import { NextResponse } from 'next/server'
import { createProduct, getProducts } from '@/lib/data/products'
import { cookies } from 'next/headers'
import { CONSTANTS } from '@/utils/constants'
import { verifyToken } from '@/utils/verifyToken'
import { ROLES } from '@/utils/roles'

export async function GET (req) {
  const products = await getProducts()
  console.log(products)

  return NextResponse.json(products)
}

export async function POST (req) {
  try {
    const data = await req.json()
    const cookieStore = cookies()
    console.log(data, 'create product')

    const token = cookieStore.get(CONSTANTS.COOKIE_NAME)?.value
    const decodedToken = await verifyToken(token)
    console.log(decodedToken)

    if (!decodedToken) {
      return NextResponse.json({ message: 'Token inválido' }, { status: 401 })
    }

    if (decodedToken.role === ROLES.CLIENTE) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 403 })
    }

    await createProduct(decodedToken.brandId || data.brand, data.presentation, data.category, data.origin, data.accessory, data.name, JSON.stringify(data.images), data.description, data.price, data.stock, data.originDetails)
    return NextResponse.json({ message: 'creado exitosamente', status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 })
  }
}

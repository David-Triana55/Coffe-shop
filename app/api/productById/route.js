import { getProductById, updateProduct } from '@/lib/data/products'
import { CONSTANTS } from '@/utils/constants'
import { ROLES } from '@/utils/roles'
import { verifyToken } from '@/utils/verifyToken'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET (req) {
  const { searchParams } = new URL(req.url)
  console.log(searchParams)
  const id = searchParams.get('id')

  const response = await getProductById(id)
  console.log(response, 'respuesta producto')

  return NextResponse.json(response)
}

export async function PUT (req) {
  try {
    const data = await req.json()
    const { id, accessory, category, images, name, description, origin, presentation, price, stock, originDetails } = data
    console.log(data)

    const cookieStore = cookies()
    const token = cookieStore.get(CONSTANTS.COOKIE_NAME)?.value
    const decodedToken = await verifyToken(token)

    if (decodedToken.role === ROLES.CLIENTE) {
      return NextResponse.json({ message: 'No autorizado', status: 401 })
    }

    await updateProduct(id, presentation, category, origin, accessory, name, JSON.stringify(images), description, price, stock, originDetails)

    return NextResponse.json({ message: 'Producto actualizado correctamente' }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 })
  }
}

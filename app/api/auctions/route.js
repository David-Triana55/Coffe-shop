import { NextResponse } from 'next/server'
import { createAuction, getAuctions } from '@/lib/data/auctions'
import { cookies } from 'next/headers'
import { CONSTANTS } from '@/utils/constants'
import { verifyToken } from '@/utils/verifyToken'
import { ROLES } from '@/utils/roles'
import { createProduct } from '@/lib/data/products'

export async function GET (req) {
  try {
    const cookieStore = cookies()

    const token = cookieStore.get(CONSTANTS.COOKIE_NAME)?.value
    const decodedToken = await verifyToken(token)
    let auctions

    if (decodedToken.role === ROLES.CLIENTE || decodedToken.role === ROLES.ADMIN) {
      auctions = await getAuctions()

      return NextResponse.json({ auctions, status: 200 })
    }
    auctions = await getAuctions(decodedToken.brandId) ?? []

    return NextResponse.json({ auctions, status: 200 })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function POST (req) {
  try {
    const data = await req.json()
    const cookieStore = cookies()
    console.log(data, 'create auction')

    const token = cookieStore.get(CONSTANTS.COOKIE_NAME)?.value
    const decodedToken = await verifyToken(token)
    console.log(decodedToken)

    if (!decodedToken) {
      return NextResponse.json({ message: 'Token inválido' }, { status: 401 })
    }

    if (decodedToken.role === ROLES.CLIENTE) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 403 })
    }
    const product = await createProduct(decodedToken.brandId || data.brand, data.presentation, data.category, data.origin, data.accessory, data.name, JSON.stringify(data.images), data.description, data.price, data.stock, data.originDetails, true)

    await createAuction(product[0].id, data.startDate, data.endDate, data.startingPrice, decodedToken.brandId || data.brand, data.minimumIncrement)
    return NextResponse.json({ message: 'creado exitosamente', status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 })
  }
}

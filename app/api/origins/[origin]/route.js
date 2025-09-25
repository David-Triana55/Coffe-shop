import { getProductByOrigin, getInfoOrigin } from '@/lib/data/origins'
import { NextResponse } from 'next/server'

export async function GET (request, { params }) {
  try {
    const { origin } = params

    const products = await getProductByOrigin(origin) || []
    const info = await getInfoOrigin(origin)

    return NextResponse.json({ products, info }, { status: 200 })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: 'Error interno del servidor', status: 500 })
  }
}

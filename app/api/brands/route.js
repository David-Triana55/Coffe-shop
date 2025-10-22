import { getBrands } from '@/lib/data/brands'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET (req) {
  try {
    const { searchParams } = new URL(req.url)

    const products = searchParams.get('products') ?? false

    const brands = await getBrands(products)

    return NextResponse.json(brands, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: 'Error interno del servidor', status: 500 })
  }
}

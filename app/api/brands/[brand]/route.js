import { getProductByBrand } from '@/lib/data/brands'
import { NextResponse } from 'next/server'

export async function GET (request, { params }) {
  const { brand } = params
  console.log(brand, 'brand')
  const products = await getProductByBrand(brand) || []

  return NextResponse.json(products, { status: 200 })
}

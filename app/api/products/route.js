// /api/products/route.js
import { NextResponse } from 'next/server'
import { getProducts } from '@/lib/data/products'

export async function GET (req) {
  const products = await getProducts()
  console.log(products)

  return NextResponse.json(products)
}

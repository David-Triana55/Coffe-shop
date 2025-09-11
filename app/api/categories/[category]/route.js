import { getProductByCategory } from '@/lib/data/categories'
import { NextResponse } from 'next/server'

export async function GET (request, { params }) {
  const { category } = params
  console.log(category)
  const products = await getProductByCategory(category) || []
  console.log(products)

  return NextResponse.json(products, { status: 200 })
}

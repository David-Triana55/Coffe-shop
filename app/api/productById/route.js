import { getProductById } from '@/lib/data/products'
import { NextResponse } from 'next/server'

export async function GET (req) {
  const { searchParams } = new URL(req.url)
  console.log(searchParams)
  const id = searchParams.get('id')

  const response = await getProductById(id)

  return NextResponse.json(response)
}

import { getProductByOrigin } from '@/lib/data/origins'
import { NextResponse } from 'next/server'

export async function GET (request, { params }) {
  const { origin } = params

  const products = await getProductByOrigin(origin) || []

  return NextResponse.json(products, { status: 200 })
}

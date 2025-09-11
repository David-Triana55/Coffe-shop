import { getProductByPresentation } from '@/lib/data/presentations'
import { NextResponse } from 'next/server'

export async function GET (request, { params }) {
  const { presentation } = params
  const products = await getProductByPresentation(presentation) || []

  return NextResponse.json(products, { status: 200 })
}

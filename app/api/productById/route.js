import { getProductById } from '@/lib/data'
import { NextResponse } from 'next/server'

export async function GET (req) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  const response = await getProductById(id)

  return NextResponse.json(response)
}

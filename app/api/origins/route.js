import { getOrigins } from '@/lib/data/origins'

import { NextResponse } from 'next/server'
export async function GET (req) {
  try {
    const { searchParams } = new URL(req.url)

    const products = searchParams.get('products') ?? false
    const origins = await getOrigins(products)
    console.log(origins)
    return NextResponse.json(origins, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 })
  }
}

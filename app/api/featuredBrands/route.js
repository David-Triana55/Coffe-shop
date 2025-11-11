import { featuredBrands } from '@/lib/data/brands'
import { NextResponse } from 'next/server'

export async function GET () {
  try {
    const brands = await featuredBrands()
    return NextResponse.json({ brands }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 })
  }
}

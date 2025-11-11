import { featuredProducts } from '@/lib/data/products'
import { NextResponse } from 'next/server'

export async function GET () {
  try {
    const products = await featuredProducts()
    console.log(products, 'products api featured')
    return NextResponse.json({ products }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 })
  }
}

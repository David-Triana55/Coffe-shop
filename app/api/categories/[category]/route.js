import { getProductsByCategory, getInfoCategory } from '@/lib/data/categories'
import { NextResponse } from 'next/server'

export async function GET (request, { params }) {
  try {
    const { category } = params
    const products = await getProductsByCategory(category) || []
    const infoCategory = await getInfoCategory(category)

    return NextResponse.json({ products, infoCategory }, { status: 200 })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: 'Error interno del servidor', status: 500 })
  }
}

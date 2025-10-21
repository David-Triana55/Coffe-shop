import { getProductsByBrand, getInfoBrandName } from '@/lib/data/brands'
import { NextResponse } from 'next/server'

export async function GET (request, { params }) {
  try {
    const { brand } = params
    const products = await getProductsByBrand(brand) || []
    const infoBrand = await getInfoBrandName(brand)

    return NextResponse.json({ products, infoBrand }, { status: 200 })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: 'Error interno del servidor', status: 500 })
  }
}

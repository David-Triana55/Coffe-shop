import { getProductByAccessory } from '@/lib/data/accessories'
import { NextResponse } from 'next/server'

export async function GET (request, { params }) {
  try {
    const { accessory } = params
    console.log(accessory)
    const products = await getProductByAccessory(accessory) || []

    return NextResponse.json(products, { status: 200 })
  } catch (err) {
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 })
  }
}

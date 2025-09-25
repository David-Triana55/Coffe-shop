import { getInfoAccessory, getProductByAccessory } from '@/lib/data/accessories'
import { NextResponse } from 'next/server'

export async function GET (request, { params }) {
  try {
    const { accessory } = params
    const products = await getProductByAccessory(accessory) || []
    const info = await getInfoAccessory(accessory)

    return NextResponse.json({ products, info }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 })
  }
}

import { getProductsByBill } from '@/lib/data/bills'
import { NextResponse } from 'next/server'

export async function GET (request, { params }) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json({ message: 'id del producto es requerido' }, { status: 400 })
    }
    const product = await getProductsByBill(id)

    if (!product) {
      return NextResponse.json({ message: 'No encontrado' }, { status: 404 })
    }
    return NextResponse.json({ product }, { status: 200 })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 })
  }
}

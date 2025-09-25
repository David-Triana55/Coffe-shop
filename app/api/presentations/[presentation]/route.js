import { getProductByPresentation, getInfoPresentations } from '@/lib/data/presentations'
import { NextResponse } from 'next/server'

export async function GET (request, { params }) {
  try {
    const { presentation } = params
    const products = await getProductByPresentation(presentation) || []
    const info = await getInfoPresentations(presentation)

    return NextResponse.json({ products, info }, { status: 200 })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: 'Error interno del servidor', status: 500 })
  }
}

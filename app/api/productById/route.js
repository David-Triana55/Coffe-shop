import { getProductById } from '@/lib/data'
import { NextResponse } from 'next/server'

export async function GET (req) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  console.log('Product ID:', id)

  // Simulación de obtener un producto desde una base de datos
  const response = await getProductById(id)

  return NextResponse.json(response)
}

import { getProductByBrand } from '@/lib/data'

export async function GET (request, { params }) {
  const { id } = params

  if (!id) {
    return new Response(JSON.stringify({ message: 'nombre del producto es requerido' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }
  const product = await getProductByBrand(id)
  console.log(product)

  if (!product) {
    return new Response(JSON.stringify({ message: ' no encontrado' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  return new Response(JSON.stringify(product), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}

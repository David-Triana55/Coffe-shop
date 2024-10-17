import { getProducts } from '@/lib/data'

export async function GET (req, res) {
  const categorias = await getProducts()
  return Response.json(categorias)
}

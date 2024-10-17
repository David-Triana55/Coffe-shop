import { getProducts } from '@/lib/data'

export async function GET (req, res) {
  const { method } = req
  const categorias = await getProducts()
  return Response.json(categorias)
}

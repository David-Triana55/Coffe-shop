import { getCategories } from '@/lib/data'

export async function GET (req, res) {
  const { method } = req
  const categorias = await getCategories()
  return Response.json(categorias)
}

import { getAccesoriesPrincipal } from '@/lib/data'
export async function GET (req) {
  const products = await getAccesoriesPrincipal()

  return new Response(
    JSON.stringify({
      data: products
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  )
}

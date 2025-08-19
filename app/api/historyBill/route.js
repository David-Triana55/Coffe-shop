import { historyBill } from '@/lib/data'

import { verifyToken } from '@/utils/verifyToken'
export async function GET (req) {
  const authHeader = req.headers.get('Authorization')

  let token = ''

  if (authHeader && authHeader.toLowerCase().startsWith('bearer')) {
    token = authHeader.split(' ')[1]
  }

  const decodedToken = await verifyToken(token)
  const data = await historyBill(decodedToken.id)

  console.log(data)

  return new Response(
    JSON.stringify({
      data
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  )
}

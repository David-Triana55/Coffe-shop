import { cookies } from 'next/headers'
import { historyBill } from '@/lib/data/bills'
import { verifyToken } from '@/utils/verifyToken'
import { CONSTANTS } from '@/utils/constants'

export async function GET () {
  const cookie = cookies()
  const token = cookie.get(CONSTANTS.COOKIE_NAME)?.value
  console.log('Token:', token)

  const decodedToken = await verifyToken(token)
  console.log('Decoded Token:', decodedToken)

  if (!decodedToken || !decodedToken.id) {
    return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401 })
  }

  const data = await historyBill(decodedToken.id)
  console.log('Data:', data)

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}

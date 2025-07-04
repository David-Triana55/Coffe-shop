import { historyBill } from '@/lib/data'
import jwt from 'jsonwebtoken' // Asegúrate de tener esta dependencia instalada
const secretKey = 'supersecretkey'

export async function GET (req) {
  const authHeader = req.headers.get('Authorization')

  let token = ''

  if (authHeader && authHeader.toLowerCase().startsWith('bearer')) {
    token = authHeader.split(' ')[1]
  }

  if (!token) {
    return new Response(
      JSON.stringify({
        message: 'Token invalid'
      }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }

  let decodedToken
  try {
    decodedToken = jwt.verify(token, secretKey)
  } catch (err) {
    return new Response(
      JSON.stringify({
        message: 'Token invalid'
      }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
  console.log(decodedToken)

  if (!decodedToken.id || decodedToken.type !== 'cliente') {
    return new Response(
      JSON.stringify({
        message: 'Token invalid'
      }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }

  const data = await historyBill(decodedToken.id)

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

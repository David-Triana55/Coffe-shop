import { getClientInfo } from '@/lib/data'
import jwt from 'jsonwebtoken' // Asegúrate de tener esta dependencia instalada

const secretKey = 'supersecretkey'

export async function GET (req) {
  const authHeader = req.headers.get('authorization')

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

  if (!decodedToken.id) {
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

  const clientInfo = await getClientInfo(decodedToken.id)

  return new Response(
    JSON.stringify({
      data: clientInfo
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  )
}

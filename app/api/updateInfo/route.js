/* eslint-disable camelcase */
import { updateInfo } from '@/lib/data'
import jwt from 'jsonwebtoken'

const secretKey = 'supersecretkey'

export async function PUT (req) {
  const authHeader = req.headers.get('authorization')

  const { nombre_cliente, apellido, email, telefono } = await req.json()

  const objClient = {
    nombre_cliente,
    apellido,
    email,
    telefono
  }

  console.log(objClient)
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

  console.log(decodedToken.id, 'id sacado del token')

  const clientInfo = await updateInfo(decodedToken.id, nombre_cliente, apellido, email, telefono)
  console.log(clientInfo)

  return new Response(
    {
      status: 204,
      headers: { 'Content-Type': 'application/json' }
    }
  )
}

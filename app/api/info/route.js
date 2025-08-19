import { getClientInfo, updateInfo } from '@/lib/data'
import { verifyToken } from '@/utils/verifyToken'
/* eslint-disable camelcase */

// get client information

export async function GET (req) {
  const authHeader = req.headers.get('authorization')

  let token = ''

  if (authHeader && authHeader.toLowerCase().startsWith('bearer')) {
    token = authHeader.split(' ')[1]
  }

  const decodedToken = await verifyToken(token)

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

// update client information

export async function PUT (req) {
  try {
    const authHeader = req.headers.get('authorization')

    const { data } = await req.json()

    const { nombre_cliente, apellido, email, telefono } = data

    let token = ''

    if (authHeader && authHeader.toLowerCase().startsWith('bearer')) {
      token = authHeader.split(' ')[1]
    }

    const decodedToken = await verifyToken(token)

    await updateInfo(decodedToken.id, nombre_cliente, apellido, email, telefono)

    return new Response(
      {
        status: 204,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500
    })
  }
}

import { detailBill, insertBill } from '@/lib/data'
import jwt from 'jsonwebtoken'
const secretKey = 'supersecretkey'

export async function POST (req) {
  const authHeader = await req.headers.get('authorization')
  const res = await req.json()

  const { productos } = res
  console.log(productos)
  console.log(authHeader)
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
  const currentDate = new Date().toISOString().split('T')[0]

  const bill = await insertBill(decodedToken.id, currentDate)

  for (const item of productos) {
    await detailBill(bill[0].id_factura, item.id_producto, item.cantidad, item.precio_unitario)
  }

  return new Response(
    JSON.stringify({
      message: 'Bill created successfully',
      data: bill
    }),
    {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    }
  )
}

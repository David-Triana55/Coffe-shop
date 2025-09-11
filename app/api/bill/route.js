import { detailBill, insertBill } from '@/lib/data'
import { ROLES } from '@/utils/roles'
import { verifyToken } from '@/utils/verifyToken'
import { cookies } from 'next/headers'

export async function POST (req) {
  const cookie = cookies()
  const token = cookie.get(process.env.COOKIE_NAME)?.value
  const res = await req.json()

  const { productos } = res
  console.log(productos)

  const decodedToken = await verifyToken(token)

  if (!decodedToken.id || decodedToken.role !== ROLES.CLIENTE) {
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

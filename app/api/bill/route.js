import { insertDetailBill, insertBill } from '@/lib/data/bills'
import { CONSTANTS } from '@/utils/constants'
import { ROLES } from '@/utils/roles'
import { verifyToken } from '@/utils/verifyToken'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST (req) {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get(CONSTANTS.COOKIE_NAME)?.value

    const res = await req.json()

    const { productos } = res
    console.log(productos, 'bill')

    const decodedToken = await verifyToken(token)

    if (decodedToken.role !== ROLES.CLIENTE && !decodedToken.id) {
      return NextResponse.json({ message: 'No ha proporcionado credenciales de autenticación validas' }, { status: 401 })
    }

    const currentDate = new Date().toISOString().split('T')[0]

    const bill = await insertBill(decodedToken.id, currentDate)
    console.log(bill, 'factura id')

    for (const item of productos) {
      await insertDetailBill(bill[0].id, item.productId, item.quantity, item.unitPrice)
    }

    return NextResponse.json({ message: 'Bill created successfully', billId: bill[0].id }, { status: 201 })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: 'Error interno del servidor', status: 500 })
  }
}

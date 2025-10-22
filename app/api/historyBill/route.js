import { cookies } from 'next/headers'
import { historyBill } from '@/lib/data/bills'
import { verifyToken } from '@/utils/verifyToken'
import { CONSTANTS } from '@/utils/constants'
import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

export async function GET () {
  try {
    const cookie = cookies()
    const token = cookie.get(CONSTANTS.COOKIE_NAME)?.value

    const decodedToken = await verifyToken(token)
    console.log('Decoded Token:', decodedToken)

    if (!decodedToken || !decodedToken.id) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401 })
    }

    const data = await historyBill(decodedToken.id)

    return NextResponse.json({ message: 'Datos actualizados', data }, { status: 200 })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 })
  }
}

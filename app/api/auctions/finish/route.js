import { finsihAuction } from '@/lib/data/auctions'
import { CONSTANTS } from '@/utils/constants'
import { verifyToken } from '@/utils/verifyToken'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function PUT (req) {
  try {
    const data = await req.json()
    const cookieStore = cookies()
    const token = cookieStore.get(CONSTANTS.COOKIE_NAME)?.value
    const decodedToken = await verifyToken(token)
    console.log(decodedToken)

    if (!decodedToken) {
      return NextResponse.json({ message: 'Token inválido' }, { status: 401 })
    }

    await finsihAuction(data.id)
    return NextResponse.json({ message: 'Finalizada exitosamente', status: 201 })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 })
  }
}

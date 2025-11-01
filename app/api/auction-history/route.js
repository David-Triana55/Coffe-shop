import { historyAuction } from '@/lib/data/auctions'
import { CONSTANTS } from '@/utils/constants'
import { ROLES } from '@/utils/roles'
import { verifyToken } from '@/utils/verifyToken'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET () {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get(CONSTANTS.COOKIE_NAME)?.value

    const decodedToken = await verifyToken(token)

    if (!decodedToken && decodedToken.role !== ROLES.CLIENTE) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 })
    }

    const history = await historyAuction(decodedToken.id)

    return NextResponse.json(history, { status: 200 })
  } catch (error) {
    console.error('Error fetching auction history:', error)
    return NextResponse.json({ message: 'Error al obtener el historial de subastas' }, { status: 500 })
  }
}

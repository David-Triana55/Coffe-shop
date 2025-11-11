import { getAuctionsWonByUserId, getCountAndTotalSpentByUserId, getTotalBoughts } from '@/lib/data/user'
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

    if (decodedToken.role !== ROLES.CLIENTE) {
      return NextResponse.json({ message: 'No ha proporcionado credenciales de autenticación validas' }, { status: 401 })
    }

    const wonAuctions = await getAuctionsWonByUserId(decodedToken.id)
    console.log(wonAuctions, 'wonAuctions')
    const brandPurchases = await getCountAndTotalSpentByUserId(decodedToken.id)
    console.log(brandPurchases, 'brandPurchases')
    const totalBoughts = await getTotalBoughts(decodedToken.id)
    console.log(totalBoughts)

    return NextResponse.json({ wonAuctions, brandPurchases, totalBoughts }, { status: 200 })
  } catch (error) {
    console.error('Error fetching client reports:', error)
    return NextResponse.json(
      { error: 'Error al obtener los reportes', details: error.message },
      { status: 500 }
    )
  }
}

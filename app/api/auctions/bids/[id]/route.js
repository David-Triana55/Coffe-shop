import { bidAuction, getBidsAuctionId } from '@/lib/data/auctions'
import { CONSTANTS } from '@/utils/constants'
import { ROLES } from '@/utils/roles'
import { verifyToken } from '@/utils/verifyToken'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET (req, { params }) {
  try {
    const { id } = params
    console.log(id, params)
    const bids = await getBidsAuctionId(id)
    console.log(bids, '<----- bids')
    return NextResponse.json({ bids, status: 200 })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function POST (req, { params }) {
  try {
    const { id } = params
    const { amount } = await req.json()
    const cookieStore = cookies()

    const token = cookieStore.get(CONSTANTS.COOKIE_NAME)?.value
    const decodedToken = await verifyToken(token)

    if (decodedToken.role !== ROLES.CLIENTE) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 403 })
    }
    console.log(id, decodedToken.id, amount)
    await bidAuction(id, decodedToken.id, amount)

    return NextResponse.json({ status: 200 })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 })
  }
}

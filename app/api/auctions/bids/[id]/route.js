import { getBidsAuctionId } from '@/lib/data/auctions'
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

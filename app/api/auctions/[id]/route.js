import { getAuctionById } from '@/lib/data/auctions'
import { NextResponse } from 'next/server'

export async function GET (req, { params }) {
  try {
    const { id } = params
    console.log(id, params)
    const auction = await getAuctionById(id)
    console.log(auction[0], '<----- auction')
    return NextResponse.json({ auction: auction[0], status: 200 })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 })
  }
}

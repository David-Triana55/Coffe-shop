import { activeAuctions } from '@/lib/data/auctions'
import { NextResponse } from 'next/server'

export async function GET () {
  try {
    const auctions = await activeAuctions()
    return NextResponse.json({ auctions }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 })
  }
}

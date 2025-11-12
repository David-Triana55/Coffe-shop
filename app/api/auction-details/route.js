import { getAuctionDetails } from "@/lib/data/auctions"
import { CONSTANTS } from "@/utils/constants"
import { verifyToken } from "@/utils/verifyToken"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(req) {
  try {
      const { searchParams } = new URL(req.url)
      console.log(searchParams)
      const cookieStore = cookies()
      const id = searchParams.get('id')
      const token = cookieStore.get(CONSTANTS.COOKIE_NAME)?.value
      const decodedToken = await verifyToken(token)
  
      if (!decodedToken) {
        return NextResponse.json({ message: 'Error' }, { status: 401 })
      } 

      const auctionDetails = await getAuctionDetails(id)

      console.log(auctionDetails, 'auction details in route')

      return NextResponse.json(auctionDetails, { status: 200 })
    }
      catch (error) {
        console.error('Error fetching auction details:', error)
        return NextResponse.json(
          { error: 'Error al obtener los detalles de la subasta', details: error.message },
          { status: 500 }
        )
      }
}
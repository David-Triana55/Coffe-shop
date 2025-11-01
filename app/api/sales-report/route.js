import { dailyAndMonthlySalesByBrand } from '@/lib/data/bills'
import { CONSTANTS } from '@/utils/constants'
import { verifyToken } from '@/utils/verifyToken'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

export async function GET (req) {
  try {
    const { searchParams } = new URL(req.url)
    const cookieStore = cookies()
    const id = searchParams.get('id')
    const token = cookieStore.get(CONSTANTS.COOKIE_NAME)?.value
    const decodedToken = await verifyToken(token)
    console.log('aqui')

    if (!decodedToken) {
      return NextResponse.json({ message: 'Error' }, { status: 401 })
    }

    const data = await dailyAndMonthlySalesByBrand(id)
    console.log(data)
    return NextResponse.json({ data }, { status: 200 })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 })
  }
}

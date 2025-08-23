import { getOrigins } from '@/lib/data/origins'
import { CONSTANTS } from '@/utils/constants'
import { cookies } from 'next/headers'
import { verifyToken } from '@/utils/verifyToken'
import { NextResponse } from 'next/server'
export async function GET () {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get(CONSTANTS.COOKIE_NAME)?.value

    await verifyToken(token)

    const origins = await getOrigins()
    console.log(origins)
    return NextResponse.json(origins, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 })
  }
}

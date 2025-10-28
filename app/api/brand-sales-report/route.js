import { monthlySalesByBrand } from '@/lib/data/bills'
import { CONSTANTS } from '@/utils/constants'
import { ROLES } from '@/utils/roles'
import { verifyToken } from '@/utils/verifyToken'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET () {
  try {
    const cookieStore = cookies()

    const token = cookieStore.get(CONSTANTS.COOKIE_NAME)?.value
    const decodedToken = await verifyToken(token)
    console.log(decodedToken)

    if (decodedToken.role !== ROLES.ADMIN) {
      return NextResponse.json({ message: 'Token inválido' }, { status: 401 })
    }

    const data = await monthlySalesByBrand()
    console.log(data)
    return NextResponse.json({ data }, { status: 200 })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 })
  }
}

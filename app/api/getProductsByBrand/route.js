import { getProductsByBrandId } from '@/lib/data/brands'
import { CONSTANTS } from '@/utils/constants'
import { ROLES } from '@/utils/roles'
import { verifyToken } from '@/utils/verifyToken'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

export async function GET (req) {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get(CONSTANTS.COOKIE_NAME)?.value

    const decodedToken = await verifyToken(token)

    if (decodedToken.role !== ROLES.VENDEDOR && decodedToken.brandId == null) {
      return NextResponse.json({ message: 'No autorizado', status: 401 })
    }

    const products = await getProductsByBrandId(decodedToken.brandId)

    return NextResponse.json(products, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: 'Error interno del servidor', status: 500 })
  }
}

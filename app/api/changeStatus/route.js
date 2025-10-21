import { updateStatusProduct } from '@/lib/data/products'
import { CONSTANTS } from '@/utils/constants'
import { ROLES } from '@/utils/roles'
import { verifyToken } from '@/utils/verifyToken'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function PUT (req) {
  try {
    const data = await req.json()
    const { id, status } = data
    console.log(id, status)

    const cookieStore = cookies()
    const token = cookieStore.get(CONSTANTS.COOKIE_NAME)?.value

    const decodedToken = await verifyToken(token)

    if (decodedToken.role !== ROLES.VENDEDOR || decodedToken.role !== ROLES.VENDEDOR) {
      return NextResponse.json({ message: 'No ha proporcionado credenciales de autenticación validas' }, { status: 401 })
    }

    await updateStatusProduct(id, status)

    return NextResponse.json({ message: 'Estado actualizado correctamente' }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 })
  }
}

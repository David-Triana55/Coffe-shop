import { changeStatusPresentation } from '@/lib/data/presentations'
import { CONSTANTS } from '@/utils/constants'
import { ROLES } from '@/utils/roles'
import { verifyToken } from '@/utils/verifyToken'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function PUT (req) {
  try {
    const { id, status } = await req.json()
    console.log(id, status)

    const cookieStore = cookies()
    const token = cookieStore.get(CONSTANTS.COOKIE_NAME)?.value

    const decodedToken = await verifyToken(token)

    if (decodedToken.role !== ROLES.ADMIN) {
      return NextResponse.json({ message: 'No ha proporcionado credenciales de autenticación validas' }, { status: 401 })
    }

    await changeStatusPresentation(id, status)

    return NextResponse.json('Actualización exitosa', { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: 'Error interno del servidor', status: 500 })
  }
}

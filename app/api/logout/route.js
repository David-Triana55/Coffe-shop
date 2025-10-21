import { NextResponse } from 'next/server'
import { CONSTANTS } from '@/utils/constants'
import { serialize } from 'cookie'
import { cookies } from 'next/headers'

export async function POST () {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get(CONSTANTS.COOKIE_NAME)?.value
    if (!token) {
      return NextResponse.json({ message: 'No hay sesión activa' }, { status: 401 })
    }

    const res = NextResponse.json({ message: 'Sesión cerrada con éxito' })

    res.headers.append('Set-Cookie', serialize(CONSTANTS.COOKIE_NAME, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(0), // Expiración en el pasado
      path: '/'
    }))
    return res
  } catch (error) {
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 })
  }
}

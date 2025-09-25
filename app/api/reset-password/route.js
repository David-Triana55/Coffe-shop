import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { validTokenExpiration, updatePassword } from '@/lib/data/user'

export async function POST (req) {
  try {
    const { token, password } = await req.json()
    console.log(token, password)

    if (!token || !password) {
      return NextResponse.json(
        { message: 'Token y nueva contraseña son requeridos' },
        { status: 400 }
      )
    }

    // Buscar al usuario con ese token y que no esté expirado
    const res = (await validTokenExpiration(token)).rows
    const isValid = res.length > 0

    if (!isValid) {
      return NextResponse.json(
        { message: 'Token invalido' },
        { status: 400 }
      )
    }
    // Hashear la nueva contraseña
    const hashedPassword = await bcrypt.hash(password, 10)

    const update = await updatePassword(res[0].id, hashedPassword)
    console.log(update)

    return NextResponse.json({ message: 'Login success', res })
  } catch (error) {
    console.error('Error en reset-password/confirm:', error)
    return NextResponse.json(
      { message: 'Error en el servidor' },
      { status: 500 }
    )
  }
}

import { loginUser, findBrandByClientId } from '@/lib/data/user'
import { CONSTANTS } from '@/utils/constants'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server'
import { serialize } from 'cookie'
import { ROLES } from '@/utils/roles'

export async function POST (req) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return new Response(JSON.stringify({ message: 'Username and password are required' }), {
        status: 400
      })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await loginUser(email, hashedPassword)

    if (!user) {
      return new Response(JSON.stringify({ message: 'Credenciales' }), {
        status: 401
      })
    }

    const passwordCorrect = await bcrypt.compare(password, user[0].password)

    if (!user || !passwordCorrect) {
      return new Response(JSON.stringify({ message: 'Credenciales incorrectas' }), {
        status: 401
      })
    }

    let brandId = null
    if (user[0].role_id === ROLES.VENDEDOR) {
      brandId = await findBrandByClientId(user[0].id)
    }

    const userForToker = {
      id: user[0].id,
      name: user[0].name,
      role: user[0].role_id,
      brandId: brandId ? brandId[0].id : null
    }
    console.log(userForToker)

    const token = jwt.sign(userForToker, process.env.JWT_SECRET)
    const res = NextResponse.json({ message: 'Login success', role: user[0].role_id })
    console.log(res, token)

    res.headers.append('Set-Cookie', serialize(CONSTANTS.COOKIE_NAME, token, {
      httpOnly: true, // No accesible desde JS
      secure: process.env.NODE_ENV === 'production', // Solo HTTPS en prod
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 días
      path: '/' // Disponible en toda la app
    }))

    return res
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 })
  }
}

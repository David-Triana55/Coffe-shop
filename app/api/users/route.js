import { registerBrandToSeller, updateBrandName } from '@/lib/data/brands'
import { alreadyRegistered, getAllUsers, getUserById, registerUser, updateUserInfo } from '@/lib/data/user'
import { CONSTANTS } from '@/utils/constants'
import { ROLES } from '@/utils/roles'
import { verifyToken } from '@/utils/verifyToken'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function GET (req) {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get(CONSTANTS.COOKIE_NAME)?.value

    const decodedToken = await verifyToken(token)

    if (decodedToken.role !== ROLES.ADMIN) {
      return NextResponse.json({ message: 'No ha proporcionado credenciales de autenticación validas' }, { status: 401 })
    }
    const users = await getAllUsers()

    return NextResponse.json(users, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: 'Error interno del servidor', status: 500 })
  }
}

export async function PUT (req) {
  try {
    const { id, name, lastName, phoneNumber, role, brandName, brandId, email } = await req.json()
    const cookieStore = cookies()
    const token = cookieStore.get(CONSTANTS.COOKIE_NAME)?.value

    const decodedToken = await verifyToken(token)

    if (decodedToken.role !== ROLES.ADMIN) {
      return NextResponse.json({ message: 'No ha proporcionado credenciales de autenticación validas' }, { status: 401 })
    }

    if (role === ROLES.VENDEDOR) {
      await updateBrandName(brandId, brandName)
    }

    updateUserInfo(id, name, lastName, phoneNumber, email)

    return NextResponse.json(true, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: 'Error interno del servidor', status: 500 })
  }
}

export async function POST (req) {
  try {
    const { name, lastName, number, password, email, role, brandName } = await req.json()
    console.log(name, lastName, number, password, email, role, brandName)

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const isAlreadyRegistered = await alreadyRegistered(email)

    if (isAlreadyRegistered) {
      return new Response(
        JSON.stringify({ message: 'Usuario ya existe' }),
        { status: 409 }
      )
    }

    const userCreated = await registerUser(role, name, lastName, number, email, hashedPassword)

    console.log(userCreated, 'usuario creado')
    if (parseInt(userCreated[0].role_id) === ROLES.VENDEDOR) await registerBrandToSeller(brandName, null, userCreated[0].id)

    const user = await getUserById(userCreated[0].id)

    console.log(user, 'usuario obtenido')

    return new Response(JSON.stringify({ create: true, user }), { status: 201 })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500
    })
  }
}

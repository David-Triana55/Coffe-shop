import { verifyToken } from '@/utils/verifyToken'
import { CONSTANTS } from '@/utils/constants'
import { cookies } from 'next/headers'
import { getUserInfo, updateUserInfo } from '@/lib/data/user'
import { NextResponse } from 'next/server'
/* eslint-disable camelcase */

// get client information

export async function GET () {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get(CONSTANTS.COOKIE_NAME)?.value

    const decodedToken = await verifyToken(token)

    const clientInfo = await getUserInfo(decodedToken.id)

    return NextResponse.json({ data: clientInfo }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 })
  }
}

// update client information

export async function PUT (req) {
  try {
    const data = await req.json()
    const { name, lastName, email, phoneNumber } = data

    const cookieStore = cookies()
    const token = cookieStore.get(CONSTANTS.COOKIE_NAME)?.value
    const decodedToken = await verifyToken(token)

    const info = await getUserInfo(decodedToken.id)

    if (!info) {
      return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 })
    }

    const update = await updateUserInfo(decodedToken.id, name ?? info.name, lastName ?? info.last_name, phoneNumber ?? info.phone_number, email ?? info.email)

    console.log(update)

    return NextResponse.json({ message: 'Datos actualizados' }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 })
  }
}

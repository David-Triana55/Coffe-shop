import { verifyToken } from '@/utils/verifyToken'
import { CONSTANTS } from '@/utils/constants'
import { cookies } from 'next/headers'
import { getBrandInfo, updateBrandInfo } from '@/lib/data/brands'
import { NextResponse } from 'next/server'
/* eslint-disable camelcase */

// get client information

export async function GET () {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get(CONSTANTS.COOKIE_NAME)?.value
    const decodedToken = await verifyToken(token)

    const brandInfo = await getBrandInfo(decodedToken.brandId)

    return NextResponse.json({ data: brandInfo[0] }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 })
  }
}

// update client information

export async function PUT (req) {
  try {
    const data = await req.json()
    const { name, image } = data

    const cookieStore = cookies()
    const token = cookieStore.get(CONSTANTS.COOKIE_NAME)?.value
    const decodedToken = await verifyToken(token)

    await updateBrandInfo(decodedToken.brandId, name, image)
    return NextResponse.json({ message: 'Datos actualizados' }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 })
  }
}

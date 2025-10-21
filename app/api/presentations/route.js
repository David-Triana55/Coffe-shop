import { createPresentation, getPresentations, updatePresentation } from '@/lib/data/presentations'
import { CONSTANTS } from '@/utils/constants'
import { ROLES } from '@/utils/roles'
import { verifyToken } from '@/utils/verifyToken'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET (req) {
  try {
    const { searchParams } = new URL(req.url)

    const products = searchParams.get('products') ?? false

    const presentations = await getPresentations(products)

    return NextResponse.json(presentations, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function POST (req) {
  try {
    // eslint-disable-next-line camelcase
    const { name, image_url, description } = await req.json()
    console.log(name, image_url, description)

    const cookieStore = cookies()
    const token = cookieStore.get(CONSTANTS.COOKIE_NAME)?.value

    const decodedToken = await verifyToken(token)

    if (decodedToken.role !== ROLES.ADMIN) {
      return NextResponse.json({ message: 'No ha proporcionado credenciales de autenticación validas' }, { status: 401 })
    }

    const data = await createPresentation(name, description, image_url)
    console.log(data)

    return new Response(JSON.stringify({ create: true, data }), { status: 201 })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500
    })
  }
}

export async function PUT (req) {
  try {
    // eslint-disable-next-line camelcase
    const { id, name, image_url, description } = await req.json()
    const cookieStore = cookies()
    const token = cookieStore.get(CONSTANTS.COOKIE_NAME)?.value

    const decodedToken = await verifyToken(token)

    if (decodedToken.role !== ROLES.ADMIN) {
      return NextResponse.json({ message: 'No ha proporcionado credenciales de autenticación validas' }, { status: 401 })
    }

    updatePresentation(id, name, description, image_url)

    return NextResponse.json(true, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: 'Error interno del servidor', status: 500 })
  }
}

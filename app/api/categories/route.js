import { createCategories, getCategories, updateCategories } from '@/lib/data/categories'
import { CONSTANTS } from '@/utils/constants'
import { ROLES } from '@/utils/roles'
import { verifyToken } from '@/utils/verifyToken'
import { cookies } from 'next/headers'

import { NextResponse } from 'next/server'

/**
 * @openapi
 * /getCategories:
 *   get:
 *     tags:
 *       - Categories
 *     summary: Obtiene todas las categorías
 *     description: Devuelve un listado de categorías de café registradas en la base de datos
 *     parameters:
 *      - name: token
 *        in: header
 *        description: Cookie HttpOnly que contiene el JWT para autorizar el acceso
 *        required: false
 *        schema:
 *          type: string
 *     responses:
 *       200:
 *         description: Lista de categorías obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                         example: a1b2c3d4-e5f6-7890-abcd-ef1234567890
 *                       name:
 *                         type: string
 *                         example: Cafe molido
 *                       image_url:
 *                         type: string
 *                         format: uri
 *                         example: string
 *                 message:
 *                   type: string
 *                   example: Respuesta exitosa
 */

export async function GET (req) {
  try {
    const { searchParams } = new URL(req.url)

    const products = searchParams.get('products') ?? false
    const categories = await getCategories(products)
    return NextResponse.json(categories, { status: 200 })
  } catch (error) {
    console.log(error)
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

    const data = await createCategories(name, description, image_url)
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

    updateCategories(id, name, description, image_url)

    return NextResponse.json(true, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: 'Error interno del servidor', status: 500 })
  }
}

import { getCategories } from '@/lib/data/categories'

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
    console.log(categories)
    return NextResponse.json(categories, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 })
  }
}

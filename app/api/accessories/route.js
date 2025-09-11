import { getAccessories } from '@/lib/data/accessories'
import { NextResponse } from 'next/server'

/**
 * @openapi
 * /accesories:
 *   get:
 *     tags:
 *       - Accesories
 *     summary: Obtiene todos los accesorios
 *     description: Devuelve un listado de accesorios de café registrados en la base de datos
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
 *                         type: UUID
 *                         example: a1b2c3d4-e5f6-7890-abcd-ef1234567890
 *                       name:
 *                         type: string
 *                         example: Cafetera Italiana
 *                       image_url:
 *                         type: string
 *                         format: uri
 *                         nullable: true
 *                         example: null
 *                 message:
 *                   type: string
 *                   example: Respuesta exitosa
 */

export async function GET (req) {
  const { searchParams } = new URL(req.url)

  const products = searchParams.get('products') ?? false

  const accesories = await getAccessories(products)

  console.log(accesories)

  return NextResponse.json(accesories, { status: 200 })
}

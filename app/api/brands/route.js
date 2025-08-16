import { getBrands } from '@/lib/data'

/**
 * @openapi
 * /brands:
 *   get:
 *     tags:
 *       - Brands
 *     summary: Obtiene todas las marcas
 *     description: Devuelve un listado de marcas de café registradas en la base de datos
 *     responses:
 *       200:
 *         description: Lista de marcas obtenida correctamente
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
 *                       id_marca:
 *                         type: integer
 *                         example: 1
 *                       nombre_marca:
 *                         type: string
 *                         example: string
 *                       logo:
 *                         type: string
 *                         format: uri
 *                         example: string
 *                 message:
 *                   type: string
 *                   example: Respuesta exitosa
 */

export async function GET (req) {
  return new Response(
    JSON.stringify({
      data: await getBrands(),
      message: 'Respuesta exitosa'
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  )
}

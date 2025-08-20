import { getCategoriesPrincipal } from '@/lib/data'

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
 *                       id_categoria:
 *                         type: integer
 *                         example: 1
 *                       nombre_categoria:
 *                         type: string
 *                         example: Cafe molido
 *                       imagenes:
 *                         type: string
 *                         format: uri
 *                         nullable: true
 *                         example: null
 *                 message:
 *                   type: string
 *                   example: Respuesta exitosa
 */

export async function GET (req) {
  const products = await getCategoriesPrincipal()

  console.log(products)

  return new Response(
    JSON.stringify({
      data: products
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  )
}

import { getProductByBrand } from '@/lib/data'
/**
 * @openapi
 * /getProductsByBrand/{brand}:
 *   get:
 *     tags:
 *       - getProducts
 *     description: Devuelve productos por marca
 *     parameters:
 *       - name: brand
 *         in: path
 *         required: true
 *         description: Marca del producto
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Respuesta exitosa
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
 *                       id_producto:
 *                         type: integer
 *                       id_marca:
 *                         type: integer
 *                       id_categoria:
 *                         type: integer
 *                       nombre_producto:
 *                         type: string
 *                       imagen:
 *                         type: string
 *                         format: uri
 *                       descripcion:
 *                         type: string
 *                       precio:
 *                         type: number
 *                         format: float
 *                       stock:
 *                         type: integer
 *                       origen:
 *                         type: string
 *                         nullable: true
 *                       tipo_origen:
 *                         type: string
 *                         nullable: true
 *                       nombre_categoria:
 *                         type: string
 *                       imagenes:
 *                         type: string
 *                         nullable: true
 *                       valor_producto_iva:
 *                         type: number
 *                         format: float
 */

export async function GET (request, { params }) {
  const { brand } = params // capturamos el parámetro dinámico de la URL

  if (!brand) {
    return new Response(JSON.stringify({ message: 'nombre del producto es requerido' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }
  const product = await getProductByBrand(brand)
  console.log(product)

  if (!product) {
    return new Response(JSON.stringify({ message: ' no encontrado' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  return new Response(JSON.stringify(product), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}

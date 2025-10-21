import { getProductById } from '@/lib/data/products'

/**
 * @openapi
 * /getProduct/{id}:
 *   get:
 *     tags:
 *       - getProduct
 *     description: Devuelve un producto por id
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del producto
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Respuesta exitosa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               poperties:
 *                 id_producto:
 *                   type: integer
 *                 id_marca:
 *                   type: integer
 *                 id_categoria:
 *                   type: integer
 *                 nombre_producto:
 *                   type: string
 *                 imagen:
 *                   type: string
 *                   format: uri
 *                 descripcion:
 *                   type: string
 *                 precio:
 *                   type: number
 *                   format: float
 *                 stock:
 *                   type: integer
 *                 origen:
 *                   type: string
 *                   nullable: true
 *                 tipo_origen:
 *                   type: string
 *                   nullable: true
 *                 nombre_categoria:
 *                   type: string
 *                 imagenes:
 *                   type: string
 *                   nullable: true
 *                 valor_producto_iva:
 *                   type: number
 *                   format: float
 */

export async function GET (request, { params }) {
  const { id } = params // capturamos el parámetro dinámico de la URL
  console.log(id, 'hola')
  if (!id) {
    return new Response(JSON.stringify({ message: 'ID del producto es requerido' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }
  const product = await getProductById(id)
  console.log(product)
  if (!product) {
    return new Response(JSON.stringify({ message: 'Producto no encontrado' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  return new Response(JSON.stringify(product), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}

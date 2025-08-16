/**
 * @openapi
 * /hello:
 *   get:
 *     tags:
 *       - Ejemplo
 *     description: Devuelve un saludo
 *     responses:
 *       200:
 *         description: Respuesta exitosa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Hola desde Next.js!
 */
export async function GET () {
  return Response.json({ message: 'Hola desde Next.js!' })
}

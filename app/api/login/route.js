import { loginUser } from '@/lib/data'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const secretKey = 'supersecretkey'

export async function POST (req) {
  try {
    const { email, password } = await req.json()

    // Validación simple
    if (!email || !password) {
      return new Response(JSON.stringify({ message: 'Username and password are required' }), {
        status: 400
      })
    }

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await loginUser(email, hashedPassword)

    const passwordCorrect = await bcrypt.compare(password, user[0].password)

    if (!user || !passwordCorrect) {
      return new Response(JSON.stringify({ message: 'Invalid email or password' }), {
        status: 401
      })
    }

    const userForToker = {
      id: user[0].id_cliente,
      name: user[0].nombre_cliente
    }

    const token = jwt.sign(userForToker, secretKey)

    // Devolver la respuesta con el token
    return new Response(
      JSON.stringify({
        message: 'User authenticated',
        token // Incluye el token en la respuesta JSON
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500
    })
  }
}

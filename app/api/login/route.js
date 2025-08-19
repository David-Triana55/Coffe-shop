import { loginUser } from '@/lib/data'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function POST (req) {
  try {
    const { email, password } = await req.json()

    // Validación simple
    if (!email || !password) {
      return new Response(JSON.stringify({ message: 'Username and password are required' }), {
        status: 400
      })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await loginUser(email, hashedPassword)

    const passwordCorrect = await bcrypt.compare(password, user[0].password)

    if (!user || !passwordCorrect) {
      return new Response(JSON.stringify({ message: 'Credenciales incorrectas' }), {
        status: 401
      })
    }

    const userForToker = {
      id: user[0].id_cliente,
      name: user[0].nombre_cliente,
      type: user[0].tipo_cliente
    }

    const token = jwt.sign(userForToker, process.env.JWT_SECRET)

    return new Response(
      JSON.stringify({
        message: 'User authenticated',
        token,
        type: user[0].tipo_cliente
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

// aca va toda la logica para crear y registrar un usuario
import bcrypt from 'bcryptjs'
import { alreadyRegistered, registerUser } from '@/lib/data'

export async function POST (req) {
  try {
    const { name, lastName, number, password, email } = await req.json()

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const isAlreadyRegistered = await alreadyRegistered(email)
    console.log(isAlreadyRegistered, 'isAlreadyRegistered')

    if (isAlreadyRegistered) {
      return new Response(
        JSON.stringify({ message: 'Usuario ya existe' }),
        { status: 409 }
      )
    }

    await registerUser(name, lastName, number, hashedPassword, email)

    return new Response(JSON.stringify({ create: true }))
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500
    })
  }
}

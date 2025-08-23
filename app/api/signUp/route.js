// aca va toda la logica para crear y registrar un usuario
import bcrypt from 'bcryptjs'
import { alreadyRegistered, registerUser } from '@/lib/data/user'
import { registerBrandToSeller } from '@/lib/data/brands'
import { ROLES } from '@/utils/roles'

export async function POST (req) {
  try {
    const { name, lastName, number, password, email, role } = await req.json()

    console.log(name, lastName, number, password, email, role)

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    console.log(hashedPassword)

    const isAlreadyRegistered = await alreadyRegistered(email)
    console.log(isAlreadyRegistered, 'isAlreadyRegistered')

    if (isAlreadyRegistered) {
      return new Response(
        JSON.stringify({ message: 'Usuario ya existe' }),
        { status: 409 }
      )
    }

    const user = await registerUser(role, name, lastName, number, email, hashedPassword)

    if (parseInt(user[0].role_id) === ROLES.VENDEDOR) await registerBrandToSeller('Mi Marca', null, user[0].id)

    return new Response(JSON.stringify({ create: true }), { status: 201 })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500
    })
  }
}

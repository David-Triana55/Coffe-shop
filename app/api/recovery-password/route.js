import { alreadyRegistered, updateResetToken } from '@/lib/data/user'
import { v4 as uuidv4 } from 'uuid'
export async function POST (req, res) {
  const { email } = await req.json()
  console.log(email)

  const isAlreadyRegistered = await alreadyRegistered(email)
  if (!isAlreadyRegistered) {
    return res.status(404).json({ message: 'Usuario no encontrado' })
  }
  const resetToken = uuidv4()
  const expiration = new Date(Date.now() + 3600000) // 1 hora después

  await updateResetToken(email, resetToken, expiration)

  const data = { resetToken, expiration }
  console.log(data)
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}

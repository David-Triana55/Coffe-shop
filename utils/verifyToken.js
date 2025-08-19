import jwt from 'jsonwebtoken'

export async function verifyToken (token) {
  let decodedToken
  try {
    if (!token) {
      return new Response(
        JSON.stringify({
          message: 'Token invalid'
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    decodedToken = jwt.verify(token, process.env.JWT_SECRET)

    if (!decodedToken.id) {
      return new Response(
        JSON.stringify({
          message: 'Token invalid'
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    return decodedToken
  } catch (err) {
    return new Response(
      JSON.stringify({
        message: 'Token invalid'
      }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

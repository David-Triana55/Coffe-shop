import { sql } from '@vercel/postgres'

export async function getOrigins () {
  try {
    const res = await sql`SELECT * FROM origins`
    return res.rows
  } catch (error) {
    console.log(error)
  }
}

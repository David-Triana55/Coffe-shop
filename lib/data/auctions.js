import { sql } from '@vercel/postgres'

export async function activeAuctions () {
  try {
    const auctions = await sql`
      SELECT * 
      FROM auctions
      WHERE status = 'active'
      `
    return auctions.rows
  } catch (error) {
    console.log(error)
  }
}

import { sql } from '@vercel/postgres'

export async function GET () {
  console.log('aqui')
  const now = new Date()

  // Actualiza todas las subastas que ya expiraron
  const { rows } = await sql`
    UPDATE auctions
    SET status = 'ended'
    WHERE status = 'active' AND end_date <= ${now}
    RETURNING id, title;
  `

  return Response.json({
    closedCount: rows.length,
    closedAuctions: rows,
    runAt: now
  })
}

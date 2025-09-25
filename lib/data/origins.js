import { sql } from '@vercel/postgres'

export async function getOrigins (WithProducts) {
  try {
    let query = 'SELECT * FROM origins'
    if (WithProducts) {
      query += ' INNER JOIN products ON products.origin_id = origins.id'
    }
    const origins = await sql.query(query)
    return origins.rows
  } catch (error) {
    console.log(error)
  }
}

export async function getProductByOrigin (origin) {
  try {
    const productos = await sql`
      SELECT p.id, p.name, p.images_url, p.description, p.price, o.name  
      FROM products p
      INNER JOIN origins o
      ON p.origin_id = o.id
      WHERE o.name = ${origin} `
    return productos.rows
  } catch (error) {
    console.log(error)
  }
}

export async function getInfoOrigin (origin) {
  try {
    const info = await sql`select * from origins where name = ${origin}`
    return info.rows[0]
  } catch (e) {
    console.log(e)
  }
}

import { sql } from '@vercel/postgres'

export async function getPresentations (WithProducts) {
  try {
    let query = 'SELECT * FROM presentations pr'
    if (WithProducts) {
      query += ' INNER JOIN products p ON p.presentation_id = pr.id'
    }
    const brands = await sql.query(query)
    return brands.rows
  } catch (error) {
    console.log(error)
  }
}

export async function getProductByPresentation (presentation) {
  try {
    const productos = await sql`
        SELECT p.id, p.name, p.images_url, p.description, p.price
        FROM products p
        INNER JOIN presentations pr
        ON p.presentation_id = pr.id
        WHERE pr.name =  ${presentation} `
    return productos.rows
  } catch (error) {
    console.log(error)
  }
}

export async function getInfoPresentations (presentation) {
  try {
    const info = await sql`select * from presentations where name = ${presentation}`
    return info.rows[0]
  } catch (e) {
    console.log(e)
  }
}

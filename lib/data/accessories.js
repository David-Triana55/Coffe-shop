import { sql } from '@vercel/postgres'

export async function getAccessories (WithProducts) {
  try {
    let query = 'SELECT * FROM accessories a'
    if (WithProducts) {
      query += ' INNER JOIN products p ON p.accessory_id = a.id'
    }
    const brands = await sql.query(query)
    return brands.rows
  } catch (error) {
    console.log(error)
  }
}

export async function getProductByAccessory (accessory) {
  try {
    const productos = await sql`
      SELECT p.id, p.name, p.images_url, p.description, p.price, a.name  
      FROM products p
      INNER JOIN accessories a
      ON p.accessory_id = a.id
      WHERE a.name = ${accessory} `
    return productos.rows
  } catch (error) {
    console.log(error)
  }
}

export async function getInfoAccessory (accessory) {
  try {
    const info = await sql`select * from accessories where name = ${accessory}`
    return info.rows[0]
  } catch (e) {
    console.log(e)
  }
}

import { sql } from '@vercel/postgres'

export async function getOrigins (WithProducts) {
  try {
    let query = 'SELECT * FROM origins o'
    if (WithProducts) {
      query += ' INNER JOIN products p ON p.origin_id = o.id WHERE p.is_active = true AND o.is_active = true'
    } else {
      query += ' WHERE o.is_active = true'
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
      INNER JOIN origins o ON p.origin_id = o.id
      INNER JOIN brands b ON p.brand_id = b.id
      WHERE o.name = 'Robusta'
      AND o.is_active = true
      AND p.is_active = true 
      AND b.is_active = true`
    return productos.rows
  } catch (error) {
    console.log(error)
  }
}

export async function getInfoOrigin (origin) {
  try {
    const info = await sql`select * from origins where name = ${origin} AND is_active = true`
    return info.rows[0]
  } catch (e) {
    console.log(e)
  }
}

export async function createOrigin (name, description, imageUrl) {
  try {
    const origins = await sql`
    INSERT INTO origins (name, description ,image_url)
    VALUES (${name}, ${description}, ${imageUrl}) returning *`
    return origins.rows
  } catch (e) {
    console.log(e)
  }
}

export async function updateOrigin (id, name, description, imageUrl) {
  try {
    const origins = await sql`
      UPDATE origins
      SET name = ${name},
      description = ${description},
      image_url = ${imageUrl} 
      where id = ${id};
    `
    return origins.rows
  } catch (e) {
    console.log(e)
  }
}

export async function changeStatusOrigin (id, status) {
  try {
    const origin = await sql`
      UPDATE origins SET is_active = ${status}
      WHERE id = ${id} 
    `
    return origin
  } catch (e) {
    console.log(e)
  }
}

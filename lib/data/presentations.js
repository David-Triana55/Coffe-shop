import { sql } from '@vercel/postgres'

export async function getPresentations (WithProducts) {
  try {
    let query = 'SELECT * FROM presentations pr'
    if (WithProducts) {
      query += ' INNER JOIN products p ON p.presentation_id = pr.id WHERE pr.is_active = true AND p.is_active = true AND p.is_in_auction = false'
    } else {
      query += ' WHERE pr.is_active = true '
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
        INNER JOIN presentations pr ON p.presentation_id = pr.id
        INNER JOIN brands b ON p.brand_id = b.id
        WHERE pr.name =  ${presentation} 
        AND p.is_active = true
        AND pr.is_active = true
        AND b.is_active = true
        AND p.is_in_auction = false`
    return productos.rows
  } catch (error) {
    console.log(error)
  }
}

export async function getInfoPresentations (presentation) {
  try {
    const info = await sql`select * from presentations where name = ${presentation} AND is_active = true`
    return info.rows[0]
  } catch (e) {
    console.log(e)
  }
}

export async function createPresentation (name, description, imageUrl) {
  try {
    const presentations = await sql`
    INSERT INTO presentations (name, description ,image_url)
    VALUES (${name}, ${description}, ${imageUrl}) returning *`
    return presentations.rows
  } catch (e) {
    console.log(e)
  }
}

export async function updatePresentation (id, name, description, imageUrl) {
  try {
    const presentation = await sql`
      UPDATE presentations
      SET name = ${name},
      description = ${description},
      image_url = ${imageUrl} 
      where id = ${id};
    `
    return presentation.rows
  } catch (e) {
    console.log(e)
  }
}

export async function changeStatusPresentation (id, status) {
  try {
    const presentation = await sql`
      UPDATE presentations SET is_active = ${status}
      WHERE id = ${id} 
    `
    return presentation
  } catch (e) {
    console.log(e)
  }
}

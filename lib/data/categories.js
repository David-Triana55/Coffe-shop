import { sql } from '@vercel/postgres'

export async function getCategories (WithProducts) {
  try {
    let query = 'SELECT * FROM categories c'
    if (WithProducts) {
      query += ' INNER JOIN products p ON p.origin_id = c.id WHERE p.is_active = true AND c.is_active = true'
    } else {
      query += ' WHERE c.is_active = true'
    }
    const categories = await sql.query(query)
    return categories.rows
  } catch (error) {
    console.log(error)
  }
}

export async function getProductsByCategory (category) {
  try {
    const productos = await sql`
      SELECT p.id, p.name, p.images_url, p.description, p.price
      FROM products p
      INNER JOIN categories c ON p.category_id = c.id
      INNER JOIN brands b ON p.brand_id = b.id
      WHERE c.name = ${category} 
      AND p.is_active = true
      AND c.is_active = true
      AND b.is_active = true
      AND p.is_in_auction = false`
    console.log(productos.rows)
    return productos.rows
  } catch (error) {
    console.log('Error fetching products:', error)
  }
}

export async function getInfoCategory (category) {
  try {
    const info = await sql`select * from categories where name = ${category} AND is_active = true`
    console.log(info.rows[0], 'info category')
    return info.rows[0]
  } catch (e) {
    console.log(e)
  }
}

export async function createCategories (name, description, imageUrl) {
  try {
    const categories = await sql`
    INSERT INTO categories (name, description ,image_url)
    VALUES (${name}, ${description}, ${imageUrl}) returning *`
    return categories.rows
  } catch (e) {
    console.log(e)
  }
}

export async function updateCategories (id, name, description, imageUrl) {
  try {
    const categories = await sql`
      UPDATE categories
      SET name = ${name},
      description = ${description},
      image_url = ${imageUrl} 
      where id = ${id};
    `
    return categories.rows
  } catch (e) {
    console.log(e)
  }
}

export async function changeStatusCategories (id, status) {
  try {
    const categorie = await sql`
      UPDATE categories SET is_active = ${status}
      WHERE id = ${id} 
    `
    return categorie
  } catch (e) {
    console.log(e)
  }
}

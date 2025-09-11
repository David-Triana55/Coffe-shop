import { sql } from '@vercel/postgres'

export async function getCategories (WithProducts) {
  try {
    let query = 'SELECT * FROM categories'
    if (WithProducts) {
      query += ' INNER JOIN products ON products.origin_id = categories.id'
    }
    const categories = await sql.query(query)
    return categories.rows
  } catch (error) {
    console.log(error)
  }
}

export async function getProductByCategory (category) {
  try {
    const productos = await sql`
      SELECT p.id, p.name, p.images_url, p.description, p.price, c.name  
      FROM products p
      INNER JOIN categories c
      ON p.category_id = c.id
      WHERE c.name = ${category} `
    console.log(productos.rows)
    return productos.rows
  } catch (error) {
    console.log('Error fetching products:', error)
  }
}

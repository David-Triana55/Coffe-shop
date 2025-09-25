import { sql } from '@vercel/postgres'

export async function registerBrandToSeller (name, brand, userId) {
  try {
    const res = await sql`INSERT INTO brands (name, image_url, created_by) VALUES (${name}, ${brand}, ${userId}) RETURNING *`
    return res.rows
  } catch (error) {
    console.log(error)
  }
}

export async function findBrandBySellerId (id) {
  try {
    const res = await sql`SELECT * FROM brands WHERE created_by = ${id} RETURNING *`
    return res.rows
  } catch (error) {
    console.log(error)
  }
}

export async function featuredBrands () {
  try {
    const brands = await sql`
      SELECT * 
      FROM brands b
      INNER JOIN products p
      ON b.id = p.brand_id
      LIMIT 5
      `
    return brands.rows
  } catch (error) {
    console.log(error)
  }
}

export async function getProductsByBrand (brand) {
  try {
    const productos = await sql`
      SELECT p.id, p.name, p.images_url, p.description, p.price, p.created_at 
      FROM products p
      INNER JOIN brands b
      ON p.brand_id = b.id
      WHERE b.name =  ${brand} `
    return productos.rows
  } catch (error) {
    console.log(error)
  }
}

export async function getBrands (WithProducts) {
  try {
    let query = 'SELECT * FROM brands b'
    if (WithProducts) {
      query += ' INNER JOIN products p ON p.brand_id = b.id'
    }
    const brands = await sql.query(query)
    return brands.rows
  } catch (error) {
    console.log(error)
  }
}

export async function getBrandInfo (id) {
  try {
    const brand = await sql`SELECT * FROM brands WHERE id = ${id}`
    return brand.rows
  } catch (error) {
    console.log(error)
  }
}

export async function updateBrandInfo (id, name, imageUrl) {
  try {
    const update = await sql`
      UPDATE brands 
      SET name = ${name}, 
      image_url = ${imageUrl} 
      WHERE id = ${id}`
    return update.rows
  } catch (error) {
    console.log(error)
  }
}

export async function getInfoBrandName (name) {
  try {
    const brand = await sql`SELECT * FROM brands WHERE name = ${name}`
    return brand.rows[0]
  } catch (error) {
    console.log(error)
  }
}

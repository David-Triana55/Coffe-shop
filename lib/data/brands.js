import { sql } from '@vercel/postgres'

export async function registerBrandToSeller (name, brand, userId) {
  try {
    const res = await sql`
      INSERT INTO brands (name, image_url, is_active, seller_id)
      VALUES (${name}, ${brand},true, ${userId}) RETURNING *`
    return res.rows
  } catch (error) {
    console.log(error)
  }
}

export async function findBrandBySellerId (id) {
  try {
    const res = await sql`SELECT * FROM brands WHERE seller_id = ${id} AND is_active = true RETURNING *`
    return res.rows
  } catch (error) {
    console.log(error)
  }
}

export async function featuredBrands () {
  try {
    const brands = await sql`
      SELECT b.id, b.name, b.image_url
      FROM brands b      
      WHERE b.is_active = true
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
      SELECT 
      p.id, p.name, p.images_url, p.description, p.price, p.created_at
      FROM products p
      INNER JOIN brands b ON p.brand_id = b.id
      WHERE b.name =  ${brand} 
      AND p.is_active = true
      AND P.is_in_auction = false
      AND b.is_active = true`
    return productos.rows
  } catch (error) {
    console.log(error)
  }
}

export async function getProductsByBrandId (brandId) {
  try {
    const products = await sql`
      SELECT 
      p.id, p.name, p.images_url, p.description, p.price, p.stock, p.is_active, p.origin_details,
      p.presentation_id, pr.name AS presentation_name,
      p.category_id, c.name AS category_name,
      p.origin_id, o.name AS origin_name,
      p.accessory_id, ac.name AS accessory_name
      FROM products p
      INNER JOIN brands b ON p.brand_id = b.id
      LEFT JOIN presentations pr ON p.presentation_id = pr.id
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN origins o ON p.origin_id = o.id
      LEFT JOIN accessories ac ON p.accessory_id = ac.id
      WHERE b.id = ${brandId}
      AND b.is_active = true
      AND p.is_in_auction = false
      ORDER BY p.name ASC;`
    return products.rows
  } catch (e) {
    console.log(e)
  }
}

export async function getBrands (WithProducts) {
  try {
    let query = 'SELECT * FROM brands b'
    if (WithProducts) {
      query += ' INNER JOIN products p ON p.brand_id = b.id WHERE b.is_active = true AND p.is_active = true AND p.is_in_auction = false'
    } else {
      query += ' WHERE b.is_active = true'
    }
    const brands = await sql.query(query)
    return brands.rows
  } catch (error) {
    console.log(error)
  }
}

export async function getBrandInfo (id) {
  try {
    const brand = await sql`SELECT * FROM brands WHERE id = ${id} AND is_active = true`
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
    const brand = await sql`SELECT * FROM brands WHERE name = ${name} AND is_active = true`
    return brand.rows[0]
  } catch (error) {
    console.log(error)
  }
}

export async function countProductsByBrand (brandId) {
  try {
    const value = await sql`
      select count(brand_id) as product_count 
      from products where brand_id = ${brandId}`
    return value
  } catch (e) {
    console.log(e)
  }
}

export async function updateBrandName (id, name) {
  try {
    const brand = await sql`UPDATE brands SET name = ${name} WHERE id = ${id}`
    return brand
  } catch (e) {
    console.log(e)
  }
}

export async function changeStatusBrand (id, status) {
  try {
    const brand = await sql`UPDATE brands SET is_active = ${status} WHERE id = ${id}`
    return brand
  } catch (e) {
    console.log(e)
  }
}

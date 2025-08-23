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

export async function getCategories () {
  try {
    const res = await sql`SELECT * FROM categories`
    return res.rows
  } catch (error) {
    console.log(error)
  }
}

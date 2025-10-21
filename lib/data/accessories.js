import { sql } from '@vercel/postgres'

export async function getAccessories (WithProducts) {
  try {
    let query = 'SELECT * FROM accessories a'
    if (WithProducts) {
      query += ' INNER JOIN products p ON p.accessory_id = a.id WHERE a.is_active = true AND p.is_active = true'
    } else {
      query += ' WHERE a.is_active = true'
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
      INNER JOIN accessories a ON p.accessory_id = a.id
      INNER JOIN brands b ON p.brand_id = b.id 
      WHERE a.name = ${accessory}
      AND p.is_active = true
      AND a.is_active = true
      AND b.is_active = true`
    return productos.rows
  } catch (error) {
    console.log(error)
  }
}

export async function getInfoAccessory (accessory) {
  try {
    const info = await sql`select * from accessories where name = ${accessory} AND is_active = true`
    return info.rows[0]
  } catch (e) {
    console.log(e)
  }
}

export async function createAccessories (name, description, imageUrl) {
  try {
    const accessories = await sql`
    INSERT INTO accessories (name, description ,image_url)
    VALUES (${name}, ${description}, ${imageUrl}) returning *`
    return accessories.rows
  } catch (e) {
    console.log(e)
  }
}

export async function updateAccessory (id, name, description, imageUrl) {
  try {
    const accessory = await sql`
      UPDATE accessories
      SET name = ${name},
      description = ${description},
      image_url = ${imageUrl} 
      where id = ${id};
    `
    return accessory.rows
  } catch (e) {
    console.log(e)
  }
}

export async function changeStatusAccessory (id, status) {
  try {
    const accessory = await sql`
      UPDATE accessories SET is_active = ${status}
      WHERE id = ${id} 
    `
    return accessory
  } catch (e) {
    console.log(e)
  }
}

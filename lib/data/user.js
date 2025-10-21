import { sql } from '@vercel/postgres'

export async function registerUser (roleId, name, lastName, phone, email, password) {
  try {
    const user = await sql`INSERT INTO users (role_id, name, last_name, email, password, phone_number) VALUES (${roleId}, ${name} ,${lastName} ,${email} ,${password} ,${phone} ) RETURNING *`
    return user.rows
  } catch (error) {
    console.log(error)
  }
}

export async function loginUser (email) {
  try {
    const user = await sql`SELECT * FROM users WHERE email = ${email} AND is_active = true`
    return user.rows
  } catch (error) {
    console.log(error)
  }
}

export async function findBrandByClientId (id) {
  try {
    const res = await sql`SELECT * FROM brands WHERE seller_id = ${id}`
    return res.rows
  } catch (error) {
    console.log(error)
  }
}

export async function alreadyRegistered (email) {
  try {
    const user = await sql`SELECT * FROM users WHERE email = ${email}`
    return user.rows.length > 0 // Retorna true si existe, false si no
  } catch (error) {
    console.log(error)
    return false // Devuelve false en caso de error
  }
}

export async function getUserInfo (id) {
  try {
    const clientInfo = await sql`SELECT name, last_name, email, phone_number FROM users WHERE id = ${id}`
    return clientInfo.rows[0]
  } catch (error) {
    console.log(error)
  }
}

export async function updateUserInfo (id, name, lastName, phone, email) {
  try {
    const update = await sql`UPDATE users SET name = ${name}, last_name = ${lastName}, email = ${email}, phone_number = ${phone} WHERE id = ${id} RETURNING *`

    return update.rows
  } catch (error) {
    console.log(error)
  }
}

export async function updateResetToken (email, token, expiration) {
  try {
    const update = await sql`UPDATE users SET password_reset_token = ${token}, password_reset_expiration = ${expiration} WHERE email = ${email} RETURNING *`
    return update.rows
  } catch (error) {
    console.log(error)
  }
}

export async function validTokenExpiration (token) {
  try {
    const res = await sql`
       SELECT * FROM users
      WHERE password_reset_token = ${token}
      AND password_reset_expiration > NOW()`
    return res
  } catch (error) {
    console.log(error)
  }
}

export async function updatePassword (id, password) {
  try {
    const res = await sql`
      UPDATE users 
      SET password_reset_token = NULL, password_reset_expiration = NULL, password = ${password} 
      WHERE id = ${id}`
    return res.rows
  } catch (error) {
    console.log(error)
  }
}

export async function getAllUsers () {
  try {
    const users = await sql`
      SELECT 
      u.id,u.role_id as role ,u.name,u.last_name,u.phone_number, u.is_active,
      u.name,u.email, b.id AS brand_id, b.name AS brand_name, b.image_url
      FROM users u
      LEFT JOIN brands b 
      ON b.seller_id = u.id
      WHERE u.role_id <> 3    
      GROUP by u.id, b.id, b.name;
      `
    return users.rows
  } catch (e) {
    console.log(e)
  }
}

export async function getUserById (id) {
  try {
    const users = await sql`
      SELECT 
      u.id,u.role_id as role ,u.name,u.last_name,u.phone_number, u.is_active,
      u.name,u.email, b.id AS brand_id, b.name AS brand_name, b.image_url
      FROM users u
      LEFT JOIN brands b 
      ON b.seller_id = u.id
      WHERE u.role_id <> 3
      AND u.id = ${id}    
      GROUP by u.id, b.id, b.name;
      `
    return users.rows
  } catch (e) {
    console.log(e)
  }
}

export async function changeStatusClient (id, status) {
  try {
    const user = await sql`
      UPDATE users SET is_active = ${status}
      WHERE id = ${id} 
    `
    return user
  } catch (e) {
    console.log(e)
  }
}

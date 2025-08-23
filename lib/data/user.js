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
    const user = await sql`SELECT * FROM users WHERE email = ${email}`
    return user.rows
  } catch (error) {
    console.log(error)
  }
}

export async function findBrandByClientId (id) {
  try {
    const res = await sql`SELECT * FROM brands WHERE created_by = ${id}`
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

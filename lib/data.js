import { sql } from '@vercel/postgres'

// aca va la logica para las consultas de la base de datos

// getProducts
// getProductByBrand
// getProductByCategory

// traer las categorias

export async function getCategories () {
  try {
    const categorias = await sql`SELECT * FROM categorias`
    return categorias.rows
  } catch (error) {
    console.log(error)
  }
}

export async function getProducts () {
  try {
    const productos = await sql`SELECT * FROM productos INNER JOIN categorias ON productos.id_categoria = categorias.id_categoria INNER JOIN marcas ON productos.id_marca = marcas.id_marca`
    // const productos = await sql`SELECT * FROM productos ORDER BY productos.id_producto ASC`
    return productos.rows
  } catch (error) {
    console.log(error)
  }
}

export async function getProductById (id) {
  try {
    const productos = await sql`SELECT *, valor_producto_con_iva(precio) as valor_producto_iva FROM productos INNER JOIN categorias ON productos.id_categoria = categorias.id_categoria WHERE productos.id_producto = ${id}`
    return productos.rows
  } catch (error) {
    console.log(error)
  }
}

export async function getProductByBrand (brand) {
  try {
    const productos = await sql`SELECT * FROM marcas WHERE marcas.nombre_marca = ${brand}`
    return productos.rows
  } catch (error) {
    console.log(error)
  }
}

export async function getProductByCategory (category) {
  try {
    const productos = await sql`SELECT id_producto, nombre_producto, imagen, descripcion, precio, nombre_categoria, valor_producto_con_iva(precio) as valor_producto_iva  FROM productos INNER JOIN categorias ON productos.id_categoria = categorias.id_categoria WHERE categorias.nombre_categoria = ${category}`
    return productos.rows
  } catch (error) {
    console.log(error)
  }
}

export async function getProductBySearch (idCategory, search) {
  try {
    const productos = await sql`SELECT * FROM productos WHERE productos.nombre_producto ILIKE '%${search}%' AND productos.id_categoria = ${idCategory}`
    return productos.rows
  } catch (error) {
    console.log(error)
  }
}

export async function registerUser (name, lastName, number, password, email) {
  try {
    const user = await sql`INSERT INTO clientes (nombre_cliente, apellido, telefono, password, email) VALUES (${name}, ${lastName}, ${number}, ${password}, ${email}) RETURNING *`
    return user.rows
  } catch (error) {
    console.log(error)
  }
}

export async function loginUser (email, password) {
  try {
    const user = await sql`SELECT * FROM clientes WHERE email = ${email}`
    return user.rows
  } catch (error) {
    console.log(error)
  }
}

export async function getBrands () {
  try {
    const brands = await sql`SELECT * FROM marcas`
    return brands.rows
  } catch (error) {
    console.log(error)
  }
}

export async function getAccesoriesPrincipal () {
  try {
    const accesories = await sql`SELECT * FROM categorias WHERE id_categoria >= 4 ORDER BY id_categoria ASC`
    return accesories.rows
  } catch (error) {
    console.log(error)
  }
}

export async function getClientInfo (id) {
  try {
    const clientInfo = await sql`SELECT nombre_cliente, apellido, email, telefono FROM clientes WHERE id_cliente = ${id}`
    return clientInfo.rows[0]
  } catch (error) {
    console.log(error)
  }
}

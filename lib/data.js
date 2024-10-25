import { sql } from '@vercel/postgres'

// obtener los productos por id de la base de datos

export async function getProductById (id) {
  try {
    const productos = await sql`SELECT *, valor_producto_con_iva(precio) as valor_producto_iva FROM productos INNER JOIN categorias ON productos.id_categoria = categorias.id_categoria WHERE productos.id_producto = ${id}`
    return productos.rows
  } catch (error) {
    console.log(error)
  }
}

// obtener los productos por marca de la base de datos

export async function getProductByBrand (brand) {
  try {
    const productos = await sql`SELECT id_producto, nombre_producto, imagen, descripcion, precio,  valor_producto_con_iva(precio) as valor_producto_iva FROM productos INNER JOIN marcas ON productos.id_marca = marcas.id_marca WHERE marcas.nombre_marca = ${brand}`
    return productos.rows
  } catch (error) {
    console.log(error)
  }
}

// obtener los productos por categoria de la base de datos

export async function getProductByCategory (category) {
  try {
    const productos = await sql`SELECT id_producto, nombre_producto, imagen, descripcion, precio, nombre_categoria, valor_producto_con_iva(precio) as valor_producto_iva  FROM productos INNER JOIN categorias ON productos.id_categoria = categorias.id_categoria WHERE categorias.nombre_categoria = ${category}`
    return productos.rows
  } catch (error) {
    console.log(error)
  }
}

// insertar un nuevo cliente en la base de datos

export async function registerUser (name, lastName, number, password, email) {
  try {
    const user = await sql`INSERT INTO clientes (nombre_cliente, apellido, telefono, password, email) VALUES (${name}, ${lastName}, ${number}, ${password}, ${email}) RETURNING *`
    return user.rows
  } catch (error) {
    console.log(error)
  }
}

// verificar si un usuario existe en la base de datos

export async function loginUser (email, password) {
  try {
    const user = await sql`SELECT * FROM clientes WHERE email = ${email}`
    return user.rows
  } catch (error) {
    console.log(error)
  }
}

// obtener las marcas de la base de datos

export async function getBrands () {
  try {
    const brands = await sql`SELECT * FROM marcas`
    return brands.rows
  } catch (error) {
    console.log(error)
  }
}

// obtener los accesorios principales de la base de datos

export async function getAccesoriesPrincipal () {
  try {
    const accesories = await sql`SELECT * FROM categorias WHERE id_categoria >= 4 ORDER BY id_categoria ASC`
    return accesories.rows
  } catch (error) {
    console.log(error)
  }
}

// obtener la informacion del cliente de la base de datos

export async function getClientInfo (id) {
  try {
    const clientInfo = await sql`SELECT id_cliente, nombre_cliente, apellido, email, telefono FROM clientes WHERE id_cliente = ${id}`
    return clientInfo.rows[0]
  } catch (error) {
    console.log(error)
  }
}

// actualizar la informacion del cliente de la base de datos

export async function updateInfo (id, nombre, apellido, email, telefono) {
  try {
    const update = await sql`UPDATE clientes SET nombre_cliente = ${nombre}, apellido = ${apellido}, email = ${email}, telefono = ${telefono} WHERE id_cliente = ${id}`

    return update.rows
  } catch (error) {
    console.log(error)
  }
}

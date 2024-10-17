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
    const productos = await sql`SELECT * FROM productos INNER JOIN categorias ON productos.id_categoria = categorias.id_categoria WHERE productos.id_producto = ${id}`
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

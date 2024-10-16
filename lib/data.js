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
    const productos = await sql`SELECT * FROM productos`
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

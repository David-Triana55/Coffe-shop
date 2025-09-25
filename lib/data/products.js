import { sql } from '@vercel/postgres'

export async function featuredProducts () {
  try {
    const brands = await sql`
      SELECT * 
      FROM products
      `
    return brands.rows
  } catch (error) {
    console.log(error)
  }
}

export async function getProducts () {
  try {
    const products = await sql`SELECT * FROM products`
    return products.rows
  } catch (error) {
    console.error(error)
    throw new Error('Error fetching products')
  }
}

export async function getProductById (id) {
  try {
    const product = await sql`SELECT * FROM products WHERE id = ${id}`
    return product.rows
  } catch (error) {
    console.log(error)
  }
}

export async function getProductsByFilter ({
  categories,
  brands,
  types,
  origins,
  accessories,
  search,
  sortBy,
  limit,
  offset
}) {
  try {
    let query = 'SELECT * FROM products p'
    const conditions = []
    const values = []

    const pushArrayCondition = (csv, columnName) => {
      if (!csv) return
      const arr = csv.split(',').map(s => s.trim()).filter(Boolean)
      if (arr.length === 0) return
      // push array as param; usamos ANY($n::uuid[])
      values.push(arr)
      const idx = values.length
      conditions.push(`${columnName} = ANY($${idx}::uuid[])`)
    }

    pushArrayCondition(categories, 'p.category_id')
    pushArrayCondition(brands, 'p.brand_id')
    pushArrayCondition(types, 'p.presentation_id') // si 'types' representa presentation
    pushArrayCondition(origins, 'p.origin_id')
    pushArrayCondition(accessories, 'p.accessory_id')

    if (search && search.trim() !== '') {
      values.push(`%${search.trim()}%`)
      const idx = values.length
      conditions.push(`(p.name ILIKE $${idx} OR p.description ILIKE $${idx})`)
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ')
    }

    // Ordenamiento simple
    if (sortBy) {
      switch (sortBy) {
        case 'price-low': query += ' ORDER BY p.price ASC'; break
        case 'price-high': query += ' ORDER BY p.price DESC'; break
        case 'recent': query += ' ORDER BY p.created_at DESC'; break
        default: query += ' ORDER BY p.created_at DESC'
      }
    }

    // limit / offset opcionales (previenen SQL injection porque son interpolados con placeholders)
    if (limit && Number.isInteger(limit) && limit > 0) {
      values.push(limit)
      query += ` LIMIT $${values.length}`
    }
    if (offset && Number.isInteger(offset) && offset >= 0) {
      values.push(offset)
      query += ` OFFSET $${values.length}`
    }

    console.log('SQL DEBUG:', query, values)
    const { rows } = await sql.query(query, values)
    return rows
  } catch (error) {
    console.error('getProductsByFilter error:', error)
    throw error
  }
}

export async function createProduct (brandId, presentationId, categoryId, originId, accessoryId, name, imagesUrl, description, price, stock, originDetails) {
  try {
    const product = await sql`INSERT INTO products (brand_id, presentation_id,category_id, origin_id,accessory_id,name,images_url, description, price ,stock, origin_details) VALUES (${brandId}, ${presentationId},${categoryId}, ${originId},${accessoryId},${name},${imagesUrl}, ${description}, ${price},${stock}, ${originDetails}) RETURNING *`
    return product.rows
  } catch (error) {
    console.log(error)
  }
}

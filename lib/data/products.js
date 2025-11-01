import { sql } from '@vercel/postgres'

export async function featuredProducts () {
  try {
    // que sean los 5 productos con mas ventas
    const brands = await sql`
      SELECT p.id, p.name, p.images_url
      FROM products p
      INNER JOIN brands b ON p.brand_id = b.id
      WHERE p.is_active = true
      AND b.is_active = true
      AND p.is_in_auction = false
      ORDER BY images_url ASC
      LIMIT 5;
      `
    return brands.rows
  } catch (error) {
    console.log(error)
  }
}

export async function getProducts () {
  try {
    const products = await sql`SELECT * FROM products WHERE is_active = true AND is_in_auction = false`
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
    // base: products + brands (porque siempre deben estar activos)
    let query = `
      SELECT 
        p.id,
        p.name,
        p.description,
        p.images_url,
        p.price,
        b.name AS brand_name
      FROM products p
      INNER JOIN brands b ON p.brand_id = b.id AND b.is_active = true AND p.is_in_auction = false
    `

    const conditions = ['p.is_active = true']
    const values = []

    // agregamos joins dinámicamente
    if (categories) {
      query += ' INNER JOIN categories c ON p.category_id = c.id AND c.is_active = true'
    }
    if (types) {
      query += ' INNER JOIN presentations pr ON p.presentation_id = pr.id AND pr.is_active = true'
    }
    if (origins) {
      query += ' INNER JOIN origins o ON p.origin_id = o.id AND o.is_active = true'
    }
    if (accessories) {
      query += ' INNER JOIN accessories a ON p.accessory_id = a.id AND a.is_active = true'
    }

    // util para parsear CSV -> array limpio
    const parseCsv = (csv) => {
      if (!csv) return []
      return csv
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)
        .filter(s => s.toLowerCase() !== 'null')
    }

    const pushArrayCondition = (csv, columnName) => {
      const arr = parseCsv(csv)
      if (arr.length === 0) return
      values.push(arr)
      const idx = values.length
      conditions.push(`${columnName} = ANY($${idx}::uuid[])`)
    }

    // filtros dinámicos
    pushArrayCondition(categories, 'p.category_id')
    pushArrayCondition(brands, 'p.brand_id')
    pushArrayCondition(types, 'p.presentation_id')
    pushArrayCondition(origins, 'p.origin_id')
    pushArrayCondition(accessories, 'p.accessory_id')

    if (search && search.trim() !== '') {
      values.push(`%${search.trim()}%`)
      const idx = values.length
      conditions.push(`(p.name ILIKE $${idx} OR p.description ILIKE $${idx})`)
    }

    // cláusula WHERE
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ')
    }

    // --- ORDENAMIENTO ---
    switch (sortBy) {
      case 'price-low':
        query += ' ORDER BY p.price ASC'
        break
      case 'price-high':
        query += ' ORDER BY p.price DESC'
        break
      case 'recent':
      default:
        query += ' ORDER BY p.created_at DESC'
        break
    }

    // paginación
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

export async function createProduct (brandId, presentationId, categoryId, originId, accessoryId, name, imagesUrl, description, price, stock, originDetails = null, inAuction = false) {
  try {
    const product = await sql`
      INSERT INTO products (brand_id, presentation_id,category_id, origin_id,
      accessory_id,name,images_url, description, price ,stock, origin_details, is_in_auction) 
      VALUES (${brandId}, ${presentationId},${categoryId}, ${originId},${accessoryId},${name},
      ${imagesUrl}, ${description}, ${price},${stock}, ${originDetails}, ${inAuction}) 
      RETURNING *`
    console.log(product.rows)
    return product.rows
  } catch (error) {
    console.log(error)
  }
}

export async function updateStatusProduct (id, status) {
  try {
    const update = await sql`   
      UPDATE products 
      SET is_active = ${status}
      WHERE id = ${id}`

    return update.rows
  } catch (e) {
    console.log(e)
  }
}

export async function updateProduct (id, presentation, category, origin, accessory, name, images, description, price, stock, originDetails) {
  try {
    const update = await sql`   
      UPDATE products 
      SET presentation_id = ${presentation}, category_id = ${category},
      origin_id = ${origin}, accessory_id = ${accessory},
      name = ${name}, images_url = ${images}, description = ${description}, 
      price = ${price}, stock = ${stock}, origin_details = ${originDetails}
      WHERE id = ${id}`

    return update.rows
  } catch (e) {
    console.log(e)
  }
}

export async function getAllProducts () {
  try {
    const products = await sql`
      SELECT 
      p.id, p.name, p.images_url, p.description, p.price, p.stock, p.is_active, p.origin_details,
      p.presentation_id, pr.name AS presentation_name,
      p.category_id, c.name AS category_name,
      p.origin_id, o.name AS origin_name,
      p.accessory_id, ac.name AS accessory_name,
      p.brand_id, b.name AS brand_name
        FROM products p
        LEFT JOIN brands b ON p.brand_id = b.id
        LEFT JOIN presentations pr ON p.presentation_id = pr.id
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN origins o ON p.origin_id = o.id
        LEFT JOIN accessories ac ON p.accessory_id = ac.id
      WHERE p.is_in_auction = false
        AND b.is_active = true
        ORDER BY p.name ASC;`

    return products.rows
  } catch (e) {
    console.log(e)
  }
}

export async function changeStatusProduct (id, status) {
  try {
    const products = await sql`
      UPDATE products SET is_active = ${status}
      WHERE brand_id = ${id}
    `
    return products
  } catch (e) {
    console.log(e)
  }
}

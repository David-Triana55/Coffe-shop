import { sql } from '@vercel/postgres'

export async function totalSales (brandId) {
  try {
    let res

    if (brandId) {
      res = await sql`
        SELECT 
          SUM(s.total) AS total_ventas
        FROM (
          SELECT 
            p.brand_id,
            (bd.quantity * bd.unit_price) AS total
          FROM bills_details bd
          INNER JOIN bills b ON bd.bill_id = b.id
          INNER JOIN products p ON bd.product_id = p.id

          UNION ALL

          SELECT 
            p.brand_id,
            ap.final_price AS total
          FROM auction_purchases ap
          INNER JOIN auctions a ON ap.auction_id = a.id
          INNER JOIN products p ON a.product_id = p.id
          WHERE LOWER(ap.status) = 'paid'
        ) AS s
        WHERE s.brand_id = ${brandId};
      `
    } else {
      res = await sql`
        SELECT 
          SUM(s.total) AS total_ventas
        FROM (
          SELECT 
            (bd.quantity * bd.unit_price) AS total
          FROM bills_details bd
          INNER JOIN bills b ON bd.bill_id = b.id

          UNION ALL

          SELECT 
            ap.final_price AS total
          FROM auction_purchases ap
          WHERE LOWER(ap.status) = 'paid'
        ) AS s;
      `
    }

    return res.rows
  } catch (e) {
    console.error(e)
  }
}

export async function activeProducts (brandId) {
  try {
    let res

    if (brandId) {
      res = await sql`
      SELECT COUNT(*) AS productos_activos
      FROM products
      WHERE is_active = true
      AND brand_id =  ${brandId}
      AND is_in_auction = false;
      `
    } else {
      res = await sql`
      SELECT COUNT(*) AS productos_activos
      FROM products
      WHERE is_active = true
      AND is_in_auction = false;

      `
    }
    return res.rows
  } catch (e) {
    console.log(e)
  }
}

export async function activeSellers () {
  try {
    const res = await sql`
      SELECT COUNT(*) AS vendedores_activos
      FROM users
      WHERE role_id = 2 AND is_active = true;
      `
    return res.rows
  } catch (e) {
    console.log(e)
  }
}

export async function activeAuctions (brandId) {
  try {
    let res
    if (brandId) {
      res = await sql`
        SELECT 
        COUNT(*) AS subastas_activas
        FROM auctions a
        WHERE a.brand_id = ${brandId}
        AND a.end_date > NOW()
        AND a.status = 'active';

      `
    } else {
      res = await sql`
        SELECT COUNT(*) AS subastas_activas
        FROM auctions a
        INNER JOIN products p ON a.product_id = p.id
        WHERE a.end_date > NOW()
        AND a.status = 'active'
      `
    }
    return res.rows
  } catch (e) {
    console.log(e)
  }
}

export async function monthlySales (brandId) {
  try {
    let res
    if (brandId) {
      res = await sql`
        SELECT DATE_TRUNC('month', b.date) AS mes,
        SUM(bd.unit_price * bd.quantity) AS total_ventas
        FROM bills_details bd
        INNER JOIN bills b ON bd.bill_id = b.id
        INNER JOIN products p ON bd.product_id = p.id
        WHERE p.brand_id = ${brandId}
        GROUP BY mes
        ORDER BY mes;
      `
    } else {
      res = await sql`
        SELECT DATE_TRUNC('month', b.date) AS mes,
        SUM(bd.unit_price * bd.quantity) AS total_ventas
        FROM bills_details bd
        INNER JOIN bills b ON bd.bill_id = b.id
        INNER JOIN products p ON bd.product_id = p.id
        GROUP BY mes
        ORDER BY mes;
      `
    }
    return res.rows
  } catch (e) {
    console.log(e)
  }
}

export async function lowStock (brandId) {
  try {
    const res = await sql`
    SELECT id,name,stock
    FROM products
    WHERE brand_id = ${brandId}
    AND is_active = true
    AND stock < 5;
    `
    return res.rows
  } catch (e) {
    console.log(e)
  }
}

export async function categoryPercentage (brandId) {
  try {
    let res

    if (brandId) {
      res = await sql`
          SELECT c.name , COUNT(p.id) AS value,
          ROUND( (COUNT(p.id) * 100.0 / SUM(COUNT(p.id)) OVER()), 2 ) AS porcentaje
          FROM products p
          JOIN categories c ON p.category_id = c.id
          WHERE p.is_active = TRUE
          AND p.brand_id = ${brandId}
          GROUP BY c.name
          ORDER BY porcentaje DESC;
      `
    } else {
      res = await sql`
        SELECT c.name, COUNT(p.id) AS value,
        ROUND( (COUNT(p.id) * 100.0 / SUM(COUNT(p.id)) OVER()), 2 ) AS porcentaje
        FROM products p
        JOIN categories c ON p.category_id = c.id
        WHERE p.is_active = TRUE
        GROUP BY c.name
        ORDER BY porcentaje DESC;
        `
    }
    return res.rows
  } catch (e) {
    console.error('Error al obtener porcentajes por categoría:', e)
    return []
  }
}

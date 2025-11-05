import { sql } from '@vercel/postgres'

export async function getDetailBillId (id) {
  try {
    const res = await sql`
      SELECT  b.id, b.date, u.name, u.last_name , u.email, 
      SUM(db.quantity * db.unit_price) AS total 
      FROM bills_details db 
      INNER JOIN bills b 
      ON b.id = db.bill_id 
      INNER JOIN users u 
      ON b.user_id = u.id 
      WHERE db.bill_id = ${id}
      GROUP BY b.id, u.id;`
    return res.rows
  } catch (error) {
    console.log(error)
  }
}

export async function total () {
  try {
    const res = await sql`
      SELECT 
      SUM(bd.unit_price * bd.quantity) AS total_ventas
      FROM bill_details bd
      INNER JOIN bills b ON bd.bill_id = b.id
      INNER JOIN products p ON bd.product_id = p.id
      WHERE p.owner_id = :vendedor_id;
    `
    return res.rows
  } catch (e) {
    console.log(e)
  }
}

export async function Earnings () {
  try {
    const res = await sql`
      SELECT 
        SUM(bd.unit_price * bd.quantity) AS ganancia
      FROM bill_details bd
      INNER JOIN bills b ON bd.bill_id = b.id
      INNER JOIN products p ON bd.product_id = p.id
      WHERE p.owner_id = :vendedor_id;

    `
    return res.rows
  } catch (e) {
    console.log(e)
  }
}

export async function ProductsActives () {
  try {
    const res = await sql`
      SELECT COUNT(*) AS productos_activos
      FROM products
      WHERE is_active = true
      AND owner_id = :vendedor_id;
    `
    return res.rows
  } catch (e) {
    console.log(e)
  }
}

export async function auctionsActives () {
  try {
    const res = await sql`
      SELECT COUNT(*) AS subastas_activas
      FROM auctions a
      INNER JOIN products p ON a.product_id = p.id
      WHERE a.end_date > NOW()
        AND p.owner_id = :vendedor_id;
    `
    return res.rows
  } catch (e) {
    console.log(e)
  }
}

export async function sellerMonths () {
  try {
    const res = await sql`
    SELECT 
    DATE_TRUNC('month', b.date) AS mes,
    SUM(bd.unit_price * bd.quantity) AS total_ventas
    FROM bill_details bd
    INNER JOIN bills b ON bd.bill_id = b.id
    INNER JOIN products p ON bd.product_id = p.id
    WHERE p.owner_id = :vendedor_id
    GROUP BY mes
    ORDER BY mes;

    `
    return res.rows
  } catch (e) {
    console.log(e)
  }
}

export async function stockLow () {
  try {
    const res = await sql`
      SELECT 
        id, 
        name, 
        stock
    FROM products
    WHERE owner_id = :vendedor_id
      AND stock < 5
      AND is_active = true;


    `
    return res.rows
  } catch (e) {
    console.log(e)
  }
}

export async function insertBill ({ userId, mpPaymentId }) {
  try {
    const bill = await sql`INSERT INTO bills (user_id, mp_payment_id) VALUES (${userId}, ${mpPaymentId}) RETURNING *`
    return bill.rows
  } catch (error) {
    console.log(error)
  }
}

export async function historyBill (id) {
  try {
    const res = await sql`
    SELECT b.id ,b.date, 
    SUM(bd.quantity * bd.unit_price) as total 
    FROM bills b INNER JOIN bills_details bd  ON b.id = bd.bill_id 
    WHERE user_id = ${id} GROUP BY b.id
    order by date desc;`
    return res.rows
  } catch (e) {
    console.log(e)
  }
}

export async function getProductsByBill (billId) {
  try {
    const res = await sql`
    SELECT * FROM bills_details bd 
    INNER JOIN products p ON bd.product_id = p.id 
    WHERE bill_id = ${billId}`
    return res.rows
  } catch (error) {
    console.log(error)
  }
}

export async function insertDetailBill ({ billId, productId, quantity, unitPrice }) {
  try {
    const bill = await sql`
      INSERT INTO bills_details (bill_id, product_id, quantity, unit_price) 
      VALUES (${billId}, ${productId}, ${quantity}, ${unitPrice}) `
    return bill.rows
  } catch (error) {
    console.log(error)
  }
}

export async function findBillByMPPaymentId (mpPaymentId) {
  try {
    const res = await sql`SELECT * FROM bills WHERE mp_payment_id = ${mpPaymentId} LIMIT 1`
    return res.rows[0]
  } catch (e) {
    console.log(e)
  }
}

export async function monthlySalesByBrand () {
  try {
    const { rows } = await sql`
      SELECT 
        bnd.id AS brand_id,
        bnd.name AS brand_name,
        TO_CHAR(s.sale_date, 'YYYY-MM') AS month,
        SUM(s.total) AS total_sales
      FROM (
        SELECT 
          p.brand_id,
          b.date AS sale_date,
          (bd.quantity * bd.unit_price) AS total
        FROM bills b
        JOIN bills_details bd ON b.id = bd.bill_id
        JOIN products p ON bd.product_id = p.id

        UNION ALL

        SELECT 
          p.brand_id,
          ap.date AS sale_date,
          ap.final_price AS total
        FROM auction_purchases ap
        JOIN auctions a ON a.id = ap.auction_id
        JOIN products p ON a.product_id = p.id
        WHERE LOWER(ap.status) = 'paid'
      ) AS s
      JOIN brands bnd ON bnd.id = s.brand_id
      GROUP BY bnd.id, bnd.name, TO_CHAR(s.sale_date, 'YYYY-MM')
      ORDER BY month DESC, total_sales DESC;
    `

    const brandMap = new Map()

    for (const sale of rows) {
      const brandId = sale.brand_id
      const total = Number(sale.total_sales)
      const month = sale.month

      if (!brandMap.has(brandId)) {
        brandMap.set(brandId, {
          brand_id: brandId,
          brand_name: sale.brand_name,
          total_sales: 0,
          months: []
        })
      }

      const brand = brandMap.get(brandId)
      brand.total_sales += total
      brand.months.push({
        month,
        sales: total
      })
    }

    return Array.from(brandMap.values())
  } catch (e) {
    console.error('Error en monthlySalesByBrand:', e)
    return []
  }
}

export async function dailyAndMonthlySalesByBrand (brandId) {
  try {
    const { rows } = await sql`
      WITH sales_data AS (
        SELECT 
          p.brand_id, 
          b.date AS sale_date, 
          (bd.quantity * bd.unit_price) AS total
        FROM bills b
        JOIN bills_details bd ON b.id = bd.bill_id
        JOIN products p ON bd.product_id = p.id

        UNION ALL

        SELECT 
          p.brand_id, 
          ap.date AS sale_date, 
          ap.final_price AS total
        FROM auction_purchases ap
        JOIN auctions a ON a.id = ap.auction_id
        JOIN products p ON a.product_id = p.id
        WHERE LOWER(ap.status) = 'paid'
      ),

      monthly_summary AS (
        SELECT
          brand_id,
          DATE_TRUNC('month', sale_date) AS month,
          SUM(total) AS total_sales
        FROM sales_data
        GROUP BY brand_id, DATE_TRUNC('month', sale_date)
      )

      SELECT 
        bnd.id AS brand_id,
        bnd.name AS brand_name,

        COALESCE(SUM(CASE WHEN DATE(s.sale_date) = CURRENT_DATE THEN s.total ELSE 0 END), 0) AS daily_sales,

        COALESCE(SUM(CASE WHEN DATE_TRUNC('month', s.sale_date) = DATE_TRUNC('month', CURRENT_DATE) THEN s.total ELSE 0 END), 0) AS monthly_sales,

        COALESCE(
          (
            SELECT JSON_AGG(
              JSON_BUILD_OBJECT(
                'month', TO_CHAR(ms.month, 'YYYY-MM'),
                'sales', ms.total_sales
              )
              ORDER BY ms.month
            )
            FROM monthly_summary ms
            WHERE ms.brand_id = bnd.id
          ),
          '[]'::json
        ) AS months

      FROM brands bnd
      LEFT JOIN sales_data s ON s.brand_id = bnd.id
      WHERE bnd.id = ${brandId}
      GROUP BY bnd.id, bnd.name
      ORDER BY monthly_sales DESC;
  `
    return rows
  } catch (e) {
    console.log(e)
  }
}

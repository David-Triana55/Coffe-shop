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

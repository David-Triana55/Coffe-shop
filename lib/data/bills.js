import { sql } from '@vercel/postgres'

export async function getDetailBillId (id) {
  try {
    const res = await sql`
      SELECT b.*, u.*, SUM(db.quantity * db.unit_price) AS total 
      FROM bill_details db 
      INNER JOIN bills b 
      ON db.id = b.bill_id 
      INNER JOIN users u 
      ON b.user_id = u.id 
      WHERE b.bill_id = ${id} 
      GROUP BY b.id, u.id;`
    return res.rows
  } catch (error) {
    console.log(error)
  }
}

export async function historyBill (userId) {
  try {
    const res = await sql`
      SELECT bills.id ,bills.date, 
      SUM(bill_details.quantity * bill_details.unit_price) as total 
      FROM bills 
      INNER JOIN bill_details 
      ON bills.id = bill_details.bill_id 
      WHERE user_id = ${userId} 
      GROUP BY bills.id;
    `
    return res.rows
  } catch (error) {
    console.log(error)
  }
}

import { sql } from '@vercel/postgres'

export async function activeAuctions () {
  try {
    const auctions = await sql`
      SELECT * 
      FROM auctions a 
      INNER JOIN products p
      ON a.product_id = p.id
      WHERE status = 'active'
      AND p.is_in_auction = true

      `
    return auctions.rows
  } catch (error) {
    console.log(error)
  }
}

export async function createAuction (productId, startDate, endDate, initialPrice, brandId, minimumIncrement) {
  try {
    const auction = await sql`
      INSERT INTO auctions (product_id, start_date, end_date, initial_price, brand_id, minimum_increment)
      VALUES (${productId}, ${startDate}, ${endDate}, ${initialPrice}, ${brandId}, ${minimumIncrement})
      RETURNING id
    `
    return auction.rows
  } catch (e) {
    console.log(e)
  }
}

export async function getAuctions (brandId) {
  try {
    let query = `
      SELECT 
        a.id AS auction_id,
        a.start_date,
        a.end_date,
        a.initial_price,
        a.status AS auction_status,
        p.name AS product_name,
        p.description AS product_description,
        p.price AS product_price,
        p.images_url AS product_images,
        b.name AS brand_name,
        u.name AS seller_name,
        u.email AS seller_email,
        ap.final_price AS final_price,
        ap.date AS purchase_date,
        b.is_active AS brand_active,
        COALESCE(MAX(bp.amount), a.initial_price) AS current_price,
        COUNT(bp.id) AS bid_count
      FROM auctions a
      LEFT JOIN products p ON a.product_id = p.id
      LEFT JOIN brands b ON p.brand_id = b.id
      LEFT JOIN users u ON u.id = b.seller_id
      LEFT JOIN auction_purchases ap ON a.id = ap.auction_id
      LEFT JOIN bids bp ON a.id = bp.auction_id
      WHERE b.is_active = true
      AND a.status = 'active'
    `

    if (brandId != null) {
      query += ` AND b.id = ${brandId}`
    }

    query += `
      GROUP BY a.id, p.name, p.description, p.price, p.images_url, b.name, u.name, u.email, ap.final_price, ap.date, b.is_active
    `

    const auctions = await sql.query(query)
    return auctions.rows
  } catch (e) {
    console.log(e)
  }
}

export async function getBidsAuctionId (auctionId) {
  try {
    const bids = await sql`
      select b.*, u.name as user_name from bids b
      INNER JOIN users u
      ON b.user_id = u.id 
      WHERE auction_id = ${auctionId}
      ORDER BY b.amount DESC;`

    return bids.rows
  } catch (e) {
    console.log(e)
  }
}

export async function getAuctionById (auctionId) {
  try {
    const auction = await sql`
       SELECT 
  a.id AS auction_id,
  a.start_date,
  a.end_date,
  a.initial_price,
  a.status AS auction_status,
  a.minimum_increment,
  p.name AS product_name,
  p.description AS product_description,
  p.price AS product_price,
  p.images_url AS product_images,
  b.name AS brand_name,
  b.is_active AS brand_active,
  ap.final_price AS final_price,
  ap.date AS purchase_date,
  COALESCE(MAX(bp.amount), a.initial_price) AS current_price
FROM auctions a
LEFT JOIN products p ON a.product_id = p.id
LEFT JOIN brands b ON p.brand_id = b.id
LEFT JOIN auction_purchases ap ON a.id = ap.auction_id
LEFT JOIN bids bp ON a.id = bp.auction_id
WHERE b.is_active = TRUE
  AND a.id = ${auctionId}
GROUP BY 
  a.id, 
  a.start_date, 
  a.end_date, 
  a.initial_price, 
  a.status,
  p.name, 
  p.description, 
  p.price, 
  p.images_url, 
  b.name, 
  b.is_active,
  ap.final_price, 
  ap.date;

    `
    return auction.rows
  } catch (e) {
    console.log(e)
  }
}

export async function validateAuctionState () {
  try {
    const update = await sql`
      UPDATE auctions
      SET status = 'finished'
      WHERE status = 'active' AND end_date <= now()
    `
    return update.rows
  } catch (e) {
    console.log(e)
  }
}

export async function proofJob () {
  try {
    const update = await sql`
      insert into marcas (nombre_marca, logo) 
      values ('prueba', 'prueba');`

    return update.rows
  } catch (e) {
    console.log(e)
  }
}

export async function bidAuction (id, userId, amount) {
  try {
    const bid = await sql`
      INSERT INTO bids (auction_id, user_id , amount) VALUES 
      (${id},${userId}, ${amount});
    `
    return bid.rows
  } catch (e) {
    console.log(e)
  }
}

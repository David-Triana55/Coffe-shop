/* eslint-disable camelcase */
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
    const { rows } = await sql`
      UPDATE public.auctions AS a
      SET status = 'finished'
      WHERE a.status = 'active'
      AND a.end_date <= (now() AT TIME ZONE 'America/Bogota')
      RETURNING id, product_id
    `
    return rows
  } catch (error) {
    console.error('Error al actualizar estado de subastas:', error)
    return []
  }
}

export async function registerWinnersJob () {
  try {
    const { rows: highestBids } = await sql`
      SELECT DISTINCT ON (b.auction_id)
        b.auction_id,
        b.user_id AS user_buyer_id,
        b.amount AS final_price,
        a.product_id
      FROM bids b
      INNER JOIN auctions a ON a.id = b.auction_id
      LEFT JOIN auction_purchases ap ON ap.auction_id = a.id
      WHERE a.status = 'finished' AND ap.id IS NULL
      ORDER BY b.auction_id, b.amount DESC, b.date ASC
    `

    if (highestBids.length === 0) {
      console.log('No hay subastas finalizadas con pujas por registrar.')
      return []
    }

    const inserted = []

    for (const bid of highestBids) {
      const { auction_id, user_buyer_id, final_price, product_id } = bid

      const { rows } = await sql`
        INSERT INTO auction_purchases (auction_id, user_buyer_id, final_price, status, date)
        VALUES (${auction_id}, ${user_buyer_id}, ${final_price}, 'pending', now())
        RETURNING *
      `
      inserted.push(rows[0])

      await sql`
        UPDATE products
        SET is_active = false,
            is_in_auction = false
        WHERE id = ${product_id}
      `
    }

    return inserted
  } catch (error) {
    console.error('Error al registrar ganadores y actualizar productos:', error)
    return []
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

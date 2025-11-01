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
        a.minimum_increment,
        a.status AS auction_status,
        p.name AS product_name,
        p.description AS product_description,
        p.price AS product_price,
        p.images_url AS product_images,
        p.id AS product_id,
        b.name AS brand_name,
        u.name AS seller_name,
        u.email AS seller_email,
        ap.final_price AS final_price,
        ap.date AS purchase_date,
        ap.status AS status_payment,
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
    `

    if (brandId != null) {
      query += ` AND b.id = '${brandId}'`
    }

    query += `
      GROUP BY a.id, p.id, ap.status, p.name, p.description, p.price, p.images_url, b.name, u.name, u.email, ap.final_price, ap.date, b.is_active
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
      UPDATE auctions
      SET status = 'finished'
      WHERE status = 'active'
      AND end_date <= (now() AT TIME ZONE 'America/Bogota')
      RETURNING id, end_date, status;
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

      console.log(bid)

      const { rows } = await sql`
        INSERT INTO auction_purchases (auction_id, user_buyer_id, final_price, status)
        VALUES (${auction_id}, ${user_buyer_id}, ${final_price}, 'pending')
        RETURNING *
      `
      inserted.push(rows[0])

      await sql`
        UPDATE products
        SET is_active = false
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

export async function historyAuction (userId) {
  try {
    const history = await sql`
      select ap.id , ap."date" , ap.final_price , ap.auction_id, ap.status, p.id as product_id, p.images_url as product_image, p."name" as product_name  
      from auction_purchases ap 
      inner join auctions a on ap.auction_id = a.id 
      inner join products p on a.product_id = p.id 
      where ap.user_buyer_id = ${userId}`
    return history.rows
  } catch (e) {
    console.log(e)
  }
}

export async function updatePayment (auctionId) {
  try {
    const auction = await sql`
      update auction_purchases 
      set status = 'paid'
      where auction_id = ${auctionId};
    `
    return auction.rows
  } catch (e) {
    console.log(e)
  }
}

export async function changeStatusAuction (id, status) {
  try {
    const auctions = await sql`
      UPDATE auctions SET status = ${status ? 'active' : 'finished'}
      WHERE brand_id = ${id}
      `

    return auctions
  } catch (e) {
    console.log(e)
  }
}

export async function finsihAuction (auctionId) {
  try {
    const auction = await sql`
      UPDATE auctions 
      SET end_date = now()
      WHERE id = ${auctionId}
    `
    return auction.rows
  } catch (e) {
    console.log(e)
  }
}

export async function updateAuction (auctionId, initialPrice, minimumIncrement, startDate, endDate) {
  try {
    const auction = await sql`
      UPDATE auctions
      SET start_date = ${startDate}, end_date = ${endDate}, 
      initial_price = ${initialPrice}, minimum_increment = ${minimumIncrement}
      WHERE id = ${auctionId}
    `
    return auction.rows
  } catch (e) {
    console.log(e)
  }
}

export async function updateDescription (productId, description) {
  try {
    const product = await sql`
      UPDATE products
      SET description = ${description}
      WHERE id = ${productId}
    `
    return product.rows
  } catch (e) {
    console.log(e)
  }
}

// app/api/payments/create-preference/route.ts
import { NextResponse } from 'next/server'
import { MercadoPagoConfig, Preference } from 'mercadopago'
import { cookies } from 'next/headers'
import { CONSTANTS } from '@/utils/constants'
import { verifyToken } from '@/utils/verifyToken'
import { ROLES } from '@/utils/roles'

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN
})

export async function POST (req) {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get(CONSTANTS.COOKIE_NAME)?.value

    const decodedToken = await verifyToken(token)

    if (decodedToken.role !== ROLES.CLIENTE) {
      return NextResponse.json({ message: 'No ha proporcionado credenciales de autenticación validas' }, { status: 401 })
    }
    const body = await req.json()
    console.log(body)
    console.log(Array(body))

    const mpItems = Array(body).map((it) => ({
      id: String(it.id),
      auctionId: String(it.auctionId),
      title: it.title,
      quantity: 1,
      currency_id: 'COP',
      unit_price: Number(it.unitPrice)
    }))

    const preference = await new Preference(client).create({
      body: {
        items: mpItems,
        back_urls: {
          success: `${process.env.APP_URL}/success`,
          failure: `${process.env.APP_URL}/failure`,
          pending: `${process.env.APP_URL}/pending`
        },
        metadata: {
          kind: 'auction',
          userId: decodedToken.id,
          auctionId: body.auctionId
        },
        notification_url: `${process.env.APP_URL}/api/payments/webhook`,
        external_reference: `auction:user:${decodedToken.id}`
      }
    })

    return NextResponse.json({
      preferenceId: preference.id,
      init_point: preference.init_point
    })
  } catch (err) {
    console.error('create-preference error:', err)
    return NextResponse.json({ error: err.message || 'Error creating preference' }, { status: 500 })
  }
}

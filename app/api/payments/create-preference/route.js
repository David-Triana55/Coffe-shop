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
    const { items } = body

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 })
    }

    // External reference: para rastrear pedido

    const mpItems = items.map((it) => ({
      id: String(it.id),
      title: it.title,
      quantity: Number(it.quantity || 1),
      currency_id: 'COP',
      unit_price: Number(it.unit_price)
    }))

    const preference = await new Preference(client).create({
      body: {
        items: mpItems,
        back_urls: {
          success: 'http://localhost:3000/success' || `${process.env.NEXT_PUBLIC_APP_URL}/success`,
          failure: 'http://localhost:3000/failure' || `${process.env.NEXT_PUBLIC_APP_URL}/failure`,
          pending: 'http://localhost:3000/pending' || `${process.env.NEXT_PUBLIC_APP_URL}/pending`
        },
        metadata: {
          userId: decodedToken.id
        }
        // auto_return: 'approved'
      }
    })

    console.log(preference, 'preferences')
    return NextResponse.json({
      preferenceId: preference.id,
      init_point: preference.init_point
    })
  } catch (err) {
    console.error('create-preference error:', err)
    return NextResponse.json({ error: err.message || 'Error creating preference' }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import { MercadoPagoConfig, Preference } from 'mercadopago'

// 🟢 Configura el cliente
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN
})

export async function POST (req) {
  try {
    const body = await req.json()
    console.log(body)

    const preference = {
      items: body.items.map(item => ({
        title: item.title,
        quantity: Number(item.quantity),
        currency_id: 'COP',
        unit_price: Number(item.unit_price) // 🔥 Asegúrate que sea número
      })),
      back_urls: {
        success: 'http://localhost:3000/success',
        failure: 'http://localhost:3000/failure',
        pending: 'http://localhost:3000/pending'
      },
      // auto_return: 'approved',
      metadata: { billId: body.billId }
    }

    const preferenceInstance = new Preference(client)
    const result = await preferenceInstance.create({ body: preference })

    console.log('✅ Preferencia creada:', result)

    // Mercado Pago v2 devuelve `id`, `sandbox_init_point`, y `init_point` dentro de `result`
    return NextResponse.json({
      init_point: result.init_point || result.sandbox_init_point
    })
  } catch (error) {
    console.error('❌ Error en /api/checkout:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

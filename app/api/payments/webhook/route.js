import { NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'
import { findBillByMPPaymentId, insertBill, insertDetailBill } from '@/lib/data/bills'

// Inicializar cliente de Mercado Pago
const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
  options: { timeout: 10000 }
})

// Crear instancia de Payment
const paymentClient = new Payment(mpClient)

export const dynamic = 'force-dynamic'

export async function POST (req) {
  try {
    const body = await req.json()

    console.log('Webhook recibido:', JSON.stringify(body))

    if (body.type === 'payment' && body.data?.id) {
      const paymentId = String(body.data.id)

      const existing = await findBillByMPPaymentId(paymentId)
      if (existing) {
        console.log('Pago ya procesado:', paymentId)
        return NextResponse.json({ received: true })
      }

      const payment = await paymentClient.get({ id: paymentId })
      console.log(payment, 'payment')
      console.log('payment.additional_info:', payment.additional_info)
      console.log('payment.metadata:', payment.metadata)
      console.log('payment.external_reference:', payment.external_reference)

      console.log('Pago obtenido:', payment.id, payment.status)

      if (payment.status === 'approved') {
        const items =
          payment.order?.items ||
          payment.additional_info?.items ||
          []

        const userId = payment.metadata?.userId
        console.log(payment.metadata)
        console.log(userId)
        const currentDate = new Date().toISOString().split('T')[0]
        console.log(currentDate)
        // Crear factura
        const newBill = await insertBill({
          userId,
          date: currentDate,
          mpPaymentId: payment.id
        })

        // Crear detalles de la factura
        for (const item of items) {
          const productId = item.id
          const quantity = Number(item.quantity ?? 1)
          const unitPrice = Number(
            item.unit_price)

          await insertDetailBill({
            billId: newBill.id,
            productId,
            quantity,
            unitPrice: Math.round(unitPrice)
          })
        }

        console.log('Factura guardada:', newBill.id)
      } else {
        console.log('Pago no aprobado:', payment.status)
      }
    } else {
      console.log('Webhook no manejado:', body.type)
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Error en webhook:', err)
    return NextResponse.json(
      { error: err.message || 'Error' },
      { status: 500 }
    )
  }
}

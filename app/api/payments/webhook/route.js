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

export async function POST (req) {
  try {
    const body = await req.json()

    console.log('Webhook recibido:', JSON.stringify(body))

    if (body.type === 'payment' && body.data?.id) {
      const paymentId = String(body.data.id)

      // Evita procesar dos veces el mismo pago
      const existing = await findBillByMPPaymentId(paymentId)
      if (existing) {
        console.log('Pago ya procesado:', paymentId)
        return NextResponse.json({ received: true })
      }

      // Obtener datos del pago desde Mercado Pago
      const payment = await paymentClient.get({ id: paymentId })
      console.log('Pago obtenido:', payment.id, payment.status)

      if (payment.status === 'approved') {
        const externalReference =
          payment.external_reference || payment.order?.external_reference || null

        const items =
          payment.order?.items ||
          payment.additional_info?.items ||
          []

        // Si guardaste userId en external_reference (por ejemplo "order_user-123_...")
        let userId = 'unknown'
        if (externalReference) {
          const match = externalReference.match(/^order_(.*?)_/)
          if (match) userId = match[1]
        }

        // Crear factura
        const newBill = await insertBill({
          userId,
          externalReference,
          mpPaymentId: payment.id,
          total: payment.transaction_amount
        })

        // Crear detalles de la factura
        for (const item of items) {
          const productId = String(item.id ?? item.sku ?? item.title)
          const quantity = Number(item.quantity ?? 1)
          const unitPrice = Number(
            item.unit_price ?? payment.transaction_amount / (items.length || 1)
          )

          await insertDetailBill({
            billId: Number(newBill.id),
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

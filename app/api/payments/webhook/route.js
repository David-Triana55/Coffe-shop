import { NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'
import { findBillByMPPaymentId, insertBill, insertDetailBill } from '@/lib/data/bills'
import { updatePayment } from '@/lib/data/auctions'

// Inicializar cliente de Mercado Pago
const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
  options: { timeout: 10000 }
})

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

      if (payment.status === 'approved') {
        const items =
          payment.order?.items ||
          payment.additional_info?.items ||
          []

        console.log(items)

        const userId =
          payment.metadata?.user_id ||
          payment.external_reference

        const kind = payment?.metadata?.kind

        if (kind === 'checkout') {
          const newBill = await insertBill({
            userId,
            mpPaymentId: payment.id
          })

          console.log(newBill, 'bill')

          for (const item of items) {
            const productId = item.id
            const quantity = Number(item.quantity ?? 1)
            const unitPrice = Number(item.unit_price)

            await insertDetailBill({
              billId: newBill[0].id,
              productId,
              quantity,
              unitPrice: Math.round(unitPrice)
            })
          }

          console.log('Factura guardada:', newBill[0].id)
        } else {
          console.log(items)
          for (const item of items) {
            const auctionId = item.auctionId

            const update = await updatePayment(auctionId)
            console.log(auctionId, 'auction')
            console.log(update)
          }
          console.log('Pago de subasta actualizado')
        }
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

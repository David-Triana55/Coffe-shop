// app/checkout-wallet/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react'

initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY)

export default function CheckoutWallet () {
  const [preferenceId, setPreferenceId] = useState(null)

  useEffect(() => {
    const createPref = async () => {
      const items = [
        { productId: 'prod-1', title: 'Auriculares', quantity: 1, unit_price: 85000 }
      ]
      const res = await fetch('/api/payments/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, userId: 'user-123' })
      })
      const data = await res.json()
      setPreferenceId(data.preferenceId)
    }
    createPref()
  }, [])

  return (
    <div>
      <h2>Pagar (Wallet)</h2>
      {preferenceId
        ? (
        <div style={{ width: 380 }}>
          <Wallet initialization={{ preferenceId }} />
        </div>
          )
        : (
        <p>Cargando botón...</p>
          )}
    </div>
  )
}

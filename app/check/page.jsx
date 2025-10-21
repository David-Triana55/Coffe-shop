// app/checkout/page.tsx
'use client'

import { useState } from 'react'

export default function CheckoutPage () {
  const [loading, setLoading] = useState(false)

  // Ejemplo de carrito (en tu app lo obtendrás del estado real)
  const cartItems = [
    { productId: 'prod-1', title: 'Auriculares', quantity: 1, unit_price: 85000 },
    { productId: 'prod-2', title: 'Cable USB', quantity: 2, unit_price: 15000 }
  ]

  const handleCheckout = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/payments/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cartItems, userId: 'user-123' })
      })
      const data = await res.json()

      if (data.init_point) {
        // Redirige al checkout de Mercado Pago
        window.location.href = data.init_point
      } else {
        alert('Error creando preferencia')
        console.error(data)
      }
    } catch (err) {
      console.error(err)
      alert('Error al procesar el pago')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2>Checkout</h2>
      <button onClick={handleCheckout} disabled={loading}>
        {loading ? 'Redirigiendo...' : 'Pagar con Mercado Pago'}
      </button>
    </div>
  )
}

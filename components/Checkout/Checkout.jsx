'use client'
import useStore from '@/store'
import OrderCard from '../OrderCard/OrderCard'
import './Checkout.css'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Checkout () {
  const { toogleCheckoutWindow, cleanCart, checkoutWindow, checkoutData, totalBill, login } = useStore((state) => state)
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleBill = async () => {
    toogleCheckoutWindow()
    if (login.isLogged === false) {
      router.push('/Sign-in')
      return
    }

    try {
      setLoading(true)

      // const bill = {
      //   cliente: clientInfo,
      //   productos: Array.isArray(checkoutData)
      //     ? checkoutData.map(item => ({
      //       productId: item.id,
      //       quantity: item.count,
      //       unitPrice: item.price
      //     }))
      //     : []
      // }

      // // 1️⃣ Crear factura
      // const response = await fetch('/api/bill', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(bill),
      //   credentials: 'include'
      // })

      // if (!response.ok) throw new Error('Error al enviar el bill')

      // const { billId } = await response.json()

      // console.log(billId, 'data---------------')

      // 2️⃣ Crear preferencia de pago en Mercado Pago
      const res = await fetch('/api/payments/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: checkoutData.map(item => ({
            id: item.id,
            title: item.name,
            quantity: item.count,
            unit_price: parseInt(item.price)
          }))
        }),
        credentials: 'include'
      })

      const data = await res.json()
      if (data.init_point) {
        // Redirige al checkout de Mercado Pago
        window.location.href = data.init_point
      } else {
        alert('Error creando preferencia')
        console.error(data)
      }
      // // 3️⃣ Redirigir al checkout de Mercado Pago
      cleanCart()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (

    <>
    {loading && <div className='fixed top-16 left-0 right-0 flex justify-center items-center h-screen bg-white z-30'>
      <div className='animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900' />
    </div>}

      {!loading && <aside className={` ${checkoutWindow ? 'flex show' : ''} checkout__products `}>
        <h3 className=' text-black block '>Carrito de compra</h3>
        <div className='checkout__products-content'>
          <h4 className='text-gray-500'>Productos</h4>
          {checkoutData?.map((product) => (
            <OrderCard key={product.id} product={product} />
          ))}

        </div>
        <div className='flex justify-between items-center gap-4 mt-4 text-black font-bold'>
          <h4>Total: {totalBill}</h4>
          <button
            onClick={() => handleBill()}
            disabled={checkoutData.length === 0}
            type='button'
            className='bg-stone-500 text-white px-2 py-2 rounded-md w-32 disabled:cursor-not-allowed disabled:opacity-50'
          >
          {checkoutData.length === 0 ? 'Carrito vacío' : 'Finalizar'}
        </button>

        </div>
      </aside>}

      <div className={` ${checkoutWindow ? 'checkout__products-active ' : ''} `} />

    </>

  )
}

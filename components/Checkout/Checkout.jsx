'use client'
import useStore from '@/store'
import OrderCard from '../OrderCard/OrderCard'
import './Checkout.css'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Loading from '../Loading/Loading'

export default function Checkout () {
  const { toogleCheckoutWindow, checkoutWindow, checkoutData, clientInfo, totalBill, login } = useStore((state) => state)
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleBill = async () => {
    toogleCheckoutWindow()
    if (login.isLogged === false) {
      router.push('/Sign-in')
      return
    }
    try {
      const bill = {
        cliente: clientInfo,
        productos: checkoutData.map(item => ({
          id_producto: item.id_producto,
          cantidad: item.count,
          precio_unitario: item.valor_producto_iva
        }))
      }

      setLoading(true)

      const response = await fetch('/api/bill', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${login.token}`
        },
        body: JSON.stringify(bill)
      })

      if (!response.ok) {
        throw new Error('Error al enviar el bill')
      }

      setLoading(false)
      const { data } = await response.json()
      router.push(`/Pay/${data[0].id_factura}`)
    } catch (error) {
      console.error(error)
    }
  }

  return (

    <>
    {loading && <Loading />}

      {!loading && <aside className={` ${checkoutWindow ? 'flex show' : ''} checkout__products `}>
        <h3 className=' text-black block '>Carrito de compra</h3>
        <div className='checkout__products-content'>
          <h4 className='text-gray-500'>Productos</h4>
          {checkoutData?.map((product) => (
            <OrderCard key={product.id_producto} product={product} />
          ))}

        </div>
        <div className='flex justify-between items-center gap-4 mt-4 text-black font-bold'>
          <h4>Total: {totalBill}</h4>
          <button
            onClick={handleBill}
            disabled={checkoutData.length === 0}
            type='button'
            className='bg-stone-500 text-white px-2 py-2 rounded-md w-32 disabled:cursor-not-allowed disabled:opacity-50'
          >
              {checkoutData.length === 0 ? 'Carrito vacio' : 'Finalizar'}
          </button>
        </div>
      </aside>}

      <div className={` ${checkoutWindow ? 'checkout__products-active ' : ''} `} />

    </>

  )
}

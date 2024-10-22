'use client'
import useStore from '@/store'
import OrderCard from '../OrderCard/OrderCard'
import './Checkout.css'
import Link from 'next/link'

export default function Checkout () {
  const { toggleCheckoutWindow, checkoutWindow, checkoutData, totalBill, billProduct, bill } = useStore((state) => state)

  const handleClickToPay = () => {
    toggleCheckoutWindow()
    console.log(bill)
  }
  return (
    <>
      <aside className={` ${checkoutWindow ? 'flex show' : ''} checkout__products `}>
        <h3 className=' text-black block '>Checkout</h3>
        <div className='checkout__products-content'>
          <h4 className='text-gray-500'>Productos</h4>
          {checkoutData?.map((product) => (
            <OrderCard key={product.id_producto} product={product} />
          ))}

        </div>
        <div className='flex justify-between items-center gap-4 mt-4 text-black font-bold'>
          <h4>Total: {totalBill}</h4>
          <button onClick={billProduct} type='button' className='bg-stone-500 text-white px-2 py-2 rounded-md w-32'>
            <Link onClick={handleClickToPay} href='/Pay'>
              Checkout
            </Link>
          </button>
        </div>
      </aside>

      <div className={` ${checkoutWindow ? 'checkout__products-active ' : ''} `} />

    </>

  )
}

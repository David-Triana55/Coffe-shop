'use client'
import useStore from '@/store'
import OrderCard from '../OrderCard/OrderCard'
import './Checkout.css'

export default function Checkout () {
  const { checkoutWindow } = useStore((state) => state)
  return (
    <aside className={` ${checkoutWindow ? 'flex' : 'hidden'} product__detail `}>
      <h3 className=' text-black block '>Checkout</h3>
      <div className='product__detail-products'>
        <h4 className='text-gray-500'>Productos</h4>
        <OrderCard />
        <OrderCard />
        <OrderCard />
        <OrderCard />

        <OrderCard />
        <OrderCard />
        <OrderCard />

      </div>
      <div className='flex justify-between items-center gap-4 mt-4 text-black font-bold'>
        <h4>Total: $0</h4>
        <button type='button' className='bg-stone-500 text-white px-2 py-2 rounded-md w-32'>
          Checkout
        </button>
      </div>
    </aside>
  )
}

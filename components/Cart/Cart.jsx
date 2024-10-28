import { ShoppingBagIcon } from '@heroicons/react/24/outline'
import useStore from '@/store'
export default function Cart () {
  const { toogleCheckoutWindow, checkoutData } = useStore((state) => state)

  return (
    <div className='ml-4 flow-root lg:ml-6'>
      <button type='button' className='group -m-2 flex items-center p-2' onClick={() => toogleCheckoutWindow()}>
        <ShoppingBagIcon
          aria-hidden='true'
          className='h-6 w-6 flex-shrink-0 text-[#D2B48C] group-hover:text-gray-300'
        />
        <span className='ml-2 text-sm font-medium text-white group-hover:text-gray-300'>{checkoutData.length}</span>

      </button>
    </div>
  )
}

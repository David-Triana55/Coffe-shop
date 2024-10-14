import { ShoppingBagIcon } from '@heroicons/react/24/outline'
import useStore from '@/store'
export default function Cart () {
  const { cart } = useStore((state) => state)

  const { toggleCheckoutWindow } = useStore((state) => state)

  return (
    <div className='ml-4 flow-root lg:ml-6'>
      <button type='button' className='group -m-2 flex items-center p-2' onClick={toggleCheckoutWindow}>
        <ShoppingBagIcon
          aria-hidden='true'
          className='h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500'
        />
        <span className='ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800'>{cart}</span>

      </button>
    </div>
  )
}

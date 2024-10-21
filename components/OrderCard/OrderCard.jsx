/* eslint-disable @next/next/no-img-element */
import useStore from '@/store'
import { formatPrice } from '@/utils/formatter'
import { TrashIcon } from '@heroicons/react/24/outline'

export default function OrderCard ({ product }) {
  const { removeToCart } = useStore((state) => state)
  console.log(product)

  const handleRemove = (id) => {
    console.log('remove')
    removeToCart(id)
  }

  const price = formatPrice(product.valor_producto_iva)
  return (
    <article className=' grid grid-cols-[1fr,2fr,30px]  w-full  justify-between items-center mt-2'>
      <img className='w-16 h-16 object-contain' src={product.imagen} alt={product.descripcion} />
      <div className='flex flex-col w-full items-start'>
        <p className=' text-black'>{product.nombre_producto}</p>
        <span className='text-gray-600'>

          {price}
          <span className='ml-4 text-base'>
            Qty:{product.count}
          </span>
        </span>
      </div>
      <div onClick={() => handleRemove(product.id_producto)} className='flex justify-end'>
        <TrashIcon className='h-8 w-8 text-black' />
      </div>

    </article>
  )
}

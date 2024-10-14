import { TrashIcon } from '@heroicons/react/24/outline'

export default function OrderCard () {
  return (
    <article className='grid grid-cols-3 justify-between items-center mt-2'>
      <img className='w-14 h-14' src='/favicon.ico' alt='foto' />
      <p className='text-black'>Nombre</p>
      <div className='flex items-center justify-center gap-2'>
        <span className='text-gray-700'>$500</span>
        <TrashIcon className='h-6 w-6 text-black' />
      </div>

    </article>
  )
}

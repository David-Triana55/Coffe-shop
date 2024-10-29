/* eslint-disable camelcase */
import { useRouter } from 'next/navigation'

export default function Bills ({ id_factura, fecha, total }) {
  const router = useRouter()
  return (
    <div onClick={() => router.push(`/Bill/${id_factura}`)} className='flex items-center justify-between p-4 border-b border-gray-200 hover:bg-gray-50'>
    <div>
      <p className='font-semibold'>#{id_factura}</p>
      <p className='text-sm text-gray-600'>{fecha.toString().slice(0, 10)}</p>
    </div>
    <div className='text-right'>
      <p className='text-green-600'>{total}</p>

    </div>
  </div>
  )
}

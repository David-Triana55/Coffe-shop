import WrapperCards from '@/components/WrapperCards/WrapperCards'
import { getProductByCategory } from '@/lib/data'
import { formatCategory } from '@/utils/formatter'
import { Suspense } from 'react'

export default async function PageTiposDeCafe ({ params }) {
  const url = await params.types.split('-').join(' ')
  const products = await getProductByCategory(url)

  const typesCoffee = formatCategory(url)

  return (
    <div className='mt-14 w-full'>
      <h1 className='text-2xl font-bold text-center text-balance bg-white '>
        {typesCoffee}
      </h1>
      <Suspense fallback={<div>cargando....</div>}>
        <WrapperCards products={products} />
      </Suspense>
    </div>
  )
}

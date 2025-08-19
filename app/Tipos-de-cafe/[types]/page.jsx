import Loading from '@/components/Loading/Loading'
import WrapperCards from '@/components/WrapperCards/WrapperCards'
import { formatCategory } from '@/utils/formatter'
import { Suspense } from 'react'

export default async function PageTiposDeCafe ({ params }) {
  const url = await params.types.split('-').join(' ')
  const products = await fetch(`/api/getProductsByCategory/${url}`)
    .then((res) => res.json())

  const typesCoffee = formatCategory(url)

  console.log(products)

  return (
    <div className='mt-16 py-12 w-full'>
      <h1 className='text-2xl font-bold text-center text-balance bg-white '>
        {typesCoffee}
      </h1>
      <Suspense fallback={<Loading />}>
        <WrapperCards products={products} />
      </Suspense>
    </div>
  )
}

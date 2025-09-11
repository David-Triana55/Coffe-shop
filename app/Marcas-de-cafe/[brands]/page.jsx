import Loading from '@/components/Loading/Loading'
import WrapperCards from '@/components/WrapperCards/WrapperCards'
import { formatCategory } from '@/utils/formatter'
import { Suspense } from 'react'

export default async function PageBrands ({ params }) {
  const brand = await params.brands.split('-').join(' ')
  console.log(brand)
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/brands/${brand}`)
  const products = await res.json()
  const typesCoffee = formatCategory(brand)

  return (
    <div className='mt-16 py-12 w-full'>
      <h1 className='text-2xl font-bold text-center text-balance bg-white '>
        {typesCoffee || brand}
      </h1>
      <Suspense fallback={<Loading />}>
        <WrapperCards products={products} />
      </Suspense>
    </div>
  )
}

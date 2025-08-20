import Loading from '@/components/Loading/Loading'
import WrapperCards from '@/components/WrapperCards/WrapperCards'
import { formatCategory } from '@/utils/formatter'
import { Suspense } from 'react'

export default async function PageMarcas ({ params }) {
  const brand = await params.brands.split('-').join(' ')
  const products = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getProductsByBrand/${brand}`).then((res) => res.json())
  const typesCoffee = formatCategory(brand)

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

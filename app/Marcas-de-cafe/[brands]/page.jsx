import WrapperCards from '@/components/WrapperCards/WrapperCards'
import { getProductByBrand } from '@/lib/data'
import { formatCategory } from '@/utils/formatter'
import { Suspense } from 'react'

export default async function PageMarcas ({ params }) {
  const brand = await params.brands.split('-').join(' ')
  const products = await getProductByBrand(brand)
  const typesCoffee = formatCategory(brand)

  return (
    <div className='mt-16 py-12 w-full'>
      <h1 className='text-2xl font-bold text-center text-balance bg-white '>
        {typesCoffee}
      </h1>
      <Suspense fallback={<div>cargando....</div>}>
        <WrapperCards products={products} />
      </Suspense>
    </div>
  )
}

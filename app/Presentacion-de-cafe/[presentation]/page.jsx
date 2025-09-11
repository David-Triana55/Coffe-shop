import Loading from '@/components/Loading/Loading'
import WrapperCards from '@/components/WrapperCards/WrapperCards'
import { formatCategory } from '@/utils/formatter'
import { Suspense } from 'react'

export default async function PagePresentations ({ params }) {
  const url = await params.presentation.split('-').join(' ')
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/presentations/${url}`)
  const products = await res.json()
  console.log(products)
  const typesCoffee = formatCategory(url)

  return (
    <div className='mt-16 py-12 w-full'>
      <h1 className='text-2xl font-bold text-center text-balance bg-white '>
        {typesCoffee || url}
      </h1>
      <Suspense fallback={<Loading />}>
        <WrapperCards products={products} />
      </Suspense>
    </div>
  )
}

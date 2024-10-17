import LayoutCards from '@/components/WrapperCards/WrapperCards'
import { Suspense } from 'react'

export default async function PageTiposDeCafe ({ params }) {
  const url = params.types.split('-').join(' ')

  console.log(url)
  return (
    <div className='mt-14'>
      <h1 className='text-2xl font-bold text-center text-balance '>
        {url}
      </h1>
      <Suspense fallback={<div>cargando....</div>}>
        <LayoutCards url={url} />
      </Suspense>
    </div>
  )
}

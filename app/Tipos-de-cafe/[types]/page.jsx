import LayoutCards from '@/components/shared/LayoutCards'
import { Suspense } from 'react'

export default async function Tipos ({ params }) {
  const url = params.types.split('-').join(' ')

  console.log(url)
  return (
    <>
      <h1 className='text-2xl font-bold text-center text-balance'>
        {url}
      </h1>
      <Suspense fallback={<div>cargando....</div>}>
        <LayoutCards url={url} />
      </Suspense>
    </>
  )
}

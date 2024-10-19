import WrapperCards from '@/components/WrapperCards/WrapperCards'
import { getProductByCategory } from '@/lib/data'
import { Suspense } from 'react'

export default async function PageTiposDeCafe ({ params }) {
  const url = await params.types.split('-').join(' ')
  const products = await getProductByCategory(url)

  const typesCoffeeName = {
    'Cafe molido': 'Café Molido',
    'Capsulas de Cafe': 'Capsulas de Café',
    'Mezlas Especiales': 'Mezlas Especiales'
  }

  const typesCoffee = typesCoffeeName[url]

  console.log(url)
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

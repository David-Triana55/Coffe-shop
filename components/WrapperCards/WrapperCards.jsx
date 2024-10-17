import Filter from '@/components/Filter/Filter'
import { getProductByCategory } from '@/lib/data'

export default async function LayoutCards ({ url }) {
  // Carga los productos en el componente de servidor
  const products = await getProductByCategory(url)

  return (
    <div className='flex flex-col items-center'>
      <Filter products={products} />

    </div>
  )
}

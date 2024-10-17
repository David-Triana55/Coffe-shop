import Filter from '@/components/home/filter'
import { getProductByCategory } from '@/lib/data'

export default async function LayoutCards ({ url }) {
  // Carga los productos en el componente de servidor
  const products = await getProductByCategory(url)

  return (
    <>
      <Filter products={products} />

    </>
  )
}

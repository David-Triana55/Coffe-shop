import ProductDetail from '@/components/ProductDetail/ProductDetail'
export default async function PageProductDetailWithId ({ params }) {
  return (
    <div className='mt-20 px-4'>
      <ProductDetail params={params} />
    </div>
  )
}

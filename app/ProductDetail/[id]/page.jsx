import ProductDetail from '@/components/ProductDetail/ProductDetail'
export default async function PageProductDetailWithId ({ params }) {
  console.log(params.id, 'paramas')
  return (
    <div className='mt-20 px-4 w-full'>
      <ProductDetail id={params.id} />
    </div>
  )
}

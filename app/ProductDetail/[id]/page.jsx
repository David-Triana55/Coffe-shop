import ProductDetail from '@/components/ProductDetail/ProductDetail'
export default async function PageProductDetailWithId ({ params }) {
  console.log(params.id, 'paramas')
  return (
    <div className='w-full bg-[#D7CCC8]'>
      <ProductDetail id={params.id} />
    </div>
  )
}

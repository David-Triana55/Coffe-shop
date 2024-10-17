import ProductDetailWithId from '@/components/shared/ProductDetail'

export default async function ProductDetail ({ params }) {
  return (
    <div className='product_detail'>
      <div className='product_detail__content'>
        <ProductDetailWithId params={params} />
      </div>
    </div>
  )
}

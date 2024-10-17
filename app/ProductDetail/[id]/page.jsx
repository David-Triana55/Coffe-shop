import ProductDetail from '@/components/ProductDetail/ProductDetail'
import './page.css'
export default async function PageProductDetailWithId ({ params }) {
  return (
    <div className='product_detail'>
      <div className='product_detail__content'>
        <ProductDetail params={params} />
      </div>
    </div>
  )
}

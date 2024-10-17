/* eslint-disable @next/next/no-img-element */
'use client'
import { useEffect, useState } from 'react'

export default function ProductDetailWithId ({ params }) {
  const [product, setProduct] = useState(null)

  useEffect(() => {
    async function fetchProduct () {
      try {
        const response = await fetch(`/api/productById?id=${params.id}`)
        const data = await response.json()
        console.log('Fetched product:', data) // Verificar datos
        setProduct(data[0])
      } catch (error) {
        console.error('Error fetching product:', error)
      }
    }

    fetchProduct()
  }, [params.id])

  console.log(product)

  if (!product) return <div>Loading...</div>

  return (
    <div>
      <h1>Product Detail</h1>
      <h1 className='text-black'>{product?.id_producto}</h1>
      <p className='text-black'>{product?.nombre_producto}</p>
      <p className='text-black'>{product?.descripcion}</p>
      {product?.imagen && (
        <img src={product.imagen} alt={product.nombre_producto} />
      )}
    </div>
  )
}

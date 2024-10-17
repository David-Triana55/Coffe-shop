/* eslint-disable @next/next/no-img-element */
'use client' // Esto asegura que el componente es un Client Component
import { useRouter } from 'next/navigation'
import './Card.css'
import { ShoppingCartIcon } from '@heroicons/react/24/outline'

export default function Card ({ products }) {
  const router = useRouter()
  const precio = Math.floor(products.valor_producto_iva)
  const precioFormateado = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP'
  }).format(precio)

  const handleProductClick = (id) => {
    router.push(`/ProductDetail/${id}`)
  }

  return (
    <div className='card_product'>
      <div className='card_product__content'>
        <span className='card_product__cart'><ShoppingCartIcon /></span>
        <h1 className='card_product__title'>{products.nombre_producto}</h1>
        <div className='card_product__image'>
          <img
            alt={products.nombre_producto}
            src={products.imagen}
            className='object-cover object-center w-full h-full'
            onClick={() => handleProductClick(products.id_producto)}
          />
        </div>
        <p className='card_product__description'>{products.descripcion}</p>
        <p className='card_product__price'>{precioFormateado}</p>
      </div>
    </div>
  )
}

/* eslint-disable @next/next/no-img-element */
'use client' // Esto asegura que el componente es un Client Component
import { useRouter } from 'next/navigation'
import './Card.css'
import { CheckCircleIcon, PlusCircleIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import { formatPrice } from '@/utils/formatter'
import useStore from '@/store'

export default function Card ({ products }) {
  // consumir el estado global
  const { addToCart, removeToCart, checkoutData } = useStore(state => state)
  const [isCart, setIsCart] = useState(false)
  // router para controlar la navegacion
  const router = useRouter()
  // formatear la moneda de los productos
  const precio = formatPrice(products?.valor_producto_iva)
  // verificar si el producto ya se encuentra agregado en el objeto de checkoutdata
  const isInCart = checkoutData.some(item => item.id_producto === products.id_producto)

  const handleIconCard = (product) => {
    setIsCart(!isCart)
    if (isInCart) {
      removeToCart(product.id_producto)
    } else {
      addToCart(product)
    }
  }

  const handleProductClick = (id) => {
    router.push(`/ProductDetail/${id}`)
  }

  return (
    <div className='card_product__content'>
      <span
        className='card_product__cart'
        onClick={() => handleIconCard(products)}
      >
        {
          isInCart
            ? <CheckCircleIcon className='icon-cart-check text-green-500' />
            : <PlusCircleIcon />
        }

      </span>
      <div className='card_product__image'>
        <img
          alt={products?.nombre_producto}
          src={products?.imagen}
          onClick={() => handleProductClick(products.id_producto)}
        />
      </div>
      <h1 className='card_product__title'>{products?.nombre_producto}</h1>
      <p className='card_product__price'>{precio}</p>
    </div>
  )
}

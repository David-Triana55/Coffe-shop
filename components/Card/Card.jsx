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
  const precio = formatPrice(products?.price)
  // verificar si el producto ya se encuentra agregado en el objeto de checkoutdata
  const isInCart = checkoutData.some(item => item.id === products.id)

  const handleIconCard = (product) => {
    setIsCart(!isCart)
    if (isInCart) {
      removeToCart(product.id)
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
          alt={products?.name}
          src={products[0]?.images_url[0].url}
          onClick={() => handleProductClick(products.id)}
        />
      </div>
      <h1 className='card_product__title'>{products?.name}</h1>
      <p className='card_product__price'>{precio}</p>
    </div>
  )
}

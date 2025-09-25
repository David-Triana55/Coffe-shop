/* eslint-disable @next/next/no-img-element */
'use client' // Esto asegura que el componente es un Client Component
import { useRouter } from 'next/navigation'
import './Card.css'
import { CheckCircleIcon, PlusCircleIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import { formatPrice } from '@/utils/formatter'
import useStore from '@/store'

export default function Card ({ product }) {
  const { addToCart, removeToCart, checkoutData } = useStore(state => state)
  const [isCart, setIsCart] = useState(false)
  const router = useRouter()
  const precio = formatPrice(product?.price)
  const isInCart = checkoutData.some(item => item.id === product.id)
  console.log(product)
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
        onClick={() => handleIconCard(product)}
      >
        {
          isInCart
            ? <CheckCircleIcon className='icon-cart-check text-green-500' />
            : <PlusCircleIcon />
        }

      </span>
      <div className='card_product__image'>
        <img
          alt={product?.name}
          src={product?.images_url[0]}
          onClick={() => handleProductClick(product.id)}
        />
      </div>
      <h1 className='card_product__title'>{product?.name}</h1>
      <p className='card_product__price'>{precio}</p>
    </div>
  )
}

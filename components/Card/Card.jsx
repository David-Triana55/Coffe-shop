/* eslint-disable @next/next/no-img-element */
'use client' // Esto asegura que el componente es un Client Component
import { useRouter } from 'next/navigation'
import './Card.css'
import { CheckCircleIcon, PlusCircleIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

export default function Card ({ products }) {
  const [isCart, setIsCart] = useState(false)

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
    <div className='card_product__content'>
      <span onClick={() => setIsCart(!isCart)} className='card_product__cart'>
        {!isCart ? <PlusCircleIcon /> : <CheckCircleIcon className='text-green-500' />}
      </span>
      <div className='card_product__image'>
        <img
          alt={products.nombre_producto}
          src={products.imagen}
          onClick={() => handleProductClick(products.id_producto)}
        />
      </div>
      <h1 className='card_product__title'>{products.nombre_producto}</h1>
      <p className='card_product__price'>{precioFormateado}</p>
    </div>
  )
}

/* eslint-disable @next/next/no-img-element */
'use client'
import { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import './ProductDetail.css'
import { formatCategory, formatPrice } from '@/utils/formatter'
import useStore from '@/store'
export default function ProductDetail ({ params }) {
  const [product, setProduct] = useState(null)
  const [count, setCount] = useState(1)
  const { increase, addToCart } = useStore((state) => state)
  const [productInCart, setProductInCart] = useState(null)

  const price = formatPrice(product?.valor_producto_iva)

  const category = formatCategory(product?.nombre_categoria)

  const handleChangeQuantity = (e) => {
    setCount(e.target.value)
  }

  const handleAddToCart = (product) => {
    if (productInCart?.id_producto === product?.id_producto) {
      setCount(prevCount => {
        const newCount = prevCount + 1
        addToCart(product, newCount)
        return newCount
      })
      return
    }

    increase()
    addToCart(product, count) //
    setProductInCart(product)
  }

  useEffect(() => {
    async function fetchProduct () {
      try {
        const response = await fetch(`/api/productById?id=${params.id}`)
        const data = await response.json()
        setProduct(data[0])
      } catch (error) {
        console.error('Error fetching product:', error)
      }
    }

    fetchProduct()
  }, [params.id])

  if (!product) return <div>Loading...</div>

  return (
    <>
      <div className='product_detail__content'>
        <img src={product.imagen} alt={product.nombre_producto} />
        <p className='product_detail__category'>{category}</p>
        <h1 className='product_detail__title'>{product?.nombre_producto}</h1>
        <p className='product_detail__price'>{price}</p>
      </div>

      <div className='product_detail__cart'>
        <input
          className='product_detail__quantity'
          type='number'
          onChange={handleChangeQuantity}
          value={count}
          min='1'
          max='10'
        />
        <button className='product_detail__button' onClick={() => handleAddToCart(product)}>Agregar al carrito</button>
      </div>

      <Tabs defaultValue='descripcion' className='mt-8'>
        <TabsList className='grid w-full grid-cols-3'>
          <TabsTrigger value='descripcion'>Descripcion</TabsTrigger>
          <TabsTrigger value='details'>Detalles</TabsTrigger>
          <TabsTrigger value='origin'>Origen</TabsTrigger>
        </TabsList>
        <TabsContent value='details' className='bg-white p-4 rounded-lg mt-2'>
          <h3 className='text-xl font-bold mb-2'>Detalles del Producto</h3>
          <ul className='list-disc list-inside'>
            <li>Peso: 300g</li>
            <li>Nivel de tostado: alto</li>
            <li>Notas de sabor: delicioso</li>
          </ul>
        </TabsContent>
        <TabsContent value='origin' className='bg-white p-4 rounded-lg mt-2'>
          <h3 className='text-xl font-bold mb-2'>Origen</h3>
          <p>Este café proviene de las alturas de los Andes colombianos, donde el clima y el suelo crean condiciones perfectas para el cultivo de granos de café de alta calidad.</p>
        </TabsContent>

        <TabsContent value='descripcion' className='bg-white p-4 rounded-lg mt-2'>
          <h3 className='text-xl font-bold mb-2'>Descripcion</h3>
          <p>{product?.descripcion}</p>
        </TabsContent>

      </Tabs>
    </>
  )
}

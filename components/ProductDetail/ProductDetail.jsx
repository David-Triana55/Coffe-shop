/* eslint-disable @next/next/no-img-element */
'use client'
import { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import './ProductDetail.css'
import { formatCategory, formatPrice } from '@/utils/formatter'
import useStore from '@/store'
import { ChevronLeft, Minus, Plus } from 'lucide-react'
import Loading from '../Loading/Loading'
import { useRouter } from 'next/navigation'
export default function ProductDetail ({ params }) {
  const router = useRouter()
  const [product, setProduct] = useState(null)
  const [count, setCount] = useState(1)
  const { addToCart, checkoutData } = useStore((state) => state)
  const [productInCart, setProductInCart] = useState(null)

  const price = formatPrice(product?.valor_producto_iva)

  const category = formatCategory(product?.nombre_categoria)

  const handleAddToCart = (product) => {
    if (productInCart?.id_producto === product?.id_producto || checkoutData.some(item => item.id_producto === product.id_producto)) {
      setCount(prevCount => {
        const newCount = prevCount + 1
        addToCart(product, newCount)
        return newCount
      })

      return
    }

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

  if (!product) return <Loading />

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 w-full lg:pt-4'>
      <div className='product_detail__content relative'>
        <ChevronLeft className=' cursor-pointer absolute left-4 top-4 w-6 h-6 text-black hover:text-primary-500' onClick={() => router.back()} />
        <img src={product.imagen} alt={product.nombre_producto} />

      </div>

      <div className='product_detail__cart'>
        <p className='product_detail__category'>{category}</p>
        <h1 className='product_detail__title'>{product?.nombre_producto}</h1>
        <p className='product_detail__price'>{price}</p>
        <div className='flex gap-2 lg:mt-4'>
          <button
            onClick={() => setCount(Math.max(1, count - 1))}
          >
            <Minus className='h-4 w-4' />
          </button>
          <span className='mx-4 text-xl'>{count}</span>
          <button
            onClick={() => setCount(count + 1)}
          >
            <Plus className='h-4 w-4' />
          </button>

          <button className='product_detail__button' onClick={() => handleAddToCart(product)}>
            Agregar al carrito
          </button>
        </div>
      </div>

      <Tabs defaultValue='descripcion' className='mt-8  lg:col-span-2 lg:mt-10'>
        <TabsList className='grid items-center w-full grid-cols-2'>
          <TabsTrigger value='descripcion'>Descripcion</TabsTrigger>
          <TabsTrigger value='origin'>Origen</TabsTrigger>
        </TabsList>

        <TabsContent value='origin' className='bg-white p-4 rounded-lg mt-2'>
          <h3 className='text-xl font-bold mb-2'>Origen</h3>
          <p>{product.origen ?? 'Este café proviene de las alturas de los Andes colombianos, donde el clima y el suelo crean condiciones perfectas para el cultivo de granos de café de alta calidad'}</p>
        </TabsContent>

        <TabsContent value='descripcion' className='bg-white p-4 rounded-lg mt-2'>
          <h3 className='text-xl font-bold mb-2'>Descripcion</h3>
          <p>{product?.descripcion}</p>
        </TabsContent>

      </Tabs>
    </div>
  )
}

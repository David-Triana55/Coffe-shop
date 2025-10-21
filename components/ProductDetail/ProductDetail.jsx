/* eslint-disable @next/next/no-img-element */
'use client'
import { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import './ProductDetail.css'
import { formatCategory, formatPrice } from '@/utils/formatter'
import useStore from '@/store'
import {
  ChevronLeft,
  Minus,
  Plus,
  ChevronRight,
  ShoppingCart,
  Package,
  Star,
  AlertTriangle,
  Check
} from 'lucide-react'
import Loading from '../Loading/Loading'
import { useRouter } from 'next/navigation'
import { CONSTANTS } from '@/utils/constants'

export default function ProductDetail ({ id }) {
  const router = useRouter()
  const [product, setProduct] = useState(null)
  const [count, setCount] = useState(1)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [stockError, setStockError] = useState('')
  const [addedToCart, setAddedToCart] = useState(false)
  const { addToCart, checkoutData } = useStore((state) => state)
  const [productInCart, setProductInCart] = useState(null)
  const [loading, setLoading] = useState(false)
  const price = formatPrice(product?.price)
  const category = formatCategory(product?.name)

  // Validación de stock
  const validateStock = (quantity) => {
    if (!product?.stock) return true

    if (quantity > product.stock) {
      setStockError(`Solo hay ${product.stock} unidades disponibles`)
      return false
    }

    setStockError('')
    return true
  }

  const handleCountChange = (newCount) => {
    if (newCount < 1) return

    if (validateStock(newCount)) {
      setCount(newCount)
    }
  }

  const handleAddToCart = (product) => {
    if (!validateStock(count)) return

    if (productInCart?.id === product?.id || checkoutData.some((item) => item.id === product.id)) {
      if (validateStock(count)) {
        addToCart(product, count)
        setAddedToCart(true)
        setTimeout(() => setAddedToCart(false), 2000)
      }
      return
    }

    addToCart(product, count)
    setProductInCart(product)
    setAddedToCart(true)

    // Reset success message after 2 seconds
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product?.images_url?.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product?.images_url?.length) % product?.images_url?.length)
  }

  useEffect(() => {
    async function fetchProduct () {
      try {
        setLoading(true)
        const response = await fetch(`/api/productById?id=${id}`, { cache: 'no-store' })
        const data = await response.json()
        setProduct(data[0])
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  if (loading) return <Loading />

  return (
    <div className='min-h-screen bg-gradient-to-br from-[#D7CCC8] to-[#EFEBE9] pt-20'>
      <div className='container mx-auto px-4'>
        {/* Back Button */}
        <Button variant='ghost' onClick={() => router.back()} className='mb-6 text-[#3E2723] hover:bg-[#D7CCC8]/30'>
          <ChevronLeft className='w-4 h-4 mr-2' />
          Volver
        </Button>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto'>
          {/* Image Gallery */}
          <div className='space-y-4'>
            <Card className='overflow-hidden bg-white/90 backdrop-blur-sm border-0 shadow-xl'>
              <CardContent className='p-0 relative'>
                <div className='aspect-square relative bg-gradient-to-br from-gray-50 to-gray-100'>
                  {product?.images_url?.length > 0 && (
                    <img
                      src={product?.images_url[currentImageIndex] || CONSTANTS.IMAGE_PLACEHOLDER}
                      alt={`${product.name} - Imagen ${currentImageIndex + 1}`}
                      className='w-full h-full object-cover'
                    />
                  )}

                  {/* Navigation Arrows */}
                  {product?.images_url?.length > 1 && (
                    <>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={prevImage}
                        className='absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-lg'
                      >
                        <ChevronLeft className='w-5 h-5' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={nextImage}
                        className='absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-lg'
                      >
                        <ChevronRight className='w-5 h-5' />
                      </Button>
                    </>
                  )}

                  {/* Image Counter */}
                  {product?.images_url?.length > 1 && (
                    <div className='absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm'>
                      {currentImageIndex + 1} / {product?.images_url?.length}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Thumbnail Navigation */}
            {product?.images_url?.length > 1 && (
              <div className='flex gap-2 overflow-x-auto pb-2'>
                {product.images_url.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      currentImageIndex === index
                        ? 'border-[#33691E] shadow-lg'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image || CONSTANTS.IMAGE_PLACEHOLDER}
                      alt={`Thumbnail ${index + 1}`}
                      className='w-full h-full object-cover'
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className='space-y-6'>
            <Card className='bg-white/90 backdrop-blur-sm border-0 shadow-xl'>
              <CardContent className='p-8'>
                {/* Category Badge */}
                <Badge className='mb-4 bg-[#33691E] text-white'>{category || 'Café Premium'}</Badge>

                {/* Product Title */}
                <h1 className='text-4xl font-bold text-[#3E2723] mb-4 leading-tight'>{product?.name}</h1>

                {/* Price */}
                <div className='flex items-center gap-4 mb-6'>
                  <span className='text-3xl font-bold text-[#33691E]'>{price}</span>
                  {product?.stock && (
                    <div className='flex items-center text-[#5D4037]'>
                      <Package className='w-4 h-4 mr-1' />
                      <span className='text-sm'>Stock: {product?.stock} unidades</span>
                    </div>
                  )}
                </div>

                {/* Stock Error Alert */}
                {stockError && (
                  <Alert className='mb-6 border-red-200 bg-red-50'>
                    <AlertTriangle className='h-4 w-4 text-red-600' />
                    <AlertDescription className='text-red-700'>{stockError}</AlertDescription>
                  </Alert>
                )}

                {/* Success Message */}
                {addedToCart && (
                  <Alert className='mb-6 border-green-200 bg-green-50'>
                    <Check className='h-4 w-4 text-green-600' />
                    <AlertDescription className='text-green-700'>
                      ¡Producto agregado al carrito exitosamente!
                    </AlertDescription>
                  </Alert>
                )}

                {/* Quantity Selector */}
                <div className='flex items-center gap-4 mb-8'>
                  <span className='text-lg font-medium text-[#3E2723]'>Cantidad:</span>
                  <div className='flex items-center border border-[#D7CCC8] rounded-lg'>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => handleCountChange(count - 1)}
                      disabled={count <= 1}
                      className='h-12 w-12 hover:bg-[#D7CCC8]/30'
                    >
                      <Minus className='h-4 w-4' />
                    </Button>
                    <span className='px-6 py-3 text-xl font-semibold min-w-[60px] text-center'>{count}</span>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => handleCountChange(count + 1)}
                      disabled={product?.stock && count >= product.stock}
                      className='h-12 w-12 hover:bg-[#D7CCC8]/30'
                    >
                      <Plus className='h-4 w-4' />
                    </Button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <Button
                  onClick={() => handleAddToCart(product)}
                  disabled={stockError || (product?.stock && count > product.stock) || (!product?.is_active)}
                  className='w-full h-14 text-lg font-semibold bg-[#33691E] hover:bg-[#1B5E20] text-white transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
                >
                  <ShoppingCart className='w-5 h-5 mr-2' />
                  Agregar al Carrito
                </Button>

                {/* Product Features */}
                <div className='grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-[#D7CCC8]'>
                  <div className='flex items-center text-[#5D4037]'>
                    <Star className='w-4 h-4 mr-2 text-[#33691E]' />
                    <span className='text-sm'>Calidad Premium</span>
                  </div>

                  <div className='flex items-center text-[#5D4037]'>
                    <Check className='w-4 h-4 mr-2 text-[#33691E]' />
                    <span className='text-sm'>Garantía de Calidad</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Product Details Tabs */}

        {(product?.description || product?.origin_details) && (

          <Card className='mt-12 bg-white/90 backdrop-blur-sm border-0 shadow-xl max-w-7xl mx-auto'>
          <CardContent className='p-8'>
            <Tabs defaultValue={`${product?.description ? 'description' : 'origin'}`} className='w-full'>
              <TabsList className={`grid w-full  mb-8 bg-[#D7CCC8]/30 ${product?.description && product?.origin_details ? 'grid-cols-2' : 'grid-cols-1'} `}>
              {product?.description && (
                <TabsTrigger
                  value='description'
                  className='data-[state=active]:bg-[#33691E] data-[state=active]:text-white'
                >
                  Descripción
                </TabsTrigger>
              )}

              {product?.origin_details && (
                <TabsTrigger value='origin' className='data-[state=active]:bg-[#33691E] data-[state=active]:text-white'>
                  Origen
                </TabsTrigger>
              )}
              </TabsList>

              <TabsContent value='description' className='space-y-4'>
                <h3 className='text-2xl font-bold text-[#3E2723] mb-4'>Descripción del Producto</h3>
                <div className='prose prose-lg max-w-none text-[#5D4037]'>
                  <p className='leading-relaxed'>
                    {product?.description}
                  </p>
                </div>
              </TabsContent>

              <TabsContent value='origin' className='space-y-4'>
                <h3 className='text-2xl font-bold text-[#3E2723] mb-4'>Origen y Procedencia</h3>
                <div className='prose prose-lg max-w-none text-[#5D4037]'>
                  <p className='leading-relaxed'>
                    {product?.origin_details}
                  </p>

                  {product?.brand_name && (
                    <div className='mt-6 p-4 bg-[#D7CCC8]/20 rounded-lg'>
                      <h4 className='font-semibold text-[#3E2723] mb-2'>Marca:</h4>
                      <p>{product.brand_name}</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        )}
      </div>
    </div>
  )
}

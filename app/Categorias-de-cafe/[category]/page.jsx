import Loading from '@/components/Loading/Loading'
import WrapperCards from '@/components/WrapperCards/WrapperCards'
import { formatCategory } from '@/utils/formatter'
import { Suspense } from 'react'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Coffee, Star, Award } from 'lucide-react'
import { CONSTANTS } from '@/utils/constants'

export default async function PageCategories ({ params }) {
  const category = await params.category.split('-').join(' ')
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories/${category}`, { cache: 'no-store' })
  const data = await res.json()
  const { products, infoCategory } = data
  console.log(data)
  const typesCoffee = formatCategory(category)
  return (

  <div className='min-h-screen bg-gradient-to-br from-[#D7CCC8] to-[#EFEBE9] text-[#3E2723] mt-14'>

      <section className='py-20 relative overflow-hidden'>
        <div className='absolute inset-0 opacity-30'>
          <div className='absolute top-20 left-10 w-32 h-32 bg-[#33691E]/10 rounded-full blur-3xl' />
          <div className='absolute bottom-20 right-10 w-48 h-48 bg-[#8BC34A]/10 rounded-full blur-3xl' />
        </div>

        <div className='container mx-auto px-4 relative'>
          <div className='grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto'>
            <div className='relative group flex justify-center'>
              <div className='w-64 h-64 bg-white rounded-3xl shadow-xl p-8 transform transition-transform duration-300 hover:scale-105'>
                {infoCategory?.image_url
                  ? (
                  <div className='relative w-full h-full'>
                    <Image
                      src={infoCategory?.image_url || CONSTANTS.IMAGE_PLACEHOLDER}
                      alt={`Logo de ${typesCoffee || category}`}
                      fill
                      priority
                      className='object-cover rounded-full transition-transform duration-300 group-hover:scale-110'
                    />
                  </div>
                    )
                  : (
                  <div className='flex items-center justify-center h-full'>
                    <Coffee className='h-20 w-20 text-[#8D6E63]' />
                  </div>
                    )}
              </div>

              {/* Floating badge */}
              <div className='absolute -bottom-2 left-1/2 transform -translate-x-1/2'>
                <Badge className='bg-gradient-to-r from-[#3E2723] to-[#5D4037] text-white px-6 py-2 text-sm shadow-lg'>
                  <Award className='h-4 w-4 mr-2' />
                  {products?.length} productos
                </Badge>
              </div>
            </div>

            <div className='space-y-6 text-center md:text-left'>
              <h1 className='text-5xl md:text-6xl font-bold bg-gradient-to-r from-[#3E2723] to-[#5D4037] bg-clip-text text-transparent'>
                {typesCoffee || category}
              </h1>
              <p className='text-lg text-[#5D4037] leading-relaxed'>
                {infoCategory?.description || 'Descubre todos los productos de esta categoría seleccionada especialmente para ofrecerte la mejor experiencia cafetera.'}
              </p>

              {/* Stats */}
              <div className='flex justify-center md:justify-start gap-8 mt-8'>
                <div className='text-center p-6 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300'>
                  <div className='text-3xl font-bold text-[#3E2723] mb-2'>{products?.length}</div>
                  <div className='text-sm text-[#5D4037] font-medium'>Productos</div>
                </div>
                <div className='text-center p-6 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300'>
                  <div className='flex justify-center mb-2'>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className='h-5 w-5 text-[#33691E] fill-current' />
                    ))}
                  </div>
                  <div className='text-sm text-[#5D4037] font-medium'>Calidad Premium</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='absolute bottom-0 left-0 right-0'>
          <svg viewBox='0 0 1200 120' preserveAspectRatio='none' className='relative block w-full h-12 fill-white'>
            <path d='M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z' />
          </svg>
        </div>
      </section>

      {/* Products Section */}
      <section className='bg-[#D7CCC8] py-14 relative'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl font-bold text-[#3E2723] mb-4'>
              Productos de <span className='text-[#33691E]'>{typesCoffee || category}</span>
            </h2>
            <p className='text-lg text-[#5D4037] max-w-2xl mx-auto mb-6'>
              Explora nuestra cuidadosa selección de productos premium
            </p>
            <div className='w-24 h-1 bg-gradient-to-r from-[#33691E] to-[#8BC34A] mx-auto rounded-full' />
          </div>

          <Suspense fallback={<Loading />}>
            <WrapperCards products={products} />
          </Suspense>
        </div>
      </section>
    </div>
  )
}

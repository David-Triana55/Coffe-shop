import { featuredBrands } from '@/lib/data/brands'
import { featuredProducts } from '@/lib/data/products'
import { activeAuctions } from '@/lib/data/auctions'
import Image from 'next/image'
import Link from 'next/link'
export default async function PagePrincipal () {
  const brands = await featuredBrands()
  const products = await featuredProducts()
  const auctions = await activeAuctions()

  return (
    <main className='mt-16 h-full bg-[#D7CCC8] text-[#3E2723] pb-10'>
      <section className='relative w-full h-full opacity-70 lg:opacity-80'>
        <Image className='lg:block lg:w-full lg:h-[550px] lg:object-cover lg:object-right lg:rounded-br-3xl lg:rounded-bl-3xl' src='/latte-coffee-cup-scaled.jpg' alt='imagen principal' width={1210} height={550} />
        <h1 className='title text-4xl absolute top-4 left-2 font-bold text-center text-balance text-textNavbar lg:top-16 lg:left-8 lg:text-7xl '>Coffee Shop</h1>
        <h2 className='mt-4 text-xl font-bold text-center text-balance text-black lg:absolute top-36 lg:-left-10 lg:text-2xl lg:text-gray-700 lg:w-[600px]'>
          Café de calidad, hecho con cuidado y dedicado para aquellos que buscan disfrutar cada sorbo.
        </h2>
        <div className='flex mt-5 flex-col items-center justify-center lg:items-start lg:mt-2 lg:left-10 lg:absolute lg:top-60 lg:text-white lg:w-[600px] lg:text-xl'>
          <Link href='/Tipos-de-cafe/Cafe-molido'>
            <button className='button-main bg-buttonColor text-white px-3 py-3 rounded-md w-34 lg:w-40'>
              Comprar ahora
            </button>
          </Link>
        </div>
      </section>

    {
      brands.length === 0
        ? null
        : (
    <section className='mt-10'>
        <h2 className='text-3xl font-bold mb-8 text-center'> Marcas destacadas</h2>
        <div className='w-auto h-72 px-2 items-center mt-6 overflow-x-auto flex gap-x-5 overflow-y-hidden lg:justify-center scroll-smooth'>
          {brands?.map((brand) => (
            <Link href={`/Marcas-de-cafe/${brand.name.split(' ').join('-')}`} aria-label={`visit page ${brand?.name.split(' ').join('-')}`} key={brand.id}>
              <div className='card-brands w-48 h-64 shadow-md rounded-lg flex-none transition-all hover:-translate-y-4 hover:shadow-xl'>
                <div className='w-full flex flex-col justify-around items-center h-full relative rounded-lg bg-white shadow-md'>
                  <p className='text-terciary text-center font-bold text-xl absolute -top-6 dark:text-white'>{brand.name}</p>
                  <img className='w-full h-full object-contain' src={brand?.image_url} alt='' />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
          )
    }

      {products.length === 0
        ? null
        : (

      <section className='mt-10 px-4'>
        <h2 className='text-3xl font-bold mb-8 text-center'>Productos destacados</h2>
        <div className='w-auto h-72 pt-4 px-2 items-center mt-6 overflow-x-clip flex gap-x-5 overflow-y-hidden lg:justify-center scroll-smooth'>

          {products?.map((coffe) => (
            <Link href={`ProductDetail/${coffe?.id}`} aria-label={`visit page ${coffe?.name.split(' ').join('-')}`} key={coffe.id}>
              <div className='w-48 h-64 shadow-md rounded-lg flex-none transition-all hover:-translate-y-6 hover:shadow-xl'>
                <div className='w-full flex flex-col justify-around items-center h-full relative rounded-lg bg-white shadow-md'>
                  <p className='text-terciary text-center font-bold text-xl absolute -top-6 dark:text-white'>{coffe.name}</p>
                  <img className='w-full h-full object-cover rounded-lg' src={coffe.images_url != null ? coffe.images_url[0] : '/placeholder.svg'} alt='' />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
          )}

      {auctions.length === 0
        ? null
        : (
    <section className='mt-10'>
        <h2 className='text-3xl font-bold mb-8 text-center'>Subastas activas</h2>
        <div className='w-auto h-72 px-2 items-center mt-6 overflow-x-auto flex gap-x-5 overflow-y-hidden lg:justify-center scroll-smooth'>

          {auctions?.map((coffe) => (
            <Link href={`/Subastas/${coffe?.name.split(' ').join('-')}`} aria-label={`visit page ${coffe?.name.split(' ').join('-')}`} key={coffe.id}>
              <div className='w-48 h-64 shadow-md rounded-lg flex-none transition-all hover:-translate-y-6 hover:shadow-xl'>
                <div className='w-full flex flex-col justify-around items-center h-full relative rounded-lg bg-white shadow-md'>
                  <p className='text-terciary text-center font-bold text-xl absolute -top-6 dark:text-white'>{coffe.name}</p>
                  <img className='w-full h-full object-cover rounded-lg' src={coffe.image_url} alt='' />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
          )}

    </main>
  )
}

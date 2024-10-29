import { getAccesoriesPrincipal, getBrands } from '@/lib/data'
import Image from 'next/image'
import Link from 'next/link'
export default async function PagePrincipal () {
  const brands = await getBrands()
  const accesoriesCoffe = await getAccesoriesPrincipal()
  return (

    <main className='mt-16  min-h-screen bg-[#D7CCC8] text-[#3E2723]'>
      <section className='relative w-full h-full opacity-70 lg:opacity-80'>

        <Image className=' lg:block lg:w-full lg:h-[550px] lg:object-cover lg:object-right lg:rounded-br-3xl lg:rounded-bl-3xl' src='/latte-coffee-cup-scaled.jpg' alt='imagen principal' width={1210} height={550} />

        <h1 className='text-4xl absolute top-2 font-bold text-center text-balance text-textNavbar lg:top-16 lg:left-8 lg:text-7xl '>Coffe shop</h1>
        <h2 className='mt-4  text-xl font-bold text-center text-balance text-black lg:absolute top-36 lg:-left-10  lg:text-2xl lg:text-gray-700 lg:w-[600px]'>
          Café de calidad, hecho con cuidado y dedicado para aquellos que buscan disfrutar cada sorbo.
        </h2>
        <div className='flex mt-5 flex-col items-center justify-center lg:items-start lg:mt-2 lg:left-10 lg:absolute lg:top-60   lg:text-white lg:w-[600px] lg:text-xl'>

          <Link href='/Tipos-de-cafe/Cafe-molido'>
            <button className='bg-buttonColor text-white px-2 py-2 rounded-md w-32 lg:w-36'>
              Comprar ahora
            </button>
          </Link>

        </div>
      </section>

      <section className='mt-10'>
        <h2 className='text-3xl font-bold mb-8 text-center'>Marcas de café</h2>
        <div className='w-auto h-72 px-2 items-center mt-6 overflow-x-auto overscroll-x-contain flex gap-x-5 overflow-y-hidden lg:justify-center'>
          {brands.map((brand) => (
            <Link href={`/Marcas-de-cafe/${brand.nombre_marca.split(' ').join('-')}`} key={brand.id_marca}>
              <div className='w-48 h-64 shadow-md rounded-lg flex-none transition-all hover:-translate-y-4 hover:shadow-xl'>
                <div className='w-full flex flex-col justify-around items-center h-full rounded-lg bg-white shadow-md'>
                  <img className='w-full h-full object-contain' src={brand.logo} alt='' />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className='mt-10'>
        <h2 className='text-3xl font-bold mb-8 text-center'>Accesorios de café</h2>

        <div className='w-auto h-72 px-2 items-center mt-6 overflow-x-auto overscroll-x-contain flex gap-x-5 overflow-y-hidden lg:justify-center'>
          {accesoriesCoffe?.map((coffe) => (
            <Link href={`/Accesorios-de-cafe/${coffe?.nombre_categoria.split(' ').join('-')}`} key={coffe.id_categoria}>
              <div className='w-48 h-64 shadow-md rounded-lg flex-none transition-all hover:-translate-y-5 hover:shadow-xl'>
                <div className='w-full flex flex-col justify-around items-center h-full relative rounded-lg bg-white shadow-md'>
                  <p className='text-terciary text-center font-bold text-xl absolute -top-6 dark:text-white'>{coffe.nombre_categoria}</p>
                  <img className='w-full h-full object-cover rounded-lg' src={coffe.imagenes} alt='' />
                </div>
              </div>
            </Link>
          ))}
        </div>

      </section>
    </main>
  )
}

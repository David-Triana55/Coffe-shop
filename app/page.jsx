import { getAccesoriesPrincipal, getBrands } from '@/lib/data'
import Link from 'next/link'
export default async function PagePrincipal () {
  const brands = await getBrands()
  const accesoriesCoffe = await getAccesoriesPrincipal()
  return (

    <main className='mt-16  min-h-screen bg-[#D7CCC8] text-[#3E2723]'>
      <section className='relative w-full h-full opacity-70'>

        <img src='https://www.baristo.com.br/wp-content/uploads/2017/09/21.jpg' alt='' />
        <h1 className='text-5xl absolute top-2 font-bold text-center text-balance text-black'>Coffe shop</h1>
        <h2 className='mt-4  text-xl font-bold text-center text-balance text-black'>
          Café de calidad, hecho con cuidado y dedicado para aquellos que buscan disfrutar cada sorbo.
        </h2>
        <div className='flex mt-2 flex-col items-center justify-center'>

          <Link href='/Tipos-de-cafe/Cafe-molido'>
            <button className='bg-buttonColor text-white px-2 py-2 rounded-md w-32'>
              Comprar ahora
            </button>
          </Link>

        </div>
      </section>

      <section className='mt-16'>
        <h2 className='text-3xl font-bold mb-8 text-center'>Marcas de café</h2>
        <div className='w-auto h-72 px-2 items-center mt-6 overflow-x-auto overscroll-x-contain flex gap-x-5 overflow-y-hidden lg:justify-center'>
          {brands.map((brand) => (
            <Link href={`/Marcas-de-cafe/${brand.nombre_marca}`} key={brand.id_marca}>
              <div className='w-48 h-64 shadow-md rounded-lg flex-none transition-all hover:-translate-y-4 hover:shadow-xl'>
                <div className='w-full flex flex-col justify-around items-center h-full rounded-lg bg-white shadow-md'>
                  <p className='text-terciary font-bold text-xl dark:text-white'>{brand.nombre_marca}</p>
                  <img className='w-full h-full object-contain' src='https://www.baristo.com.br/wp-content/uploads/2017/09/21.jpg' alt='' />
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
            <Link href={`/Accesorios-de-cafe/${coffe.nombre_categoria}`} key={coffe.id_categoria}>
              <div className='w-48 h-64 shadow-md rounded-lg flex-none transition-all hover:-translate-y-4 hover:shadow-xl'>
                <div className='w-full flex flex-col justify-around items-center h-full rounded-lg bg-white shadow-md'>
                  <p className='text-terciary font-bold text-xl dark:text-white'>{coffe.nombre_categoria}</p>
                  <img className='w-full h-full object-contain' src='https://www.baristo.com.br/wp-content/uploads/2017/09/21.jpg' alt='' />
                </div>
              </div>
            </Link>
          ))}
        </div>

      </section>
    </main>
  )
}

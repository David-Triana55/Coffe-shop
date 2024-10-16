import { getCategories, getProductByBrand } from '@/lib/data'

export default async function Home () {
  const categories = await getCategories()
  // console.log(categories)
  const marcas = await getProductByBrand('Oma')
  console.log(marcas)
  return (
    <div className=''>
      <main className=''>
        <h1 className='text-5xl font-bold text-center text-balance'>Coffee Shop</h1>
        <p className='text-center text-balance'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, doloremque, voluptates, quia, ipsa, aspernatur, voluptas, repellendus, eaque, consequuntur, fugiat, quos, odit, accusamus, velit, laborum, delectus.
        </p>
        <p className='text-center text-balance'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, doloremque, voluptates, quia, ipsa, aspernatur, voluptas, repellendus, eaque, consequuntur, fugiat, quos, odit, accusamus, velit, laborum, delectus.
        </p>

        {/* {categories.map((category) => (
          <p key={category.id_categoria} className='text-center text-balance'>
            {category.nombre_categoria}
          </p>
        ))} */}

      </main>
      <footer className='row-start-3 flex gap-6 flex-wrap items-center justify-center' />
    </div>
  )
}

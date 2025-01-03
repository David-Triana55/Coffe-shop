/* eslint-disable react-hooks/rules-of-hooks */
'use client'
import CardProducts from '@/components/Card/Card'
import React, { Suspense, useState } from 'react'
import './WrapperCards.css'
import NotProducts from '../NotProducts/NotProducts'
import Loading from '../Loading/Loading'
import { useFilter } from '@/hooks/useFilter'

export default function WrapperCards ({ products }) {
  // eslint-disable-next-line no-unused-vars
  const [remainProducts, setRemainProducts] = useState(products)
  const [filteredProducts, setFilteredProducts] = useState(products)
  const [filtroValue, setFiltroValue] = useState('')
  const [search, setSearch] = useState('')

  const handleChangeOptions = (e) => {
    const value = e.target.value
    setFiltroValue(value)

    // hook que encapsula la logica del filtrado de los productos
    useFilter(setFilteredProducts, filteredProducts, filtroValue)
  }

  const handleChangeSearch = (e) => {
    setSearch(e.target.value)
    if (e.target.value === '') {
      setFilteredProducts(remainProducts)
    } else {
      setFilteredProducts(filteredProducts.filter((product) => product.nombre_producto.toLowerCase().includes(e.target.value.toLowerCase())))
    }
  }

  return (
    <div className='wrapper_cards'>
      <div className='w-full px-4 flex flex-wrap-reverse justify-between items-center gap-4 mt-4 text-black font-bold mb-9'>
        <select className='w-2/4 lg:w-1/4 rounded-md' onChange={handleChangeOptions}>
          <option value=''>Seleccionar filtro</option>
          <option value='Ordenar por precio alto a bajo'>Ordenar por precio: alto a bajo</option>
          <option value='Ordenar por precio bajo a alto'>Ordenar por precio: bajo a alto</option>

          <option value='Ordenar por alfabeto'>Ordenar por alfabeto: a-z</option>
        </select>

        <input onChange={handleChangeSearch} type='text' value={search} className=' w-1/3 h-10 text-black rounded-lg' placeholder='Buscar...' />

        <p className='text-base font-light md:text-xl'>Cantidad de Productos: {filteredProducts?.length}</p>
      </div>

      <div className='wrapper_cards__content'>
        {
        filteredProducts?.map((product) => (
          <div className=' last:mb-6 ' key={product.id_producto}>
            <Suspense fallback={<Loading />}>
              <CardProducts products={product} />

            </Suspense>
          </div>
        ))
      }
      </div>
      {filteredProducts?.length === 0 && <NotProducts product={search} />}

    </div>
  )
}

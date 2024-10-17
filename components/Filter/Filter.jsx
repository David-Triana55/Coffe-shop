'use client'
import CardProducts from '@/components/Card/Card'
import React, { Suspense, useState } from 'react'

export default function Filter ({ products }) {
  const [filteredProducts, setFilteredProducts] = useState(products)
  const [filtroValue, setFiltroValue] = useState('') // Estado para el valor del filtro

  const handleChange = (e) => {
    const value = e.target.value
    setFiltroValue(value) // Actualiza el estado del filtro

    if (filtroValue === 'Ordenar por precio') {
      setFilteredProducts(filteredProducts.sort((a, b) => a.valor_producto_iva - b.valor_producto_iva))
    } else if (filtroValue === 'Ordenar por alfabeto') {
      setFilteredProducts(filteredProducts.sort((a, b) => a.nombre_producto.localeCompare(b.nombre_producto)))
    } else {
      setFilteredProducts(products)
    }
  }

  return (
    <>
      <div className='w-10/12 flex flex-wrap-reverse justify-between items-center gap-4 mt-4 text-black font-bold'>
        <select onChange={handleChange}>
          <option value=''>Seleccionar filtro</option>
          <option value='Ordenar por precio'>Ordenar por precio</option>
          <option value='Ordenar por alfabeto'>Ordenar por alfabeto</option>
        </select>

        <p className='text-base font-light md:text-xl'>Cantidad de Productos: {filteredProducts?.length}</p>
      </div>

      <div className='grid sm:grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 p-8'>
        {
        filteredProducts.map((product) => (
          <div className=' last:mb-24' key={product.id_producto}>
            <Suspense fallback={<p>Cargando...</p>}>
              <CardProducts products={product} />

            </Suspense>
          </div>
        ))

      }
      </div>
      {filteredProducts.length === 0 && <h1>No hay productos</h1>}

    </>
  )
}

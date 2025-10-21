/* eslint-disable react-hooks/rules-of-hooks */
'use client'
import CardProducts from '@/components/Card/Card'
import { Suspense, useState, useEffect } from 'react'
import './WrapperCards.css'
import NotProducts from '../NotProducts/NotProducts'
import Loading from '../Loading/Loading'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function WrapperCards ({ products }) {
  const [remainProducts] = useState(products || [])
  const [filteredProducts, setFilteredProducts] = useState(products)
  const [filtroValue, setFiltroValue] = useState('recent')
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!filtroValue || filtroValue === '') {
      return
    }

    let sorted = [...remainProducts]

    switch (filtroValue) {
      case 'price-high':
        sorted = sorted.sort((a, b) => Number.parseFloat(b.price) - Number.parseFloat(a.price))
        break
      case 'price-low':
        sorted = sorted.sort((a, b) => Number.parseFloat(a.price) - Number.parseFloat(b.price))
        break
      case 'recent':
        sorted = sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        break
      default:
        sorted = sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        break
    }

    setFilteredProducts(sorted)
  }, [filtroValue, remainProducts])

  const handleChangeSearch = (e) => {
    setSearch(e.target.value)
    if (e.target.value === '') {
      setFilteredProducts(remainProducts)
    } else {
      setFilteredProducts(remainProducts.filter((product) => product.name.toLowerCase().includes(e.target.value.toLowerCase())))
    }
  }

  return (
    <div className='wrapper_cards'>
      <div className='w-full px-4 flex flex-wrap-reverse justify-between items-center gap-4 mt-4 text-black font-bold mb-9'>
        <Select value={filtroValue} onValueChange={setFiltroValue}>
          <SelectTrigger className='w-48 bg-white border-0 rounded-xl shadow-lg'>
            <SelectValue placeholder='Ordenar por' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='recent'>Más recientes</SelectItem>
            <SelectItem value='price-low'>Precio: menor a mayor</SelectItem>
            <SelectItem value='price-high'>Precio: mayor a menor</SelectItem>
          </SelectContent>
        </Select>

        <div className='relative flex-1 max-w-md'>
          <div className='relative bg-white rounded-xl shadow-lg'>
            <div className='relative'>
              <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#33691E]' />
              <Input
                placeholder='Buscar productos...'
                value={search}
                onChange={handleChangeSearch}
                className='pl-12 pr-4 py-3 border-0 bg-transparent text-lg placeholder:text-[#5D4037]/60 focus:ring-0'
              />
            </div>
          </div>
        </div>

        <p className='text-base font-light md:text-xl text-[#5D4037]'>
          Productos: <span className='font-semibold text-[#33691E]'>{filteredProducts?.length}</span>
        </p>
      </div>

      <div className='wrapper_cards__content'>
        {filteredProducts?.map((product) => (
          <div className='last:mb-6' key={product.id}>
            <Suspense fallback={<Loading />}>
              <CardProducts product={product} />
            </Suspense>
          </div>
        ))}
      </div>

      {filteredProducts?.length === 0 && <NotProducts product={search} />}
    </div>
  )
}

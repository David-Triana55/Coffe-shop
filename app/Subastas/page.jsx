'use client'
import { useEffect, useState, useMemo } from 'react'
import { Search, Gavel, ArrowUpDown } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Loading from '@/components/Loading/Loading'
import CardAuction from '@/components/CardAuction/CardAuction'

export default function SubastasPage () {
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [auctions, setAuctions] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/auctions', { cache: 'no-store' })
        const data = await response.json()
        setAuctions(data)
      } catch (error) {
        console.error('Error fetching auctions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filtrado y ordenamiento en el front-end
  const filteredAndSortedAuctions = useMemo(() => {
    let auctionsList = auctions?.auctions || []

    // Filtrar por término de búsqueda
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase()
      auctionsList = auctionsList.filter((auction) => {
        const productName = auction.product?.name?.toLowerCase() || ''
        const brandName = auction.product?.brand?.name?.toLowerCase() || ''
        const categoryName = auction.product?.category?.name?.toLowerCase() || ''
        const originName = auction.product?.origin?.name?.toLowerCase() || ''

        return (
          productName.includes(searchLower) ||
          brandName.includes(searchLower) ||
          categoryName.includes(searchLower) ||
          originName.includes(searchLower)
        )
      })
    }

    return auctionsList
  }, [auctions, searchTerm])

  return (
    <div className='min-h-screen bg-[#D7CCC8] text-[#3E2723]'>
      {loading
        ? (
        <Loading />
          )
        : (
        <main className='container mx-auto px-4 py-8'>
          {/* Título */}
          <div className='text-center mb-8 mt-16'>
            <h1 className='text-4xl md:text-5xl font-bold text-[#3E2723] mb-2'>Subastas</h1>
            <p className='text-[#5D4037] text-lg'>Descubre las mejores ofertas de café</p>
          </div>

          {/* Barra de búsqueda y ordenamiento */}
        <div className='mb-8'>
          <div className='flex flex-col md:flex-row gap-4 items-center justify-center max-w-4xl mx-auto'>

            {/* Búsqueda */}
            <div className='flex items-center justify-center h-full'>
              <div className='inline-flex items-center space-x-3 bg-white rounded-xl px-6 py-2 shadow-lg'>
                <Gavel className='h-5 w-5 text-[#33691E]' />
                <p className='text-[#3E2723] font-medium'>
                  {searchTerm
                    ? (
                    <>
                      <span className='font-bold text-[#33691E] text-xl'>{filteredAndSortedAuctions.length}</span>{' '}
                      resultado
                      {filteredAndSortedAuctions.length !== 1 && 's'} encontrado
                      {filteredAndSortedAuctions.length !== 1 && 's'}
                    </>
                      )
                    : (
                    <>
                      <span className='font-bold text-[#33691E] text-xl'>{filteredAndSortedAuctions.length}</span> subasta
                      {filteredAndSortedAuctions.length !== 1 && 's'} disponible
                      {filteredAndSortedAuctions.length !== 1 && 's'}
                    </>
                      )}
                </p>
              </div>
            </div>

            {/* Input de búsqueda */}
            <div className='relative flex-1 w-full'>
              <div className='relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300'>
                <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#33691E]' />
                <Input
                  placeholder='Buscar por nombre, marca, categoría u origen...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='pl-12 pr-4 py-3 border-0 bg-transparent text-lg placeholder:text-[#5D4037]/60 focus:ring-0 focus-visible:ring-2 focus-visible:ring-[#33691E]'
                />
              </div>
            </div>

          </div>
        </div>

          {/* Grid de subastas centrado */}
          <div className='max-w-7xl mx-auto'>
            {filteredAndSortedAuctions.length > 0
              ? (
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                {filteredAndSortedAuctions.map((auction) => (
                  <div key={auction.auction_id} className='group'>
                    <CardAuction auction={auction} />
                  </div>
                ))}
              </div>
                )
              : (
              <div className='text-center py-16'>
                <div className='bg-white rounded-2xl p-12 shadow-lg max-w-md mx-auto'>
                  <Gavel className='h-20 w-20 text-[#8D6E63] mx-auto mb-6' />
                  <h3 className='text-2xl font-semibold text-[#3E2723] mb-3'>
                    {searchTerm ? 'No se encontraron resultados' : 'No hay subastas disponibles'}
                  </h3>
                  <p className='text-[#5D4037] text-lg'>
                    {searchTerm
                      ? 'Intenta con otros términos de búsqueda'
                      : 'Vuelve más tarde para ver nuevas subastas'}
                  </p>
                </div>
              </div>
                )}
          </div>
        </main>
          )}
    </div>
  )
}

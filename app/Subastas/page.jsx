'use client'
import { useEffect, useState } from 'react'
import { Search, Filter, SlidersHorizontal, X, ChevronDown, ChevronUp, Gavel } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import CardProducts from '@/components/Card/Card'
import { Badge } from '@/components/ui/badge'
import { formatCategory } from '@/utils/formatter'
import Loading from '@/components/Loading/Loading'

export default function SubastasPage () {
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('ending-soon')
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedBrands, setSelectedBrands] = useState([])
  const [selectedOrigins, setSelectedOrigins] = useState([])
  const [selectedStatus, setSelectedStatus] = useState([])
  const [origins, setOrigins] = useState([])
  const [brands, setBrands] = useState([])
  const [categories, setCategories] = useState([])
  const [auctions, setAuctions] = useState([])
  const [query, setQuery] = useState('')

  const statusOptions = [
    { id: 'active', name: 'Activas' },
    { id: 'ending-soon', name: 'Por Finalizar' },
    { id: 'upcoming', name: 'Próximas' }
  ]

  const FilterSection = ({ title, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen)

    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant='ghost'
            className='w-full justify-between p-2 h-auto hover:bg-gray-50 rounded-lg transition-all duration-200'
          >
            <h3 className='font-medium text-left text-sm text-[#3E2723]'>{title}</h3>
            <div className='p-1 rounded-full bg-[#3E2723]'>
              {isOpen ? <ChevronUp className='h-3 w-3 text-white' /> : <ChevronDown className='h-3 w-3 text-white' />}
            </div>
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className='mt-2 pl-1'>{children}</CollapsibleContent>
      </Collapsible>
    )
  }

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        fetch('/api/categories')
          .then((res) => res.json())
          .then(setCategories),
        fetch('/api/brands')
          .then((res) => res.json())
          .then(setBrands),
        fetch('/api/origins')
          .then((res) => res.json())
          .then(setOrigins),
        fetch('/api/auctions', { cache: 'no-store' })
          .then((res) => res.json())
          .then(setAuctions)
      ])
      setLoading(false)
    }

    fetchData()
  }, [])

  console.log(auctions)

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setQuery(searchTerm)
    }, 500)

    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm])

  useEffect(() => {
    const fetchFilteredAuctions = async () => {
      const params = new URLSearchParams()

      if (query) params.append('search', query)
      if (selectedCategories.length > 0) params.append('categories', selectedCategories.map((c) => c.id).join(','))
      if (selectedBrands.length > 0) params.append('brands', selectedBrands.map((b) => b.id).join(','))
      if (selectedOrigins.length > 0) params.append('origins', selectedOrigins.map((o) => o.id).join(','))
      if (selectedStatus.length > 0) params.append('status', selectedStatus.map((s) => s.id).join(','))
      if (sortBy) params.append('sortBy', sortBy)

      const res = await fetch(`/api/auctions/filter?${params.toString()}`)
      const data = await res.json()
      setAuctions(data)
    }

    fetchFilteredAuctions()
  }, [selectedCategories, selectedBrands, selectedOrigins, selectedStatus, query, sortBy])

  const handleCategoryChange = (category, checked) => {
    setSelectedCategories((prev) => (checked ? [...prev, category] : prev.filter((c) => c.id !== category.id)))
  }

  const handleBrandChange = (brand, checked) => {
    setSelectedBrands((prev) => (checked ? [...prev, brand] : prev.filter((b) => b.id !== brand.id)))
  }

  const handleOriginChange = (origin, checked) => {
    setSelectedOrigins((prev) => (checked ? [...prev, origin] : prev.filter((o) => o.id !== origin.id)))
  }

  const handleStatusChange = (status, checked) => {
    setSelectedStatus((prev) => (checked ? [...prev, status] : prev.filter((s) => s.id !== status.id)))
  }

  const clearAllFilters = () => {
    setSelectedCategories([])
    setSelectedBrands([])
    setSelectedOrigins([])
    setSelectedStatus([])
    setSearchTerm('')
  }

  const FilterContent = () => (
    <div className='space-y-2'>
      {/* Estado de Subasta */}
      <FilterSection title='Estado' defaultOpen>
        <div className='space-y-1'>
          {statusOptions.map((status) => (
            <div
              key={status.id}
              className='flex items-center space-x-2 p-1 rounded hover:bg-gray-50 transition-all duration-200'
            >
              <Checkbox
                id={`status-${status.id}`}
                checked={selectedStatus.some((s) => s.id === status.id)}
                onCheckedChange={(checked) => handleStatusChange(status, checked)}
                className='data-[state=checked]:bg-[#33691E] h-4 w-4'
              />
              <Label
                htmlFor={`status-${status.id}`}
                className='text-sm cursor-pointer hover:text-[#33691E] transition-colors duration-200'
              >
                {status.name}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Categorías */}
      <FilterSection title='Categorías' defaultOpen={false}>
        <div className='space-y-1'>
          {categories?.map((category) => (
            <div
              key={category.id}
              className='flex items-center space-x-2 p-1 rounded hover:bg-gray-50 transition-all duration-200'
            >
              <Checkbox
                id={`category-${category.id}`}
                checked={selectedCategories.some((c) => c.id === category.id)}
                onCheckedChange={(checked) => handleCategoryChange(category, checked)}
                className='data-[state=checked]:bg-[#33691E] h-4 w-4'
              />
              <Label
                htmlFor={`category-${category.id}`}
                className='text-sm cursor-pointer hover:text-[#33691E] transition-colors duration-200'
              >
                {formatCategory(category.name) || category.name}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Marcas */}
      <FilterSection title='Marcas' defaultOpen={false}>
        <div className='space-y-1 max-h-32 overflow-y-auto custom-scrollbar'>
          {brands?.map((brand) => (
            <div
              key={brand.id}
              className='flex items-center space-x-2 p-1 rounded hover:bg-gray-50 transition-all duration-200'
            >
              <Checkbox
                id={`brand-${brand.id}`}
                checked={selectedBrands.some((b) => b.id === brand.id)}
                onCheckedChange={(checked) => handleBrandChange(brand, checked)}
                className='data-[state=checked]:bg-[#33691E] h-4 w-4'
              />
              <Label
                htmlFor={`brand-${brand.id}`}
                className='text-sm cursor-pointer hover:text-[#33691E] transition-colors duration-200'
              >
                {formatCategory(brand.name) || brand.name}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Origen */}
      <FilterSection title='Origen' defaultOpen={false}>
        <div className='space-y-1'>
          {origins?.map((origin) => (
            <div
              key={origin.id}
              className='flex items-center space-x-2 p-1 rounded hover:bg-gray-50 transition-all duration-200'
            >
              <Checkbox
                id={`origin-${origin.id}`}
                checked={selectedOrigins.some((o) => o.id === origin.id)}
                onCheckedChange={(checked) => handleOriginChange(origin, checked)}
                className='data-[state=checked]:bg-[#33691E] h-4 w-4'
              />
              <Label
                htmlFor={`origin-${origin.id}`}
                className='text-sm cursor-pointer hover:text-[#33691E] transition-colors duration-200'
              >
                {formatCategory(origin.name) || origin.name}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      <Button
        variant='outline'
        onClick={clearAllFilters}
        className='w-full bg-[#3E2723] text-white border-0 hover:bg-[#5D4037] transition-all duration-300 text-sm py-2'
      >
        <X className='mr-2 h-3 w-3' />
        Limpiar Filtros
      </Button>
    </div>
  )

  return (
    <div className='min-h-screen bg-[#D7CCC8] text-[#3E2723]'>
      {loading
        ? (
        <Loading />
          )
        : (
        <main className='container mx-auto p-4'>
          {/* Barra de búsqueda */}
          <div className='mb-6 mt-16'>
            <div className='flex flex-col md:flex-row gap-4 items-center justify-center'>
              <div className='relative flex-1 max-w-2xl'>
                <div className='relative bg-white rounded-xl shadow-lg'>
                  <div className='relative'>
                    <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#33691E]' />
                    <Input
                      placeholder='Buscar subastas...'
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className='pl-12 pr-4 py-3 border-0 bg-transparent text-lg placeholder:text-[#5D4037]/60 focus:ring-0'
                    />
                  </div>
                </div>
              </div>

              <div className='flex items-center space-x-4'>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className='w-48 bg-white border-0 rounded-xl shadow-lg'>
                    <SelectValue placeholder='Ordenar por' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='ending-soon'>Finalizan pronto</SelectItem>
                    <SelectItem value='recent'>Más recientes</SelectItem>
                    <SelectItem value='price-low'>Puja más baja</SelectItem>
                    <SelectItem value='price-high'>Puja más alta</SelectItem>
                  </SelectContent>
                </Select>

                {/* Filtros móviles */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button className='md:hidden bg-[#3E2723] hover:bg-[#5D4037] border-0 rounded-xl shadow-lg'>
                      <Filter className='h-4 w-4 mr-2' />
                      Filtros
                    </Button>
                  </SheetTrigger>
                  <SheetContent side='left' className='w-80 bg-white'>
                    <SheetHeader>
                      <SheetTitle className='text-[#3E2723] text-xl'>Filtros</SheetTitle>
                      <SheetDescription className='text-[#5D4037]'>Refina tu búsqueda de subastas</SheetDescription>
                    </SheetHeader>
                    <div className='mt-6'>
                      <FilterContent />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>

          <div className='flex gap-6'>
            {/* Sidebar de filtros */}
            <aside className='hidden md:block w-64 flex-shrink-0'>
              <div className='sticky top-4'>
                <Card className='bg-white border-0 shadow-lg rounded-xl overflow-hidden'>
                  <CardHeader className='bg-[#3E2723] text-white py-3'>
                    <CardTitle className='flex items-center text-base'>
                      <SlidersHorizontal className='h-4 w-4 mr-2' />
                      Filtros
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='p-3'>
                    <FilterContent />
                  </CardContent>
                </Card>
              </div>
            </aside>

            {/* Grid de subastas */}
            <div className='flex-1'>
              <div className='mb-4 flex items-center justify-between bg-white rounded-xl p-4 shadow-lg'>
                <div className='flex items-center space-x-3'>
                  <Gavel className='h-5 w-5 text-[#33691E]' />
                  <p className='text-[#3E2723] font-medium'>
                    Mostrando <span className='font-bold text-[#33691E]'>{auctions.auctions.length}</span> subastas
                  </p>
                </div>

                {(selectedCategories.length > 0 ||
                  selectedBrands.length > 0 ||
                  selectedOrigins.length > 0 ||
                  selectedStatus.length > 0) && (
                  <div className='flex flex-wrap gap-2 max-w-md'>
                    {selectedStatus.map((status) => (
                      <Badge
                        key={status.id}
                        className='cursor-pointer bg-[#33691E] hover:bg-[#2E7D32] transition-all duration-200 text-xs'
                        onClick={() => handleStatusChange(status, false)}
                      >
                        {status.name} <X className='ml-1 h-3 w-3' />
                      </Badge>
                    ))}
                    {selectedCategories.map((category) => (
                      <Badge
                        key={category.id}
                        className='cursor-pointer bg-[#5D4037] hover:bg-[#4E342E] transition-all duration-200 text-xs'
                        onClick={() => handleCategoryChange(category, false)}
                      >
                        {category.name} <X className='ml-1 h-3 w-3' />
                      </Badge>
                    ))}
                    {selectedBrands.map((brand) => (
                      <Badge
                        key={brand.id}
                        className='cursor-pointer bg-[#6D4C41] hover:bg-[#5D4037] transition-all duration-200 text-xs'
                        onClick={() => handleBrandChange(brand, false)}
                      >
                        {brand.name} <X className='ml-1 h-3 w-3' />
                      </Badge>
                    ))}
                    {selectedOrigins.map((origin) => (
                      <Badge
                        key={origin.id}
                        className='cursor-pointer bg-[#8D6E63] hover:bg-[#6D4C41] transition-all duration-200 text-xs'
                        onClick={() => handleOriginChange(origin, false)}
                      >
                        {origin.name} <X className='ml-1 h-3 w-3' />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                {auctions?.auctions?.map((auction) => (
                  <div key={auction.id} className='group'>
                    <CardProducts
                      auction={auction}
                      className='overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white border-0 rounded-xl'
                    />
                  </div>
                ))}
              </div>

              {auctions?.auctions?.length === 0 && (
                <div className='text-center py-12'>
                  <Gavel className='h-16 w-16 text-[#8D6E63] mx-auto mb-4' />
                  <h3 className='text-xl font-semibold text-[#3E2723] mb-2'>No hay subastas disponibles</h3>
                  <p className='text-[#5D4037]'>Intenta ajustar los filtros o vuelve más tarde</p>
                </div>
              )}
            </div>
          </div>
        </main>
          )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #33691e;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #2e7d32;
        }
      `}</style>
    </div>
  )
}

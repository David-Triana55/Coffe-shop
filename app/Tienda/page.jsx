'use client'
import { useEffect, useState } from 'react'
import { Search, Filter, SlidersHorizontal, X, ChevronDown, ChevronUp, ShoppingBag } from 'lucide-react'
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
import Link from 'next/link'
import { formatCategory } from '@/utils/formatter'
import Loading from '@/components/Loading/Loading'
import NotProducts from '@/components/NotProducts/NotProducts'

export default function CoffeeStore () {
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('recent')
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedBrands, setSelectedBrands] = useState([])
  const [selectedTypes, setSelectedTypes] = useState([])
  const [selectedOrigins, setSelectedOrigins] = useState([])
  const [selectedAccessories, setSelectedAccessories] = useState([])
  const [origins, setOrigins] = useState([])
  const [brands, setBrands] = useState([])
  const [categories, setCategories] = useState([])
  const [accesories, setAccesories] = useState([])
  const [presentations, setPresentations] = useState([])
  const [products, setProducts] = useState([])
  const [query, setQuery] = useState('')
  // eslint-disable-next-line no-unused-vars
  const [page, setPage] = useState(1)
  const [limit] = useState(12)

  const FilterSection = ({ title, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen)

    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger>
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
        fetch('/api/categories').then((res) => res.json()).then(setCategories),
        fetch('/api/brands').then((res) => res.json()).then(setBrands),
        fetch('/api/origins').then((res) => res.json()).then(setOrigins),
        fetch('/api/presentations').then((res) => res.json()).then(setPresentations),
        fetch('/api/products').then((res) => res.json()).then(setProducts),
        fetch('/api/accessories').then((res) => res.json()).then(setAccesories)
      ])
      setLoading(false)
    }

    fetchData()
  }, [])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setQuery(searchTerm)
    }, 500)

    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm])

  useEffect(() => {
    const fetchFilteredProducts = async () => {
      const params = new URLSearchParams()

      if (query) params.append('search', query)
      if (selectedCategories.length > 0) params.append('categories', selectedCategories.map((c) => c.id).join(','))
      if (selectedBrands.length > 0) params.append('brands', selectedBrands.map((b) => b.id).join(','))
      if (selectedAccessories.length > 0) params.append('accessories', selectedAccessories.map((a) => a.id).join(','))
      if (selectedTypes.length > 0) params.append('types', selectedTypes.map((t) => t.id).join(','))
      if (selectedOrigins.length > 0) params.append('origins', selectedOrigins.map((o) => o.id).join(','))
      if (sortBy) params.append('sortBy', sortBy)
      params.append('page', page)
      params.append('limit', limit)
      const res = await fetch(`/api/getProductsByFilter?${params.toString()}`)
      const data = await res.json()
      setProducts(data)
    }

    fetchFilteredProducts()
  }, [selectedCategories, selectedBrands, selectedTypes, selectedOrigins, selectedAccessories, query, page])

  const handleCategoryChange = (category, checked) => {
    setSelectedCategories((prev) => (checked ? [...prev, category] : prev.filter((c) => c.id !== category.id)))
  }

  const handleBrandChange = (brand, checked) => {
    setSelectedBrands((prev) => (checked ? [...prev, brand] : prev.filter((b) => b.id !== brand.id)))
  }

  const handleTypeChange = (type, checked) => {
    setSelectedTypes((prev) => (checked ? [...prev, type] : prev.filter((t) => t.id !== type.id)))
  }

  const handleOriginChange = (origin, checked) => {
    setSelectedOrigins((prev) => (checked ? [...prev, origin] : prev.filter((o) => o.id !== origin.id)))
  }
  const handleAccessoryChange = (accessory, checked) => {
    setSelectedAccessories((prev) => (checked ? [...prev, accessory] : prev.filter((a) => a.id !== accessory.id)))
  }

  const clearAllFilters = () => {
    setSelectedCategories([])
    setSelectedBrands([])
    setSelectedTypes([])
    setSelectedOrigins([])
    setSelectedAccessories([])
    setSearchTerm('')
  }

  const FilterContent = () => (
    <div className='space-y-2'>
      {/* Categorías */}
      <FilterSection title='Categorías' defaultOpen>
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
              <Link href={`/Categorias-de-cafe/${category.name.split(' ').join('-')}`}>
                <Label
                  htmlFor={`category-${category.id}`}
                  className='text-sm cursor-pointer hover:text-[#33691E] transition-colors duration-200'
                >
                  {formatCategory(category.name) || category.name}
                </Label>
              </Link>
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
                checked={selectedBrands.some((c) => c.id === brand.id)}
                onCheckedChange={(checked) => handleBrandChange(brand, checked)}
                className='data-[state=checked]:bg-[#33691E] h-4 w-4'
              />
              <Link href={`/Marcas-de-cafe/${brand.name.split(' ').join('-')}`}>
                <Label
                  htmlFor={`brand-${brand.id}`}
                  className='text-sm cursor-pointer hover:text-[#33691E] transition-colors duration-200'
                >
                  {formatCategory(brand.name) || brand.name}
                </Label>
              </Link>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Presentación de producto */}
      <FilterSection title='Presentación' defaultOpen={false}>
        <div className='space-y-1'>
          {presentations?.map((type) => (
            <div
              key={type.id}
              className='flex items-center space-x-2 p-1 rounded hover:bg-gray-50 transition-all duration-200'
            >
              <Checkbox
                id={`type-${type.id}`}
                checked={selectedTypes.some((c) => c.id === type.id)}
                onCheckedChange={(checked) => handleTypeChange(type, checked)}
                className='data-[state=checked]:bg-[#33691E] h-4 w-4'
              />
              <Link href={`/Presentacion-de-cafe/${type.name.split(' ').join('-')}`}>
                <Label
                  htmlFor={`type-${type.id}`}
                  className='text-sm cursor-pointer hover:text-[#33691E] transition-colors duration-200'
                >
                  {formatCategory(type.name) || type.name}
                </Label>
              </Link>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Origen del café */}
      <FilterSection title='Origen' defaultOpen={false}>
        <div className='space-y-1'>
          {origins?.map((origin) => (
            <div
              key={origin.id}
              className='flex items-center space-x-2 p-1 rounded hover:bg-gray-50 transition-all duration-200'
            >
              <Checkbox
                id={`origin-${origin.id}`}
                checked={selectedOrigins.some((c) => c.id === origin.id)}
                onCheckedChange={(checked) => handleOriginChange(origin, checked)}
                className='data-[state=checked]:bg-[#33691E] h-4 w-4'
              />
              <Link href={`/Origen-de-cafe/${origin.name.split(' ').join('-')}`}>
                <Label
                  htmlFor={`origin-${origin.id}`}
                  className='text-sm cursor-pointer hover:text-[#33691E] transition-colors duration-200'
                >
                  {formatCategory(origin.name) || origin.name}
                </Label>
              </Link>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Accesorios de café */}
      <FilterSection title='Accesorios' defaultOpen={false}>
        <div className='space-y-1'>
          {accesories?.map((accessory) => (
            <div
              key={accessory.id}
              className='flex items-center space-x-2 p-1 rounded hover:bg-gray-50 transition-all duration-200'
            >
              <Checkbox
                id={`accessory-${accessory.id}`}
                checked={selectedAccessories.some((c) => c.id === accessory.id)}
                onCheckedChange={(checked) => handleAccessoryChange(accessory, checked)}
                className='data-[state=checked]:bg-[#33691E] h-4 w-4'
              />
              <Link href={`/Accesorios-de-cafe/${accessory.name.split(' ').join('-')}`}>
                <Label
                  htmlFor={`accessory-${accessory.id}`}
                  className='text-sm cursor-pointer hover:text-[#33691E] transition-colors duration-200'
                >
                  {formatCategory(accessory.name) || accessory.name}
                </Label>
              </Link>
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
        ? (<Loading />)
        : (<main className='container mx-auto p-4'>
        {/* Barra de búsqueda compacta */}
        <div className='mb-6 mt-16'>
          <div className='flex flex-col md:flex-row gap-4 items-center justify-center'>
            <div className='relative flex-1 max-w-2xl'>
              <div className='relative bg-white rounded-xl shadow-lg'>
                <div className='relative'>
                  <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#33691E]' />
                  <Input
                    placeholder='Buscar productos, marcas o categorías...'
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
                  <SelectItem value='recent'>Más recientes</SelectItem>
                  <SelectItem value='price-low'>Precio: menor a mayor</SelectItem>
                  <SelectItem value='price-high'>Precio: mayor a menor</SelectItem>
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
                    <SheetDescription className='text-[#5D4037]'>Refina tu búsqueda de productos</SheetDescription>
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
          {/* Sidebar de filtros compacto */}
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

          {/* Grid de productos */}
          <div className='flex-1'>
            <div className='mb-4 flex items-center justify-between bg-white rounded-xl p-4 shadow-lg'>
              <div className='flex items-center space-x-3'>
                <ShoppingBag className='h-5 w-5 text-[#33691E]' />
                <p className='text-[#3E2723] font-medium'>
                  Mostrando <span className='font-bold text-[#33691E]'>{products.length}</span> productos
                </p>
              </div>

              {(selectedCategories.length > 0 ||
                selectedBrands.length > 0 ||
                selectedTypes.length > 0 ||
                selectedOrigins.length > 0 ||
                selectedAccessories.length > 0) && (
                <div className='flex flex-wrap gap-2 max-w-md'>
                  {selectedCategories.map((category) => (
                    <Badge
                      key={category.id}
                      className='cursor-pointer bg-[#33691E] hover:bg-[#2E7D32] transition-all duration-200 text-xs'
                      onClick={() => handleCategoryChange(category, false)}
                    >
                      {category.name} <X className='ml-1 h-3 w-3' />
                    </Badge>
                  ))}
                  {selectedBrands.map((brand) => (
                    <Badge
                      key={brand.id}
                      className='cursor-pointer bg-[#5D4037] hover:bg-[#4E342E] transition-all duration-200 text-xs'
                      onClick={() => handleBrandChange(brand, false)}
                    >
                      {brand.name} <X className='ml-1 h-3 w-3' />
                    </Badge>
                  ))}
                  {selectedTypes.map((type) => (
                    <Badge
                      key={type.id}
                      className='cursor-pointer bg-[#6D4C41] hover:bg-[#5D4037] transition-all duration-200 text-xs'
                      onClick={() => handleTypeChange(type, false)}
                    >
                      {type.name} <X className='ml-1 h-3 w-3' />
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
                  {selectedAccessories.map((accessory) => (
                    <Badge
                      key={accessory.id}
                      className='cursor-pointer bg-[#A1887F] hover:bg-[#8D6E63] transition-all duration-200 text-xs'
                      onClick={() => handleAccessoryChange(accessory, false)}
                    >
                      {accessory.name} <X className='ml-1 h-3 w-3' />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                  {products?.map((product) => (
                  <div key={product.id} className='group'>
                    <CardProducts
                      product={product}
                      className='overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white border-0 rounded-xl'
                    />
                  </div>
                  ))}
              </div>
              {products?.length === 0 && <NotProducts product={searchTerm} />}

          </div>
        </div>
      </main>)}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #33691E;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #2E7D32;
        }
      `}</style>
    </div>
  )
}

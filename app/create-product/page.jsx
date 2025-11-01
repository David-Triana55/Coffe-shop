'use client'
import { useState, useEffect } from 'react'
import { Upload, DollarSign, Package, XIcon, Clock, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useRouter } from 'next/navigation'
import { ROLES } from '@/utils/roles'
import { ToastContainer, Bounce } from 'react-toastify'
import Loading from '@/components/Loading/Loading'
import { toastError, toastSuccess } from '@/utils/toast'

export default function CreateProduct () {
  const router = useRouter()
  const [categories, setCategories] = useState([])
  const [origins, setOrigins] = useState([])
  const [brands, setBrands] = useState([])
  const [role, setRole] = useState([])
  const [presentations, setPresentations] = useState([])
  const [accessories, setAccessories] = useState([])
  const [selectedImages, setSelectedImages] = useState([])
  const [imageUrls, setImageUrls] = useState([])
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [productType, setProductType] = useState('normal')

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    originDetails: '',
    category: '',
    origin: '',
    stock: '',
    price: '',
    brand: '',
    presentation: '',
    accessory: '',
    startingPrice: '',
    minimumIncrement: '',
    startDate: '',
    endDate: ''
  })

  useEffect(() => {
    setIsLoading(true)
    const { state } = JSON.parse(window.localStorage.getItem('isLogged'))

    if (state?.login?.isLogged && state?.login?.role === ROLES.CLIENTE) {
      router.push('/')
    }

    setRole(state?.login?.role)
    const fetchData = async (url, setter) => {
      const res = await fetch(url, { credentials: 'include' })
      const data = await res.json()
      setter(data)
    }
    fetchData('/api/categories', setCategories)
    fetchData('/api/origins', setOrigins)
    fetchData('/api/brands', setBrands)
    fetchData('/api/presentations', setPresentations)
    fetchData('/api/accessories', setAccessories)

    setIsLoading(false)
  }, [])

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleProductTypeChange = (value) => {
    setProductType(value)
    // Limpiar campos no necesarios según el tipo
    if (value === 'auction') {
      setFormData((prev) => ({ ...prev, price: '', stock: '' }))
    } else {
      setFormData((prev) => ({
        ...prev,
        startingPrice: '',
        minimumIncrement: '',
        startDate: '',
        endDate: ''
      }))
    }
  }

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files)
    setSelectedImages((prev) => [...prev, ...files])

    if (files.length === 0) return

    const data = new FormData()
    files.forEach((file) => data.append('file', file))

    setUploading(true)
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data
      })
      const result = await res.json()
      if (res.ok) {
        setImageUrls((prev) => [...prev, ...result.urls])
        toastSuccess('¡Imágenes subidas correctamente!', 3000, Bounce)
      } else {
        toastError('Error al subir las imágenes', 5000, Bounce)
        console.error(result.error)
      }
    } catch (err) {
      toastError('Error al subir las imágenes', 5000, Bounce)
      console.error('Error subiendo imágenes:', err)
    } finally {
      setUploading(false)
    }

    e.target.value = null
  }

  const handleRemoveImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, idx) => idx !== index))
    setImageUrls((prev) => prev.filter((_, idx) => idx !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    const cleanFormData = Object.entries(formData).reduce((acc, [key, value]) => {
      acc[key] = value === '' ? null : value
      return acc
    }, {})

    const data = {
      images: imageUrls,
      productType,
      ...cleanFormData
    }

    try {
      const endpoint = productType === 'auction' ? '/api/auctions' : '/api/products'
      const response = await fetch(endpoint, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(data)
      })

      if (response.ok) {
        const message = productType === 'auction' ? '¡Subasta creada exitosamente!' : '¡Producto creado exitosamente!'
        toastSuccess(message, 5000, Bounce)

        setFormData({
          name: '',
          description: '',
          originDetails: '',
          category: '',
          origin: '',
          stock: '',
          price: '',
          brand: '',
          presentation: '',
          accessory: '',
          startingPrice: '',
          minimumIncrement: '',
          startDate: '',
          endDate: ''
        })
        setSelectedImages([])
        setImageUrls([])

        setTimeout(() => {
          router.push(productType === 'auction' ? 'manage-auctions' : 'productos')
        }, 3000)
      } else {
        toastError('Error al crear', 5000, Bounce)
      }
    } catch (err) {
      toastError('Error al enviar la solicitud', 5000, Bounce)
      console.error('Error al enviar la solicitud:', err)
    } finally {
      setSubmitting(false)
    }
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className='min-h-screen text-[#3E2723] mt-12'>
      <main className='container mx-auto p-4 sm:p-6'>
        <div className='mb-8 text-center'>
          <h2 className='text-2xl sm:text-3xl font-bold mb-2'>Crear Nuevo Producto</h2>
          <p className='text-base sm:text-lg text-[#5D4037]'>Complete la información de tu producto</p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-6 sm:space-y-8 max-w-6xl mx-auto'>
          {/* TIPO DE PRODUCTO */}
          <Card className='bg-white/80 backdrop-blur-sm border-[#D7CCC8]'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-lg sm:text-xl'>
                <Package className='h-5 w-5' />
                Tipo de Producto
              </CardTitle>
              <CardDescription>Selecciona cómo deseas vender tu producto</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={productType}
                onValueChange={handleProductTypeChange}
                className='grid grid-cols-1 sm:grid-cols-2 gap-4'
              >
                <div className='flex items-center space-x-2 border-2 border-[#D7CCC8] rounded-lg p-4 hover:border-[#8D6E63] transition-colors cursor-pointer'>
                  <RadioGroupItem value='normal' id='normal' />
                  <Label htmlFor='normal' className='cursor-pointer flex-1'>
                    <div className='font-semibold text-[#3E2723]'>Compra Normal</div>
                    <div className='text-sm text-[#5D4037]'>Venta directa con precio fijo</div>
                  </Label>
                </div>
                <div className='flex items-center space-x-2 border-2 border-[#D7CCC8] rounded-lg p-4 hover:border-[#8D6E63] transition-colors cursor-pointer'>
                  <RadioGroupItem value='auction' id='auction' />
                  <Label htmlFor='auction' className='cursor-pointer flex-1'>
                    <div className='font-semibold text-[#3E2723]'>Subasta</div>
                    <div className='text-sm text-[#5D4037]'>Los compradores pujan por tu producto</div>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* INFO PRODUCTO */}
          <Card className='bg-white/80 backdrop-blur-sm border-[#D7CCC8]'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-lg sm:text-xl'>
                <Package className='h-5 w-5' />
                Información del Producto
              </CardTitle>
              <CardDescription>Detalles básicos de tu producto</CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='space-y-2'>
                <Label htmlFor='name' className='text-sm font-medium'>
                  Nombre del Producto *
                </Label>
                <Input
                  id='name'
                  placeholder='Ej: Café Colombiano Premium'
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                  className='border-[#D7CCC8]'
                />
              </div>

              <div className={`grid grid-cols-1  gap-4 sm:gap-6  ${productType === 'normal' ? 'md:grid-cols-2' : 'md:grid-cols-1'}`}>
                <div className='space-y-2'>
                  <Label htmlFor='description' className='text-sm font-medium'>
                    Descripción *
                  </Label>
                  <Textarea
                    required
                    id='description'
                    placeholder='Describe las características de tu producto...'
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className='border-[#D7CCC8] resize-none'
                  />
                </div>
                {productType === 'normal' && <div className='space-y-2'>
                  <Label htmlFor='originDetails' className='text-sm font-medium'>
                    Detalles de Origen
                  </Label>
                  <Textarea
                    id='originDetails'
                    placeholder='Especifica información del origen...'
                    value={formData.originDetails}
                    onChange={(e) => handleInputChange('originDetails', e.target.value)}
                    rows={4}
                    className='border-[#D7CCC8] resize-none'
                  />
                </div>}
              </div>

              {/* CAMPOS CONDICIONALES */}
              {productType === 'normal'
                ? (
                // COMPRA NORMAL
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6'>
                  <div className='space-y-2'>
                    <Label htmlFor='stock' className='text-sm font-medium'>
                      Cantidad en Stock *
                    </Label>
                    <Input
                      id='stock'
                      type='number'
                      min='1'
                      placeholder='100'
                      value={formData.stock}
                      onChange={(e) => handleInputChange('stock', e.target.value)}
                      required
                      className='border-[#D7CCC8]'
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='price' className='text-sm font-medium'>
                      Precio de Venta *
                    </Label>
                    <div className='relative'>
                      <DollarSign className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8D6E63]' />
                      <Input
                        id='price'
                        type='number'
                        step='1000'
                        min='1000'
                        placeholder='15000'
                        className='pl-10 border-[#D7CCC8]'
                        value={formData.price}
                        onChange={(e) => handleInputChange('price', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='category' className='text-sm font-medium'>
                      Categoría
                    </Label>
                    <Select
                      value={formData.category ?? 'null'}
                      onValueChange={(value) => handleInputChange('category', value === 'null' ? null : value)}
                    >
                      <SelectTrigger className='border-[#D7CCC8]'>
                        <SelectValue placeholder='Seleccionar' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='null'>No Aplica</SelectItem>
                        {categories?.map((c) => (
                          <SelectItem value={c.id} key={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                  )
                : (
                // SUBASTA
                <div className='space-y-6'>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6'>
                    <div className='space-y-2'>
                      <Label htmlFor='startingPrice' className='text-sm font-medium'>
                        Precio Inicial *
                      </Label>
                      <div className='relative'>
                        <DollarSign className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8D6E63]' />
                        <Input
                          id='startingPrice'
                          type='number'
                          step='1000'
                          min='1000'
                          placeholder='10000'
                          className='pl-10 border-[#D7CCC8]'
                          value={formData.startingPrice}
                          onChange={(e) => handleInputChange('startingPrice', e.target.value)}
                          required
                        />
                      </div>
                      <p className='text-xs text-[#8D6E63]'>Precio mínimo para iniciar las pujas</p>
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='minimumIncrement' className='text-sm font-medium'>
                        Incremento Mínimo *
                      </Label>
                      <div className='relative'>
                        <DollarSign className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8D6E63]' />
                        <Input
                          id='minimumIncrement'
                          type='number'
                          step='500'
                          min='500'
                          placeholder='1000'
                          className='pl-10 border-[#D7CCC8]'
                          value={formData.minimumIncrement}
                          onChange={(e) => handleInputChange('minimumIncrement', e.target.value)}
                          required
                        />
                      </div>
                      <p className='text-xs text-[#8D6E63]'>Aumento mínimo por puja</p>
                    </div>
                  </div>

                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6'>
                    <div className='space-y-2'>
                      <Label htmlFor='startDate' className='text-sm font-medium'>
                        Fecha de Inicio *
                      </Label>
                      <div className='relative'>
                        <Calendar className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8D6E63]' />
                        <Input
                          id='startDate'
                          type='datetime-local'
                          className='pl-10 border-[#D7CCC8]'
                          value={formData.startDate}
                          onChange={(e) => handleInputChange('startDate', e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='endDate' className='text-sm font-medium'>
                        Fecha de Finalización *
                      </Label>
                      <div className='relative'>
                        <Clock className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8D6E63]' />
                        <Input
                          id='endDate'
                          type='datetime-local'
                          className='pl-10 border-[#D7CCC8]'
                          value={formData.endDate}
                          onChange={(e) => handleInputChange('endDate', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='category' className='text-sm font-medium'>
                      Categoría
                    </Label>
                    <Select
                      value={formData.category ?? 'null'}
                      onValueChange={(value) => handleInputChange('category', value === 'null' ? null : value)}
                    >
                      <SelectTrigger className='border-[#D7CCC8]'>
                        <SelectValue placeholder='Seleccionar' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='null'>No Aplica</SelectItem>
                        {categories?.map((c) => (
                          <SelectItem value={c.id} key={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                  )}

              {/* CAMPOS COMUNES */}
              <div
                className={`grid grid-cols-1 sm:grid-cols-2 ${role === ROLES.ADMIN ? 'md:grid-cols-4' : 'md:grid-cols-3'} gap-4 sm:gap-6`}
              >
                {[
                  { label: 'Origen', field: 'origin', options: origins },
                  ...(role === ROLES.ADMIN ? [{ label: 'Marca', field: 'brand', options: brands }] : []),
                  { label: 'Presentación', field: 'presentation', options: presentations },
                  { label: 'Accesorio', field: 'accessory', options: accessories }
                ].map(({ label, field, options }) => (
                  <div key={field} className='space-y-2'>
                    <Label htmlFor={field} className='text-sm font-medium'>
                      {label}
                    </Label>
                    <Select
                      value={formData[field] ?? 'null'}
                      onValueChange={(value) => handleInputChange(field, value === 'null' ? null : value)}
                    >
                      <SelectTrigger className='border-[#D7CCC8]'>
                        <SelectValue placeholder='Seleccionar' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='null'>No Aplica</SelectItem>
                        {options?.map((o) => (
                          <SelectItem value={o.id} key={o.id}>
                            {o.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* IMÁGENES */}
          <Card className='bg-white/80 backdrop-blur-sm border-[#D7CCC8]'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-lg sm:text-xl'>
                <Upload className='h-5 w-5' />
                Imágenes del Producto
              </CardTitle>
              <CardDescription>Sube fotos para atraer más compradores</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className='border-2 border-dashed border-[#D7CCC8] rounded-lg p-6 sm:p-8 text-center hover:border-[#8D6E63] transition-colors'
                onDrop={(e) => {
                  e.preventDefault()
                  const files = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith('image/'))
                  if (files.length > 0) {
                    const fakeEvent = { target: { files } }
                    handleImageChange(fakeEvent)
                  }
                }}
                onDragOver={(e) => e.preventDefault()}
              >
                <Upload className='mx-auto h-10 w-10 sm:h-12 sm:w-12 text-[#8D6E63] mb-4' />
                <p className='text-base sm:text-lg font-medium mb-2 text-[#3E2723]'>
                  Arrastra y suelta tus imágenes aquí
                </p>
                <p className='text-xs sm:text-sm text-[#8D6E63] mb-4'>o haz clic para seleccionar archivos</p>
                <input
                  id='images'
                  type='file'
                  accept='image/*'
                  multiple
                  style={{ display: 'none' }}
                  onChange={handleImageChange}
                />
                <Button
                  variant='outline'
                  type='button'
                  onClick={() => document.getElementById('images').click()}
                  disabled={uploading}
                  className='border-[#3E2723] text-[#3E2723] hover:bg-[#D7CCC8]'
                >
                  {uploading ? 'Subiendo...' : 'Seleccionar Imágenes'}
                </Button>

                {selectedImages.length > 0 && (
                  <div className='flex flex-wrap gap-3 mt-6 justify-center'>
                    {selectedImages.map((img, idx) => (
                      <div key={idx} className='relative'>
                        <img
                          src={URL.createObjectURL(img) || '/placeholder.svg'}
                          alt={`preview-${idx}`}
                          className='h-20 w-20 object-cover rounded-md border-2 border-[#D7CCC8]'
                        />
                        <button
                          type='button'
                          onClick={() => handleRemoveImage(idx)}
                          className='absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700 transition-colors'
                          title='Eliminar'
                        >
                          <XIcon className='h-4 w-4' />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* BOTONES */}
          <div className='flex flex-col sm:flex-row justify-end gap-3 sm:gap-4'>
            <Button
              type='button'
              variant='outline'
              onClick={() => router.back()}
              className='border-[#3E2723] text-[#3E2723] hover:bg-[#D7CCC8] w-full sm:w-auto'
            >
              Cancelar
            </Button>
            <Button
              type='submit'
              className='bg-[#33691E] hover:bg-[#1B5E20] text-white w-full sm:w-auto'
              disabled={submitting || uploading}
            >
              {submitting ? 'Creando...' : productType === 'auction' ? 'Crear Subasta' : 'Crear Producto'}
            </Button>
          </div>
        </form>
      </main>

      <ToastContainer
        position='bottom-right'
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover
        theme='dark'
        transition={Bounce}
      />
    </div>
  )
}

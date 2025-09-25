'use client'
import { useState, useEffect } from 'react'
import { Coffee, Upload, DollarSign, Package, XIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useRouter } from 'next/navigation'
import { ROLES } from '@/utils/roles'
import { toast, ToastContainer, Bounce } from 'react-toastify'

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
    accessory: ''
  })

  useEffect(() => {
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
  }, [])

  useEffect(() => {
    const { state } = JSON.parse(window.localStorage.getItem('isLogged'))

    if (state?.login?.isLogged && state?.login?.role === ROLES.CLIENTE) {
      router.push('/')
    }

    setRole(state?.login?.role)
  }, [])

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Subida múltiple de imágenes a cloudinary
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
        toast.success('¡Imágenes subidas correctamente!', {
          position: 'bottom-right',
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          progress: undefined,
          theme: 'dark',
          transition: Bounce
        })
      } else {
        toast.error('Error al subir las imágenes', {
          position: 'bottom-right',
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          progress: undefined,
          theme: 'dark',
          transition: Bounce
        })
        console.error(result.error)
      }
    } catch (err) {
      toast.error('Error al subir las imágenes', {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: 'dark',
        transition: Bounce
      })
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

    const data = {
      images: imageUrls,
      ...formData
    }

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (response.ok) {
        toast.success('¡Producto creado exitosamente!', {
          position: 'bottom-right',
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          progress: undefined,
          theme: 'dark',
          transition: Bounce
        })

        // Limpiar el formulario después del éxito
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
          accessory: ''
        })
        setSelectedImages([])
        setImageUrls([])

        // Opcional: redirigir después de un tiempo
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      } else {
        toast.error(result.message || 'Error al crear el producto', {
          position: 'bottom-right',
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          progress: undefined,
          theme: 'dark',
          transition: Bounce
        })
      }
    } catch (err) {
      toast.error('Error de conexión. Intenta nuevamente.', {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: 'dark',
        transition: Bounce
      })
      console.error('Error al enviar la solicitud:', err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className='min-h-screen bg-[#D7CCC8] text-[#3E2723]'>
      {/* HEADER */}
      <header className='bg-[#3E2723] text-white p-4'>
        <div className='container mx-auto flex justify-between items-center'>
          <div className='flex items-center space-x-3'>
            <Coffee className='h-8 w-8' />
            <h1 className='text-2xl font-bold'>Crear Nuevo Producto</h1>
          </div>
          <nav className='hidden md:flex space-x-6'>
            <a href='#' className='hover:text-[#D7CCC8]'>
              Dashboard
            </a>
            <a href='#' className='hover:text-[#D7CCC8]'>
              Mis Subastas
            </a>
            <a href='#' className='hover:text-[#D7CCC8]'>
              Perfil
            </a>
          </nav>
        </div>
      </header>

      {/* MAIN */}
      <main className='container mx-auto p-6'>
        <div className='mb-8 text-center'>
          <h2 className='text-3xl font-bold mb-2'>Crear Nuevo Producto</h2>
          <p className='text-lg'>Complete la información de tu producto para comenzar la subasta</p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-8 max-w-6xl mx-auto'>
          {/* INFO PRODUCTO */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Package className='h-5 w-5' />
                Información del Producto
              </CardTitle>
              <CardDescription>Detalles básicos de tu producto</CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='space-y-2'>
                <Label htmlFor='name'>Nombre del Producto *</Label>
                <Input
                  id='name'
                  placeholder='Ej: Café Colombiano Premium'
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='space-y-2'>
                  <Label htmlFor='description'>Descripción</Label>
                  <Textarea
                    id='description'
                    placeholder='Describe las características de tu producto...'
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='originDetails'>Detalles de Origen</Label>
                  <Textarea
                    id='originDetails'
                    placeholder='Especifica información del origen...'
                    value={formData.originDetails}
                    onChange={(e) => handleInputChange('originDetails', e.target.value)}
                    rows={4}
                  />
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <div className='space-y-2'>
                  <Label htmlFor='stock'>Cantidad *</Label>
                  <Input
                    id='stock'
                    type='number'
                    placeholder='100'
                    value={formData.stock}
                    onChange={(e) => handleInputChange('stock', e.target.value)}
                    required
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='price'>Precio *</Label>
                  <div className='relative'>
                    <DollarSign className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500' />
                    <Input
                      id='price'
                      type='number'
                      step='1000'
                      placeholder='15000'
                      className='pl-10'
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='category'>Categoría</Label>
                  <Select
                    value={formData.category ?? 'null'}
                    onValueChange={(value) => handleInputChange('category', value === 'null' ? null : value)}
                  >
                    <SelectTrigger>
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

              <div className={`grid grid-cols-1 md:grid-cols-${role === ROLES.ADMIN ? 4 : 3} gap-6`}>
                {[
                  { label: 'Origen', field: 'origin', options: origins },
                  ...(role === ROLES.ADMIN ? [{ label: 'Marca', field: 'brand', options: brands }] : []),
                  { label: 'Presentación', field: 'presentation', options: presentations },
                  { label: 'Accesorio', field: 'accessory', options: accessories }
                ].map(({ label, field, options }) => (
                  <div key={field} className='space-y-2'>
                    <Label htmlFor={field}>{label}</Label>
                    <Select
                      value={formData[field] ?? 'null'}
                      onValueChange={(value) => handleInputChange(field, value === 'null' ? null : value)}
                    >
                      <SelectTrigger>
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
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Upload className='h-5 w-5' />
                Imágenes del Producto
              </CardTitle>
              <CardDescription>Sube fotos para atraer más compradores</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className='border-2 border-dashed border-gray-300 rounded-lg p-8 text-center'
                onDrop={(e) => {
                  e.preventDefault()
                  const files = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith('image/'))
                  setSelectedImages((prev) => [...prev, ...files])
                }}
                onDragOver={(e) => e.preventDefault()}
              >
                <Upload className='mx-auto h-12 w-12 text-gray-400 mb-4' />
                <p className='text-lg font-medium mb-2'>Arrastra y suelta tus imágenes aquí</p>
                <p className='text-sm text-gray-500 mb-4'>o haz clic para seleccionar archivos</p>
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
                >
                  {uploading ? 'Subiendo...' : 'Seleccionar Imagen'}
                </Button>

                <div className='flex flex-wrap gap-3 mt-6'>
                  {selectedImages.map((img, idx) => (
                    <div key={idx} className='relative'>
                      <img
                        src={URL.createObjectURL(img) || '/placeholder.svg'}
                        alt='preview'
                        className='h-20 w-20 object-cover rounded-md'
                      />
                      <button
                        type='button'
                        onClick={() => handleRemoveImage(idx)}
                        className='absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center'
                        title='Eliminar'
                      >
                        <XIcon className='h-4 w-4' />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* BOTÓN */}
          <div className='flex justify-end'>
            <Button
              type='submit'
              className='bg-[#33691E] hover:bg-[#1B5E20] text-white px-6 py-2 rounded-lg'
              disabled={submitting}
            >
              {submitting ? 'Creando Producto...' : 'Crear Producto'}
            </Button>
          </div>
        </form>
      </main>

      {/* FOOTER */}
      <footer className='bg-[#3E2723] text-white p-4 mt-12'>
        <div className='container mx-auto flex flex-col md:flex-row justify-between items-center'>
          <p>&copy; 2024 Coffee Auction Platform. Todos los derechos reservados.</p>
          <nav className='flex space-x-4 mt-4 md:mt-0'>
            <a href='#' className='hover:text-[#D7CCC8]'>
              Soporte
            </a>
            <a href='#' className='hover:text-[#D7CCC8]'>
              Términos
            </a>
          </nav>
        </div>
      </footer>

      {/* Toast Container */}
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

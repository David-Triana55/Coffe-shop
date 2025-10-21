/* eslint-disable no-unused-vars */
'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Plus, Search, Edit, ImageIcon, Upload, XIcon } from 'lucide-react'
import { formatPrice } from '@/utils/formatter'
import useStore from '@/store'
import { ROLES } from '@/utils/roles'
import Link from 'next/link'
import { Label } from '@/components/ui/label'
import Loading from '@/components/Loading/Loading'
import { toastError, toastSuccess } from '@/utils/toast'
import { Bounce, ToastContainer, toast } from 'react-toastify'
import { Textarea } from '@/components/ui/textarea'
import { CONSTANTS } from '@/utils/constants'

export default function ProductosPage () {
  const { login } = useStore((state) => state)
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [search, setSearch] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [saveConfirmOpen, setSaveConfirmOpen] = useState(false)
  const [saveChangeStatus, setSaveChangeStatus] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [origins, setOrigins] = useState([])
  const [presentations, setPresentations] = useState([])
  const [accessories, setAccessories] = useState([])
  const [brands, setBrands] = useState([])
  const [imageUrls, setImageUrls] = useState([])
  const [selectedImages, setSelectedImages] = useState([])
  const [uploading, setUploading] = useState(false)

  const [editForm, setEditForm] = useState({
    id: '',
    name: '',
    category: '',
    presentation: '',
    accessory: '',
    description: '',
    brand: '',
    origin: '',
    originDetails: '',
    price: 0,
    stock: 0,
    images: []
  })
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        const fetchData = async (url, setter) => {
          const res = await fetch(url, { credentials: 'include' })
          const data = await res.json()
          setter([...data, { id: null, name: 'No Aplica' }])
        }

        await Promise.all([
          fetchData('/api/categories', setCategories),
          fetchData('/api/origins', setOrigins),
          fetchData('/api/presentations', setPresentations),
          fetchData('/api/accessories', setAccessories),
          fetchData('/api/brands', setBrands)
        ])

        const products = await fetch('/api/getAllProducts', { credentials: 'include', cache: 'no-store' })
        const res = await products.json()
        setFilteredProducts(res)
        setProducts(res)
      } catch (e) {
        console.log(e)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  useEffect(() => {
    let filtered = products

    if (search) {
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    }

    setFilteredProducts(filtered)
  }, [search, products])

  const handleOpenEdit = (product) => {
    console.log(product, 'edit')
    setSelectedProduct(product)

    const editObject = {
      id: product.id,
      name: product.name,
      category: product.category_id,
      accessory: product.accessory_id,
      description: product.description,
      origin: product.origin_id,
      originDetails: product.origin_details,
      presentation: product.presentation_id,
      price: product.price,
      stock: product.stock,
      images: product.images_url || []
    }

    if (login.role === ROLES.ADMIN) {
      editObject.brand = product.brand_id
    }

    const existingImages = product.images_url?.map((img) => img) || []
    setImageUrls(existingImages)
    setSelectedImages([])

    setEditForm(editObject)
    setHasChanges(false)
    setEditDialogOpen(true)
  }

  const handleEditFormChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }

  const handleConfirmSave = async () => {
    try {
      const productToSave = {
        ...editForm,
        images: imageUrls
      }

      console.log('Producto a guardar:', productToSave)

      setSaveConfirmOpen(false)
      setEditDialogOpen(false)
      setHasChanges(false)
      setSelectedProduct(null)

      const data = await fetch('/api/productById', {
        method: 'PUT',
        body: JSON.stringify(productToSave),
        credentials: 'include'
      })
      const res = await data.json()

      toastSuccess(res.message, 3000, Bounce)
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editForm.id
            ? {
                ...p,
                ...editForm,
                images_url: imageUrls
              }
            : p
        )
      )
      setSaveChangeStatus(false)

      setImageUrls([])
      setSelectedImages([])
    } catch (e) {
      toastError('Hubo un error en el guardado', 3000, Bounce)
      console.log(e)
    }
  }

  const handleConfirmeChangeStatus = async (product) => {
    try {
      console.log(product, 'productsssss')
      const objetToUpdate = {
        id: product.id,
        status: !product.is_active
      }
      const data = await fetch('/api/changeStatus', {
        method: 'PUT',
        body: JSON.stringify(objetToUpdate),
        credentials: 'include'
      })
      const res = await data.json()

      toastSuccess(res.message, 3000, Bounce)
      setProducts((prev) => prev.map((p) => (p.id === product.id ? { ...p, is_active: !p.is_active } : p)))

      setSaveChangeStatus(false)
    } catch (e) {
      toastError('Hubo un error en el guardado', 3000, Bounce)

      console.log(e)
    }
  }

  const handleCancelEdit = () => {
    if (hasChanges) {
      if (confirm('¿Descartar los cambios realizados?')) {
        setEditDialogOpen(false)
        setHasChanges(false)
        setImageUrls([])
        setSelectedImages([])
      }
    } else {
      setEditDialogOpen(false)
      setImageUrls([])
      setSelectedImages([])
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
        const newImageUrls = [...imageUrls, ...result.urls]
        setImageUrls(newImageUrls)

        setEditForm((prev) => ({
          ...prev,
          images: newImageUrls
        }))

        setHasChanges(true)
        toastSuccess('¡Imágenes subidas correctamente!', 3000, Bounce)
      } else {
        toastError('Error al subir las imágenes', 5000, Bounce)
      }
    } catch (err) {
      toastError('Error al subir las imágenes', 3000, Bounce)
    } finally {
      setUploading(false)
    }

    e.target.value = null
  }

  const handleRemoveImage = (index) => {
    const newImageUrls = imageUrls.filter((_, idx) => idx !== index)
    setImageUrls(newImageUrls)

    setEditForm((prev) => ({
      ...prev,
      images: newImageUrls
    }))

    setHasChanges(true)
  }

  if (isLoading) {
    return (
      <div>
        <Loading />
      </div>
    )
  }

  return (
    <div className='space-y-6 mt-16 p-6'>
      {/* Header */}
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
        <div>
          <h1 className='text-4xl font-bold text-[#3E2723]'>
            {login?.role === ROLES.ADMIN ? 'Gestión de Productos' : 'Mis Productos'}
          </h1>
          <p className='text-[#5D4037] mt-1'>{filteredProducts.length} productos encontrados</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className='pt-6'>
          <div className='flex flex-wrap items-center justify-between gap-4'>
            {/* Search + Clear */}
            <div className='flex items-center gap-4 flex-1'>
              <div className='relative flex-1'>
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8D6E63]' />
                <Input
                  placeholder='Buscar productos...'
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className='pl-10 w-full'
                />
              </div>

              <Button variant='outline' onClick={() => setSearch('')}>
                Limpiar Filtros
              </Button>
            </div>

            {/* Create product */}
            <Link href='/create-product'>
              <Button className='bg-[#33691E] hover:bg-[#1B5E20] flex items-center gap-2'>
                <Plus className='h-4 w-4' />
                Crear Producto
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card className='bg-white/90 backdrop-blur-sm border-[#D7CCC8]'>
        <CardContent className='pt-6'>
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Imagen</TableHead>
                  <TableHead>Producto</TableHead>
                  {login?.role === ROLES.ADMIN && <TableHead>Marca</TableHead>}
                  <TableHead>Categoría</TableHead>
                  <TableHead>Origen</TableHead>
                  <TableHead>Presentación</TableHead>
                  <TableHead>Accesorio</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts?.map((product) => (
                  <TableRow key={product?.id}>
                    <TableCell>
                      <Link href={`ProductDetail/${product.id}`}>
                      <div className='w-12 h-12 rounded-lg overflow-hidden bg-gray-100'>
                        {product?.images_url
                          ? (
                          <img
                            src={product?.images_url[0] || CONSTANTS.IMAGE_PLACEHOLDER}
                            alt={product?.name}
                            className='w-full h-full object-cover'
                          />
                            )
                          : (
                          <div className='w-full h-full flex items-center justify-center'>
                            <ImageIcon className='h-6 w-6 text-gray-400' />
                          </div>
                            )}
                      </div>
                      </Link>

                    </TableCell>
                    <TableCell className='font-medium'>{product.name}</TableCell>
                    {login?.role === ROLES.ADMIN && <TableCell>{product.brand_name ?? 'No Aplica'}</TableCell>}
                    <TableCell>{product.category_name ?? 'No Aplica'}</TableCell>
                    <TableCell>{product.origin_name ?? 'No Aplica'}</TableCell>
                    <TableCell>{product.presentation_name ?? 'No Aplica'}</TableCell>
                    <TableCell>{product.accessory_name ?? 'No Aplica'}</TableCell>
                    <TableCell>{formatPrice(product.price)}</TableCell>
                    <TableCell>
                      <Badge
                        variant='outline'
                        className={product.stock < 5 ? 'bg-orange-50 text-orange-700 border-orange-200' : ''}
                      >
                        {product.stock} u.
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-2'>
                        <Switch checked={product.is_active} onClick={() => setSaveChangeStatus(product)} />
                        <span className='text-sm text-[#5D4037]'>{product.is_active ? 'Activo' : 'Inactivo'}</span>
                      </div>
                      {/* model confirmacion Estado acivo a inactivo */}
                      <Dialog open={!!saveChangeStatus} onOpenChange={() => setSaveChangeStatus(null)}>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>¿Guardar cambios?</DialogTitle>
                            <DialogDescription>
                              Se actualizará el estado del producto "{saveChangeStatus?.name}". Esta acción se puede
                              revertir editando nuevamente el producto.
                            </DialogDescription>
                          </DialogHeader>

                          <div className='flex justify-end gap-2'>
                            <Button variant='outline' onClick={() => setSaveChangeStatus(null)}>
                              Cancelar
                            </Button>
                            <Button
                              onClick={() => handleConfirmeChangeStatus(saveChangeStatus)}
                              className='bg-[#33691E] hover:bg-[#1B5E20]'
                            >
                              Confirmar Guardado
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                    <TableCell className='text-right'>
                      <div className='flex justify-end gap-2'>
                        <Dialog
                          open={editDialogOpen && selectedProduct?.id === product.id}
                          onOpenChange={setEditDialogOpen}
                        >
                          <DialogTrigger asChild>
                            <Button variant='ghost' size='icon' onClick={() => handleOpenEdit(product)}>
                              <Edit className='h-4 w-4' />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className='max-w-3xl max-h-[90vh] overflow-y-auto'>
                            <DialogHeader>
                              <DialogTitle>Editar Producto</DialogTitle>
                              <DialogDescription>
                                Modifica los datos del producto "{selectedProduct?.name}"
                              </DialogDescription>
                            </DialogHeader>

                            <div className='space-y-6 py-4'>
                              {/* Nombre */}
                              <div className='space-y-2'>
                                <Label className='text-sm font-medium text-[#3E2723]'>Nombre del Producto *</Label>
                                <Input
                                  value={editForm.name}
                                  onChange={(e) => handleEditFormChange('name', e.target.value)}
                                  placeholder='Ej: Café Colombiano Premium'
                                />
                              </div>

                              <div className=' grid grid-cols-2 gap-2'>
                                <div>
                                  <Label className='text-sm font-medium text-[#3E2723]'>
                                    Descripción del Producto *
                                  </Label>
                                  <Textarea
                                    className='resize-none'
                                    value={editForm.description}
                                    onChange={(e) => handleEditFormChange('description', e.target.value)}
                                    placeholder='Ej: Café Colombiano Premium'
                                  />
                                </div>

                                <div>
                                  <Label className='text-sm font-medium text-[#3E2723]'>
                                    Detalle de origen del Producto *
                                  </Label>
                                  <Textarea
                                    className='resize-none'
                                    value={editForm.originDetails}
                                    onChange={(e) => handleEditFormChange('originDetails', e.target.value)}
                                    placeholder='Ej: Café Colombiano Premium'
                                  />
                                </div>
                              </div>

                              <div
                                className={`grid gap-4 ${login.role === ROLES.ADMIN ? 'grid-cols-5' : 'grid-cols-4'}`}
                              >
                                <div className='space-y-2'>
                                  <Label className='text-sm font-medium text-[#3E2723]'>Categoría *</Label>
                                  <Select
                                    value={editForm.category}
                                    onValueChange={(value) => handleEditFormChange('category', value)}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder='Seleccionar' />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {categories.map((category) => (
                                        <SelectItem key={category.id} value={category.id}>
                                          {category.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className='space-y-2'>
                                  <Label className='text-sm font-medium text-[#3E2723]'>Presentación *</Label>
                                  <Select
                                    value={editForm.presentation}
                                    onValueChange={(value) => handleEditFormChange('presentation', value)}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder='Seleccionar' />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {presentations.map((presentation) => (
                                        <SelectItem key={presentation.id} value={presentation.id}>
                                          {presentation.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className='space-y-2'>
                                  <Label className='text-sm font-medium text-[#3E2723]'>Origen *</Label>
                                  <Select
                                    value={editForm.origin}
                                    onValueChange={(value) => handleEditFormChange('origin', value)}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder='Seleccionar' />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {origins.map((origin) => (
                                        <SelectItem key={origin.id} value={origin.id}>
                                          {origin.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className='space-y-2'>
                                  <Label className='text-sm font-medium text-[#3E2723]'>Accesorio *</Label>
                                  <Select
                                    value={editForm.accessory}
                                    onValueChange={(value) => handleEditFormChange('accessory', value)}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder='Seleccionar' />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {accessories.map((accessory) => (
                                        <SelectItem key={accessory.id} value={accessory.id}>
                                          {accessory.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>

                                {login?.role === ROLES.ADMIN && (
                                  <div className='space-y-2'>
                                    <Label className='text-sm font-medium text-[#3E2723]'>Marca *</Label>

                                    <Select
                                      value={editForm.brand}
                                      onValueChange={(value) => handleEditFormChange('brand', value)}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder='Seleccionar' />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {brands.map((brand) => (
                                          <SelectItem key={brand.id} value={brand.id}>
                                            {brand.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                )}
                              </div>

                              {/* Precio y Stock */}
                              <div className='grid grid-cols-2 gap-4'>
                                <div className='space-y-2'>
                                  <Label className='text-sm font-medium text-[#3E2723]'>Precio *</Label>
                                  <Input
                                    type='number'
                                    value={editForm.price}
                                    onChange={(e) => handleEditFormChange('price', Number(e.target.value))}
                                    placeholder='45000'
                                    step='1000'
                                  />
                                </div>

                                <div className='space-y-2'>
                                  <Label className='text-sm font-medium text-[#3E2723]'>Stock *</Label>
                                  <Input
                                    type='number'
                                    value={editForm.stock}
                                    onChange={(e) => handleEditFormChange('stock', Number(e.target.value))}
                                    placeholder='15'
                                  />
                                </div>
                              </div>

                              {/* Imágenes del Producto */}
                              <div className='space-y-4'>
                                <Label className='text-sm font-medium text-[#3E2723]'>Imágenes del Producto</Label>

                                <div className='border-2 border-dashed border-gray-300 rounded-lg p-6 text-center'>
                                  <Upload className='mx-auto h-10 w-10 text-gray-400 mb-3' />
                                  <p className='text-sm text-gray-600 mb-3'>
                                    Arrastra imágenes o haz clic para seleccionar
                                  </p>
                                  <input
                                    id='edit-images'
                                    type='file'
                                    accept='image/*'
                                    multiple
                                    style={{ display: 'none' }}
                                    onChange={handleImageChange}
                                  />
                                  <Button
                                    variant='outline'
                                    type='button'
                                    onClick={() => document.getElementById('edit-images').click()}
                                    disabled={uploading}
                                  >
                                    {uploading ? 'Subiendo...' : 'Seleccionar Imágenes'}
                                  </Button>
                                </div>

                                {/* Vista previa de imágenes */}
                                {imageUrls.length > 0 && (
                                  <div className='flex flex-wrap gap-3 mt-4'>
                                    {imageUrls.map((url, idx) => (
                                      <div key={idx} className='relative'>
                                        <img
                                          src={url || CONSTANTS.IMAGE_PLACEHOLDER}
                                          alt='preview'
                                          className='h-20 w-20 object-cover rounded-md border-2 border-gray-200'
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

                              {/* Indicador de cambios */}
                              {hasChanges && (
                                <div className='bg-amber-50 border border-amber-200 rounded-lg p-3'>
                                  <p className='text-sm text-amber-800'>⚠️ Hay cambios sin guardar</p>
                                </div>
                              )}
                            </div>

                            <div className='flex justify-end gap-2 mt-4'>
                              <Button variant='outline' onClick={handleCancelEdit}>
                                Cancelar
                              </Button>
                              <Button
                                onClick={handleConfirmSave}
                                className='bg-[#33691E] hover:bg-[#1B5E20]'
                                disabled={!hasChanges}
                              >
                                Guardar Cambios
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

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

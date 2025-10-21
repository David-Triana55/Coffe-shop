'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { Plus, Search, Edit, Tag, Globe, PackageIcon, Coffee, Upload, X, ImageIcon } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import Loading from '@/components/Loading/Loading'
import { toastError, toastSuccess } from '@/utils/toast'
import { Bounce, ToastContainer } from 'react-toastify'

const CATALOG_TYPES = {
  CATEGORIES: 'categories',
  ORIGINS: 'origins',
  PRESENTATIONS: 'presentations',
  ACCESSORIES: 'accessories'
}

const CATALOG_CONFIG = {
  [CATALOG_TYPES.CATEGORIES]: {
    label: 'Categorías',
    icon: Tag,
    apiEndpoint: '/api/categories',
    singularLabel: 'Categoría',
    placeholder: 'Buscar categorías...',
    createPlaceholder: 'Ej: Grano Entero',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  [CATALOG_TYPES.ORIGINS]: {
    label: 'Orígenes',
    icon: Globe,
    apiEndpoint: '/api/origins',
    singularLabel: 'Origen',
    placeholder: 'Buscar orígenes...',
    createPlaceholder: 'Ej: Colombia',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  [CATALOG_TYPES.PRESENTATIONS]: {
    label: 'Presentaciones',
    icon: PackageIcon,
    apiEndpoint: '/api/presentations',
    singularLabel: 'Presentación',
    placeholder: 'Buscar presentaciones...',
    createPlaceholder: 'Ej: 250g',
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  [CATALOG_TYPES.ACCESSORIES]: {
    label: 'Accesorios',
    icon: Coffee,
    apiEndpoint: '/api/accessories',
    singularLabel: 'Accesorio',
    placeholder: 'Buscar accesorios...',
    createPlaceholder: 'Ej: Filtro de Café',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50'
  }
}

export default function CatalogosPage () {
  const [selectedCatalog, setSelectedCatalog] = useState(CATALOG_TYPES.CATEGORIES)
  const [items, setItems] = useState([])
  const [filteredItems, setFilteredItems] = useState([])
  const [search, setSearch] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [saveChangeStatus, setSaveChangeStatus] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [editImageUrl, setEditImageUrl] = useState('')

  const [editForm, setEditForm] = useState({
    id: '',
    name: '',
    description: '',
    image_url: ''
  })

  const [createForm, setCreateForm] = useState({
    name: '',
    description: '',
    image_url: ''
  })

  const config = CATALOG_CONFIG[selectedCatalog]
  const Icon = config.icon

  useEffect(() => {
    loadData()
    // Reset image when changing catalog type
    setImageUrl('')
    setEditImageUrl('')
  }, [selectedCatalog])

  useEffect(() => {
    let filtered = items

    if (search) {
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
    }

    setFilteredItems(filtered)
  }, [search, items])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(config.apiEndpoint, { credentials: 'include' })
      const data = await response.json()
      setItems(data)
      setFilteredItems(data)
    } catch (e) {
      console.log(e)
      toastError(`Error al cargar ${config.label.toLowerCase()}`, 3000, Bounce)
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = async (e, isEdit = false) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    setUploading(true)
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      const result = await res.json()

      if (res.ok && result.urls?.[0]) {
        if (isEdit) {
          setEditImageUrl(result.urls[0])
          setEditForm((prev) => ({ ...prev, image_url: result.urls[0] }))
          setHasChanges(true)
        } else {
          setImageUrl(result.urls[0])
          setCreateForm((prev) => ({ ...prev, image_url: result.urls[0] }))
        }
        toastSuccess('¡Imagen subida correctamente!', 3000, Bounce)
      } else {
        toastError('Error al subir la imagen', 3000, Bounce)
      }
    } catch (err) {
      console.error(err)
      toastError('Error al subir la imagen', 3000, Bounce)
    } finally {
      setUploading(false)
    }

    e.target.value = null
  }

  const handleRemoveImage = (isEdit = false) => {
    if (isEdit) {
      setEditImageUrl('')
      setEditForm((prev) => ({ ...prev, image_url: '' }))
      setHasChanges(true)
    } else {
      setImageUrl('')
      setCreateForm((prev) => ({ ...prev, image_url: '' }))
    }
  }

  const handleOpenEdit = (item) => {
    setSelectedItem(item)
    setEditForm({
      id: item.id,
      name: item.name,
      description: item.description || '',
      image_url: item.image_url || ''
    })
    setEditImageUrl(item.image_url || '')
    setHasChanges(false)
    setEditDialogOpen(true)
  }

  const handleEditFormChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }

  const handleCreateFormChange = (field, value) => {
    setCreateForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleConfirmSave = async () => {
    try {
      setEditDialogOpen(false)
      setHasChanges(false)

      const response = await fetch(config.apiEndpoint, {
        method: 'PUT',
        body: JSON.stringify(editForm),
        credentials: 'include'
      })
      const res = await response.json()

      toastSuccess(res.message || `${config.singularLabel} actualizado correctamente`, 3000, Bounce)

      // Update the item in the list with the new data
      setItems((prev) =>
        prev.map((item) =>
          item.id === editForm.id
            ? {
                ...item,
                name: editForm.name,
                description: editForm.description,
                image_url: editForm.image_url
              }
            : item
        )
      )

      setSelectedItem(null)
      setEditImageUrl('')
    } catch (e) {
      toastError('Hubo un error al actualizar', 3000, Bounce)
      console.log(e)
    }
  }

  const handleCreate = async () => {
    try {
      if (!createForm.name) {
        toastError('El nombre es requerido', 3000, Bounce)
        return
      }

      const response = await fetch(config.apiEndpoint, {
        method: 'POST',
        body: JSON.stringify(createForm),
        credentials: 'include'
      })
      const res = await response.json()
      console.log(res)

      if (response.ok) {
        toastSuccess(res.message || `${config.singularLabel} creado correctamente`, 3000, Bounce)

        // Extract the created item from response - handle different response structures
        const newItem = {
          id: res.data[0].id,
          name: createForm.name,
          description: createForm.description,
          image_url: createForm.image_url,
          is_active: true
        }

        // Add to the list immediately for reactivity
        setItems((prev) => [...prev, newItem])

        setCreateDialogOpen(false)
        setCreateForm({ name: '', description: '', image_url: '' })
        setImageUrl('')
      } else {
        toastError(res.message || `Error al crear ${config.singularLabel.toLowerCase()}`, 3000, Bounce)
      }
    } catch (e) {
      toastError(`Hubo un error al crear ${config.singularLabel.toLowerCase()}`, 3000, Bounce)
      console.log(e)
    }
  }

  const handleConfirmeChangeStatus = async (item) => {
    try {
      const response = await fetch(`${config.apiEndpoint}/status`, {
        method: 'PUT',
        body: JSON.stringify({ id: item.id, status: !item.is_active }),
        credentials: 'include'
      })
      const res = await response.json()

      toastSuccess(res.message || 'Estado actualizado correctamente', 3000, Bounce)
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, is_active: !i.is_active } : i)))
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
        setEditImageUrl('')
      }
    } else {
      setEditDialogOpen(false)
      setEditImageUrl('')
    }
  }

  const handleCancelCreate = () => {
    setCreateDialogOpen(false)
    setCreateForm({ name: '', description: '', image_url: '' })
    setImageUrl('')
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className='space-y-6 mt-16 p-6'>
      {/* Header */}
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
        <div>
          <h1 className='text-4xl font-bold text-[#3E2723]'>Gestión de Catálogos</h1>
          <p className='text-[#5D4037] mt-1'>Administra categorías, orígenes, presentaciones y accesorios</p>
        </div>
      </div>

      {/* Catalog Type Selector */}
      <Card className={config.bgColor}>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Icon className={`h-6 w-6 ${config.color}`} />
            <span className={config.color}>Gestión de {config.label}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedCatalog} onValueChange={setSelectedCatalog}>
            <SelectTrigger className='w-full md:w-[300px]'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(CATALOG_CONFIG).map(([key, catalogConfig]) => {
                const CatalogIcon = catalogConfig.icon
                return (
                  <SelectItem key={key} value={key}>
                    <div className='flex items-center gap-2'>
                      <CatalogIcon className='h-4 w-4' />
                      {catalogConfig.label}
                    </div>
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className='pt-6'>
          <div className='flex flex-wrap items-center justify-between gap-4'>
            <div className='flex items-center gap-4 flex-1'>
              <div className='relative flex-1'>
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8D6E63]' />
                <Input
                  placeholder={config.placeholder}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className='pl-10 w-full'
                />
              </div>

              <Button variant='outline' onClick={() => setSearch('')}>
                Limpiar
              </Button>
            </div>

            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className='bg-[#33691E] hover:bg-[#1B5E20] flex items-center gap-2'>
                  <Plus className='h-4 w-4' />
                  Crear {config.singularLabel}
                </Button>
              </DialogTrigger>
              <DialogContent className='max-w-2xl'>
                <DialogHeader>
                  <DialogTitle>Crear {config.singularLabel}</DialogTitle>
                  <DialogDescription>
                    Completa los datos del nuevo {config.singularLabel.toLowerCase()}
                  </DialogDescription>
                </DialogHeader>

                <div className='space-y-4 py-4'>
                  <div className='space-y-2'>
                    <Label>Nombre *</Label>
                    <Input
                      value={createForm.name}
                      onChange={(e) => handleCreateFormChange('name', e.target.value)}
                      placeholder={config.createPlaceholder}
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label>Descripción</Label>
                    <Textarea
                      value={createForm.description}
                      onChange={(e) => handleCreateFormChange('description', e.target.value)}
                      placeholder='Descripción opcional...'
                      rows={3}
                    />
                  </div>

                  {/* Image Upload */}
                  <div className='space-y-2'>
                    <Label>Imagen</Label>
                    <div className='border-2 border-dashed border-gray-300 rounded-lg p-6 text-center'>
                      {imageUrl
                        ? (
                        <div className='relative inline-block'>
                          <img
                            src={imageUrl || '/placeholder.svg'}
                            alt='Preview'
                            className='h-32 w-32 object-cover rounded-md border-2 border-gray-200'
                          />
                          <button
                            type='button'
                            onClick={() => handleRemoveImage(false)}
                            className='absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700 transition-colors'
                            title='Eliminar'
                          >
                            <X className='h-4 w-4' />
                          </button>
                        </div>
                          )
                        : (
                        <>
                          <Upload className='mx-auto h-10 w-10 text-gray-400 mb-3' />
                          <p className='text-sm text-gray-600 mb-3'>Arrastra una imagen o haz clic para seleccionar</p>
                          <input
                            id='create-image'
                            type='file'
                            accept='image/*'
                            style={{ display: 'none' }}
                            onChange={(e) => handleImageUpload(e, false)}
                          />
                          <Button
                            variant='outline'
                            type='button'
                            onClick={() => document.getElementById('create-image')?.click()}
                            disabled={uploading}
                          >
                            {uploading ? 'Subiendo...' : 'Seleccionar Imagen'}
                          </Button>
                        </>
                          )}
                    </div>
                  </div>
                </div>

                <div className='flex justify-end gap-2'>
                  <Button variant='outline' onClick={handleCancelCreate}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreate} className='bg-[#33691E] hover:bg-[#1B5E20]' disabled={uploading}>
                    Crear {config.singularLabel}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className='mt-4'>
            <p className='text-sm text-[#5D4037]'>
              {filteredItems.length}{' '}
              {filteredItems.length === 1 ? config.singularLabel.toLowerCase() : config.label.toLowerCase()} encontrados
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Items Table */}
      <Card className='bg-white/90 backdrop-blur-sm border-[#D7CCC8]'>
        <CardContent className='pt-6'>
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Imagen</TableHead>
                  <TableHead>{config.singularLabel}</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className='text-right'>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems?.map((item) => (
                  <TableRow key={item?.id}>
                    <TableCell>
                      <div className='w-12 h-12 rounded-lg overflow-hidden bg-gray-100'>
                        {item?.image_url
                          ? (
                          <img
                            src={item.image_url || '/placeholder.svg'}
                            alt={item.name}
                            className='w-full h-full object-cover'
                          />
                            )
                          : (
                          <div className='w-full h-full flex items-center justify-center'>
                            <ImageIcon className='h-6 w-6 text-gray-400' />
                          </div>
                            )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-3'>
                        <div className={`w-10 h-10 rounded-lg ${config.bgColor} flex items-center justify-center`}>
                          <Icon className={`h-5 w-5 ${config.color}`} />
                        </div>
                        <span className='font-medium'>{item?.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className='max-w-md truncate'>{item?.description || 'Sin descripción'}</TableCell>
                    <TableCell>
                      <div className='flex items-center gap-2'>
                        <Switch checked={item?.is_active} onClick={() => setSaveChangeStatus(item)} />
                        <span className='text-sm text-[#5D4037]'>{item?.is_active ? 'Activo' : 'Inactivo'}</span>
                      </div>

                      <Dialog open={!!saveChangeStatus} onOpenChange={() => setSaveChangeStatus(null)}>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>¿Guardar cambios?</DialogTitle>
                            <DialogDescription>
                              Se actualizará el estado de {config.singularLabel.toLowerCase()} "{saveChangeStatus?.name}
                              ".
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
                              Confirmar
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                    <TableCell className='text-right'>
                      <Dialog open={editDialogOpen && selectedItem?.id === item.id} onOpenChange={setEditDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant='ghost' size='icon' onClick={() => handleOpenEdit(item)}>
                            <Edit className='h-4 w-4' />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className='max-w-2xl'>
                          <DialogHeader>
                            <DialogTitle>Editar {config.singularLabel}</DialogTitle>
                            <DialogDescription>
                              Modifica los datos de {config.singularLabel.toLowerCase()} "{selectedItem?.name}"
                            </DialogDescription>
                          </DialogHeader>

                          <div className='space-y-4 py-4'>
                            <div className='space-y-2'>
                              <Label>Nombre *</Label>
                              <Input
                                value={editForm.name}
                                onChange={(e) => handleEditFormChange('name', e.target.value)}
                                placeholder={config.createPlaceholder}
                              />
                            </div>

                            <div className='space-y-2'>
                              <Label>Descripción</Label>
                              <Textarea
                                value={editForm.description}
                                onChange={(e) => handleEditFormChange('description', e.target.value)}
                                placeholder='Descripción opcional...'
                                rows={3}
                              />
                            </div>

                            {/* Image Upload */}
                            <div className='space-y-2'>
                              <Label>Imagen</Label>
                              <div className='border-2 border-dashed border-gray-300 rounded-lg p-6 text-center'>
                                {editImageUrl
                                  ? (
                                  <div className='relative inline-block'>
                                    <img
                                      src={editImageUrl || '/placeholder.svg'}
                                      alt='Preview'
                                      className='h-32 w-32 object-cover rounded-md border-2 border-gray-200'
                                    />
                                    <button
                                      type='button'
                                      onClick={() => handleRemoveImage(true)}
                                      className='absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700 transition-colors'
                                      title='Eliminar'
                                    >
                                      <X className='h-4 w-4' />
                                    </button>
                                  </div>
                                    )
                                  : (
                                  <>
                                    <Upload className='mx-auto h-10 w-10 text-gray-400 mb-3' />
                                    <p className='text-sm text-gray-600 mb-3'>
                                      Arrastra una imagen o haz clic para seleccionar
                                    </p>
                                    <input
                                      id='edit-image'
                                      type='file'
                                      accept='image/*'
                                      style={{ display: 'none' }}
                                      onChange={(e) => handleImageUpload(e, true)}
                                    />
                                    <Button
                                      variant='outline'
                                      type='button'
                                      onClick={() => document.getElementById('edit-image')?.click()}
                                      disabled={uploading}
                                    >
                                      {uploading ? 'Subiendo...' : 'Seleccionar Imagen'}
                                    </Button>
                                  </>
                                    )}
                              </div>
                            </div>

                            {hasChanges && (
                              <div className='bg-amber-50 border border-amber-200 rounded-lg p-3'>
                                <p className='text-sm text-amber-800'>⚠️ Hay cambios sin guardar</p>
                              </div>
                            )}
                          </div>

                          <div className='flex justify-end gap-2'>
                            <Button variant='outline' onClick={handleCancelEdit}>
                              Cancelar
                            </Button>
                            <Button
                              onClick={handleConfirmSave}
                              className='bg-[#33691E] hover:bg-[#1B5E20]'
                              disabled={!hasChanges || uploading}
                            >
                              Guardar Cambios
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
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

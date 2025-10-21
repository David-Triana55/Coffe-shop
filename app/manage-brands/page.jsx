'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
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
import { Switch } from '@/components/ui/switch'
import { Plus, Search, Edit, Upload, XIcon, Package } from 'lucide-react'
import { Label } from '@/components/ui/label'
import Loading from '@/components/Loading/Loading'
import { toastError, toastSuccess } from '@/utils/toast'
import { Bounce, ToastContainer } from 'react-toastify'
import { Textarea } from '@/components/ui/textarea'

export default function MarcasPage () {
  const [brands, setBrands] = useState([])
  const [filteredBrands, setFilteredBrands] = useState([])
  const [search, setSearch] = useState('')
  const [selectedBrand, setSelectedBrand] = useState(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [saveChangeStatus, setSaveChangeStatus] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [uploading, setUploading] = useState(false)

  const [editForm, setEditForm] = useState({
    id: '',
    name: '',
    description: '',
    logo: '',
    is_active: true
  })

  const [createForm, setCreateForm] = useState({
    name: '',
    description: '',
    logo: ''
  })

  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/brands', { credentials: 'include' })
        const data = await response.json()
        setBrands(data)
        setFilteredBrands(data)
      } catch (e) {
        toastError('Error al cargar marcas', 3000, Bounce)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  useEffect(() => {
    let filtered = brands

    if (search) {
      filtered = filtered.filter((b) => b.name.toLowerCase().includes(search.toLowerCase()))
    }

    setFilteredBrands(filtered)
  }, [search, brands])

  const handleOpenEdit = (brand) => {
    setSelectedBrand(brand)
    setEditForm({
      id: brand.id,
      name: brand.name,
      description: brand.description || '',
      logo: brand.logo || '',
      is_active: brand.is_active
    })
    setImageUrl(brand.logo || '')
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

  const handleImageUpload = async (e, isEdit = false) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    setUploading(true)
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      const result = await response.json()

      if (response.ok) {
        const uploadedUrl = result.urls[0]
        setImageUrl(uploadedUrl)

        if (isEdit) {
          setEditForm((prev) => ({ ...prev, logo: uploadedUrl }))
          setHasChanges(true)
        } else {
          setCreateForm((prev) => ({ ...prev, logo: uploadedUrl }))
        }

        toastSuccess('Imagen subida correctamente', 3000, Bounce)
      } else {
        toastError('Error al subir la imagen', 3000, Bounce)
      }
    } catch (err) {
      toastError('Error al subir la imagen', 3000, Bounce)
    } finally {
      setUploading(false)
    }

    e.target.value = null
  }

  const handleRemoveImage = (isEdit = false) => {
    setImageUrl('')
    if (isEdit) {
      setEditForm((prev) => ({ ...prev, logo: '' }))
      setHasChanges(true)
    } else {
      setCreateForm((prev) => ({ ...prev, logo: '' }))
    }
  }

  const handleConfirmSave = async () => {
    try {
      const brandToSave = {
        ...editForm,
        logo: imageUrl
      }

      setEditDialogOpen(false)
      setHasChanges(false)

      const response = await fetch('/api/brands', {
        method: 'PUT',
        body: JSON.stringify(brandToSave),
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      })
      const res = await response.json()

      toastSuccess(res.message || 'Marca actualizada correctamente', 3000, Bounce)
      setBrands((prev) => prev.map((b) => (b.id === editForm.id ? { ...b, ...brandToSave } : b)))
      setSelectedBrand(null)
      setImageUrl('')
    } catch (e) {
      toastError('Hubo un error en el guardado', 3000, Bounce)
    }
  }

  const handleCreateBrand = async () => {
    try {
      const brandToCreate = {
        ...createForm,
        logo: imageUrl
      }

      const response = await fetch('/api/brands', {
        method: 'POST',
        body: JSON.stringify(brandToCreate),
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      })
      const res = await response.json()

      if (response.ok) {
        toastSuccess(res.message || 'Marca creada correctamente', 3000, Bounce)
        setBrands((prev) => [...prev, res.brand])
        setCreateDialogOpen(false)
        setCreateForm({ name: '', description: '', logo: '' })
        setImageUrl('')
      } else {
        toastError(res.message || 'Error al crear marca', 3000, Bounce)
      }
    } catch (e) {
      toastError('Hubo un error al crear la marca', 3000, Bounce)
    }
  }

  const handleConfirmeChangeStatus = async (brand) => {
    try {
      const response = await fetch('/api/brands/status', {
        method: 'PUT',
        body: JSON.stringify({ id: brand.id, is_active: !brand.is_active }),
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      })
      const res = await response.json()

      toastSuccess(res.message || 'Estado actualizado', 3000, Bounce)
      setBrands((prev) => prev.map((b) => (b.id === brand.id ? { ...b, is_active: !b.is_active } : b)))
      setSaveChangeStatus(false)
    } catch (e) {
      toastError('Hubo un error en el guardado', 3000, Bounce)
    }
  }

  const handleCancelEdit = () => {
    if (hasChanges) {
      if (confirm('¿Descartar los cambios realizados?')) {
        setEditDialogOpen(false)
        setHasChanges(false)
        setImageUrl('')
      }
    } else {
      setEditDialogOpen(false)
      setImageUrl('')
    }
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className='space-y-6 mt-16 p-6'>
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
        <div>
          <h1 className='text-4xl font-bold text-[#3E2723]'>Gestión de Marcas</h1>
          <p className='text-[#5D4037] mt-1'>{filteredBrands.length} marcas encontradas</p>
        </div>
      </div>

      <Card>
        <CardContent className='pt-6'>
          <div className='flex flex-wrap items-center justify-between gap-4'>
            <div className='flex items-center gap-4 flex-1'>
              <div className='relative flex-1'>
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8D6E63]' />
                <Input
                  placeholder='Buscar marcas...'
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className='pl-10 w-full'
                />
              </div>

              <Button variant='outline' onClick={() => setSearch('')}>
                Limpiar Filtros
              </Button>
            </div>

            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className='bg-[#33691E] hover:bg-[#1B5E20] flex items-center gap-2'>
                  <Plus className='h-4 w-4' />
                  Crear Marca
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Crear Nueva Marca</DialogTitle>
                  <DialogDescription>Completa los datos de la nueva marca</DialogDescription>
                </DialogHeader>

                <div className='space-y-4 py-4'>
                  <div className='space-y-2'>
                    <Label>Nombre de la Marca *</Label>
                    <Input
                      value={createForm.name}
                      onChange={(e) => handleCreateFormChange('name', e.target.value)}
                      placeholder='Juan Valdez'
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label>Descripción</Label>
                    <Textarea
                      value={createForm.description}
                      onChange={(e) => handleCreateFormChange('description', e.target.value)}
                      placeholder='Descripción de la marca...'
                      className='resize-none'
                    />
                  </div>

                  <div className='space-y-4'>
                    <Label>Logo de la Marca</Label>
                    <div className='border-2 border-dashed border-gray-300 rounded-lg p-6 text-center'>
                      <Upload className='mx-auto h-10 w-10 text-gray-400 mb-3' />
                      <p className='text-sm text-gray-600 mb-3'>Haz clic para seleccionar el logo</p>
                      <input
                        id='create-logo'
                        type='file'
                        accept='image/*'
                        style={{ display: 'none' }}
                        onChange={(e) => handleImageUpload(e, false)}
                      />
                      <Button
                        variant='outline'
                        type='button'
                        onClick={() => document.getElementById('create-logo').click()}
                        disabled={uploading}
                      >
                        {uploading ? 'Subiendo...' : 'Seleccionar Logo'}
                      </Button>
                    </div>

                    {imageUrl && (
                      <div className='relative inline-block'>
                        <img
                          src={imageUrl || '/placeholder.svg'}
                          alt='logo preview'
                          className='h-24 w-24 object-cover rounded-md border-2 border-gray-200'
                        />
                        <button
                          type='button'
                          onClick={() => handleRemoveImage(false)}
                          className='absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700 transition-colors'
                          title='Eliminar'
                        >
                          <XIcon className='h-4 w-4' />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className='flex justify-end gap-2'>
                  <Button
                    variant='outline'
                    onClick={() => {
                      setCreateDialogOpen(false)
                      setImageUrl('')
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateBrand} className='bg-[#33691E] hover:bg-[#1B5E20]'>
                    Crear Marca
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      <Card className='bg-white/90 backdrop-blur-sm border-[#D7CCC8]'>
        <CardContent className='pt-6'>
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Logo</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBrands?.map((brand) => (
                  <TableRow key={brand.id}>
                    <TableCell>
                      <div className='w-12 h-12 rounded-lg overflow-hidden bg-gray-100'>
                        {brand.logo
                          ? (
                          <img
                            src={brand.logo || '/placeholder.svg'}
                            alt={brand.name}
                            className='w-full h-full object-cover'
                          />
                            )
                          : (
                          <div className='w-full h-full flex items-center justify-center'>
                            <Package className='h-6 w-6 text-gray-400' />
                          </div>
                            )}
                      </div>
                    </TableCell>
                    <TableCell className='font-medium'>{brand.name}</TableCell>
                    <TableCell className='max-w-xs truncate'>{brand.description || 'Sin descripción'}</TableCell>
                    <TableCell>
                      <div className='flex items-center gap-2'>
                        <Switch checked={brand.is_active} onClick={() => setSaveChangeStatus(brand)} />
                        <span className='text-sm text-[#5D4037]'>{brand.is_active ? 'Activo' : 'Inactivo'}</span>
                      </div>
                      <Dialog open={!!saveChangeStatus} onOpenChange={() => setSaveChangeStatus(null)}>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>¿Cambiar estado de la marca?</DialogTitle>
                            <DialogDescription>
                              Se actualizará el estado de la marca "{saveChangeStatus?.name}". Esta acción se puede
                              revertir.
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
                      <Dialog open={editDialogOpen && selectedBrand?.id === brand.id} onOpenChange={setEditDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant='ghost' size='icon' onClick={() => handleOpenEdit(brand)}>
                            <Edit className='h-4 w-4' />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
                          <DialogHeader>
                            <DialogTitle>Editar Marca</DialogTitle>
                            <DialogDescription>
                              Modifica los datos de la marca "{selectedBrand?.name}"
                            </DialogDescription>
                          </DialogHeader>

                          <div className='space-y-4 py-4'>
                            <div className='space-y-2'>
                              <Label>Nombre de la Marca *</Label>
                              <Input
                                value={editForm.name}
                                onChange={(e) => handleEditFormChange('name', e.target.value)}
                                placeholder='Juan Valdez'
                              />
                            </div>

                            <div className='space-y-2'>
                              <Label>Descripción</Label>
                              <Textarea
                                value={editForm.description}
                                onChange={(e) => handleEditFormChange('description', e.target.value)}
                                placeholder='Descripción de la marca...'
                                className='resize-none'
                              />
                            </div>

                            <div className='space-y-4'>
                              <Label>Logo de la Marca</Label>
                              <div className='border-2 border-dashed border-gray-300 rounded-lg p-6 text-center'>
                                <Upload className='mx-auto h-10 w-10 text-gray-400 mb-3' />
                                <p className='text-sm text-gray-600 mb-3'>Haz clic para seleccionar el logo</p>
                                <input
                                  id='edit-logo'
                                  type='file'
                                  accept='image/*'
                                  style={{ display: 'none' }}
                                  onChange={(e) => handleImageUpload(e, true)}
                                />
                                <Button
                                  variant='outline'
                                  type='button'
                                  onClick={() => document.getElementById('edit-logo').click()}
                                  disabled={uploading}
                                >
                                  {uploading ? 'Subiendo...' : 'Seleccionar Logo'}
                                </Button>
                              </div>

                              {imageUrl && (
                                <div className='relative inline-block'>
                                  <img
                                    src={imageUrl || '/placeholder.svg'}
                                    alt='logo preview'
                                    className='h-24 w-24 object-cover rounded-md border-2 border-gray-200'
                                  />
                                  <button
                                    type='button'
                                    onClick={() => handleRemoveImage(true)}
                                    className='absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700 transition-colors'
                                    title='Eliminar'
                                  >
                                    <XIcon className='h-4 w-4' />
                                  </button>
                                </div>
                              )}
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
                              disabled={!hasChanges}
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

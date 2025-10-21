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
import { Plus, Search, Edit, User, Mail, Shield, Store } from 'lucide-react'
import { Label } from '@/components/ui/label'
import Loading from '@/components/Loading/Loading'
import { toastError, toastSuccess } from '@/utils/toast'
import { Bounce, ToastContainer } from 'react-toastify'
import { ROLES } from '@/utils/roles'
import { CONSTANTS } from '@/utils/constants'

export default function UsuariosPage () {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [selectedUser, setSelectedUser] = useState(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [saveChangeStatus, setSaveChangeStatus] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const [editForm, setEditForm] = useState({
    id: '',
    name: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    role: '',
    brandName: '',
    brandId: ''
  })

  const [createForm, setCreateForm] = useState({
    name: '',
    lastName: '',
    email: '',
    password: '',
    number: '',
    role: ROLES.CLIENTE,
    brandName: ''
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/users', { credentials: 'include' })
        const data = await response.json()
        console.log(data)
        setUsers(data)
        setFilteredUsers(data)
      } catch (e) {
        console.log(e)
        toastError('Error al cargar usuarios', 3000, Bounce)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  useEffect(() => {
    let filtered = users

    if (search) {
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase()) ||
          (u.brand_name && u.brand_name.toLowerCase().includes(search.toLowerCase()))
      )
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter((u) => u.role === roleFilter)
    }

    setFilteredUsers(filtered)
  }, [search, roleFilter, users])

  const handleOpenEdit = (user) => {
    setSelectedUser(user)
    setEditForm({
      id: user.id,
      name: user.name,
      lastName: user.last_name,
      phoneNumber: user.phone_number,
      email: user.email,
      role: user.role_id,
      brandName: user.brand_name || '',
      brandId: user.brand_id || ''
    })
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
      console.log(editForm, 'update data')

      const response = await fetch('/api/users', {
        method: 'PUT',
        body: JSON.stringify(editForm),
        credentials: 'include'
      })
      const res = await response.json()

      toastSuccess(res.message || 'Usuario actualizado correctamente', 3000, Bounce)

      // Update local state
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editForm.id
            ? {
                ...u,
                name: editForm.name,
                last_name: editForm.lastName,
                email: editForm.email,
                phone_number: editForm.phoneNumber,
                role: editForm.role,
                brand_name: editForm.brandName
              }
            : u
        )
      )
      setSelectedUser(null)
    } catch (e) {
      toastError('Hubo un error al actualizar', 3000, Bounce)
      console.log(e)
    }
  }

  const handleCreateUser = async () => {
    try {
      if (!createForm.name || !createForm.email || !createForm.password || !createForm.role) {
        toastError('Todos los campos básicos son requeridos', 3000, Bounce)
        return
      }

      if (createForm.role === ROLES.VENDEDOR && !createForm.brandName) {
        toastError('Los vendedores requieren un nombre de marca', 3000, Bounce)
        return
      }
      console.log()

      const response = await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify(createForm),
        credentials: 'include'
      })

      const res = await response.json()
      console.log(res)

      if (response.ok) {
        toastSuccess(res.message || 'Usuario creado correctamente', 3000, Bounce)

        const newUser = {
          id: res.user.id,
          name: res.user.name,
          last_name: res.user.last_name || createForm.lastName || '',
          email: res.user.email || createForm.email,
          phone_number: res.user.phone_number || createForm.number || '',
          role: res.user.role || createForm.role,
          brand_name: res.user.brand_name || createForm.brandName || '',
          brand_id: res.user.brand_id || null,
          is_active: res.user.is_active ?? true,
          image_url: res.user.image_url || null
        }

        // 🔹 Esto evita el error al renderizar el nuevo usuario
        setUsers(prev =>
          prev.some(u => u.id === newUser.id)
            ? prev.map(u => (u.id === newUser.id ? newUser : u))
            : [...prev, newUser]
        )
        setCreateDialogOpen(false)
        setCreateForm({
          name: '',
          lastName: '',
          email: '',
          password: '',
          number: '',
          role: ROLES.CLIENTE,
          brandName: ''
        })
      } else {
        toastError(res.message || 'Error al crear usuario', 3000, Bounce)
      }
    } catch (e) {
      toastError('Hubo un error al crear el usuario', 3000, Bounce)
      console.log(e)
    }
  }

  const handleConfirmeChangeStatus = async (user) => {
    try {
      const response = await fetch('/api/users/status', {
        method: 'PUT',
        body: JSON.stringify({ id: user.id, status: !user.is_active, role: user.role, brandId: user?.brand_id }),
        credentials: 'include'
      })
      const res = await response.json()

      toastSuccess(res.message || 'Estado actualizado correctamente', 3000, Bounce)
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, is_active: !u.is_active } : u)))
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
      }
    } else {
      setEditDialogOpen(false)
    }
  }

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case ROLES.VENDEDOR:
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case ROLES.CLIENTE:
        return 'bg-green-100 text-green-700 border-green-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getRoleLabel = (role) => {
    switch (role) {
      case ROLES.VENDEDOR:
        return 'Vendedor'
      case ROLES.CLIENTE:
        return 'Cliente'
      default:
        return role
    }
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className='space-y-6 mt-16 p-6'>
      {/* Header */}
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
        <div>
          <h1 className='text-4xl font-bold text-[#3E2723]'>Gestión de Usuarios</h1>
          <p className='text-[#5D4037] mt-1'>{filteredUsers.length} usuarios encontrados</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className='pt-6'>
          <div className='flex flex-wrap items-center justify-between gap-4'>
            <div className='flex items-center gap-4 flex-1'>
              <div className='relative flex-1'>
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8D6E63]' />
                <Input
                  placeholder='Buscar por nombre, email o marca...'
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className='pl-10 w-full'
                />
              </div>

              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className='w-[180px]'>
                  <SelectValue placeholder='Filtrar por rol' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>Todos los roles</SelectItem>
                  <SelectItem value={ROLES.VENDEDOR}>Vendedor</SelectItem>
                  <SelectItem value={ROLES.CLIENTE}>Cliente</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant='outline'
                onClick={() => {
                  setSearch('')
                  setRoleFilter('all')
                }}
              >
                Limpiar Filtros
              </Button>
            </div>

            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className='bg-[#33691E] hover:bg-[#1B5E20] flex items-center gap-2'>
                  <Plus className='h-4 w-4' />
                  Crear Usuario
                </Button>
              </DialogTrigger>
              <DialogContent className='max-w-2xl'>
                <DialogHeader>
                  <DialogTitle>Crear Nuevo Usuario</DialogTitle>
                  <DialogDescription>Completa los datos del nuevo usuario</DialogDescription>
                </DialogHeader>

                <div className='space-y-4 py-4'>
                  <div className='grid grid-cols-3 gap-4'>
                    <div className='space-y-2'>
                      <Label>Nombre *</Label>
                      <Input
                        value={createForm.name}
                        onChange={(e) => handleCreateFormChange('name', e.target.value)}
                        placeholder='Ej: Juan'
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label>Apellido *</Label>
                      <Input
                        value={createForm.lastName}
                        onChange={(e) => handleCreateFormChange('lastName', e.target.value)}
                        placeholder='Ej: Perez'
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label>Email *</Label>
                      <Input
                        value={createForm.email}
                        onChange={(e) => handleCreateFormChange('email', e.target.value)}
                        placeholder='Ej: juan@ejemplo.com'
                      />
                    </div>
                  </div>

                  <div className='grid grid-cols-3 gap-4'>

                    <div className='space-y-2'>
                      <Label>Telefono *</Label>
                      <Input
                        type='number'
                        value={createForm.number}
                        onChange={(e) => handleCreateFormChange('number', e.target.value)}
                        placeholder='300894825'
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label>Contraseña *</Label>
                      <Input
                        type='password'
                        value={createForm.password}
                        onChange={(e) => handleCreateFormChange('password', e.target.value)}
                        placeholder='Mínimo 6 caracteres'
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label>Rol *</Label>
                      <Select value={createForm.role} onValueChange={(value) => handleCreateFormChange('role', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder='Seleccionar rol' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={ROLES.VENDEDOR}>Vendedor (Marca)</SelectItem>
                          <SelectItem value={ROLES.CLIENTE}>Cliente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {createForm.role === ROLES.VENDEDOR && (
                    <>
                      <div className='border-t pt-4'>
                        <h3 className='font-medium text-[#3E2723] mb-3 flex items-center gap-2'>
                          <Store className='h-4 w-4' />
                          Información de Marca
                        </h3>
                      </div>

                      <div className='space-y-2'>
                        <Label>Nombre de Marca *</Label>
                        <Input
                          value={createForm.brandName}
                          onChange={(e) => handleCreateFormChange('brandName', e.target.value)}
                          placeholder='Ej: Café Premium Colombia'
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className='flex justify-end gap-2'>
                  <Button variant='outline' onClick={() => setCreateDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateUser} className='bg-[#33691E] hover:bg-[#1B5E20]'>
                    Crear Usuario
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className='bg-white/90 backdrop-blur-sm border-[#D7CCC8]'>
        <CardContent className='pt-6'>
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>nombre</TableHead>
                  <TableHead>Apellido</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefono</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Marca/Info</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers?.map((user) => (
                  <TableRow key={user?.id}>
                    <TableCell>
                      <div className='flex items-center gap-3'>
                        <div className={`w-10 h-10 rounded-full border-slate-600 flex items-center justify-center ${user.role === ROLES.VENDEDOR ? '' : 'bg-[#D7CCC8]'}`}>
                        {user?.role === ROLES.VENDEDOR
                          ? <img src={user?.image_url ?? CONSTANTS.IMAGE_PLACEHOLDER} alt={user?.brand_name} />
                          : <User className='h-6 w-6 text-[#5D4037]' />}
                        </div>
                        <span className='font-medium'>{user?.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-3'>
                        <span className='font-medium'>{user?.last_name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-2 text-sm'>
                        <Mail className='h-4 w-4 text-[#8D6E63]' />
                        {user?.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-2 text-sm'>
                        <Mail className='h-4 w-4 text-[#8D6E63]' />
                        {user?.phone_number}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant='outline' className={getRoleBadgeColor(user?.role)}>
                        <Shield className='h-3 w-3 mr-1' />
                        {getRoleLabel(user?.role)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user?.role === ROLES.VENDEDOR
                        ? (
                        <div className='space-y-1'>
                          <div className='flex items-center gap-2'>
                            <span className='font-medium text-sm text-[#8D6E63]'>{user?.brand_name || 'Sin marca'}</span>
                          </div>

                        </div>
                          )
                        : (
                        <span className='text-sm text-[#8D6E63]'>
                          cliente
                        </span>
                          )}
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-2'>
                        <Switch checked={user?.is_active} onClick={() => setSaveChangeStatus(user)} />
                        <span className='text-sm text-[#5D4037]'>{user?.is_active ? 'Activo' : 'Inactivo'}</span>
                      </div>

                      <Dialog open={!!saveChangeStatus} onOpenChange={() => setSaveChangeStatus(null)}>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>¿Cambiar estado del usuario?</DialogTitle>
                            <DialogDescription>
                              {saveChangeStatus?.role === ROLES.VENDEDOR
                                ? (
                                <>
                                  Se actualizará el estado del vendedor "{saveChangeStatus?.name}" y su marca "
                                  {saveChangeStatus?.brand_name}". Esto afectará todos sus productos y subastas.
                                </>
                                  )
                                : (
                                <>Se actualizará el estado del usuario "{saveChangeStatus?.name}".</>
                                  )}
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
                      <Dialog open={editDialogOpen && selectedUser?.id === user.id} onOpenChange={setEditDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant='ghost' size='icon' onClick={() => handleOpenEdit(user)}>
                            <Edit className='h-4 w-4' />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className='max-w-2xl'>
                          <DialogHeader>
                            <DialogTitle>Editar Usuario</DialogTitle>
                            <DialogDescription>Modifica los datos del usuario "{selectedUser?.name}"</DialogDescription>
                          </DialogHeader>

                          <div className='space-y-4 py-4'>
                            <div className='grid grid-cols-2 gap-4'>
                              <div className='space-y-2'>
                                <Label>Nombre *</Label>
                                <Input
                                  value={editForm.name}
                                  onChange={(e) => handleEditFormChange('name', e.target.value)}
                                  placeholder='Ej: Juan'
                                />
                              </div>

                              <div className='space-y-2'>
                                <Label>Apellido *</Label>
                                <Input
                                  value={editForm.lastName}
                                  onChange={(e) => handleEditFormChange('lastName', e.target.value)}
                                  placeholder='Ej: Perez'
                                />
                              </div>
                            </div>

                            <div className='grid grid-cols-2 gap-4'>
                              <div className='space-y-2'>
                                <Label>Telefono *</Label>
                                <Input
                                  value={editForm.phoneNumber}
                                  onChange={(e) => handleEditFormChange('phoneNumber', e.target.value)}
                                  placeholder='300582928'
                                />
                              </div>

                              <div className='space-y-2'>
                                <Label>Email *</Label>
                                <Input
                                  type='email'
                                  value={editForm.email}
                                  onChange={(e) => handleEditFormChange('email', e.target.value)}
                                  placeholder='Ej: juan@ejemplo.com'
                                />
                              </div>
                            </div>

                            {editForm.role === ROLES.VENDEDOR && (
                              <>
                                <div className='border-t pt-4'>
                                  <h3 className='font-medium text-[#3E2723] mb-3 flex items-center gap-2'>
                                    <Store className='h-4 w-4' />
                                    Información de Marca
                                  </h3>
                                </div>

                                <div className='space-y-2'>
                                  <Label>Nombre de Marca *</Label>
                                  <Input
                                    value={editForm.brandName}
                                    onChange={(e) => handleEditFormChange('brandName', e.target.value)}
                                    placeholder='Ej: Café Premium Colombia'
                                  />
                                </div>
                              </>
                            )}

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

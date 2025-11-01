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
import {
  Search,
  Gavel,
  Clock,
  CheckCircle,
  AlertCircle,
  User,

  Plus,
  Edit,
  Flag
} from 'lucide-react'
import Loading from '@/components/Loading/Loading'
import { toastError, toastSuccess } from '@/utils/toast'
import { Bounce, ToastContainer } from 'react-toastify'
import { formatPrice } from '@/utils/formatter'
import useStore from '@/store'
import { ROLES } from '@/utils/roles'
import Link from 'next/link'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CONSTANTS } from '@/utils/constants'

const AUCTION_STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
  FINISHED: 'finished',
  CANCELLED: 'cancelled'
}

export default function SubastasPage () {
  const { login } = useStore((state) => state)
  const [auctions, setAuctions] = useState([])
  const [filteredAuctions, setFilteredAuctions] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedAuction, setSelectedAuction] = useState(null)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [finishConfirmOpen, setFinishConfirmOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [refetch, setRefetch] = useState(false)

  const [editForm, setEditForm] = useState({
    id: '',
    productId: '',
    initial_price: 0,
    minimum_increment: 0,
    start_date: '',
    end_date: '',
    description: ''
  })

  useEffect(() => {
    const loadData = async (showLoading = true) => {
      try {
        if (showLoading) setIsLoading(true)

        const response = await fetch('/api/auctions', { credentials: 'include' })
        const data = await response.json()

        setAuctions(data.auctions)
        setFilteredAuctions(data.auctions)
      } catch (e) {
        console.error(e)
        toastError('Error al cargar subastas', 3000, Bounce)
      } finally {
        if (showLoading) setIsLoading(false)
        setRefetch(false)
      }
    }

    loadData(true)

    const intervalId = setInterval(() => loadData(false), 5000)

    return () => clearInterval(intervalId)
  }, [refetch])

  useEffect(() => {
    let filtered = [...auctions].sort((a, b) =>
      a.auction_status.localeCompare(b.auction_status)
    )
    console.log(auctions, 'filtrado', statusFilter)

    if (search) {
      filtered = filtered.filter(
        (a) =>
          a.product_name.toLowerCase().includes(search.toLowerCase()) ||
          a.seller_name.toLowerCase().includes(search.toLowerCase())
      )
    }
    if (statusFilter === AUCTION_STATUS.ACTIVE) {
      filtered = filtered.filter((a) => a.auction_status === AUCTION_STATUS.ACTIVE)
    } else if (statusFilter === AUCTION_STATUS.PENDING) {
      filtered = filtered.filter((a) => a.auction_status === AUCTION_STATUS.FINISHED && a.status_payment !== 'paid')
    } else if (statusFilter === AUCTION_STATUS.FINISHED) {
      filtered = filtered.filter((a) => a.auction_status === statusFilter && a.status_payment === 'paid')
    }

    setFilteredAuctions(filtered)
  }, [search, statusFilter, auctions])

  const handleOpenDetail = (auction) => {
    setSelectedAuction(auction)
    setDetailDialogOpen(true)
  }

  const handleOpenEdit = (auction) => {
    console.log(auction, 'auction edit')
    setSelectedAuction(auction)
    setEditForm({
      id: auction.auction_id,
      initial_price: auction.initial_price,
      minimum_increment: auction.minimum_increment || 1000,
      start_date: auction.start_date
        ? new Date(new Date(auction.start_date).getTime() - new Date(auction.start_date).getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 16)
        : '',
      end_date: auction.end_date
        ? new Date(new Date(auction.end_date).getTime() - new Date(auction.end_date).getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 16)
        : '',
      description: auction.product_description || '',
      productId: auction.product_id
    })
    setHasChanges(false)
    setEditDialogOpen(true)
  }

  const handleEditFormChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }

  const handleSaveAuction = async () => {
    try {
      const response = await fetch('/api/auctions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(editForm)
      })

      const data = await response.json()

      if (response.ok) {
        toastSuccess(data.message || 'Subasta actualizada exitosamente', 3000, Bounce)

        setAuctions((prev) => prev.map((a) => (a.id === editForm.id ? { ...a, ...editForm } : a)))

        setRefetch(true)
        setEditDialogOpen(false)
        setHasChanges(false)
      } else {
        toastError(data.error || 'Error al actualizar subasta', 3000, Bounce)
      }
    } catch (e) {
      console.log(e)
      toastError('Error al actualizar subasta', 3000, Bounce)
    }
  }

  const handleFinishAuction = async (auction) => {
    try {
      console.log(auction)
      const response = await fetch('/api/auctions/finish', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id: auction.auction_id })
      })

      const data = await response.json()

      if (response.ok) {
        toastSuccess(data.message || 'Subasta finalizada exitosamente', 3000, Bounce)

        setAuctions((prev) => prev.map((a) => (a.id === auction.auction_id ? { ...a, status: AUCTION_STATUS.FINISHED } : a)))

        setFinishConfirmOpen(false)
        setRefetch(true)
      } else {
        toastError(data.error || 'Error al finalizar subasta', 3000, Bounce)
      }
    } catch (e) {
      console.log(e)
      toastError('Error al finalizar subasta', 3000, Bounce)
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

  const getStatusBadge = (status) => {
    const statusConfig = {
      [AUCTION_STATUS.ACTIVE]: {
        icon: <Clock className='h-3 w-3 mr-1' />,
        text: 'En Curso',
        className: 'bg-blue-100 text-blue-700 border-blue-200'
      },

      [AUCTION_STATUS.FINISHED]: {
        icon: <CheckCircle className='h-3 w-3 mr-1' />,
        text: 'Finalizada',
        className: 'bg-green-100 text-green-700 border-green-200'
      },
      [AUCTION_STATUS.PENDING]: {
        icon: <AlertCircle className='h-3 w-3 mr-1' />,
        text: 'Pendiente',
        className: 'bg-yellow-100 text-yellow-700 border-yellow-200'
      }
    }

    const config = statusConfig[status]

    return (
      <Badge variant='outline' className={`flex items-center w-fit ${config.className}`}>
        {config.icon}
        {config.text}
      </Badge>
    )
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className='space-y-6 mt-16 p-6'>
      {/* Header */}
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
        <div>
          <h1 className='text-4xl font-bold text-[#3E2723]'>
            {login?.role === ROLES.ADMIN ? 'Gestión de Subastas' : 'Mis Subastas'}
          </h1>
          <p className='text-[#5D4037] mt-1'>{filteredAuctions.length} subastas encontradas</p>
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
                  placeholder='Buscar por producto o vendedor...'
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className='pl-10 w-full'
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className='w-[200px]'>
                  <SelectValue placeholder='Filtrar por estado' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>Todos los estados</SelectItem>
                  <SelectItem value={AUCTION_STATUS.ACTIVE}>En Curso</SelectItem>
                  <SelectItem value={AUCTION_STATUS.PENDING}>Pendiente pago</SelectItem>
                  <SelectItem value={AUCTION_STATUS.FINISHED}>Finalizada</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant='outline'
                onClick={() => {
                  setSearch('')
                  setStatusFilter('all')
                }}
              >
                Limpiar Filtros
              </Button>
            </div>

            <Link href='/create-product'>
              <Button className='bg-[#33691E] hover:bg-[#1B5E20] flex items-center gap-2'>
                <Plus className='h-4 w-4' />
                Crear Subasta
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Auctions Table */}
      <Card className='bg-white/90 backdrop-blur-sm border-[#D7CCC8]'>
        <CardContent className='pt-6'>
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  {login?.role === ROLES.ADMIN && <TableHead>Vendedor</TableHead>}
                  <TableHead>Precio Inicial</TableHead>
                  <TableHead>Precio Actual</TableHead>
                  <TableHead>Pujas</TableHead>
                  <TableHead>Fecha Inicio</TableHead>
                  <TableHead>Fecha Fin</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className='text-right'>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAuctions?.map((auction) => (
                  <TableRow key={auction.auction_id}>
                    <TableCell>
                      <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 rounded-lg overflow-hidden bg-gray-100'>
                          <img
                            src={auction.product_images || CONSTANTS.IMAGE_PLACEHOLDER}
                            alt={auction.product_name}
                            className='w-full h-full object-cover'
                          />
                        </div>
                        <span className='font-medium'>{auction.product_name}</span>
                      </div>
                    </TableCell>
                    {login?.role === ROLES.ADMIN && (
                      <TableCell>
                        <div className='flex items-center gap-2'>
                          <User className='h-4 w-4 text-[#8D6E63]' />
                          {auction.seller_name}
                        </div>
                      </TableCell>
                    )}
                    <TableCell>{formatPrice(auction.initial_price)}</TableCell>
                    <TableCell>
                      <span className='font-semibold text-[#33691E]'>{formatPrice(auction.current_price)}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant='outline' className='bg-gray-50'>
                        <Gavel className='h-3 w-3 mr-1' />
                        {auction.bid_count || 0}
                      </Badge>
                    </TableCell>
                    <TableCell className='text-sm text-[#5D4037]'>{formatDate(auction.start_date)}</TableCell>
                    <TableCell className='text-sm text-[#5D4037]'>{formatDate(auction.end_date)}</TableCell>
                    <TableCell>{getStatusBadge(auction.auction_status === AUCTION_STATUS.FINISHED ? (auction.auction_status === AUCTION_STATUS.FINISHED && auction.status_payment === 'paid' ? auction.auction_status : 'pending') : auction.auction_status)}</TableCell>
                    <TableCell className='text-right'>
                      <div className='flex justify-end gap-2'>
                        {(auction.auction_status === AUCTION_STATUS.ACTIVE) && (
                          <Dialog
                            open={editDialogOpen && selectedAuction?.auction_id === auction.auction_id}
                            onOpenChange={setEditDialogOpen}
                          >
                            <DialogTrigger asChild>
                              <Button variant='ghost' size='icon' onClick={() => handleOpenEdit(auction)}>
                                <Edit className='h-4 w-4' />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
                              <DialogHeader>
                                <DialogTitle>Editar Subasta</DialogTitle>
                                <DialogDescription>
                                  Modifica los datos de la subasta: {selectedAuction?.product_name}
                                </DialogDescription>
                              </DialogHeader>

                              <div className='space-y-6 py-4'>
                                <div className='space-y-2'>
                                  <Label className='text-sm font-medium text-[#3E2723]'>Precio Inicial *</Label>
                                  <Input
                                    type='number'
                                    value={editForm.initial_price}
                                    onChange={(e) => handleEditFormChange('initial_price', Number(e.target.value))}
                                    placeholder='50000'
                                    step='1000'
                                  />
                                </div>

                                <div className='space-y-2'>
                                  <Label className='text-sm font-medium text-[#3E2723]'>Incremento Mínimo *</Label>
                                  <Input
                                    type='number'
                                    value={editForm.minimum_increment}
                                    onChange={(e) => handleEditFormChange('minimum_increment', Number(e.target.value))}
                                    placeholder='1000'
                                    step='100'
                                  />
                                </div>

                                <div className='grid grid-cols-2 gap-4'>
                                  <div className='space-y-2'>
                                    <Label className='text-sm font-medium text-[#3E2723]'>Fecha de Inicio *</Label>
                                    <Input
                                      type='datetime-local'
                                      value={editForm.start_date}
                                      onChange={(e) => handleEditFormChange('start_date', e.target.value)}
                                    />
                                  </div>

                                  <div className='space-y-2'>
                                    <Label className='text-sm font-medium text-[#3E2723]'>Fecha de Fin *</Label>
                                    <Input
                                      type='datetime-local'
                                      value={editForm.end_date}
                                      onChange={(e) => handleEditFormChange('end_date', e.target.value)}
                                    />
                                  </div>
                                </div>

                                <div className='space-y-2'>
                                  <Label className='text-sm font-medium text-[#3E2723]'>Descripción</Label>
                                  <Textarea
                                    className='resize-none'
                                    value={editForm.description}
                                    onChange={(e) => handleEditFormChange('description', e.target.value)}
                                    placeholder='Descripción de la subasta...'
                                    rows={4}
                                  />
                                </div>

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
                                  onClick={handleSaveAuction}
                                  className='bg-[#33691E] hover:bg-[#1B5E20]'
                                  disabled={!hasChanges}
                                >
                                  Guardar Cambios
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}

                        {auction.auction_status === AUCTION_STATUS.ACTIVE && (
                          <>
                            <Button
                              variant='outline'
                              size='sm'
                              className='bg-red-600 text-white hover:bg-orange-50 '
                              onClick={() => setFinishConfirmOpen(auction)}
                            >
                              Finalizar
                            </Button>

                            <Dialog
                              open={finishConfirmOpen?.auction_id === auction.auction_id}
                              onOpenChange={() => setFinishConfirmOpen(false)}
                            >
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>¿Finalizar subasta?</DialogTitle>
                                  <DialogDescription>
                                    Se finalizará la subasta "{finishConfirmOpen?.product_name}". Esta acción no se
                                    puede revertir.
                                  </DialogDescription>
                                </DialogHeader>

                                <div className='flex justify-end gap-2'>
                                  <Button variant='outline' onClick={() => setFinishConfirmOpen(false)}>
                                    Cancelar
                                  </Button>
                                  <Button
                                    onClick={() => handleFinishAuction(finishConfirmOpen)}
                                    className='bg-orange-600 hover:bg-orange-700'
                                  >
                                    Confirmar Finalización
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </>
                        )}

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

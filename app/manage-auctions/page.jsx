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
import { Search, Eye, Gavel, Clock, CheckCircle, XCircle, AlertCircle, User, Package, DollarSign } from 'lucide-react'
import Loading from '@/components/Loading/Loading'
import { toastError } from '@/utils/toast'
import { Bounce, ToastContainer } from 'react-toastify'
import { formatPrice } from '@/utils/formatter'
import useStore from '@/store'
import { ROLES } from '@/utils/roles'
import Link from 'next/link'

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
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        const status = JSON.parse(window.localStorage.getItem('isLogged'))
        const role = status?.login?.role

        // Fetch auctions based on role
        const auctionsEndpoint = role === ROLES.ADMIN ? '/api/auctions' : '/api/auctions/mybrand'
        const response = await fetch(auctionsEndpoint, { credentials: 'include' })
        const data = await response.json()
        setAuctions(data)
        setFilteredAuctions(data)
      } catch (e) {
        console.log(e)
        toastError('Error al cargar subastas', 3000, Bounce)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  useEffect(() => {
    let filtered = auctions

    if (search) {
      filtered = filtered.filter(
        (a) =>
          a.product_name.toLowerCase().includes(search.toLowerCase()) ||
          a.seller_name.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((a) => a.status === statusFilter)
    }

    setFilteredAuctions(filtered)
  }, [search, statusFilter, auctions])

  const handleOpenDetail = (auction) => {
    setSelectedAuction(auction)
    setDetailDialogOpen(true)
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      [AUCTION_STATUS.ACTIVE]: {
        icon: <Clock className='h-3 w-3 mr-1' />,
        text: 'En Curso',
        className: 'bg-blue-100 text-blue-700 border-blue-200'
      },
      [AUCTION_STATUS.PENDING]: {
        icon: <AlertCircle className='h-3 w-3 mr-1' />,
        text: 'Pendiente',
        className: 'bg-yellow-100 text-yellow-700 border-yellow-200'
      },
      [AUCTION_STATUS.FINISHED]: {
        icon: <CheckCircle className='h-3 w-3 mr-1' />,
        text: 'Finalizada',
        className: 'bg-green-100 text-green-700 border-green-200'
      },
      [AUCTION_STATUS.CANCELLED]: {
        icon: <XCircle className='h-3 w-3 mr-1' />,
        text: 'Cancelada',
        className: 'bg-red-100 text-red-700 border-red-200'
      }
    }

    const config = statusConfig[status] || statusConfig[AUCTION_STATUS.PENDING]

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
          <div className='flex flex-wrap items-center gap-4'>
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
                <SelectItem value={AUCTION_STATUS.PENDING}>Pendiente</SelectItem>
                <SelectItem value={AUCTION_STATUS.FINISHED}>Finalizada</SelectItem>
                <SelectItem value={AUCTION_STATUS.CANCELLED}>Cancelada</SelectItem>
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
        </CardContent>
      </Card>

      {/* Auctions Table */}
      <Card className='bg-white/90 backdrop-blur-sm border-[#D7CCC8]'>
        <CardContent className='pt-6'>
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
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
                  <TableRow key={auction.id}>
                    <TableCell className='font-mono text-sm'>#{auction.id}</TableCell>
                    <TableCell>
                      <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 rounded-lg overflow-hidden bg-gray-100'>
                          <img
                            src={auction.product_image || '/placeholder.svg'}
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
                    <TableCell>{getStatusBadge(auction.status)}</TableCell>
                    <TableCell className='text-right'>
                      <div className='flex justify-end gap-2'>
                        <Dialog
                          open={detailDialogOpen && selectedAuction?.id === auction.id}
                          onOpenChange={setDetailDialogOpen}
                        >
                          <DialogTrigger asChild>
                            <Button variant='ghost' size='icon' onClick={() => handleOpenDetail(auction)}>
                              <Eye className='h-4 w-4' />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className='max-w-2xl'>
                            <DialogHeader>
                              <DialogTitle>Detalles de la Subasta #{selectedAuction?.id}</DialogTitle>
                              <DialogDescription>Información completa de la subasta</DialogDescription>
                            </DialogHeader>

                            {selectedAuction && (
                              <div className='space-y-6 py-4'>
                                {/* Producto */}
                                <div className='space-y-2'>
                                  <h3 className='text-sm font-semibold text-[#3E2723] flex items-center gap-2'>
                                    <Package className='h-4 w-4' />
                                    Producto
                                  </h3>
                                  <div className='flex items-center gap-4 p-4 bg-gray-50 rounded-lg'>
                                    <img
                                      src={selectedAuction.product_image || '/placeholder.svg'}
                                      alt={selectedAuction.product_name}
                                      className='w-16 h-16 rounded-lg object-cover'
                                    />
                                    <div>
                                      <p className='font-medium'>{selectedAuction.product_name}</p>
                                      <p className='text-sm text-[#5D4037]'>{selectedAuction.product_description}</p>
                                    </div>
                                  </div>
                                </div>

                                {/* Vendedor (solo para admin) */}
                                {login?.role === ROLES.ADMIN && (
                                  <div className='space-y-2'>
                                    <h3 className='text-sm font-semibold text-[#3E2723] flex items-center gap-2'>
                                      <User className='h-4 w-4' />
                                      Vendedor
                                    </h3>
                                    <div className='p-4 bg-gray-50 rounded-lg'>
                                      <p className='font-medium'>{selectedAuction.seller_name}</p>
                                      <p className='text-sm text-[#5D4037]'>{selectedAuction.seller_email}</p>
                                    </div>
                                  </div>
                                )}

                                {/* Información de Precios */}
                                <div className='grid grid-cols-2 gap-4'>
                                  <div className='space-y-2'>
                                    <h3 className='text-sm font-semibold text-[#3E2723] flex items-center gap-2'>
                                      <DollarSign className='h-4 w-4' />
                                      Precio Inicial
                                    </h3>
                                    <p className='text-2xl font-bold text-[#5D4037]'>
                                      {formatPrice(selectedAuction.initial_price)}
                                    </p>
                                  </div>

                                  <div className='space-y-2'>
                                    <h3 className='text-sm font-semibold text-[#3E2723] flex items-center gap-2'>
                                      <Gavel className='h-4 w-4' />
                                      Precio Actual
                                    </h3>
                                    <p className='text-2xl font-bold text-[#33691E]'>
                                      {formatPrice(selectedAuction.current_price)}
                                    </p>
                                  </div>
                                </div>

                                {/* Fechas */}
                                <div className='grid grid-cols-2 gap-4'>
                                  <div className='space-y-2'>
                                    <p className='text-sm font-semibold text-[#3E2723]'>Fecha de Inicio</p>
                                    <p className='text-sm text-[#5D4037]'>{formatDate(selectedAuction.start_date)}</p>
                                  </div>
                                  <div className='space-y-2'>
                                    <p className='text-sm font-semibold text-[#3E2723]'>Fecha de Finalización</p>
                                    <p className='text-sm text-[#5D4037]'>{formatDate(selectedAuction.end_date)}</p>
                                  </div>
                                </div>

                                {/* Estado y Pujas */}
                                <div className='grid grid-cols-2 gap-4'>
                                  <div className='space-y-2'>
                                    <p className='text-sm font-semibold text-[#3E2723]'>Estado</p>
                                    {getStatusBadge(selectedAuction.status)}
                                  </div>
                                  <div className='space-y-2'>
                                    <p className='text-sm font-semibold text-[#3E2723]'>Total de Pujas</p>
                                    <Badge variant='outline' className='bg-gray-50 text-lg'>
                                      <Gavel className='h-4 w-4 mr-1' />
                                      {selectedAuction.bid_count || 0} pujas
                                    </Badge>
                                  </div>
                                </div>

                                {/* Ganador (si está finalizada) */}
                                {selectedAuction.status === AUCTION_STATUS.FINISHED && selectedAuction.winner_name && (
                                  <div className='space-y-2'>
                                    <h3 className='text-sm font-semibold text-[#3E2723] flex items-center gap-2'>
                                      <CheckCircle className='h-4 w-4 text-green-600' />
                                      Ganador
                                    </h3>
                                    <div className='p-4 bg-green-50 border border-green-200 rounded-lg'>
                                      <p className='font-medium text-green-900'>{selectedAuction.winner_name}</p>
                                      <p className='text-sm text-green-700'>
                                        Precio final: {formatPrice(selectedAuction.current_price)}
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            <div className='flex justify-end gap-2'>
                              <Button variant='outline' onClick={() => setDetailDialogOpen(false)}>
                                Cerrar
                              </Button>
                              <Link href={`/auctions/${selectedAuction?.id}`}>
                                <Button className='bg-[#33691E] hover:bg-[#1B5E20]'>Ver Subasta Completa</Button>
                              </Link>
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

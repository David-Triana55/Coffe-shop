'use client'
import { Coffee, DollarSign, Gavel, Clock, Bell } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { useEffect, useState } from 'react'

export default function AuctionDashboard () {
  const [name, setName] = useState('')
  useEffect(() => {
    const { state } = JSON.parse(window.localStorage.getItem('isLogged'))
    setName(state?.clientInfo?.data?.name)
  }, [])

  const auctionData = {
    totalEarnings: 28750.00,
    activeAuctions: 12,
    completedAuctions: 45,
    successRate: 78
  }

  const activeAuctions = [
    {
      id: 'AUC-001',
      product: 'Café Colombiano Premium',
      minPrice: 15.99,
      currentBid: 18.50,
      timeLeft: '2h 15m',
      bids: 8,
      status: 'Activa'
    },
    {
      id: 'AUC-002',
      product: 'Café Etíope Yirgacheffe',
      minPrice: 18.99,
      currentBid: 22.00,
      timeLeft: '45m',
      bids: 12,
      status: 'Activa'
    },
    {
      id: 'AUC-003',
      product: 'Mezcla Especial',
      minPrice: 12.50,
      currentBid: 12.50,
      timeLeft: '1h 30m',
      bids: 1,
      status: 'Activa'
    },
    {
      id: 'AUC-004',
      product: 'Café Descafeinado',
      minPrice: 14.99,
      currentBid: 16.75,
      timeLeft: '3h 20m',
      bids: 5,
      status: 'Activa'
    }
  ]

  const recentCompletedAuctions = [
    {
      id: 'AUC-098',
      product: 'Café Orgánico',
      minPrice: 16.00,
      finalPrice: 19.50,
      buyer: 'Tostadores Unidos',
      status: 'Vendida'
    },
    {
      id: 'AUC-097',
      product: 'Café Arábica Especial',
      minPrice: 20.00,
      finalPrice: 0,
      buyer: '-',
      status: 'Sin ofertas'
    },
    {
      id: 'AUC-096',
      product: 'Café de Altura',
      minPrice: 17.50,
      finalPrice: 21.25,
      buyer: 'Café Central',
      status: 'Vendida'
    },
    {
      id: 'AUC-095',
      product: 'Café Tostado Medio',
      minPrice: 13.99,
      finalPrice: 15.80,
      buyer: 'Barista Pro',
      status: 'Vendida'
    }
  ]

  return (
    <div className='min-h-screen bg-[#D7CCC8] text-[#3E2723]'>
      <header className='bg-[#3E2723] text-white p-4'>
        <div className='container mx-auto flex justify-between items-center'>
          <div className='flex items-center space-x-4'>
            <Coffee className='h-8 w-8' />
            <h1 className='text-2xl font-bold'>Dashboard Subastas</h1>
          </div>
          <div className='flex items-center space-x-4'>
            <Bell className='h-6 w-6 cursor-pointer' />
            <div className='flex items-center space-x-2'>
              <div className='w-8 h-8 bg-[#D7CCC8] rounded-full flex items-center justify-center'>
                <span className='text-[#3E2723] font-bold'>{name}</span>
              </div>
              <span>{name}</span>
            </div>
          </div>
        </div>
      </header>

      <main className='container mx-auto p-4'>
        <div className='mb-6'>
          <h2 className='text-3xl font-bold mb-2'>Bienvenido, {name}</h2>
          <p className='text-lg'>Gestiona tus subastas de café y maximiza tus ganancias</p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Ganancias Totales</CardTitle>
              <DollarSign className='h-4 w-4 text-[#33691E]' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>${auctionData.totalEarnings.toLocaleString()}</div>
              <p className='text-xs text-muted-foreground'>
                De subastas completadas
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Subastas Activas</CardTitle>
              <Gavel className='h-4 w-4 text-[#33691E]' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{auctionData.activeAuctions}</div>
              <p className='text-xs text-muted-foreground'>
                En curso ahora
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Subastas Completadas</CardTitle>
              <Clock className='h-4 w-4 text-[#33691E]' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{auctionData.completedAuctions}</div>
              <p className='text-xs text-muted-foreground'>
                Este mes
              </p>
            </CardContent>
          </Card>

        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
          <Card>
            <CardHeader>
              <CardTitle>Subastas Activas</CardTitle>
              <CardDescription>Subastas en curso con ofertas activas</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead>Oferta Actual</TableHead>
                    <TableHead>Tiempo Restante</TableHead>
                    <TableHead>Ofertas</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeAuctions.map((auction) => (
                    <TableRow key={auction.id}>
                      <TableCell className='font-medium'>{auction.product}</TableCell>
                      <TableCell>${auction.currentBid.toFixed(2)}</TableCell>
                      <TableCell>{auction.timeLeft}</TableCell>
                      <TableCell>{auction.bids}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Subastas Recientes</CardTitle>
              <CardDescription>Últimas subastas completadas</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead>Precio Final</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentCompletedAuctions.map((auction) => (
                    <TableRow key={auction.id}>
                      <TableCell className='font-medium'>{auction.product}</TableCell>
                      <TableCell>
                        {auction.finalPrice > 0 ? `$${auction.finalPrice.toFixed(2)}` : '-'}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={auction.status === 'Vendida' ? 'default' : 'destructive'}
                        >
                          {auction.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

      </main>

    </div>
  )
}

/* eslint-disable @next/next/no-img-element */
'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Loading from '@/components/Loading/Loading'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Building, Gavel, TrendingUp, User, ChevronLeft, ChevronRight, Clock, AlertTriangle, Check } from 'lucide-react'
import { formatPrice } from '@/utils/formatter'
import { toastError, toastSuccess } from '@/utils/toast'
import { Bounce, ToastContainer } from 'react-toastify'
import { CONSTANTS } from '@/utils/constants'
import useStore from '@/store'

export default function AuctionDetailPage () {
  const { login } = useStore((state) => state)
  const params = useParams()
  const router = useRouter()
  const [auction, setAuction] = useState(null)
  const [bids, setBids] = useState([])
  const [bidAmount, setBidAmount] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState('')
  const [bidError, setBidError] = useState('')
  const [bidSuccess, setBidSuccess] = useState(false)

  // Función para cargar los datos de la subasta
  const fetchAuctionData = async () => {
    try {
      const [auctionRes, bidsRes] = await Promise.all([
        fetch(`/api/auctions/${params.id}`, { cache: 'no-cache' }),
        fetch(`/api/auctions/bids/${params.id}`, { cache: 'no-store' })
      ])

      const auctionData = await auctionRes.json()
      const bidsData = await bidsRes.json()

      setAuction(auctionData?.auction)
      setBids(bidsData?.bids)

      console.log(auctionData.auction.current_price, 'auctions')
      console.log(bidsData.bids, 'bids')

      const currentPrice = Number(auctionData?.auction?.current_price) || Number(auction?.auction?.initial_price)
      const minimumIncrement = Number(auctionData?.auction?.minimum_increment)
      const minBid = currentPrice + minimumIncrement

      setBidAmount(minBid)

      if (bidsData?.bids && bidsData.bids.length > 0) {
        const highestBid = Math.max(...bidsData.bids.map((bid) => Number(bid.amount) || 0))
        if (auctionData?.auction) {
          auctionData.auction.current_price = highestBid
          setAuction({ ...auctionData.auction, current_price: highestBid })
        }
      }
    } catch (error) {
      console.error('Error fetching auction:', error)
      toastError('Error al cargar la subasta', 3000, Bounce)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await fetchAuctionData()
      setLoading(false)
    }

    loadData()

    const interval = setInterval(() => {
      fetchAuctionData()
    }, 5000)

    return () => clearInterval(interval)
  }, [params.id])

  useEffect(() => {
    if (!auction) return

    const calculateTimeLeft = () => {
    // Convertimos ambas fechas a timestamps (ms)
      const now = new Date().getTime()

      // Ajuste para compensar zona horaria (UTC → local)
      const endDate = new Date(auction.end_date)
      const offset = endDate.getTimezoneOffset() * 60000 // minutos → ms
      const adjustedEnd = new Date(endDate.getTime() + offset).getTime()

      const diff = adjustedEnd - now

      if (diff <= 0) {
        setTimeLeft('Subasta finalizada')
        return
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h ${minutes}m`)
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`)
      } else {
        setTimeLeft(`${minutes}m ${seconds}s`)
      }
    }

    calculateTimeLeft()
    const interval = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(interval)
  }, [auction])

  const validateBid = (amount) => {
    const currentPrice = Number(auction?.current_price) || Number(auction?.initial_price) || 0
    const minimumIncrement = Number(auction?.minimum_increment) || 0
    const minBid = currentPrice + minimumIncrement

    if (isNaN(amount) || amount < minBid) {
      setBidError(`La puja mínima debe ser ${formatPrice(minBid)}`)
      return false
    }

    setBidError('')
    return true
  }

  const handlePlaceBid = async (e) => {
    e.preventDefault()
    if (login.isLogged === false) {
      router.push('/Sign-in')
      return
    }
    const amount = Number.parseFloat(bidAmount)

    if (!validateBid(amount)) return

    setSubmitting(true)
    setBidError('')

    try {
      const response = await fetch(`/api/auctions/bids/${params.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ auctionId: params.id, amount })
      })

      const data = await response.json()

      if (response.ok) {
        // Mostrar mensaje de éxito
        toastSuccess('¡Puja realizada exitosamente!', 3000, Bounce)
        setBidSuccess(true)

        // Recargar los datos completos desde la base de datos
        await fetchAuctionData()

        // Ocultar mensaje de éxito después de 2 segundos
        setTimeout(() => setBidSuccess(false), 2000)
      } else {
        toastError(data.message || 'Error al realizar la puja', 3000, Bounce)
        setBidError(data.message || 'Error al realizar la puja')
      }
    } catch (error) {
      console.error('Error al realizar puja:', error)
      toastError('Error al realizar la puja', 3000, Bounce)
      setBidError('Error al realizar la puja')
    } finally {
      setSubmitting(false)
    }
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % (auction?.product_images?.length || 1))
  }

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + (auction?.product_images?.length || 1)) % (auction?.product_images?.length || 1)
    )
  }

  if (loading) return <Loading />

  if (!auction) {
    return (
      <div className='min-h-screen bg-[#D7CCC8] flex items-center justify-center pt-20'>
        <Card className='p-8 text-center'>
          <h2 className='text-2xl font-bold text-[#3E2723]'>Subasta no encontrada</h2>
        </Card>
      </div>
    )
  }

  // Asegurar que currentBid siempre sea un número válido
  const currentBid = Number(auction?.current_price) || Number(auction?.initial_price) || 0
  const minimumIncrement = Number(auction?.minimum_increment) || 0
  const images = auction?.product_images || []

  return (
    <div className='min-h-screen bg-gradient-to-br from-[#D7CCC8] to-[#EFEBE9] pt-20 pb-12'>
      <div className='container mx-auto px-4'>
        {/* Back Button */}
        <Button variant='ghost' onClick={() => router.back()} className='mb-6 text-[#3E2723] hover:bg-[#D7CCC8]/30'>
          <ChevronLeft className='w-4 h-4 mr-2' />
          Volver
        </Button>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto'>
          {/* Image Gallery */}
          <div className='space-y-4'>
            <Card className='overflow-hidden bg-white/90 backdrop-blur-sm border-0 shadow-xl'>
              <CardContent className='p-0 relative'>
                <div className='aspect-square relative bg-gradient-to-br from-gray-50 to-gray-100'>
                  {images.length > 0 && (
                    <img
                      src={images[currentImageIndex] || CONSTANTS.IMAGE_PLACEHOLDER}
                      alt={`${auction.product_name} - Imagen ${currentImageIndex + 1}`}
                      className='w-full h-full object-cover'
                    />
                  )}

                  {/* Navigation Arrows */}
                  {images.length > 1 && (
                    <>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={prevImage}
                        className='absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-lg'
                      >
                        <ChevronLeft className='w-5 h-5' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={nextImage}
                        className='absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-lg'
                      >
                        <ChevronRight className='w-5 h-5' />
                      </Button>
                    </>
                  )}

                  {/* Image Counter */}
                  {images.length > 1 && (
                    <div className='absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm'>
                      {currentImageIndex + 1} / {images.length}
                    </div>
                  )}

                  {/* Time Left Badge */}
                  <div className='absolute top-4 left-4 bg-black/70 text-white px-3 py-2 rounded-lg flex items-center gap-2'>
                    <Clock className='h-4 w-4' />
                    <span className='font-semibold'>{timeLeft}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Thumbnail Navigation */}
            {images.length > 1 && (
              <div className='flex gap-2 overflow-x-auto pb-2'>
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      currentImageIndex === index
                        ? 'border-[#33691E] shadow-lg'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image || CONSTANTS.IMAGE_PLACEHOLDER}
                      alt={`Thumbnail ${index + 1}`}
                      className='w-full h-full object-cover'
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Auction Info */}
          <div className='space-y-6'>
            <Card className='bg-white/90 backdrop-blur-sm border-0 shadow-xl'>
              <CardContent className='p-8'>
                {/* Brand Badge */}
                {auction?.brand_name && (
                  <Badge className='mb-4 bg-[#33691E] text-white'>
                    <Building className='h-3 w-3 mr-1' />
                    {auction.brand_name}
                  </Badge>
                )}

                {/* Product Title */}
                <h1 className='text-4xl font-bold text-[#3E2723] mb-4 leading-tight'>{auction?.product_name}</h1>

                {/* Current Bid */}
                <div className='mb-6'>
                  <p className='text-sm text-[#5D4037] mb-2'>Puja Actual</p>
                  <span className='text-4xl font-bold text-[#33691E]'>{formatPrice(currentBid)}</span>
                </div>

                {/* Bid Stats */}
                <div className='grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-[#D7CCC8]'>
                  <div className='flex items-center text-[#5D4037]'>
                    <Gavel className='w-4 h-4 mr-2 text-[#33691E]' />
                    <span className='text-sm'>{bids.length} pujas</span>
                  </div>
                  <div className='flex items-center text-[#5D4037]'>
                    <TrendingUp className='w-4 w-4 mr-2 text-[#33691E]' />
                    <span className='text-sm'>Min: {formatPrice(minimumIncrement)}</span>
                  </div>
                </div>

                {/* Bid Error Alert */}
                {bidError && (
                  <Alert className='mb-6 border-red-200 bg-red-50'>
                    <AlertTriangle className='h-4 w-4 text-red-600' />
                    <AlertDescription className='text-red-700'>{bidError}</AlertDescription>
                  </Alert>
                )}

                {/* Success Message */}
                {bidSuccess && (
                  <Alert className='mb-6 border-green-200 bg-green-50'>
                    <Check className='h-4 w-4 text-green-600' />
                    <AlertDescription className='text-green-700'>¡Puja realizada exitosamente!</AlertDescription>
                  </Alert>
                )}

                {/* Bid Form */}
                <form onSubmit={handlePlaceBid} className='space-y-4'>
                  <div>
                    <label className='text-sm font-medium text-[#3E2723] mb-2 block'>Tu Puja</label>
                    <Input
                      type='number'
                      value={bidAmount}
                      onChange={(e) => {
                        setBidAmount(e.target.value)
                        const value = Number.parseFloat(e.target.value)
                        if (!isNaN(value)) {
                          validateBid(value)
                        }
                      }}
                      min={currentBid + minimumIncrement}
                      step={minimumIncrement}
                      className='text-lg h-14'
                      placeholder={formatPrice(auction + minimumIncrement)}
                    />
                    <p className='text-xs text-[#5D4037] mt-1'>
                      Puja mínima: {formatPrice(currentBid + minimumIncrement)}
                    </p>
                  </div>

                  <Button
                    type='submit'
                    disabled={
                      submitting ||
                      !!bidError ||
                      timeLeft.toLowerCase().includes('finalizada')
                    }
                    className='w-full h-14 text-lg font-semibold bg-[#33691E] hover:bg-[#1B5E20] text-white transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
                  >
                    <Gavel className='w-5 h-5 mr-2' />
                    {submitting ? 'Pujando...' : 'Realizar Puja'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Description Card */}
            {auction?.product_description && (
              <Card className='bg-white/90 backdrop-blur-sm border-0 shadow-xl'>
                <CardHeader>
                  <CardTitle className='text-xl text-[#3E2723]'>Descripción</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-[#5D4037] leading-relaxed'>
                    {auction.product_description || 'Sin descripción disponible'}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Bid History */}
        <Card className='mt-12 bg-white/90 backdrop-blur-sm border-0 shadow-xl max-w-7xl mx-auto'>
          <CardHeader>
            <CardTitle className='flex items-center text-2xl text-[#3E2723]'>
              <Gavel className='h-6 w-6 mr-2 text-[#33691E]' />
              Historial de Pujas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {bids.length === 0
              ? (
              <div className='text-center py-12'>
                <Gavel className='h-16 w-16 text-[#8D6E63] mx-auto mb-4' />
                <p className='text-[#5D4037] text-lg'>No hay pujas aún. ¡Sé el primero en pujar!</p>
              </div>
                )
              : (
              <div className='space-y-2'>
                {bids.map((bid, index) => (
                  <div
                    key={bid?.id || index}
                    className={`flex justify-between items-center p-4 rounded-lg transition-all ${
                      index === 0 ? 'bg-[#33691E]/10 border-2 border-[#33691E]' : 'bg-[#EFEBE9]'
                    }`}
                  >
                    <div className='flex items-center gap-3'>
                      <div className='bg-[#D7CCC8] p-2 rounded-full'>
                        <User className='h-4 w-4 text-[#5D4037]' />
                      </div>
                      <div>
                        <span className='font-medium text-[#3E2723]'>{bid?.user_name || 'Usuario'}</span>
                        {index === 0 && <Badge className='ml-2 bg-[#33691E] text-white text-xs'>Puja más alta</Badge>}
                        <p className='text-xs text-[#5D4037]'>
                          {bid?.date ? new Date(bid.date).toLocaleString() : 'Fecha no disponible'}
                        </p>
                      </div>
                    </div>
                    <span className='font-bold text-[#33691E] text-xl'>{formatPrice(Number(bid?.amount) || 0)}</span>
                  </div>
                ))}
              </div>
                )}
          </CardContent>
        </Card>
      </div>

      <ToastContainer
        position='bottom-right'
        autoClose={5000}
        hideProgressBar
        closeOnClick
        pauseOnHover
        theme='dark'
        transition={Bounce}
      />
    </div>
  )
}

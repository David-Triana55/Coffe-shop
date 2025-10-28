'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Clock, Gavel } from 'lucide-react'
import { formatPrice } from '@/utils/formatter'
import { Badge } from '@/components/ui/badge'
import './CardAuction.css'

export default function CardAuction ({ auction }) {
  console.log(auction)
  const router = useRouter()
  const [timeRemaining, setTimeRemaining] = useState('')
  const [updatedAuction, setUpdatedAuction] = useState(auction)

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = Date.now()
      const endDate = new Date(updatedAuction.end_date).getTime()
      const diff = endDate - now

      if (diff <= 1000) {
        setTimeRemaining('Finalizada')
        return
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

      if (days > 0) {
        setTimeRemaining(`${days}d ${hours}h`)
      } else if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}m`)
      } else {
        setTimeRemaining(`${minutes}m`)
      }
    }

    calculateTimeRemaining()
    const interval = setInterval(calculateTimeRemaining, 60000)

    return () => clearInterval(interval)
  }, [updatedAuction.end_date])

  useEffect(() => {
    const fetchAuction = async () => {
      try {
        const res = await fetch(`/api/auctions/${auction.auction_id}`)
        if (res.ok) {
          const data = await res.json()
          console.log(data.auction, 'data')
          setUpdatedAuction(data.auction)
        }
      } catch (error) {
        console.error('Error actualizando subasta:', error)
      }
    }

    // Hacer la primera carga inmediata
    fetchAuction()

    // Refrescar cada 10 segundos
    const interval = setInterval(fetchAuction, 10000)

    return () => clearInterval(interval)
  }, [auction.auction_id])

  const getStatusBadge = () => {
    const now = new Date()
    const startDate = new Date(updatedAuction.start_date)
    const endDate = new Date(updatedAuction.end_date)

    if (now < startDate) {
      return 'upcoming'
    } else if (now > endDate) {
      return 'finished'
    } else if (endDate - now < 24 * 60 * 60 * 1000) {
      return 'ending-soon'
    } else {
      return 'active'
    }
  }

  const handleAuctionClick = () => {
    router.push(`/Subastas/${updatedAuction.auction_id}`)
  }

  const currentBid = updatedAuction.current_price || updatedAuction.initial_price
  const totalBids = updatedAuction.bid_count || 0
  const status = getStatusBadge()

  return (
    <div className='card_auction__content'>
      <span className='card_auction__status'>
        {status === 'upcoming' && <Badge className='bg-blue-500 text-white'>Próxima</Badge>}
        {status === 'finished' && <Badge className='bg-gray-500 text-white'>Finalizada</Badge>}
        {status === 'ending-soon' && <Badge className='bg-red-500 text-white animate-pulse'>¡Por Finalizar!</Badge>}
        {status === 'active' && <Badge className='bg-green-500 text-white'>Activa</Badge>}
      </span>

      <div className='card_auction__image' onClick={handleAuctionClick}>
        <img
          alt={updatedAuction.product_name}
          src={updatedAuction.product_images?.[0] || '/placeholder.svg'}
        />
        <div className='card_auction__timer'>
          <Clock className='h-4 w-4' />
          <span>{timeRemaining}</span>
        </div>
      </div>

      <h1 className='card_auction__title'>{updatedAuction.product_name}</h1>

      <div className='card_auction__info'>
        <div className='card_auction__bid'>
          <span className='card_auction__label'>Puja actual:</span>
          <span className='card_auction__price'>{formatPrice(currentBid)}</span>
        </div>

        <div className='card_auction__stats'>
          <div className='card_auction__stat'>
            <Gavel className='h-3 w-3' />
            <span>
              {totalBids} puja{totalBids !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

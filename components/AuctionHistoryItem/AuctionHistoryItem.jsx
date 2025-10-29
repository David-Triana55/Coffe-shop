'use client'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, DollarSign, CreditCard, Gavel } from 'lucide-react'
import { formatPrice } from '@/utils/formatter'
import { useState } from 'react'
import { toastError, toastSuccess } from '@/utils/toast'
import { Bounce } from 'react-toastify'

export default function AuctionHistoryItem ({
  auctionId,
  productId,
  productName,
  productImage,
  finalPrice,
  bidDate,
  paymentStatus
}) {
  const [processing, setProcessing] = useState(false)

  const handlePayment = async () => {
    setProcessing(true)
    try {
      const response = await fetch('/api/payments/create-preference-auction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          id: productId,
          auctionId,
          title: productName,
          unitPrice: finalPrice
        })
      })

      const data = await response.json()

      if (data.init_point) {
        toastSuccess('Redirigiendo a la pasarela de pago...', 2000, Bounce)
        window.location.href = data.init_point
      } else {
        toastError(data.message || 'Error al procesar el pago', 3000, Bounce)
      }
    } catch (error) {
      console.error('Error creating payment preference:', error)
      toastError('Error al procesar el pago', 3000, Bounce)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <Card className='overflow-hidden hover:shadow-lg transition-all duration-300 border-[#D2B48C]/30'>
      <CardContent className='p-0'>
        <div className='flex flex-col sm:flex-row gap-4 p-4'>
          {/* Product Image */}
          <div className='flex-shrink-0'>
            <img
              src={productImage[0] || '/placeholder.svg?height=100&width=100'}
              alt={productName}
              className='w-24 h-24 object-cover rounded-lg border-2 border-[#D2B48C]/20'
            />
          </div>

          {/* Auction Info */}
          <div className='flex-1 space-y-2'>
            <div className='flex items-start justify-between gap-2'>
              <h3 className='font-semibold text-[#3E2723] text-lg line-clamp-2'>{productName}</h3>
              <Badge
                className={
                  paymentStatus === 'paid'
                    ? 'bg-green-100 text-green-800 border-green-200'
                    : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                }
              >
                {paymentStatus === 'paid' ? 'Pagado' : 'Pendiente por pagar'}
              </Badge>
            </div>

            <div className='flex flex-wrap gap-4 text-sm text-[#5D4037]'>
              <div className='flex items-center gap-1'>
                <DollarSign className='h-4 w-4 text-[#33691E]' />
                <span className='font-semibold'>{formatPrice(finalPrice)}</span>
              </div>
              <div className='flex items-center gap-1'>
                <Calendar className='h-4 w-4 text-[#8D6E63]' />
                <span>{new Date(bidDate).toLocaleDateString()}</span>
              </div>
              <div className='flex items-center gap-1'>
                <Gavel className='h-4 w-4 text-[#33691E]' />
                <span className='text-[#33691E]'>¡Subasta Ganada!</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className='flex gap-2 pt-2'>
              {paymentStatus === 'pending' &&
                (
                <Button
                  onClick={handlePayment}
                  disabled={processing}
                  size='sm'
                  className='bg-[#33691E] hover:bg-[#1B5E20] text-white'
                >
                  <CreditCard className='h-4 w-4 mr-2' />
                  {processing ? 'Procesando...' : 'Pagar Ahora'}
                </Button>
                )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

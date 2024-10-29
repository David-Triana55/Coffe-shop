'use client'

import useStore from '@/store'
import { useEffect } from 'react'

export default function SendBill () {
  const { bill, login } = useStore((state) => state)
  console.log(bill)
  console.log(login)

  useEffect(() => {
    const SendBill = async () => {
      try {
        const response = await fetch('/api/bill', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${login.token}`
          },
          body: JSON.stringify(bill)
        })

        if (!response.ok) {
          throw new Error('Error al enviar el bill')
        }
      } catch (error) {
        console.error(error)
      }
    }
    SendBill()
  }, [bill, login.token])
  return (
    <div className='flex justify-center items-center h-screen'>
      <div className='animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900' />
      {bill?.length > 0 && <p className='text-lg'>Enviando el bill...</p>}
    </div>
  )
}

'use client'

import useStore from '@/store'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Counter () {
  const [count, setCount] = useState(10)
  const { cleanCart } = useStore(state => state)
  const router = useRouter()

  useEffect(() => {
    const timer = setInterval(() => {
      setCount(prevCount => {
        if (prevCount <= 1) {
          clearInterval(timer)
          return 0
        }
        return prevCount - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (count === 0) {
      cleanCart()
      router.push('/Profile')
    }
  }, [count, cleanCart, router])

  return (
    <div className='z-50 flex items-center mx-auto justify-center max-w-4xl h-16 bg-white rounded-full border-2 border-black'>
      {count > 0 && (<p>Redirigiendo en {count} segundos...</p>)}
    </div>
  )
}

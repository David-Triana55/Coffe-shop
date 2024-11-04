'use client'

import useStore from '@/store'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Counter () {
  const [count, setCount] = useState(10)
  const { cleanCart } = useStore(state => state)
  const router = useRouter()

  useEffect(() => {
    // Iniciar el contador regresivo
    const timer = setInterval(() => {
      setCount(prevCount => {
        if (prevCount <= 1) {
          clearInterval(timer) // Detener el temporizador al llegar a 0
          return 0
        }
        return prevCount - 1
      })
    }, 1000) // Disminuye el contador cada segundo (1000 ms)

    return () => clearInterval(timer) // Limpiar el intervalo al desmontar
  }, [])

  // Redirigir cuando el contador llega a 0
  useEffect(() => {
    if (count === 0) {
      cleanCart() // Limpiar el carrito
      router.push('/') // Redirigir a la página principal
    }
  }, [count, cleanCart, router]) // Dependencias del efecto

  return (
    <div className='z-50 flex items-center mx-auto justify-center max-w-4xl h-16 bg-white rounded-full border-2 border-black'>
      {count > 0 && (<p>Redirigiendo en {count} segundos...</p>)}
    </div>
  )
}

'use client'
import Form from '@/components/Form/Form'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function PageSignIn () {
  const router = useRouter()
  useEffect(() => {
    const { state } = JSON.parse(window.localStorage.getItem('isLogged'))

    if (state?.login?.isLogged && state?.login?.type === 'cliente') {
      router.push('/')
    }

    if (state?.login?.isLogged && state?.login?.type === 'vendedor') {
      router.push('/dashboard')
    }
  }, [])
  return (
    <section className='flex min-h-screen flex-col items-center justify-center overflow-y-hidden bg-background '>
      <Form type='login' />
    </section>
  )
}

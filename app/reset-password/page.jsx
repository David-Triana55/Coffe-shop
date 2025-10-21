'use client'
import '../../components/Form/Form.css'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Mail, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ResetPasswordPage () {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/recovery-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      if (!res.ok) {
        throw new Error('No se pudo generar el enlace de recuperación')
      }

      const data = await res.json()
      console.log(data)
      setSuccess(true)
      // redirect con token después de 2 segundos
      setTimeout(() => {
        router.push(`/reset-password/${data.resetToken}`)
      }, 2000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className='form-content flex-1'>
          <div className='max-w-md w-full space-y-8'>
            <div className='bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 text-center'>
              <div className='mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6'>
                <Mail className='h-8 w-8 text-green-600' />
              </div>
              <h2 className='text-2xl font-bold text-[#4A3728] mb-4'>¡Redirigiendo!</h2>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-[#4A3728] mx-auto' />
              <p className='text-sm text-[#8D6E63] mt-4'>Redirigiendo...</p>
            </div>
          </div>
        </div>
    )
  }

  return (

      <div className='form-content flex-1'>
        <div className='shadow-none w-96 p-7 md:shadow-xl rounded-lg '>
            {/* Header */}
            <div className='text-center mb-2'>
              <div className='mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-[#D2B48C]/20 mb-2'>
                <Image width={40} height={40} alt='Coffee Shop Logo' src='/logoDark.svg' className='h-10 w-10' />
              </div>
              <h2 className='text-3xl font-bold text-[#4A3728] mb-2'>Recuperar contraseña</h2>
              <p className='text-[#5D4037] text-sm'>
                Ingresa tu correo electrónico y te redigiremos para restablecer tu contraseña
              </p>

            {/* Form */}
            <div className='mt-2 sm:mx-auto sm:w-full sm:max-w-sm'>
              <form onSubmit={handleSubmit} className='space-y-6'>
                <div>
                  <label htmlFor='email' className='block text-sm font-medium text-[#4A3728] mb-2'>
                    Correo electrónico
                  </label>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                      <Mail className='h-5 w-5 text-[#8D6E63]' />
                    </div>
                    <input
                      id='email'
                      name='email'
                      type='email'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder='ejemplo@correo.com'
                      required
                      className='block w-full pl-10 pr-3 py-3 border border-[#D2B48C]/30 rounded-xl text-[#4A3728] placeholder-[#8D6E63]/60 focus:outline-none focus:ring-2 focus:ring-[#D2B48C] focus:border-transparent transition-all duration-200 bg-white/80'
                    />
                  </div>
                </div>

                <button
                  type='submit'
                  disabled={loading}
                  className='group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-[#4A3728] hover:bg-[#5D4037] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D2B48C] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]'
                >
                  {loading
                    ? (
                    <div className='flex items-center'>
                      <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2' />
                      Redirigiendo...
                    </div>
                      )
                    : (
                        'Enviar'
                      )}
                </button>
              </form>
            </div>

            {/* Error Message */}
            {error && (
              <div className='mt-4 p-4 bg-red-50 border border-red-200 rounded-xl'>
                <p className='text-red-600 text-sm text-center'>{error}</p>
              </div>
            )}

            {/* Back to Login */}
            <div className='mt-4 text-center'>
              <Link
                href='/Sign-in'
                className='inline-flex items-center text-sm font-medium text-[#D2B48C] hover:text-[#4A3728] transition-colors duration-200'
              >
                <ArrowLeft className='h-4 w-4 mr-2' />
                Volver al inicio de sesión
              </Link>
            </div>

            {/* Additional Help */}
            <div className='mt-2 pt-6 border-t border-[#D2B48C]/20'>
              <p className='text-xs text-[#8D6E63] text-center'>
                ¿No tienes cuenta?{' '}
                <Link href='/Sign-up' className='font-medium text-[#D2B48C] hover:text-[#4A3728] transition-colors'>
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </div>

        </div>
      </div>

  )
}

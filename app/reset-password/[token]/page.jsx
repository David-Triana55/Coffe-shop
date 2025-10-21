'use client'
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Lock, Eye, EyeOff, ArrowLeft, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import '../../../components/Form/Form.css'

export default function ResetPasswordTokenPage () {
  const { token } = useParams()
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})

  const validatePassword = (password) => {
    const errors = {}

    if (password.length < 8) {
      errors.password = 'La contraseña debe tener al menos 8 caracteres'
    } else if (password.length > 100) {
      errors.password = 'La contraseña no puede exceder 100 caracteres'
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      errors.password = 'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
    }

    if (confirmPassword && password !== confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden'
    }

    return errors
  }

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value
    setPassword(newPassword)

    const errors = validatePassword(newPassword)
    setValidationErrors(errors)
  }

  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value
    setConfirmPassword(newConfirmPassword)

    if (password !== newConfirmPassword) {
      setValidationErrors((prev) => ({
        ...prev,
        confirmPassword: 'Las contraseñas no coinciden'
      }))
    } else {
      setValidationErrors((prev) => {
        const { confirmPassword, ...rest } = prev
        return rest
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Validar antes de enviar
    const errors = validatePassword(password)
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || 'Token inválido o expirado')
      }

      setSuccess(true)

      // Redirigir después de mostrar éxito
      setTimeout(() => {
        router.push('/Sign-in')
      }, 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Pantalla de éxito
  if (success) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-[#D2B48C]/20 via-white to-[#D2B48C]/10 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
        <div className='form-content flex-1'>
          <div className='max-w-md w-full space-y-8'>
            <div className='bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 text-center border border-[#D2B48C]/20'>
              <div className='mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6'>
                <CheckCircle className='h-8 w-8 text-green-600' />
              </div>
              <h2 className='text-2xl font-bold text-[#4A3728] mb-4'>¡Contraseña actualizada!</h2>
              <p className='text-[#5D4037] mb-6'>
                Tu contraseña ha sido cambiada exitosamente. Serás redirigido al inicio de sesión.
              </p>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-[#4A3728] mx-auto' />
              <p className='text-sm text-[#8D6E63] mt-4'>Redirigiendo en 3 segundos...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='form-content'>
        <div className='shadow-none w-96 p-7 md:shadow-xl rounded-lg'>
          {/* Header */}
          <div className='text-center mb-2'>
            <div className='mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-[#D2B48C]/20 mb-2'>
              <Image width={40} height={40} alt='Coffee Shop Logo' src='/logoDark.svg' className='h-10 w-10' />
            </div>
            <h2 className='text-3xl font-bold text-[#4A3728] mb-2'>Nueva contraseña</h2>
            <p className='text-[#5D4037] text-sm'>
              Ingresa tu nueva contraseña para completar el proceso de recuperación
            </p>
          </div>

          {/* Form */}
          <div className='mt-2 sm:mx-auto sm:w-full sm:max-w-sm'>
            <form onSubmit={handleSubmit} className='space-y-6'>
              {/* Nueva contraseña */}
              <div>
                <label htmlFor='password' className='block text-sm font-medium text-[#4A3728] mb-2'>
                  Nueva contraseña *
                </label>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <Lock className='h-5 w-5 text-[#8D6E63]' />
                  </div>
                  <input
                    id='password'
                    name='password'
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder='Mínimo 8 caracteres'
                    required
                    minLength={8}
                    maxLength={100}
                    className={`block w-full pl-10 pr-12 py-3 border rounded-xl text-[#4A3728] placeholder-[#8D6E63]/60 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 bg-white/80 ${
                      validationErrors.password
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-[#D2B48C]/30 focus:ring-[#D2B48C]'
                    }`}
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer hover:text-[#4A3728] transition-colors duration-200'
                  >
                    {showPassword
                      ? (
                      <EyeOff className='h-5 w-5 text-[#8D6E63]' />
                        )
                      : (
                      <Eye className='h-5 w-5 text-[#8D6E63]' />
                        )}
                  </button>
                </div>
                {validationErrors.password && <p className='mt-1 text-xs text-red-600'>{validationErrors.password}</p>}
                <p className='mt-1 text-xs text-[#8D6E63]'>Debe contener: mayúscula, minúscula y número</p>
              </div>

              {/* Confirmar contraseña */}
              <div>
                <label htmlFor='confirmPassword' className='block text-sm font-medium text-[#4A3728] mb-2'>
                  Confirmar contraseña *
                </label>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <Lock className='h-5 w-5 text-[#8D6E63]' />
                  </div>
                  <input
                    id='confirmPassword'
                    name='confirmPassword'
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    placeholder='Repite tu contraseña'
                    required
                    className={`block w-full pl-10 pr-12 py-3 border rounded-xl text-[#4A3728] placeholder-[#8D6E63]/60 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 bg-white/80 ${
                      validationErrors.confirmPassword
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-[#D2B48C]/30 focus:ring-[#D2B48C]'
                    }`}
                  />
                  <button
                    type='button'
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className='absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer hover:text-[#4A3728] transition-colors duration-200'
                  >
                    {showConfirmPassword
                      ? (
                      <EyeOff className='h-5 w-5 text-[#8D6E63]' />
                        )
                      : (
                      <Eye className='h-5 w-5 text-[#8D6E63]' />
                        )}
                  </button>
                </div>
                {validationErrors.confirmPassword && (
                  <p className='mt-1 text-xs text-red-600'>{validationErrors.confirmPassword}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type='submit'
                disabled={loading || Object.keys(validationErrors).length > 0}
                className='group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-[#4A3728] hover:bg-[#5D4037] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D2B48C] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]'
              >
                {loading
                  ? (
                  <div className='flex items-center'>
                    <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2' />
                    Guardando...
                  </div>
                    )
                  : (
                      'Guardar nueva contraseña'
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

        </div>
      </div>
  )
}

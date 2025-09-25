'use client'
import { useState } from 'react'
import Image from 'next/image'
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function LoginForm ({ handleSbmitLogin, error }) {
  const [validationErrors, setValidationErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const validateField = (name, value) => {
    const errors = { ...validationErrors }

    switch (name) {
      case 'email':
        if (value.length > 100) {
          errors.email = 'El correo no puede exceder 100 caracteres'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.email = 'Ingrese un correo electrónico válido'
        } else {
          delete errors.email
        }
        break

      case 'password':
        if (value.length < 8) {
          errors.password = 'La contraseña debe tener al menos 8 caracteres'
        } else if (value.length > 100) {
          errors.password = 'La contraseña no puede exceder 100 caracteres'
        } else {
          delete errors.password
        }
        break

      default:
        break
    }

    setValidationErrors(errors)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    validateField(name, value)
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Validar todos los campos antes de enviar
    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData)

    // Validar cada campo
    Object.keys(data).forEach((key) => {
      validateField(key, data[key])
    })

    // Si no hay errores de validación, enviar el formulario
    if (Object.keys(validationErrors).length === 0) {
      await handleSbmitLogin(e)
    }

    setLoading(false)
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
      <div className='form-content flex-1'>
        <div className='shadow-none w-96 p-7 md:shadow-xl rounded-lg bg-white/95 backdrop-blur-sm border border-[#D2B48C]/20'>
          {/* Header */}
          <div className='text-center mb-2'>
            <div className='mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-[#D2B48C]/20 mb-2'>
              <Image width={40} height={40} alt='Coffee Shop Logo' src='/logoDark.svg' className='h-10 w-10' />
            </div>
            <h2 className='text-3xl font-bold text-[#4A3728] mb-2'>Iniciar sesión</h2>
            <p className='text-[#5D4037] text-sm'>Bienvenido de vuelta, ingresa tus credenciales</p>
          </div>

          {/* Form */}
          <div className='mt-2 sm:mx-auto sm:w-full sm:max-w-sm'>
            <form onSubmit={handleFormSubmit} className='space-y-6'>
              {/* Email Field */}
              <div>
                <label htmlFor='email' className='block text-sm font-medium text-[#4A3728] mb-2'>
                  Correo electrónico *
                </label>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <Mail className='h-5 w-5 text-[#8D6E63]' />
                  </div>
                  <input
                    id='email'
                    name='email'
                    type='email'
                    required
                    maxLength={100}
                    autoComplete='email'
                    onChange={handleInputChange}
                    placeholder='ejemplo@correo.com'
                    className={`block w-full pl-10 pr-3 py-3 border rounded-xl text-[#4A3728] placeholder-[#8D6E63]/60 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 bg-white/80 ${
                      validationErrors.email
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-[#D2B48C]/30 focus:ring-[#D2B48C]'
                    }`}
                  />
                </div>
                {validationErrors.email && <p className='mt-1 text-xs text-red-600'>{validationErrors.email}</p>}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor='password' className='block text-sm font-medium text-[#4A3728] mb-2'>
                  Contraseña *
                </label>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <Lock className='h-5 w-5 text-[#8D6E63]' />
                  </div>
                  <input
                    id='password'
                    name='password'
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    maxLength={100}
                    autoComplete='current-password'
                    onChange={handleInputChange}
                    placeholder='Ingrese su contraseña'
                    className={`block w-full pl-10 pr-12 py-3 border rounded-xl text-[#4A3728] placeholder-[#8D6E63]/60 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 bg-white/80 ${
                      validationErrors.password
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-[#D2B48C]/30 focus:ring-[#D2B48C]'
                    }`}
                  />
                  <button
                    type='button'
                    onClick={togglePasswordVisibility}
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
              </div>

              {/* Forgot Password Link */}
              <div className='text-right'>
                <Link
                  href='/reset-password'
                  className='text-sm font-medium text-[#D2B48C] hover:text-[#4A3728] transition-colors duration-200'
                >
                  ¿Olvidaste tu contraseña?
                </Link>
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
                    Iniciando sesión...
                  </div>
                    )
                  : (
                      'Iniciar sesión'
                    )}
              </button>
            </form>

            {/* Error Message */}
            {error && (
              <div className='mt-2 p-4 bg-red-50 border border-red-200 rounded-xl'>
                <p className='text-red-600 text-sm text-center'>{error.message}</p>
              </div>
            )}
          </div>

          {/* Sign Up Link */}
          <div className='mt-4 text-center'>
            <p className='text-sm text-[#8D6E63]'>
              ¿No tienes cuenta?{' '}
              <Link
                href='/Sign-up'
                className='font-medium text-[#D2B48C] hover:text-[#4A3728] transition-colors duration-200'
              >
                Regístrate aquí
              </Link>
            </p>
          </div>

          {/* Additional Help */}
          <div className='mt-2 pt-6 border-t border-[#D2B48C]/20'>
            <div className='text-center'>
              <Link
                href='/'
                className='inline-flex items-center text-sm font-medium text-[#D2B48C] hover:text-[#4A3728] transition-colors duration-200'
              >
                <ArrowLeft className='h-4 w-4 mr-2' />
                Volver al inicio
              </Link>
            </div>
          </div>
        </div>
      </div>
  )
}

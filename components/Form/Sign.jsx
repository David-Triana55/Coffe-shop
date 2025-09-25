'use client'
import { useState } from 'react'
import Image from 'next/image'
import { Eye, EyeOff, User, Mail, Lock, Phone, UserCheck, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function SignForm ({ handleSbmitSignUp, error }) {
  const [validationErrors, setValidationErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const validateField = (name, value) => {
    const errors = { ...validationErrors }

    switch (name) {
      case 'name':
        if (value.length < 2) {
          errors.name = 'El nombre debe tener al menos 2 caracteres'
        } else if (value.length > 50) {
          errors.name = 'El nombre no puede exceder 50 caracteres'
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
          errors.name = 'El nombre solo puede contener letras'
        } else {
          delete errors.name
        }
        break

      case 'lastName':
        if (value.length < 2) {
          errors.lastName = 'El apellido debe tener al menos 2 caracteres'
        } else if (value.length > 50) {
          errors.lastName = 'El apellido no puede exceder 50 caracteres'
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
          errors.lastName = 'El apellido solo puede contener letras'
        } else {
          delete errors.lastName
        }
        break

      case 'number':
        if (value.length < 10) {
          errors.number = 'El teléfono debe tener al menos 10 dígitos'
        } else if (value.length > 15) {
          errors.number = 'El teléfono no puede exceder 15 dígitos'
        } else if (!/^[0-9+\-\s()]+$/.test(value)) {
          errors.number = 'El teléfono solo puede contener números, +, -, espacios y paréntesis'
        } else {
          delete errors.number
        }
        break

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
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          errors.password = 'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
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
      await handleSbmitSignUp(e)
    }

    setLoading(false)
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
      <div className='form-content'>
        <div className='shadow-none w-full max-w-md p-7 md:shadow-xl rounded-lg bg-white/95 backdrop-blur-sm border border-[#D2B48C]/20'>
          {/* Header */}
          <div className='text-center mb-2'>
            <div className='mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-[#D2B48C]/20 mb-2'>
              <Image width={40} height={40} alt='Coffee Shop Logo' src='/logoDark.svg' className='h-10 w-10' />
            </div>
            <h2 className='text-3xl font-bold text-[#4A3728] mb-2'>Crear cuenta</h2>
            <p className='text-[#5D4037] text-sm'>Únete a nuestra comunidad cafetera</p>
          </div>

          {/* Form */}
          <div className='mt-6'>
            <form onSubmit={handleFormSubmit} className='space-y-6'>
              {/* Name and Last Name */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label htmlFor='name' className='block text-sm font-medium text-[#4A3728] mb-2'>
                    Nombre *
                  </label>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                      <User className='h-5 w-5 text-[#8D6E63]' />
                    </div>
                    <input
                      id='name'
                      name='name'
                      type='text'
                      required
                      minLength={2}
                      maxLength={50}
                      pattern='[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+'
                      autoComplete='given-name'
                      onChange={handleInputChange}
                      placeholder='Tu nombre'
                      className={`block w-full pl-10 pr-3 py-3 border rounded-xl text-[#4A3728] placeholder-[#8D6E63]/60 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 bg-white/80 ${
                        validationErrors.name
                          ? 'border-red-300 focus:ring-red-500'
                          : 'border-[#D2B48C]/30 focus:ring-[#D2B48C]'
                      }`}
                    />
                  </div>
                  {validationErrors.name && <p className='mt-1 text-xs text-red-600'>{validationErrors.name}</p>}
                </div>

                <div>
                  <label htmlFor='lastName' className='block text-sm font-medium text-[#4A3728] mb-2'>
                    Apellido *
                  </label>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                      <User className='h-5 w-5 text-[#8D6E63]' />
                    </div>
                    <input
                      id='lastName'
                      name='lastName'
                      type='text'
                      required
                      minLength={2}
                      maxLength={50}
                      pattern='[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+'
                      autoComplete='family-name'
                      onChange={handleInputChange}
                      placeholder='Tu apellido'
                      className={`block w-full pl-10 pr-3 py-3 border rounded-xl text-[#4A3728] placeholder-[#8D6E63]/60 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 bg-white/80 ${
                        validationErrors.lastName
                          ? 'border-red-300 focus:ring-red-500'
                          : 'border-[#D2B48C]/30 focus:ring-[#D2B48C]'
                      }`}
                    />
                  </div>
                  {validationErrors.lastName && (
                    <p className='mt-1 text-xs text-red-600'>{validationErrors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Role and Phone */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label htmlFor='role' className='block text-sm font-medium text-[#4A3728] mb-2'>
                    Tipo de usuario *
                  </label>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                      <UserCheck className='h-5 w-5 text-[#8D6E63]' />
                    </div>
                    <select
                      id='role'
                      name='role'
                      required
                      autoComplete='organization-title'
                      className='block w-full pl-10 pr-3 py-3 border border-[#D2B48C]/30 rounded-xl text-[#4A3728] bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#D2B48C] focus:border-transparent transition-all duration-200'
                    >
                      <option value=''>Seleccione</option>
                      <option value='CLIENTE'>Cliente</option>
                      <option value='VENDEDOR'>Vendedor</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor='number' className='block text-sm font-medium text-[#4A3728] mb-2'>
                    Teléfono *
                  </label>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                      <Phone className='h-5 w-5 text-[#8D6E63]' />
                    </div>
                    <input
                      id='number'
                      name='number'
                      type='tel'
                      required
                      minLength={10}
                      maxLength={10}
                      pattern='[0-9+\-\s()]+'
                      autoComplete='tel'
                      onChange={handleInputChange}
                      placeholder='300 123 4567'
                      className={`block w-full pl-10 pr-3 py-3 border rounded-xl text-[#4A3728] placeholder-[#8D6E63]/60 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 bg-white/80 ${
                        validationErrors.number
                          ? 'border-red-300 focus:ring-red-500'
                          : 'border-[#D2B48C]/30 focus:ring-[#D2B48C]'
                      }`}
                    />
                  </div>
                  {validationErrors.number && <p className='mt-1 text-xs text-red-600'>{validationErrors.number}</p>}
                </div>
              </div>

              {/* Email */}
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

              {/* Password */}
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
                    autoComplete='new-password'
                    onChange={handleInputChange}
                    placeholder='Mínimo 8 caracteres'
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
                <p className='mt-1 text-xs text-[#8D6E63]'>Debe contener: mayúscula, minúscula y número</p>
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
                    Creando cuenta...
                  </div>
                    )
                  : (
                      'Crear cuenta'
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

          {/* Login Link */}
          <div className='mt-4 text-center'>
            <p className='text-sm text-[#8D6E63]'>
              ¿Ya tienes cuenta?{' '}
              <Link
                href='/Sign-in'
                className='font-medium text-[#D2B48C] hover:text-[#4A3728] transition-colors duration-200'
              >
                Inicia sesión aquí
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

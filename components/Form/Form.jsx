'use client'
import Image from 'next/image'
import './Form.css'
import useStore from '@/store'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
export default function Form ({ type }) {
  const router = useRouter()
  const [error, setError] = useState(null)
  const { setLogin } = useStore(state => state)
  // funcion para enviar el formulario de login
  const handleSbmitLogin = async (e) => {
    e.preventDefault()
    try {
      const form = new FormData(e.target)
      const email = form.get('email')
      const password = form.get('password')

      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      if (!response.ok) {
        throw new Error('Error al entrar')
      }

      const data = await response.json()
      console.log(data)
      setLogin(data.token, true)
      router.push('/')
    } catch (error) {
      setError(true)
      console.error(error)
    } finally {
      e.target.reset()
    }
  }

  // funcion para enviar el formulario de registro

  const handleSbmitSignUp = async (e) => {
    e.preventDefault()
    try {
      const form = new FormData(e.target)
      const name = form.get('name')
      const lastName = form.get('lastName')
      const number = form.get('number')
      const email = form.get('email')
      const password = form.get('password')

      const response = await fetch('/api/signUp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, lastName, number, password, email })
      })
      if (!response.ok) {
        throw new Error('Error al crear el usuario')
      }

      router.push('/Sign-in')
    } catch (error) {
      console.error(error)
    } finally {
      e.target.reset()
    }
  }

  return (
    <>
      {type === 'signUp' && (
        <div className=' form-content flex-1   '>
          <div className='shadow-none w-96 p-7 md:shadow-xl rounded-lg'>
            <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
              <Image
                width={110}
                height={110}
                alt='Your Company'
                src='/logoDark.svg'
                className='mx-auto h-32 w-32'
              />
              <h2 className=' text-center text-2xl font-bold leading-9 tracking-tight text-black'>
                Registrarse
              </h2>
            </div>

            <div className='mt-6 sm:mx-auto sm:w-full sm:max-w-sm'>
              <form onSubmit={handleSbmitSignUp} className='space-y-6'>
                {/* fields of name and last name */}
                <div className='w-full justify-center flex flex-row gap-1'>
                  <div className='w-1/2'>
                    <label
                      htmlFor='name'
                      className='block text-sm font-medium leading-6 text-gray-900'
                    >
                      nombre
                    </label>
                    <div className='mt-2'>
                      <input
                        id='name'
                        name='name'
                        type='name'
                        required
                        autoComplete='nombre'
                        className='block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6'
                      />
                    </div>
                  </div>

                  <div className='w-1/2'>
                    <label
                      htmlFor='lastName'
                      className='block  text-sm font-medium leading-6 text-gray-900'
                    >
                      apellido
                    </label>
                    <div className='mt-2'>
                      <input
                        id='lastName'
                        name='lastName'
                        type='lastName'
                        required
                        autoComplete='apellido'
                        className='block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6'
                      />
                    </div>
                  </div>
                </div>

                <div className='container__group'>
                  <label
                    htmlFor='number'
                    className='block text-sm font-medium leading-6 text-gray-900'
                  >
                    Teléfono
                  </label>
                  <div className='mt-2'>
                    <input
                      id='number'
                      name='number'
                      type='number'
                      required
                      autoComplete='number'
                      className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6'
                    />
                  </div>
                </div>

                <div className='container__group'>
                  <label
                    htmlFor='email'
                    className='block text-sm font-medium leading-6 text-gray-900'
                  >
                    Correo electrónico
                  </label>
                  <div className='mt-2'>
                    <input
                      id='email'
                      name='email'
                      type='email'
                      required
                      autoComplete='email'
                      className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6'
                    />
                  </div>
                </div>

                <div className='container__group'>
                  <div className='flex items-center justify-between'>
                    <label
                      htmlFor='password'
                      className='block text-sm font-medium leading-6 text-gray-900'
                    >
                      Contraseña
                    </label>
                  </div>
                  <div className='mt-2'>
                    <input
                      id='password'
                      name='password'
                      type='password'
                      required
                      autoComplete='current-password'
                      className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6'
                    />
                  </div>
                </div>

                <div>
                  <button
                    type='submit'
                    className='flex w-full justify-center rounded-md bg-buttonColor px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-textNavbar focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-textNavbar'
                  >
                    Registrarse
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {type === 'login' && (
        <div className=' form-content flex-1'>
          <div className='shadow-none w-96 p-7 md:shadow-md rounded-lg'>
            <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
              <Image
                width={110}
                height={110}
                alt='Your Company'
                src='/logoDark.svg'
                className='mx-auto h-32 w-32'
              />
              <h2 className=' text-center text-2xl font-bold leading-9 tracking-tight text-black'>
                Iniciar sesión
              </h2>
            </div>

            <div className='mt-6 sm:mx-auto sm:w-full sm:max-w-sm'>
              <form onSubmit={handleSbmitLogin} className='space-y-6'>
                <div>
                  <label
                    htmlFor='email'
                    className='block text-sm font-medium leading-6 text-gray-900'
                  >
                    Correo electrónico
                  </label>
                  <div className='mt-2'>
                    <input
                      id='email'
                      name='email'
                      type='email'
                      required
                      autoComplete='email'
                      className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6'
                    />
                  </div>
                </div>

                <div className='container__group'>
                  <div className='flex items-center justify-between'>
                    <label
                      htmlFor='password'
                      className='block text-sm font-medium leading-6 text-gray-900'
                    >
                      Contraseña
                    </label>
                  </div>
                  <div className='mt-2'>
                    <input
                      id='password'
                      name='password'
                      type='password'
                      required
                      autoComplete='current-password'
                      className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6'
                    />
                  </div>
                </div>

                <div>
                  <button
                    type='submit'
                    className='flex w-full justify-center rounded-md bg-buttonColor px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-textNavbar focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-textNavbar'
                  >
                    Entrar
                  </button>
                </div>
              </form>
              {error && <p className='text-red-500 mt-3'>Credenciales incorrectas</p>}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

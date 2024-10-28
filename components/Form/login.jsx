import Image from 'next/image'

export default function LoginForm ({ handleSbmitLogin, error }) {
  return (
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
  )
}

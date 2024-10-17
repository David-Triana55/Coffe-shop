import Image from 'next/image'
import './styles.css'
export default function Form () {
  return (
    <>
      <div className=' sm:bg-white form-content flex-1 py-12  '>
        <div className='w-96 p-7 shadow-md rounded-lg'>

          <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
            <Image
              width={500}
              height={500}
              alt='Your Company'
              src='/logo_dark.svg'
              className='mx-auto h-28 w-28'
            />
            <h2 className=' text-center text-2xl font-bold leading-9 tracking-tight text-black'>
              Sign in to your account
            </h2>
          </div>

          <div className='mt-6 sm:mx-auto sm:w-full sm:max-w-sm'>
            <form action='#' method='POST' className='space-y-6'>
              <div>
                <label htmlFor='email' className='block text-sm font-medium leading-6 text-gray-900'>
                  Email address
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

              <div>
                <div className='flex items-center justify-between'>
                  <label htmlFor='password' className='block text-sm font-medium leading-6 text-gray-900'>
                    Password
                  </label>
                  <div className='text-sm'>
                    <a href='#' className='font-semibold text-indigo-600 hover:text-indigo-500'>
                      Forgot password?
                    </a>
                  </div>
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
                  className='flex w-full justify-center rounded-md bg-verde px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                >
                  Sign in
                </button>
              </div>
            </form>

          </div>
        </div>
      </div>
    </>
  )
}

'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  PopoverGroup

} from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import Cart from '../Cart/Cart'
import Image from 'next/image'
import useStore from '@/store'
import { useRouter } from 'next/navigation'
import { ROLES } from '@/utils/roles'

const navigationClient = {

  pages: [
    { name: 'Inicio', href: '/' },
    { name: 'Tienda', href: '/Tienda' },
    { name: 'Cultura Cafetera', href: '/cultura-cafetera' },
    { name: 'Subastas', href: '/Subastas' },
    { name: 'Sobre nosotros', href: '/Nosotros' }
  ]

}

const navigationSeller = {
  pages: [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Mis Productos', href: '/products' },
    { name: 'Crear Producto', href: '/create-product' },
    { name: 'Mis Subastas', href: '/manage-auctions' }
  ]
}

const navigationAdmin = {
  pages: [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Gestión Productos', href: '/products' },
    { name: 'Gestión Usuarios', href: '/manage-users' },
    { name: 'Gestión Subastas', href: '/manage-auctions' },
    { name: 'Gestión Catalogo', href: '/manage-catalogs' }
  ]
}

const getRoleNavigation = (role) => {
  switch (role) {
    case ROLES.ADMIN:
      return navigationAdmin
    case ROLES.VENDEDOR:
      return navigationSeller

    default:
      return navigationClient
  }
}

export default function NavBar () {
  const { toogleCheckoutWindowValue, login, logOut } = useStore(state => state)
  const { isLogged, role } = login
  const [open, setOpen] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const router = useRouter()

  const closePopover = () => {
    setIsOpen(!isOpen)
    setOpen(!open)
    toogleCheckoutWindowValue(false)
  }

  const handleLogut = async () => {
    setOpen(!open)
    closePopover(false)
    logOut()

    try {
      const res = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include'
      })
      res.json()
      router.push('/')

      if (!res.ok) {
        throw new Error('Error al cerrar sesión')
      }

      console.log('logout')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className='bg-white'>
      {/* Mobile menu */}
      <Dialog open={open} onClose={setOpen} className='relative z-40 lg:hidden'>
        <DialogBackdrop
          onClick={() => {
            setOpen(false)
          }}
          transition
          className='fixed inset-0 bg-black bg-opacity-25 transition-opacity duration-300 ease-linear data-[closed]:opacity-0'
        />

        <div className='fixed inset-0 z-40 flex '>
          <DialogPanel
            transition
            className='relative flex w-full max-w-xs transform flex-col overflow-y-auto bg-white pb-12 shadow-xl transition duration-300 ease-in-out data-[closed]:-translate-x-full'
          >
            <div className='flex px-4 pb-2 pt-5'>
              <button
                type='button'
                onClick={() => {
                  setOpen(false)
                }}
                className='button-mobile__close relative -m-2 inline-flex border-none border-transparent items-center justify-center rounded-md p-2 text-gray-400'
              >
                <span className='absolute -inset-0.5' />
                <XMarkIcon aria-hidden='true' className='h-6 w-6' />
              </button>
            </div>

            {/* Links */}

            <div className='space-y-6 border-t border-gray-200 px-4 py-6'>
              {getRoleNavigation(role).pages?.map((page) => (
                <div key={page.name} className='flow-root'>
                  <Link
                    onClick={() => {
                      setOpen(!open)
                    }} href={page.href} className='-m-2 block p-2 font-medium text-textNavbar'
                  >
                    {page.name}
                  </Link>
                </div>
              ))}
            </div>

            {!isLogged
              ? <div className='space-y-6 border-t border-gray-200 px-4 py-6'>
                <div className='flow-root'>
                  <Link
                    onClick={() => {
                      setOpen(!open)
                    }} href='/Sign-in' className='-m-2 block p-2 font-medium text-textNavbar'
                  >
                    Iniciar sesión
                  </Link>
                </div>
                <div className='flow-root'>
                  <Link
                    onClick={() => setOpen(!open)} href='/Sign-up' className='-m-2 block p-2 font-medium text-textNavbar'
                  >
                    Crear cuenta
                  </Link>
                </div>
              </div>
              : <div className='space-y-6 border-t border-gray-200 px-4 py-6'>

                <div className='flow-root'>
                  <Link
                    onClick={() => setOpen(!open)} href='/Profile' className='link-perfil-mobile -m-2 block p-2 font-medium text-textNavbar'
                  >
                    Perfil
                  </Link>
                </div>

                <div className='flow-root'>
                  <button onClick={handleLogut}>
                      Cerrar sesión
                  </button>
                </div>
              </div>}

          </DialogPanel>
        </div>
      </Dialog>

      <header className='fixed top-0 w-full bg-[#4A3728] z-10'>

        <nav aria-label='Top' className='mx-auto  max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='border-b border-black'>
            <div className='flex h-16 items-center'>
              <button
                type='button'
                onClick={() => {
                  setOpen(!open)
                  toogleCheckoutWindowValue(false)
                }}
                className='button-mobile relative rounded-md border-none  bg-transparent p-2 text-[#D2B48C] lg:hidden'
              >
                <span className='absolute -inset-0.5' />
                <span className='sr-only'>Open menu</span>
                <Bars3Icon aria-hidden='true' className='h-6 w-6' />
              </button>

              {/* Logo */}
              <div className='ml-4 flex lg:ml-0'>
                <Link href='/'>
                  <Image
                    width={80}
                    height={80}
                    alt='logo cofeeshop'
                    src='/logo.svg'
                  />
                </Link>
              </div>

              {/* Flyout menus */}
              <PopoverGroup className='hidden lg:ml-8 lg:block lg:self-stretch'>
                <div className='flex h-full space-x-8'>

                  {getRoleNavigation(role).pages?.map((page) => (
                    <Link
                      key={page.name}
                      href={page.href}
                      className='flex items-center text-sm font-medium text-[#D2B48C] hover:text-gray-300'
                      onClick={() => closePopover()}

                    >
                      {page.name}
                    </Link>
                  ))}
                </div>
              </PopoverGroup>

              <div className='ml-auto flex items-center'>
                {!isLogged
                  ? <div className='hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6'>
                    <Link onClick={() => closePopover(false)} href='/Sign-in' className='text-sm font-medium text-[#D2B48C] hover:text-gray-300'>
                      Iniciar sesión
                    </Link>
                    <span aria-hidden='true' className='h-6 w-px bg-gray-200' />
                    <Link
                      onClick={() => setOpen(!open)}
                      href='/Sign-up' className='text-sm font-medium text-[#D2B48C] hover:text-gray-300'
                    >
                      Crear cuenta
                    </Link>
                  </div>
                  : <div className='hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6'>
                    <Link onClick={() => closePopover(false)} href='/Profile' className='text-sm font-medium text-[#D2B48C] hover:text-gray-300'>
                      Perfil
                    </Link>
                    <span aria-hidden='true' className='h-6 w-px bg-gray-200' />
                    <button
                      onClick={() => {
                        handleLogut()
                      }} className='text-sm font-medium text-[#D2B48C] hover:text-gray-300'
                    >
                      Cerrar sesión
                    </button>
                    </div>}

                {(role === ROLES.CLIENTE || role === ROLES.DESCONOCIDO) && <Cart />}
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  )
}

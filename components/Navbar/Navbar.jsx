'use client'

import { Fragment, useState } from 'react'
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels
} from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import Cart from '../Cart/Cart'
import Image from 'next/image'
import useStore from '@/store'
import { useRouter } from 'next/navigation'

const navigation = {
  categories: [
    {
      id: 'Cafes',
      name: 'Cafes',
      featured: [
        {
          name: 'variedades de cafés',
          imageSrc: 'https://th.bing.com/th/id/OIP.Uztyg-o8Bjn5_u0VK2-aRgHaE8?rs=1&pid=ImgDetMain',
          imageAlt: 'Imagen de cafés con una variedad de cafés'
        },
        {
          name: 'Accessorios de café',
          imageSrc: 'https://p0.pikist.com/photos/267/192/cafe-coffee-aroma-beverage-cup-thumbnail.jpg',
          imageAlt: 'Imagen de varios accesorios de café'
        }
      ],
      sections: [
        {
          id: 'Tipos de Café',
          name: 'Tipos de Café',
          items: [
            { name: 'Café Molido', href: '/Tipos-de-cafe/Cafe-molido' },
            { name: 'Cápsulas de Café', href: '/Tipos-de-cafe/Capsulas-de-cafe' },
            { name: 'Mezclas Especiales', href: '/Tipos-de-cafe/Mezclas-Especiales' }
          ]
        },
        {

          id: 'Accesorios de Café ',
          name: 'Accesorios de Café ',
          items: [
            { name: 'Molinillos', href: '/Accesorios-de-cafe/Molinillos' },
            { name: 'Cafeteras ', href: '/Accesorios-de-cafe/Cafeteras' },
            { name: 'Tazas y termos', href: '/Accesorios-de-cafe/Tazas-y-termos' },
            { name: 'Filtros', href: '/Accesorios-de-cafe/Filtros' }
          ]
        },
        {
          id: 'Marcas de Café',
          name: 'Marcas de Café',
          items: [
            { name: 'Oma', href: '/Marcas-de-cafe/Oma' },
            { name: 'Juan Valdez', href: '/Marcas-de-cafe/Juan-Valdez' },
            { name: 'Nescafé', href: '/Marcas-de-cafe/Nescafe' },
            { name: 'Colcafé', href: '/Marcas-de-cafe/Colcafe' },
            { name: 'Café Devoción', href: '/Marcas-de-cafe/Cafe-Devocion' }
          ]
        }
      ]
    }
  ],
  pages: [
    { name: 'Mision', href: '/Mision' },
    { name: 'Vision', href: '/Vision' },
    { name: 'Nosotros', href: '/Nosotros' }
  ]
}

export default function NavBar () {
  const { toogleCheckoutWindowValue, login, logOut } = useStore(state => state)
  const { isLogged } = login
  const [open, setOpen] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const closePopover = () => {
    setIsOpen(!isOpen)
    setOpen(!open)
    toogleCheckoutWindowValue(false)
  }

  const handleLogut = () => {
    setOpen(!open)
    logOut()
    router.push('/')
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
                className='relative -m-2 inline-flex border-none border-transparent items-center justify-center rounded-md p-2 text-gray-400'
              >
                <span className='absolute -inset-0.5' />
                <XMarkIcon aria-hidden='true' className='h-6 w-6' />
              </button>
            </div>

            {/* Links */}
            <TabGroup className='mt-2'>
              <div className='border-b border-gray-200'>
                <TabList className='-mb-px flex space-x-8 px-4'>
                  {navigation.categories.map((category) => (
                    <Tab
                      key={category.name}
                      className='flex-1 whitespace-nowrap border-b-2 border-transparent px-1 py-4 text-base font-medium text-gray-900 data-[selected]:border-textNavbar data-[selected]:text-textNavbar'
                    >
                      {category.name}
                    </Tab>
                  ))}
                </TabList>
              </div>
              <TabPanels as={Fragment}>
                {navigation.categories.map((category) => (
                  <TabPanel key={category.name} className='space-y-10 px-4 pb-8 pt-10'>
                    <div className='grid grid-cols-2 gap-x-4'>
                      {category?.featured?.map((item) => (
                        <div key={item.name} className='group relative text-sm'>
                          <div className='aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-100 '>
                            <img alt={item.imageAlt} src={item.imageSrc} className='object-cover object-center' />
                          </div>
                        </div>
                      ))}
                    </div>
                    {category?.sections?.map((section) => (
                      <div key={section.name}>
                        <p id={`${category.id}-${section.id}-heading-mobile`} className='font-medium text-textNavbar'>
                          {section.name}
                        </p>
                        <ul
                          role='list'
                          aria-labelledby={`${category.id}-${section.id}-heading-mobile`}
                          className='mt-6 flex flex-col space-y-6'
                        >
                          {section.items.map((item) => (
                            <li key={item.name} className='flow-root'>
                              <Link
                                onClick={() => {
                                  setOpen(false)
                                }} href={item.href} className='-m-2 block p-2 text-gray-500'
                              >
                                {item.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </TabPanel>
                ))}
              </TabPanels>
            </TabGroup>

            <div className='space-y-6 border-t border-gray-200 px-4 py-6'>
              {navigation.pages.map((page) => (
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
                    onClick={() => setOpen(!open)} href='/Profile' className='-m-2 block p-2 font-medium text-textNavbar'
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
                className=' relative rounded-md border-none  bg-transparent p-2 text-[#D2B48C] lg:hidden'
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
                  {navigation.categories.map((category) => (
                    <Popover key={category.name} className='flex'>
                      <div className='relative flex'>
                        <PopoverButton
                          onClick={() => {
                            setIsOpen(true)
                            toogleCheckoutWindowValue(false)
                          }}
                          className='relative border-none z-10 -mb-px flex items-center border-transparent pt-px text-sm font-medium text-[#D2B48C] transition-colors duration-200 ease-out hover:text-gray-300 data-[open]:border-textNavbar data-[open]:text-[#D2B48C]'
                        >
                          {category.name}
                        </PopoverButton>
                      </div>

                      <PopoverPanel
                        transition
                        className={` ${isOpen ? 'block' : 'hidden'} absolute inset-x-0 top-full text-sm text-[#D2B48C] transition data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in `}
                      >
                        <div className='relative bg-white'>
                          <div className='mx-auto max-w-7xl px-8'>
                            <div className='grid grid-cols-2 gap-x-8 gap-y-10 py-16'>
                              <div className='col-start-2 grid grid-cols-2 gap-x-8'>
                                {category?.featured?.map((item) => (
                                  <div key={item.name} className='group relative text-base sm:text-sm '>
                                    <div className='aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-100 '>
                                      <img
                                        className='object-cover object-center' alt={item.imageAlt}
                                        src={item.imageSrc}
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <div className='row-start-1 grid grid-cols-3 gap-x-8 gap-y-10 text-sm'>
                                {category?.sections?.map((section) => (
                                  <div key={section.name}>
                                    <p id={`${section.name}-heading`} className='font-medium text-textNavbar'>
                                      {section.name}
                                    </p>
                                    <ul
                                      role='list'
                                      aria-labelledby={`${section.name}-heading`}
                                      className='mt-6 space-y-6 sm:mt-4 sm:space-y-4 text-[#c09255]'
                                    >
                                      {section.items.map((item) => (
                                        <li key={item.name} className='flex'>
                                          <Link
                                            href={item.href}
                                            className='hover:text-yellow-950 data-[closed]'
                                            onClick={() => {
                                              closePopover()
                                            }}
                                          >
                                            {item.name}
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                        </div>
                      </PopoverPanel>
                    </Popover>
                  ))}

                  {navigation.pages.map((page) => (
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
                        closePopover(false)
                        logOut()
                        router.push('/')
                      }} className='text-sm font-medium text-[#D2B48C] hover:text-gray-300'
                    >
                      Cerrar sesión
                    </button>
                    </div>}

                <Cart />
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  )
}

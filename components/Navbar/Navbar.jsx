/* eslint-disable @next/next/no-img-element */
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
            { name: 'Cápsulas de Café', href: '/Tipos-de-cafe/Capsulas-de-Cafe' },
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
            { name: 'Filtros y herramientas para preparación', href: '/Accesorios-de-cafe/Filtros-y-herramientas-para-preparacion' }
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
  const [open, setOpen] = useState(false)

  return (
    <div className='bg-white'>
      {/* Mobile menu */}
      <Dialog open={open} onClose={setOpen} className='relative z-40 lg:hidden'>
        <DialogBackdrop
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
                onClick={() => setOpen(false)}
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
                              <Link onClick={() => setOpen(false)} href={item.href} className='-m-2 block p-2 text-gray-500'>
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
                  <Link onClick={() => setOpen(false)} href={page.href} className='-m-2 block p-2 font-medium text-textNavbar'>
                    {page.name}
                  </Link>
                </div>
              ))}
            </div>

            <div className='space-y-6 border-t border-gray-200 px-4 py-6'>
              <div className='flow-root'>
                <Link href='/Sign-in' className='-m-2 block p-2 font-medium text-textNavbar'>
                  Sign in
                </Link>
              </div>
              <div className='flow-root'>
                <Link href='/Sign-up' className='-m-2 block p-2 font-medium text-textNavbar'>
                  Create account
                </Link>
              </div>
            </div>

          </DialogPanel>
        </div>
      </Dialog>

      <header className='fixed top-0 w-full bg-[#4A3728] z-10'>

        <nav aria-label='Top' className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='border-b border-black'>
            <div className='flex h-16 items-center'>
              <button
                type='button'
                onClick={() => setOpen(true)}
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
                        <PopoverButton className='relative z-10 -mb-px flex items-center border-transparent pt-px text-sm font-medium text-[#D2B48C] transition-colors duration-200 ease-out hover:text-gray-300 data-[open]:border-textNavbar data-[open]:text-[#D2B48C]'>
                          {category.name}
                        </PopoverButton>
                      </div>

                      <PopoverPanel
                        transition
                        className='absolute inset-x-0 top-full text-sm text-[#D2B48C] transition data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in'
                      >
                        {/* Presentational element used to render the bottom shadow, if we put the shadow on the actual panel it pokes out the top, so we use this shorter element to hide the top of the shadow */}
                        <div aria-hidden='true' className='absolute inset-0 top-1/2 bg-white shadow' />

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
                                          <Link href={item.href} className='hover:text-yellow-950'>
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
                      onClick={() => setOpen(false)}
                      href={page.href}
                      className='flex items-center text-sm font-medium text-[#D2B48C] hover:text-gray-300'
                    >
                      {page.name}
                    </Link>
                  ))}
                </div>
              </PopoverGroup>

              <div className='ml-auto flex items-center'>
                <div className='hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6'>
                  <Link onClick={() => setOpen(false)} href='/Sign-in' className='text-sm font-medium text-[#D2B48C] hover:text-gray-300'>
                    Sign in
                  </Link>
                  <span aria-hidden='true' className='h-6 w-px bg-gray-200' />
                  <Link onClick={() => setOpen(false)} href='/Sign-up' className='text-sm font-medium text-[#D2B48C] hover:text-gray-300'>
                    Create account
                  </Link>
                </div>

                {/* Cart */}
                <Cart />
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  )
}

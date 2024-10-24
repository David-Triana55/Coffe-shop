'use client'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FileText, LogOut, User } from 'lucide-react'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

import useStore from '@/store'

export default function Profile () {
  const [activeTab, setActiveTab] = useState('information')
  const { clientInfo } = useStore((state) => state)

  const { data } = clientInfo

  return (
    <main className='container mt-16 mx-auto p-4 flex flex-col md:flex-row gap-8'>
      <aside className='md:w-1/4'>
        <Card>
          <CardHeader>
            <CardTitle>Menú de Perfil</CardTitle>
          </CardHeader>
          <CardContent>
            <nav className='flex flex-col space-y-2'>
              <Button
                variant='ghost'
                className='justify-start'
                onClick={() => setActiveTab('information')}
              >
                <User className='mr-2 h-4 w-4' />
                Información
              </Button>
              <Button
                variant='ghost'
                className='justify-start'
                onClick={() => setActiveTab('invoices')}
              >
                <FileText className='mr-2 h-4 w-4' />
                Facturas
              </Button>

              <Button
                variant='ghost'
                className='justify-start text-red-600 hover:text-red-700 hover:bg-red-100'
              >
                <LogOut className='mr-2 h-4 w-4' />
                Cerrar Sesión
              </Button>
            </nav>
          </CardContent>
        </Card>
      </aside>

      <section className='md:w-3/4'>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='information'>Información</TabsTrigger>
            <TabsTrigger value='invoices'>Facturas</TabsTrigger>
          </TabsList>
          <TabsContent value='information'>
            <Card>
              <CardHeader>
                <CardTitle>Información del Perfil</CardTitle>
                <CardDescription>
                  Gestiona tu información personal y de contacto.
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <form onSubmit={() => console.log('ssss')}>
                  <div className='space-y-2'>
                    <Label htmlFor='name'>Nombre</Label>
                    <Input id='name' placeholder={data?.nombre_cliente} />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='lastName'>Apellido</Label>
                    <Input id='lastName' placeholder={data?.apellido} />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='email'>Correo Electrónico</Label>
                    <Input id='email' type='email' placeholder={data?.email} />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='number'>Telefono</Label>
                    <Input
                      id='number'
                      type='number'
                      placeholder={data?.telefono}
                    />
                  </div>
                  <button
                    type='submit'
                    className='mt-3 flex w-2/12 justify-center rounded-md bg-buttonColor px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-textNavbar focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-textNavbar'
                  >
                    Guardar Cambios
                  </button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value='invoices'>
            <Card>
              <CardHeader>
                <CardTitle>Historial de Facturas</CardTitle>
                <CardDescription>
                  Revisa tus facturas recientes y su estado.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {[
                    {
                      id: 'INV-001',
                      date: '2024-03-15',
                      amount: '$1,250.00',
                      status: 'Pagada'
                    },
                    {
                      id: 'INV-002',
                      date: '2024-02-28',
                      amount: '$980.50',
                      status: 'Pendiente'
                    },
                    {
                      id: 'INV-003',
                      date: '2024-01-31',
                      amount: '$1,500.00',
                      status: 'Pagada'
                    }
                  ].map((invoice) => (
                    <div
                      key={invoice.id}
                      className='flex justify-between items-center border-b pb-2'
                    >
                      <div>
                        <p className='font-semibold'>{invoice.id}</p>
                        <p className='text-sm text-gray-600'>{invoice.date}</p>
                      </div>
                      <div className='text-right'>
                        <p>{invoice.amount}</p>
                        <p
                          className={`text-sm ${
                            invoice.status === 'Pagada'
                              ? 'text-green-600'
                              : 'text-yellow-600'
                          }`}
                        >
                          {invoice.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className='mt-4 bg-[#33691E] hover:bg-[#1B5E20] text-white'>
                  Ver Todas las Facturas
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </main>
  )
}

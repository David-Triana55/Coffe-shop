/* eslint-disable react/jsx-props-no-multi-spaces */
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
import { useRouter } from 'next/navigation'

export default function Profile () {
  const { clientInfo, login, setClientInfo, setLogin } = useStore((state) => state)
  const [activeTab, setActiveTab] = useState('information')
  const [noEdit, setNoEdit] = useState(true)
  const [save, setSave] = useState(null)
  const [dataClient, setDataClient] = useState({ ...clientInfo.data })
  const router = useRouter()
  console.log(clientInfo)
  console.log(dataClient)
  const handleSubmitInfo = async (e) => {
    try {
      e.preventDefault()

      const objClient = {
        id: clientInfo.id_cliente,
        nombre_cliente: dataClient.nombre_cliente ?? clientInfo.nombre_cliente,
        apellido: dataClient.apellido ?? clientInfo.apellido,
        email: dataClient.email ?? clientInfo.email,
        telefono: dataClient.telefono ?? clientInfo.telefono
      }

      console.log(objClient, 'objClient')

      const response = await fetch('/api/updateInfo', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${login.token}`
        },
        body: JSON.stringify(objClient)
      })

      if (!response.ok) {
        throw new Error('Error al actualizar la información')
      }
      setClientInfo(objClient)

      setSave(true)
      setTimeout(() => {
        setSave(false)
      }, 2000)
      setNoEdit(true)
      console.log(response)
    } catch (error) {
      console.error(error)
    } finally {
      e.target.reset()
    }
  }

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
                onClick={() => {
                  setLogin(null, false)
                  router.push('/')
                }}
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
                <form onSubmit={handleSubmitInfo}>
                  <div className='space-y-2'>
                    <Label htmlFor='name'>Nombre</Label>
                    <Input
                      disabled={noEdit}
                      id='name'
                      placeholder={clientInfo.data?.nombre_cliente}
                      value={dataClient?.nombre_cliente}
                      onChange={(e) => setDataClient({ ...dataClient, nombre_cliente: e.target.value })}
                    />

                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='lastName'>Apellido</Label>
                    <Input
                      disabled={noEdit}
                      id='lastName'
                      placeholder={clientInfo.data?.apellido}
                      value={dataClient?.apellido}
                      onChange={(e) => setDataClient({ ...dataClient, apellido: e.target.value })}
                    />

                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='email'>Correo Electrónico</Label>
                    <Input
                      disabled={noEdit}
                      id='email'
                      type='email'
                      placeholder={clientInfo.data?.email}
                      value={dataClient?.email}
                      onChange={(e) => setDataClient({ ...dataClient, email: e.target.value })}
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='number'>Telefono</Label>
                    <Input
                      disabled={noEdit}
                      id='number'
                      type='number'
                      placeholder={clientInfo.data?.telefono}
                      value={dataClient?.telefono}
                      onChange={(e) => setDataClient({ ...dataClient, telefono: e.target.value })}
                    />
                  </div>
                  {noEdit && <button
                    onClick={() => setNoEdit(!noEdit)}
                    className='mt-3 flex w-40 justify-center rounded-md bg-buttonColor px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-textNavbar focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-textNavbar'
                             >
                    Editar Perfil
                  </button>}

                 {noEdit === false && <button
                    type='submit'
                    className='mt-3 flex w-40 justify-center rounded-md bg-buttonColor px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-textNavbar focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-textNavbar'
                                      >
                    Guardar Cambios
                  </button>}
                  {save && <p className='text-green-500 mt-3'>Cambios guardados</p>}
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

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
import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import useStore from '@/store'
import { useRouter } from 'next/navigation'
import Bills from '@/components/Bills/Bills'
import { formatPrice } from '@/utils/formatter'

export default function Profile () {
  const { clientInfo, login, setClientInfo, setLogin } = useStore((state) => state)
  const [activeTab, setActiveTab] = useState('information')
  const [noEdit, setNoEdit] = useState(true)
  const [save, setSave] = useState(null)
  const router = useRouter()
  const [dataClient, setDataClient] = useState({})
  const [history, setHistory] = useState([])

  useEffect(() => {
    const getHistory = async () => {
      const res = await fetch('/api/historyBill', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${login.token}`
        }
      })

      const { data } = await res.json()
      setHistory(data)
    }
    getHistory()
  }, [login.token])

  useEffect(() => {
    const getClientInfo = async () => {
      const res = await fetch('/api/getInfo', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${login.token}`
        }
      })

      const data = await res.json()
      setDataClient({ ...data, edit: { ...data.data } })
      setClientInfo(data)
    }
    getClientInfo()
  }, [login.token, save])

  console.log(dataClient, 'dataClient')
  console.log(history, 'history')

  const handleSubmitInfo = async (e) => {
    try {
      e.preventDefault()

      const objClient = {
        data: {
          nombre_cliente: dataClient.edit.nombre_cliente === '' ? clientInfo.data.nombre_cliente : dataClient.edit.nombre_cliente,
          apellido: dataClient.edit.apellido === '' ? clientInfo.data.apellido : dataClient.edit.apellido,
          email: dataClient.edit.email === '' ? clientInfo.data.email : dataClient.edit.email,
          telefono: dataClient.edit.telefono === '' ? clientInfo.data.telefono : dataClient.edit.telefono
        }
      }

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
                      value={dataClient?.edit?.nombre_cliente}
                      onChange={(e) => setDataClient({ ...dataClient, edit: { ...dataClient.edit, nombre_cliente: e.target.value } })}
                    />

                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='lastName'>Apellido</Label>
                    <Input
                      disabled={noEdit}
                      id='lastName'
                      placeholder={clientInfo.data?.apellido}
                      value={dataClient?.edit?.apellido}
                      onChange={(e) => setDataClient({ ...dataClient, edit: { ...dataClient.edit, apellido: e.target.value } })}
                    />

                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='email'>Correo Electrónico</Label>
                    <Input
                      disabled={noEdit}
                      id='email'
                      type='email'
                      placeholder={clientInfo.data?.email}
                      value={dataClient?.edit?.email}
                      onChange={(e) => setDataClient({ ...dataClient, edit: { ...dataClient.edit, email: e.target.value } })}
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='number'>Telefono</Label>
                    <Input
                      disabled={noEdit}
                      id='number'
                      type='number'
                      placeholder={clientInfo.data?.telefono}
                      value={dataClient?.edit?.telefono}
                      onChange={(e) => setDataClient({ ...dataClient, edit: { ...dataClient.edit, telefono: e.target.value } })}
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
                {history?.map((item) => (
                  <Bills key={item.id_factura} id_factura={item.id_factura} fecha={item.fecha} total={formatPrice(item.total)} />
                ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </main>
  )
}

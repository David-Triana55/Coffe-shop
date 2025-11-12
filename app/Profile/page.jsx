'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import {
  FileText,
  LogOut,
  User,
  Upload,
  XIcon,
  Loader2,
  Edit3,
  Save,
  Camera,
  Mail,
  Phone,
  Building,
  AlertCircle,
  Gavel
  , DollarSign, Package, ShoppingCart, Award, BarChart3
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import useStore from '@/store'
import { useRouter } from 'next/navigation'
import Bills from '@/components/Bills/Bills'
import { formatPrice } from '@/utils/formatter'
import Loading from '@/components/Loading/Loading'
import { ROLES } from '@/utils/roles'
import { Bounce, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { toastError, toastSuccess } from '@/utils/toast'
import AuctionHistoryItem from '@/components/AuctionHistoryItem/AuctionHistoryItem'
import { getRoleName } from '@/utils/roleName'
import { useProtectedRedirect } from '@/hooks/useProtectedRedirect'

export default function Profile () {
  const { clientInfo, login, setClientInfo, setLogin } = useStore((state) => state)
  const [activeTab, setActiveTab] = useState(login?.role === ROLES.CLIENTE ? 'invoices' : 'information')
  const [noEditUser, setNoEditUser] = useState(true)
  const [noEditBrand, setNoEditBrand] = useState(true)
  const [loadingInfo, setLoadingInfo] = useState(false)
  const [loadingBills, setLoadingBills] = useState(false)
  const [savingUser, setSavingUser] = useState(false)
  const [savingBrand, setSavingBrand] = useState(false)
  const [history, setHistory] = useState([])
  const [auctionHistory, setAuctionHistory] = useState([])
  const [loadingAuctions, setLoadingAuctions] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})
  const router = useRouter()

  const [originalUserData, setOriginalUserData] = useState({})
  const [originalBrandData, setOriginalBrandData] = useState({})

  const [reportStats, setReportStats] = useState({
    totalSpent: 0,
    totalOrders: 0,
    wonAuctions: 0
  })

  const [brandPurchases, setBrandPurchases] = useState([])
  useProtectedRedirect('/')
  useEffect(() => {
    if (login?.role === ROLES.CLIENTE) {
      const fetchClientReports = async () => {
        try {
          const res = await fetch('/api/reportsClient', { cache: 'no-cache', credentials: 'include' })
          if (res.ok) {
            const { wonAuctions, brandPurchases, totalBoughts } = await res.json()
            setReportStats({
              totalSpent: totalBoughts.totalspent,
              totalOrders: totalBoughts.totalorders,
              wonAuctions
            })
            setBrandPurchases(brandPurchases)
          }
        } catch (error) {
          console.error('Error fetching client reports:', error)
        }
      }
      fetchClientReports()
    }
  }, [login?.role])

  const [dataClient, setDataClient] = useState({
    data: {},
    edit: {
      name: '',
      last_name: '',
      email: '',
      phone_number: ''
    }
  })

  const [dataBrand, setDataBrand] = useState({
    data: {},
    edit: {
      name: '',
      image_url: ''
    }
  })

  const [selectedImages, setSelectedImages] = useState([])
  const [imageUrls, setImageUrls] = useState('')
  const [uploading, setUploading] = useState(false)

  const validateField = (name, value) => {
    const errors = { ...validationErrors }

    switch (name) {
      case 'name':
      case 'last_name':
        if (value && value.length < 2) {
          errors[name] = 'Debe tener al menos 2 caracteres'
        } else if (value && value.length > 50) {
          errors[name] = 'No puede exceder 50 caracteres'
        } else if (value && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
          errors[name] = 'Solo puede contener letras'
        } else {
          delete errors[name]
        }
        break

      case 'email':
        if (value && value.length > 100) {
          errors.email = 'El correo no puede exceder 100 caracteres'
        } else if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.email = 'Ingrese un correo electrónico válido'
        } else {
          delete errors.email
        }
        break

      case 'phone_number':
        if (value && value.length < 10) {
          errors.phone_number = 'El teléfono debe tener al menos 10 dígitos'
        } else if (value && value.length > 15) {
          errors.phone_number = 'El teléfono no puede exceder 15 dígitos'
        } else {
          delete errors.phone_number
        }
        break

      default:
        break
    }

    setValidationErrors(errors)
  }

  const handleInputChange = (field, value) => {
    setDataClient({
      ...dataClient,
      edit: { ...dataClient.edit, [field]: value }
    })
    validateField(field, value)
  }

  const handleBrandInputChange = (field, value) => {
    setDataBrand({
      ...dataBrand,
      edit: { ...dataBrand.edit, [field]: value }
    })
  }

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toastError('Por favor selecciona un archivo de imagen válido', 3000, Bounce)
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toastError('La imagen no puede exceder 5MB', 3000, Bounce)
      return
    }

    setSelectedImages([file])

    const data = new FormData()
    data.append('file', file)

    setUploading(true)
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data
      })
      const result = await res.json()

      if (res.ok) {
        setImageUrls(result.urls[0])
        toastSuccess('¡Imagen subida correctamente!', 3000, Bounce)
      } else {
        throw new Error(result.error || 'Error al subir la imagen')
      }
    } catch (err) {
      toastError('Error al subir la imagen', 5000, Bounce)
      console.error('Error subiendo imagen:', err)
    } finally {
      setUploading(false)
    }

    e.target.value = null
  }

  const handleDrop = async (e) => {
    e.preventDefault()
    const file = Array.from(e.dataTransfer.files).find((f) => f.type.startsWith('image/'))
    if (file) {
      const fakeEvent = { target: { files: [file] } }
      await handleImageChange(fakeEvent)
    }
  }

  const handleRemoveImage = () => {
    setSelectedImages([])
    setImageUrls('')
  }

  const resetUserData = () => {
    setDataClient({
      ...dataClient,
      edit: { ...originalUserData }
    })
    setValidationErrors({})
  }

  const resetBrandData = () => {
    setDataBrand({
      ...dataBrand,
      edit: { ...originalBrandData }
    })
    setSelectedImages([])
    setImageUrls(originalBrandData.image_url || '')
  }

  useEffect(() => {
    const storedData = JSON.parse(window.localStorage.getItem('isLogged'))

    if (!storedData?.state?.login?.isLogged) {
      router.push('/')
    }
  }, [router])

  useEffect(() => {
    if (login?.role === ROLES.CLIENTE) {
      setLoadingBills(true)
      const getHistory = async () => {
        try {
          const res = await fetch('/api/historyBill', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'include'
          })

          if (res.ok) {
            const { data } = await res.json()
            setHistory(data)
          }
        } catch (error) {
          console.error('Error fetching history:', error)
        } finally {
          setLoadingBills(false)
        }
      }
      getHistory()
    }
  }, [login?.role])

  useEffect(() => {
    if (login?.role === ROLES.CLIENTE) {
      setLoadingAuctions(true)
      const getAuctionHistory = async () => {
        try {
          const res = await fetch('/api/auction-history', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'include',
            cache: 'no-cache'
          })

          if (res.ok) {
            const data = await res.json()
            setAuctionHistory(data)
          }
        } catch (error) {
          console.error('Error fetching auction history:', error)
        } finally {
          setLoadingAuctions(false)
        }
      }
      getAuctionHistory()
    }
  }, [login?.role])

  console.log(auctionHistory)

  useEffect(() => {
    setLoadingInfo(true)

    const getClientInfo = async () => {
      try {
        const res = await fetch('/api/userInfo', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        })

        if (res.ok) {
          const data = await res.json()
          const userData = data.data || {}

          setDataClient({
            data: userData,
            edit: { ...userData }
          })
          setOriginalUserData({ ...userData })
          setClientInfo(data)
        }
      } catch (error) {
        console.error('Error fetching user info:', error)
      }
    }

    const getBrandInfo = async () => {
      try {
        const res = await fetch('/api/brandInfo', { credentials: 'include' })
        if (res.ok) {
          const data = await res.json()
          const brandData = data.data || {}

          setDataBrand({
            data: brandData,
            edit: { ...brandData }
          })
          setOriginalBrandData({ ...brandData })
          setImageUrls(brandData.image_url || '')
        }
      } catch (error) {
        console.error('Error fetching brand info:', error)
      }
    }

    const fetchData = async () => {
      await getClientInfo()
      if (login?.role === ROLES.VENDEDOR) {
        await getBrandInfo()
      }
      setLoadingInfo(false)
    }

    fetchData()
  }, [login?.role, setClientInfo])

  const handleSubmitInfo = async (e) => {
    e.preventDefault()

    const fields = ['name', 'last_name', 'email', 'phone_number']
    fields.forEach((field) => {
      validateField(field, dataClient.edit[field])
    })

    if (Object.keys(validationErrors).length > 0) {
      toastError('Por favor corrige los errores en el formulario', 3000, Bounce)
      return
    }

    setSavingUser(true)

    try {
      const objClient = {
        name: dataClient.edit.name || dataClient.data.name,
        lastName: dataClient.edit.last_name || dataClient.data.last_name,
        email: dataClient.edit.email || dataClient.data.email,
        phoneNumber: dataClient.edit.phone_number || dataClient.data.phone_number
      }

      const response = await fetch('/api/userInfo', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(objClient)
      })

      if (!response.ok) {
        throw new Error('Error al actualizar la información')
      }

      const updatedData = {
        name: objClient.name,
        last_name: objClient.lastName,
        email: objClient.email,
        phone_number: objClient.phoneNumber
      }

      setDataClient({
        data: updatedData,
        edit: { ...updatedData }
      })
      setOriginalUserData({ ...updatedData })
      setClientInfo({ data: updatedData })
      setNoEditUser(true)
      toastSuccess('¡Información actualizada correctamente!', 3000, Bounce)
    } catch (error) {
      console.error(error)
      toastError('Error al actualizar la información', 5000, Bounce)
    } finally {
      setSavingUser(false)
    }
  }

  const handleSubmitInfoBrand = async (e) => {
    e.preventDefault()
    setSavingBrand(true)

    try {
      const objBrand = {
        name: dataBrand.edit.name || dataBrand.data.name,
        image: imageUrls || dataBrand.data.image_url
      }

      const response = await fetch('/api/brandInfo', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(objBrand)
      })

      if (!response.ok) {
        throw new Error('Error al actualizar la información')
      }

      const updatedBrandData = {
        name: objBrand.name,
        image_url: objBrand.image
      }

      setDataBrand({
        data: updatedBrandData,
        edit: { ...updatedBrandData }
      })
      setOriginalBrandData({ ...updatedBrandData })
      setNoEditBrand(true)
      setSelectedImages([])
      toastSuccess('¡Información de marca actualizada correctamente!', 3000, Bounce)
    } catch (error) {
      console.error(error)
      toastError('Error al actualizar la información de marca', 5000, Bounce)
    } finally {
      setSavingBrand(false)
    }
  }

  const handleLogout = async () => {
    try {
      setLogin(null, false)
      router.push('/')
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include'
      })
      toastSuccess('Sesión cerrada correctamente', 2000, Bounce)
    } catch (error) {
      console.error(error)
    }
  }

  const getRoleColor = (role) => {
    switch (role) {
      case ROLES.ADMIN:
        return 'bg-red-100 text-red-800'
      case ROLES.VENDEDOR:
        return 'bg-blue-100 text-blue-800'
      case ROLES.CLIENTE:
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-[#D2B48C]/20 via-white to-[#D2B48C]/10'>
      <main className='container mt-16 mx-auto p-4 flex flex-col lg:flex-row gap-8 min-h-screen'>
        {/* Sidebar */}
        <aside className='lg:w-1/4'>
          <Card className='bg-white/95 backdrop-blur-sm border border-[#D2B48C]/20 shadow-xl'>
            <CardHeader className='bg-gradient-to-r from-[#4A3728] to-[#5D4037] text-white rounded-t-lg'>
              <div className='flex items-center space-x-4'>
                <Avatar className='h-16 w-16 border-2 border-white'>
                  <AvatarImage src={imageUrls || dataBrand?.data?.image_url || '/placeholder.svg'} />
                  <AvatarFallback className='bg-[#D2B48C] text-[#4A3728] text-lg font-bold'>
                    {dataClient?.data?.name?.charAt(0) || clientInfo?.data?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className='text-lg'>
                    {dataClient?.data?.name || clientInfo?.data?.name}{' '}
                    {dataClient?.data?.last_name || clientInfo?.data?.last_name}
                  </CardTitle>
                  <Badge className={`mt-1 ${getRoleColor(login?.role)}`}>{getRoleName(login?.role)}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className='p-6'>
              <nav className='flex flex-col space-y-3'>
                <Button
                  variant={activeTab === 'information' ? 'default' : 'ghost'}
                  className={`justify-start transition-all duration-200 ${
                    activeTab === 'information'
                      ? 'bg-[#4A3728] text-white hover:bg-[#5D4037]'
                      : 'hover:bg-[#D2B48C]/20 text-[#4A3728]'
                  }`}
                  onClick={() => setActiveTab('information')}
                >
                  <User className='mr-3 h-4 w-4' />
                  Información Personal
                </Button>

                {login?.role === ROLES.CLIENTE && (
                  <>
                    <Button
                      variant={activeTab === 'invoices' ? 'default' : 'ghost'}
                      className={`justify-start transition-all duration-200 ${
                        activeTab === 'invoices'
                          ? 'bg-[#4A3728] text-white hover:bg-[#5D4037]'
                          : 'hover:bg-[#D2B48C]/20 text-[#4A3728]'
                      }`}
                      onClick={() => setActiveTab('invoices')}
                    >
                      <FileText className='mr-3 h-4 w-4' />
                      Mis Facturas
                    </Button>

                    <Button
                      variant={activeTab === 'auctions' ? 'default' : 'ghost'}
                      className={`justify-start transition-all duration-200 ${
                        activeTab === 'auctions'
                          ? 'bg-[#4A3728] text-white hover:bg-[#5D4037]'
                          : 'hover:bg-[#D2B48C]/20 text-[#4A3728]'
                      }`}
                      onClick={() => setActiveTab('auctions')}
                    >
                      <Gavel className='mr-3 h-4 w-4' />
                      Mis Subastas
                    </Button>

                    <Button
                      variant={activeTab === 'reports' ? 'default' : 'ghost'}
                      className={`justify-start transition-all duration-200 ${
                        activeTab === 'reports'
                          ? 'bg-[#4A3728] text-white hover:bg-[#5D4037]'
                          : 'hover:bg-[#D2B48C]/20 text-[#4A3728]'
                      }`}
                      onClick={() => setActiveTab('reports')}
                    >
                      <BarChart3 className='mr-3 h-4 w-4' />
                      Reportes
                    </Button>
                  </>
                )}

                {login?.role === ROLES.VENDEDOR && (
                  <Button
                    variant={activeTab === 'information-brand' ? 'default' : 'ghost'}
                    className={`justify-start transition-all duration-200 ${
                      activeTab === 'information-brand'
                        ? 'bg-[#4A3728] text-white hover:bg-[#5D4037]'
                        : 'hover:bg-[#D2B48C]/20 text-[#4A3728]'
                    }`}
                    onClick={() => setActiveTab('information-brand')}
                  >
                    <Building className='mr-3 h-4 w-4' />
                    Mi Marca
                  </Button>
                )}

                <Separator className='my-4' />

                <Button
                  onClick={handleLogout}
                  variant='ghost'
                  className='justify-start text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200'
                >
                  <LogOut className='mr-3 h-4 w-4' />
                  Cerrar Sesión
                </Button>
              </nav>
            </CardContent>
          </Card>
        </aside>

        {/* Main Content */}
        <section className='lg:w-3/4'>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {/* Information Tab */}
            <TabsContent value='information'>
              <Card className='bg-white/95 backdrop-blur-sm border border-[#D2B48C]/20 shadow-xl'>
                <CardHeader className='bg-gradient-to-r from-[#4A3728] to-[#5D4037] text-white rounded-t-lg'>
                  <CardTitle className='flex items-center gap-2'>
                    <User className='h-5 w-5' />
                    Información Personal
                  </CardTitle>
                  <CardDescription className='text-gray-200'>
                    Gestiona tu información personal y de contacto
                  </CardDescription>
                </CardHeader>
                <CardContent className='p-6'>
                  {loadingInfo
                    ? (
                    <div className='flex justify-center items-center py-12'>
                      <Loading position='start' />
                    </div>
                      )
                    : (
                    <form onSubmit={noEditUser ? (e) => e.preventDefault() : handleSubmitInfo} className='space-y-6'>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <div className='space-y-2'>
                          <Label htmlFor='name' className='text-[#4A3728] font-medium'>
                            Nombre *
                          </Label>
                          <div className='relative'>
                            <User className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#8D6E63]' />
                            <Input
                              disabled={noEditUser}
                              id='name'
                              placeholder={dataClient.data?.name || 'Ingresa tu nombre'}
                              value={dataClient?.edit?.name || ''}
                              onChange={(e) => handleInputChange('name', e.target.value)}
                              className={`pl-10 border-[#D2B48C]/30 focus:ring-[#D2B48C] focus:border-[#D2B48C] ${
                                validationErrors.name ? 'border-red-300' : ''
                              } ${noEditUser ? 'bg-gray-50' : 'bg-white'}`}
                            />
                          </div>
                          {validationErrors.name && (
                            <p className='text-xs text-red-600 flex items-center gap-1'>
                              <AlertCircle className='h-3 w-3' />
                              {validationErrors.name}
                            </p>
                          )}
                        </div>

                        <div className='space-y-2'>
                          <Label htmlFor='lastName' className='text-[#4A3728] font-medium'>
                            Apellido *
                          </Label>
                          <div className='relative'>
                            <User className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#8D6E63]' />
                            <Input
                              disabled={noEditUser}
                              id='lastName'
                              placeholder={dataClient.data?.last_name || 'Ingresa tu apellido'}
                              value={dataClient?.edit?.last_name || ''}
                              onChange={(e) => handleInputChange('last_name', e.target.value)}
                              className={`pl-10 border-[#D2B48C]/30 focus:ring-[#D2B48C] focus:border-[#D2B48C] ${
                                validationErrors.last_name ? 'border-red-300' : ''
                              } ${noEditUser ? 'bg-gray-50' : 'bg-white'}`}
                            />
                          </div>
                          {validationErrors.last_name && (
                            <p className='text-xs text-red-600 flex items-center gap-1'>
                              <AlertCircle className='h-3 w-3' />
                              {validationErrors.last_name}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className='space-y-2'>
                        <Label htmlFor='email' className='text-[#4A3728] font-medium'>
                          Correo Electrónico *
                        </Label>
                        <div className='relative'>
                          <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#8D6E63]' />
                          <Input
                            disabled={noEditUser}
                            id='email'
                            type='email'
                            placeholder={dataClient.data?.email || 'ejemplo@correo.com'}
                            value={dataClient?.edit?.email || ''}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className={`pl-10 border-[#D2B48C]/30 focus:ring-[#D2B48C] focus:border-[#D2B48C] ${
                              validationErrors.email ? 'border-red-300' : ''
                            } ${noEditUser ? 'bg-gray-50' : 'bg-white'}`}
                          />
                        </div>
                        {validationErrors.email && (
                          <p className='text-xs text-red-600 flex items-center gap-1'>
                            <AlertCircle className='h-3 w-3' />
                            {validationErrors.email}
                          </p>
                        )}
                      </div>

                      <div className='space-y-2'>
                        <Label htmlFor='number' className='text-[#4A3728] font-medium'>
                          Teléfono *
                        </Label>
                        <div className='relative'>
                          <Phone className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#8D6E63]' />
                          <Input
                            disabled={noEditUser}
                            id='number'
                            type='tel'
                            placeholder={dataClient.data?.phone_number || '+57 300 123 4567'}
                            value={dataClient?.edit?.phone_number || ''}
                            onChange={(e) => handleInputChange('phone_number', e.target.value)}
                            className={`pl-10 border-[#D2B48C]/30 focus:ring-[#D2B48C] focus:border-[#D2B48C] ${
                              validationErrors.phone_number ? 'border-red-300' : ''
                            } ${noEditUser ? 'bg-gray-50' : 'bg-white'}`}
                          />
                        </div>
                        {validationErrors.phone_number && (
                          <p className='text-xs text-red-600 flex items-center gap-1'>
                            <AlertCircle className='h-3 w-3' />
                            {validationErrors.phone_number}
                          </p>
                        )}
                      </div>

                      <div className='flex gap-4 pt-4'>
                        {noEditUser
                          ? (
                          <Button
                            type='button'
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              console.log('Activando modo edición usuario, noEditUser actual:', noEditUser)
                              setNoEditUser(false)
                            }}
                            className='bg-[#4A3728] hover:bg-[#5D4037] text-white transition-all duration-200'
                          >
                            <Edit3 className='mr-2 h-4 w-4' />
                            Editar Perfil
                          </Button>
                            )
                          : (
                          <>
                            <Button
                              type='submit'
                              disabled={savingUser || Object.keys(validationErrors).length > 0}
                              className='bg-[#4A3728] hover:bg-[#5D4037] text-white transition-all duration-200'
                            >
                              {savingUser
                                ? (
                                <>
                                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                  Guardando...
                                </>
                                  )
                                : (
                                <>
                                  <Save className='mr-2 h-4 w-4' />
                                  Guardar Cambios
                                </>
                                  )}
                            </Button>
                            <Button
                              type='button'
                              variant='outline'
                              onClick={() => {
                                setNoEditUser(true)
                                resetUserData()
                              }}
                              className='border-[#D2B48C] text-[#4A3728] hover:bg-[#D2B48C]/10'
                            >
                              Cancelar
                            </Button>
                          </>
                            )}
                      </div>
                    </form>
                      )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Invoices Tab */}
            {login?.role === ROLES.CLIENTE && (
              <TabsContent value='invoices'>
                <Card className='bg-white/95 backdrop-blur-sm border border-[#D2B48C]/20 shadow-xl'>
                  <CardHeader className='bg-gradient-to-r from-[#4A3728] to-[#5D4037] text-white rounded-t-lg'>
                    <CardTitle className='flex items-center gap-2'>
                      <FileText className='h-5 w-5' />
                      Historial de Facturas
                    </CardTitle>
                    <CardDescription className='text-gray-200'>
                      Revisa tus facturas recientes y su estado
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='p-6'>
                    <div className='mb-4 flex justify-between items-center'>
                      <Badge variant='outline' className='border-[#D2B48C] text-[#4A3728]'>
                        {history?.length > 0 ? `${history.length} facturas encontradas` : 'Sin facturas'}
                      </Badge>
                    </div>

                    <div className='space-y-4'>
                      {loadingBills
                        ? (
                        <div className='flex justify-center items-center py-12'>
                          <Loading position='start' />
                        </div>
                          )
                        : history?.length > 0
                          ? (
                              history
                                .sort((a, b) => b.id - a.id)
                                .map((item) => (
                            <Bills
                              key={item.id}
                              id={item.id}
                              date={item.date}
                              total={formatPrice(item.total)}
                              user={item.user?.name}
                            />
                                ))
                            )
                          : (
                        <div className='text-center py-12'>
                          <FileText className='mx-auto h-12 w-12 text-gray-400 mb-4' />
                          <h3 className='text-lg font-medium text-gray-900 mb-2'>No hay facturas</h3>
                          <p className='text-gray-500'>Cuando realices compras, aparecerán aquí.</p>
                        </div>
                            )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* Auction History Tab */}
            {login?.role === ROLES.CLIENTE && (
              <TabsContent value='auctions'>
                <Card className='bg-white/95 backdrop-blur-sm border border-[#D2B48C]/20 shadow-xl'>
                  <CardHeader className='bg-gradient-to-r from-[#4A3728] to-[#5D4037] text-white rounded-t-lg'>
                    <CardTitle className='flex items-center gap-2'>
                      <Gavel className='h-5 w-5' />
                      Historial de Subastas
                    </CardTitle>
                    <CardDescription className='text-gray-200'>
                      Revisa tus pujas y el estado de pago de las subastas ganadas
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='p-6'>
                    <div className='mb-4 flex justify-between items-center'>
                      <Badge variant='outline' className='border-[#D2B48C] text-[#4A3728]'>
                        {auctionHistory?.length > 0 ? `${auctionHistory.length} subastas` : 'Sin subastas'}
                      </Badge>
                    </div>

                    <div className='space-y-4'>
                      {loadingAuctions
                        ? (
                        <div className='flex justify-center items-center py-12'>
                          <Loading position='start' />
                        </div>
                          )
                        : auctionHistory?.length > 0
                          ? (
                              auctionHistory
                                .sort((a, b) => b.id - a.id)
                                .map((item) => (
                            <AuctionHistoryItem
                              key={item.id}
                              id={item.id}
                              auctionId={item.auction_id}
                              productId={item.product_id}
                              productName={item.product_name}
                              productImage={item.product_image}
                              finalPrice={item.final_price}
                              bidDate={item.date}
                              paymentStatus={item.status}
                            />
                                ))
                            )
                          : (
                        <div className='text-center py-12'>
                          <Gavel className='mx-auto h-12 w-12 text-gray-400 mb-4' />
                          <h3 className='text-lg font-medium text-gray-900 mb-2'>No has participado en subastas</h3>
                          <p className='text-gray-500'>Cuando participes en subastas, aparecerán aquí.</p>
                        </div>
                            )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
            {/* Reports Tab */}
            {login?.role === ROLES.CLIENTE && (
              <TabsContent value='reports'>
                <div className='space-y-6'>
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    <Card className='bg-gradient-to-br from-[#33691E] to-[#1B5E20] text-white border-0'>
                      <CardHeader className='flex flex-row items-center justify-between pb-2'>
                        <CardTitle className='text-sm font-medium'>Total Gastado</CardTitle>
                        <DollarSign className='h-4 w-4 opacity-70' />
                      </CardHeader>
                      <CardContent>
                        <div className='text-2xl font-bold'>{formatPrice(reportStats.totalSpent)}</div>
                      </CardContent>
                    </Card>

                    <Card className='bg-white/95 backdrop-blur-sm border border-[#D2B48C]/20'>
                      <CardHeader className='flex flex-row items-center justify-between pb-2'>
                        <CardTitle className='text-sm font-medium text-[#4A3728]'>Órdenes Totales</CardTitle>
                        <ShoppingCart className='h-4 w-4 text-[#33691E]' />
                      </CardHeader>
                      <CardContent>
                        <div className='text-2xl font-bold text-[#4A3728]'>{reportStats.totalOrders}</div>
                        <p className='text-xs text-[#8D6E63] mt-1'>Compras realizadas</p>
                      </CardContent>
                    </Card>

                    <Card className='bg-white/95 backdrop-blur-sm border border-[#D2B48C]/20'>
                      <CardHeader className='flex flex-row items-center justify-between pb-2'>
                        <CardTitle className='text-sm font-medium text-[#4A3728]'>Subastas Ganadas</CardTitle>
                        <Award className='h-4 w-4 text-[#33691E]' />
                      </CardHeader>
                      <CardContent>
                        <div className='text-2xl font-bold text-[#4A3728]'>{reportStats.wonAuctions}</div>
                        <p className='text-xs text-[#8D6E63] mt-1'>Participaciones exitosas</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Compras por marca */}
                  <Card className='bg-white/95 backdrop-blur-sm border border-[#D2B48C]/20 shadow-xl'>
                    <CardHeader className='bg-gradient-to-r from-[#4A3728] to-[#5D4037] text-white rounded-t-lg'>
                      <CardTitle className='flex items-center gap-2'>
                        <Package className='h-5 w-5' />
                        Compras por Marca
                      </CardTitle>

                    </CardHeader>
                    <CardContent className='p-6'>
                      <div className='space-y-4'>
                        {brandPurchases.map((brand, index) => (
                          <div key={index} className='flex items-center justify-between p-4 bg-gradient-to-r from-[#D2B48C]/10 to-transparent rounded-lg border border-[#D2B48C]/30'>
                            <div className='flex items-center gap-4'>
                              <div className='w-12 h-12 rounded-full bg-gradient-to-br from-[#4A3728] to-[#5D4037] flex items-center justify-center text-white font-bold'>
                                {brand.brand.charAt(0)}
                              </div>
                              <div>
                                <p className='font-semibold text-[#4A3728]'>{brand.brand}</p>
                                <p className='text-sm text-[#8D6E63]'>{brand.purchases} compras</p>
                              </div>
                            </div>
                            <div className='text-right'>
                              <p className='text-xl font-bold text-[#33691E]'>{formatPrice(brand.total)}</p>
                              <Badge className='mt-1 bg-[#33691E]/10 text-[#33691E] hover:bg-[#33691E]/20'>
                                {((brand.purchases / reportStats.totalOrders) * 100).toFixed(1)}%
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                </div>
              </TabsContent>
            )}

            {/* Brand Information Tab */}
            {login?.role === ROLES.VENDEDOR && (
              <TabsContent value='information-brand'>
                <Card className='bg-white/95 backdrop-blur-sm border border-[#D2B48C]/20 shadow-xl'>
                  <CardHeader className='bg-gradient-to-r from-[#4A3728] to-[#5D4037] text-white rounded-t-lg'>
                    <CardTitle className='flex items-center gap-2'>
                      <Building className='h-5 w-5' />
                      Información de la Marca
                    </CardTitle>
                    <CardDescription className='text-gray-200'>
                      Gestiona la información de tu marca y logo
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='p-6'>
                    {loadingInfo
                      ? (
                      <div className='flex justify-center items-center py-12'>
                        <Loading position='start' />
                      </div>
                        )
                      : (
                      <form
                        onSubmit={noEditBrand ? (e) => e.preventDefault() : handleSubmitInfoBrand}
                        className='space-y-6'
                      >
                        <div className='space-y-2'>
                          <Label htmlFor='brandName' className='text-[#4A3728] font-medium'>
                            Nombre de la Marca *
                          </Label>
                          <div className='relative'>
                            <Building className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#8D6E63]' />
                            <Input
                              disabled={noEditBrand}
                              id='brandName'
                              placeholder={dataBrand.data?.name || 'Nombre de tu marca'}
                              value={dataBrand?.edit?.name || ''}
                              onChange={(e) => handleBrandInputChange('name', e.target.value)}
                              className={`pl-10 border-[#D2B48C]/30 focus:ring-[#D2B48C] focus:border-[#D2B48C] ${
                                noEditBrand ? 'bg-gray-50' : 'bg-white'
                              }`}
                            />
                          </div>
                        </div>

                        {/* Image Upload Section */}
                        <div className='space-y-4'>
                          <Label className='text-[#4A3728] font-medium'>Logo de la Marca</Label>
                          <div
                            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                              noEditBrand
                                ? 'border-gray-200 bg-gray-50'
                                : 'border-[#D2B48C]/50 hover:border-[#D2B48C] bg-white'
                            }`}
                            onDrop={handleDrop}
                            onDragOver={(e) => e.preventDefault()}
                          >
                            {selectedImages.length > 0 || imageUrls || dataBrand.data?.image_url
                              ? (
                              <div className='space-y-4'>
                                <div className='relative inline-block'>
                                  <img
                                    src={
                                      selectedImages.length > 0
                                        ? URL.createObjectURL(selectedImages[0])
                                        : imageUrls || dataBrand.data?.image_url
                                    }
                                    alt='Logo preview'
                                    className='h-32 w-32 object-cover rounded-lg mx-auto border-2 border-[#D2B48C]/20'
                                  />
                                  {!noEditBrand && (
                                    <button
                                      type='button'
                                      onClick={handleRemoveImage}
                                      disabled={uploading}
                                      className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors'
                                      title='Eliminar imagen'
                                    >
                                      <XIcon className='h-4 w-4' />
                                    </button>
                                  )}
                                </div>
                                {!noEditBrand && (
                                  <Button
                                    type='button'
                                    variant='outline'
                                    onClick={() => document.getElementById('brandImage').click()}
                                    disabled={uploading}
                                    className='border-[#D2B48C] text-[#4A3728] hover:bg-[#D2B48C]/10'
                                  >
                                    <Camera className='mr-2 h-4 w-4' />
                                    Cambiar imagen
                                  </Button>
                                )}
                              </div>
                                )
                              : (
                              <div className='space-y-4'>
                                <Upload className='mx-auto h-12 w-12 text-[#8D6E63]' />
                                <div>
                                  <p className='text-lg font-medium text-[#4A3728] mb-2'>
                                    Arrastra y suelta tu logo aquí
                                  </p>
                                  <p className='text-sm text-[#8D6E63] mb-4'>o haz clic para seleccionar un archivo</p>
                                  <p className='text-xs text-[#8D6E63]'>PNG, JPG hasta 5MB</p>
                                </div>
                                {!noEditBrand && (
                                  <Button
                                    type='button'
                                    variant='outline'
                                    onClick={() => document.getElementById('brandImage').click()}
                                    disabled={uploading}
                                    className='border-[#D2B48C] text-[#4A3728] hover:bg-[#D2B48C]/10'
                                  >
                                    {uploading
                                      ? (
                                      <>
                                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                        Subiendo...
                                      </>
                                        )
                                      : (
                                      <>
                                        <Upload className='mr-2 h-4 w-4' />
                                        Seleccionar imagen
                                      </>
                                        )}
                                  </Button>
                                )}
                              </div>
                                )}

                            <input
                              id='brandImage'
                              type='file'
                              accept='image/*'
                              style={{ display: 'none' }}
                              onChange={handleImageChange}
                              disabled={noEditBrand}
                            />
                          </div>
                        </div>

                        <div className='flex gap-4 pt-4'>
                          {noEditBrand
                            ? (
                            <Button
                              type='button'
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                console.log('Activando modo edición marca, noEditBrand actual:', noEditBrand)
                                setNoEditBrand(false)
                              }}
                              className='bg-[#4A3728] hover:bg-[#5D4037] text-white transition-all duration-200'
                            >
                              <Edit3 className='mr-2 h-4 w-4' />
                              Editar Marca
                            </Button>
                              )
                            : (
                            <>
                              <Button
                                type='submit'
                                disabled={savingBrand}
                                className='bg-[#4A3728] hover:bg-[#5D4037] text-white transition-all duration-200'
                              >
                                {savingBrand
                                  ? (
                                  <>
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                    Guardando...
                                  </>
                                    )
                                  : (
                                  <>
                                    <Save className='mr-2 h-4 w-4' />
                                    Guardar Cambios
                                  </>
                                    )}
                              </Button>
                              <Button
                                type='button'
                                variant='outline'
                                onClick={() => {
                                  setNoEditBrand(true)
                                  resetBrandData()
                                }}
                                className='border-[#D2B48C] text-[#4A3728] hover:bg-[#D2B48C]/10'
                              >
                                Cancelar
                              </Button>
                            </>
                              )}
                        </div>
                      </form>
                        )}
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </section>
      </main>

      {/* Toast Container */}
      <ToastContainer
        position='bottom-right'
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover
        theme='dark'
        transition={Bounce}
      />
    </div>
  )
}

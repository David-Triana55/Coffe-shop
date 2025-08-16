'use client'
import React, { useState } from 'react'
import { Coffee, Upload, DollarSign, Package, XIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function CreateProduct () {
  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    category: '',
    origin: '',
    quantity: '',
    unit: 'kg',
    minPrice: '',
    duration: '',
    durationType: 'hours',
    roastLevel: '',
    processingMethod: '',
    certifications: ''
  })

  const [selectedImages, setSelectedImages] = useState([])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    console.log(e.target.files)
    console.log(Array.from(e.target.files))
    setSelectedImages(prev => [...prev, ...files])
    e.target.value = null
  }

  const handleRemoveImage = (index) => {
    setSelectedImages(prev => prev.filter((_, idx) => idx !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formDataToSend = new FormData()
    formDataToSend.append('productName', formData.productName)
    formDataToSend.append('description', formData.description)
    formDataToSend.append('category', formData.category)
    formDataToSend.append('origin', formData.origin)
    formDataToSend.append('quantity', formData.quantity)
    formDataToSend.append('unit', formData.unit)
    formDataToSend.append('minPrice', formData.minPrice)
    formDataToSend.append('duration', formData.duration)
    formDataToSend.append('durationType', formData.durationType)
    formDataToSend.append('roastLevel', formData.roastLevel)
    formDataToSend.append('processingMethod', formData.processingMethod)
    formDataToSend.append('certifications', formData.certifications)

    console.log('Selected images:', selectedImages)

    selectedImages.forEach((file) => {
      formDataToSend.append('content', file)
    })

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataToSend

      })

      console.log('Response status:', response)

      const result = await response.json()
      if (response.ok) {
        alert(result.message)
      } else {
        alert(result.message || 'Error en la solicitud')
      }
    } catch (err) {
      console.error('Error al enviar la solicitud:', err)
      alert('Ocurrió un error inesperado.')
    }
  }

  console.log(formData)

  console.log(selectedImages)

  return (
    <div className='min-h-screen bg-[#D7CCC8] text-[#3E2723]'>
      <header className='bg-[#3E2723] text-white p-4'>
        <div className='container mx-auto flex justify-between items-center'>
          <div className='flex items-center space-x-4'>
            <Coffee className='h-8 w-8' />
            <h1 className='text-2xl font-bold'>Crear Nuevo Producto</h1>
          </div>
          <nav className='hidden md:flex space-x-4'>
            <a href='#' className='hover:text-[#D7CCC8]'>Dashboard</a>
            <a href='#' className='hover:text-[#D7CCC8]'>Mis Subastas</a>
            <a href='#' className='hover:text-[#D7CCC8]'>Perfil</a>
          </nav>
        </div>
      </header>

      <main className='container mx-auto p-4'>
        <div className='mb-6'>
          <h2 className='text-3xl font-bold mb-2'>Crear Nuevo Producto</h2>
          <p className='text-lg'>Complete la información de tu producto para comenzar la subasta</p>
        </div>

        <form onSubmit={handleSubmit} className='max-w-4xl mx-auto'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center'>
                  <Package className='mr-2 h-5 w-5' />
                  Información del Producto
                </CardTitle>
                <CardDescription>Detalles básicos de tu producto</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='productName'>Nombre del Producto *</Label>
                  <Input
                    id='productName'
                    placeholder='Ej: Café Colombiano Premium'
                    value={formData.productName}
                    onChange={(e) => handleInputChange('productName', e.target.value)}
                    required
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='description'>Descripción</Label>
                  <Textarea
                    id='description'
                    placeholder='Describe las características especiales de tu producto...'
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                  />
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='category'>Categoría</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder='Seleccionar' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='arabica'>Arábica</SelectItem>
                        <SelectItem value='robusta'>Robusta</SelectItem>
                        <SelectItem value='blend'>Mezcla</SelectItem>
                        <SelectItem value='specialty'>Especialidad</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='origin'>Origen</Label>
                    <Input
                      id='origin'
                      placeholder='Ej: Huila, Colombia'
                      value={formData.origin}
                      onChange={(e) => handleInputChange('origin', e.target.value)}
                    />
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='roastLevel'>Nivel de Tostado</Label>
                    <Select value={formData.roastLevel} onValueChange={(value) => handleInputChange('roastLevel', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder='Seleccionar' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='light'>Claro</SelectItem>
                        <SelectItem value='medium'>Medio</SelectItem>
                        <SelectItem value='dark'>Oscuro</SelectItem>
                        <SelectItem value='green'>Verde (sin tostar)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='processingMethod'>Método de Procesamiento</Label>
                    <Select value={formData.processingMethod} onValueChange={(value) => handleInputChange('processingMethod', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder='Seleccionar' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='washed'>Lavado</SelectItem>
                        <SelectItem value='natural'>Natural</SelectItem>
                        <SelectItem value='honey'>Honey</SelectItem>
                        <SelectItem value='semi-washed'>Semi-lavado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='certifications'>Certificaciones</Label>
                  <Input
                    id='certifications'
                    placeholder='Ej: Orgánico, Fair Trade, Rainforest Alliance'
                    value={formData.certifications}
                    onChange={(e) => handleInputChange('certifications', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className='flex items-center'>
                  <DollarSign className='mr-2 h-5 w-5' />
                  Configuración de Subasta
                </CardTitle>
                <CardDescription>Define los términos de tu subasta</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='quantity'>Cantidad *</Label>
                    <Input
                      id='quantity'
                      type='number'
                      placeholder='100'
                      value={formData.quantity}
                      onChange={(e) => handleInputChange('quantity', e.target.value)}
                      required
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='unit'>Unidad</Label>
                    <Select value={formData.unit} onValueChange={(value) => handleInputChange('unit', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='kg'>Kilogramos</SelectItem>
                        <SelectItem value='lb'>Libras</SelectItem>
                        <SelectItem value='ton'>Toneladas</SelectItem>
                        <SelectItem value='sack'>Sacos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='minPrice'>Precio Mínimo por {formData.unit} *</Label>
                  <div className='relative'>
                    <DollarSign className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500' />
                    <Input
                      id='minPrice'
                      type='number'
                      step='0.01'
                      placeholder='15.99'
                      className='pl-10'
                      value={formData.minPrice}
                      onChange={(e) => handleInputChange('minPrice', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='duration'>Duración *</Label>
                    <Input
                      id='duration'
                      type='number'
                      placeholder='24'
                      value={formData.duration}
                      onChange={(e) => handleInputChange('duration', e.target.value)}
                      required
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='durationType'>Unidad de Tiempo</Label>
                    <Select value={formData.durationType} onValueChange={(value) => handleInputChange('durationType', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='hours'>Horas</SelectItem>
                        <SelectItem value='days'>Días</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className='bg-[#F5F5DC] p-4 rounded-lg'>
                  <h4 className='font-semibold mb-2'>Resumen de la Subasta</h4>
                  <div className='space-y-1 text-sm'>
                    <p><span className='font-medium'>Producto:</span> {formData.productName || 'Sin especificar'}</p>
                    <p><span className='font-medium'>Cantidad:</span> {formData.quantity || '0'} {formData.unit}</p>
                    <p><span className='font-medium'>Precio mínimo:</span> ${formData.minPrice || '0.00'} por {formData.unit}</p>
                    <p><span className='font-medium'>Duración:</span> {formData.duration || '0'} {formData.durationType}</p>
                    {formData.quantity && formData.minPrice && (
                      <p><span className='font-medium'>Valor mínimo total:</span> ${(parseFloat(formData.quantity) * parseFloat(formData.minPrice || '0')).toFixed(2)}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className='mt-8'>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <Upload className='mr-2 h-5 w-5' />
                Imágenes del Producto
              </CardTitle>
              <CardDescription>Sube fotos de tu producto para atraer más compradores</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className='border-2 border-dashed border-gray-300 rounded-lg p-8 text-center'
                onDrop={e => {
                  e.preventDefault()
                  const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'))
                  console.log(e)
                  setSelectedImages(prev => [...prev, ...files])
                }}
                onDragOver={e => e.preventDefault()}
              >
                <Upload className='mx-auto h-12 w-12 text-gray-400 mb-4' />
                <p className='text-lg font-medium mb-2'>Arrastra y suelta tus imágenes aquí</p>
                <p className='text-sm text-gray-500 mb-4'>o haz clic para seleccionar archivos</p>
                <input
                  id='images'
                  type='file'
                  accept='image/*'
                  multiple
                  style={{ display: 'none' }}
                  onChange={handleImageChange}
                />
                <Button variant='outline' type='button' onClick={() => document.getElementById('images').click()}>
                  Seleccionar Imágenes
                </Button>
                <div className='flex flex-wrap gap-2 mt-4'>
                  {selectedImages.map((img, idx) => (
                    <div key={idx} className='relative'>
                      <img src={URL.createObjectURL(img)} alt='preview' className='h-16 rounded' />
                      <button
                        type='button'
                        onClick={() => handleRemoveImage(idx)}
                        className='absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs'
                        title='Eliminar'
                      >
                        <XIcon className='h-4 w-4' />

                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className='flex justify-end space-x-4 mt-8'>
            <Button variant='outline' type='button'>
              Guardar como Borrador
            </Button>
            <Button onClick={handleSubmit} type='submit' className='bg-[#33691E] hover:bg-[#1B5E20] text-white'>
              Publicar Subasta
            </Button>
          </div>
        </form>
      </main>

      <footer className='bg-[#3E2723] text-white p-4 mt-12'>
        <div className='container mx-auto flex flex-col md:flex-row justify-between items-center'>
          <p>&copy; 2024 Coffee Auction Platform. Todos los derechos reservados.</p>
          <nav className='flex space-x-4 mt-4 md:mt-0'>
            <a href='#' className='hover:text-[#D7CCC8]'>Soporte</a>
            <a href='#' className='hover:text-[#D7CCC8]'>Términos</a>
          </nav>
        </div>
      </footer>
    </div>
  )
}

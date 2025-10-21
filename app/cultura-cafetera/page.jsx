'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Coffee,
  Droplets,
  Thermometer,
  Clock,
  MapPin,
  Leaf,
  Star,
  ChevronRight,
  Globe,
  Mountain,
  Zap,
  Filter,
  Beaker,
  Package,
  Brain as Grain,
  Sparkles
} from 'lucide-react'
import Image from 'next/image'

export default function CulturaCafetera () {
  const [activeSection, setActiveSection] = useState('metodos')

  const menuItems = [
    { id: 'metodos', label: 'Métodos de Preparación', icon: Coffee },
    { id: 'presentaciones', label: 'Presentaciones', icon: Package },
    { id: 'origenes', label: 'Orígenes del Café', icon: Globe },
    { id: 'categorias', label: 'Categorías', icon: Leaf }
  ]

  const metodos = [
    {
      name: 'Espresso',
      icon: Zap,
      tiempo: '25-30 seg',
      temperatura: '90-96°C',
      descripcion: 'Método de extracción rápida que produce un café concentrado y aromático.',
      caracteristicas: ['Alta presión (9 bares)', 'Molienda fina', 'Crema dorada', 'Sabor intenso'],
      color: 'from-amber-500 to-orange-600'
    },
    {
      name: 'Pour Over',
      icon: Droplets,
      tiempo: '3-4 min',
      temperatura: '92-96°C',
      descripcion: 'Método manual que permite control total sobre la extracción.',
      caracteristicas: ['Vertido controlado', 'Molienda media', 'Filtro de papel', 'Sabor limpio'],
      color: 'from-blue-500 to-cyan-600'
    },
    {
      name: 'French Press',
      icon: Filter,
      tiempo: '4 min',
      temperatura: '93-96°C',
      descripcion: 'Inmersión completa que extrae aceites naturales del café.',
      caracteristicas: ['Inmersión total', 'Molienda gruesa', 'Filtro metálico', 'Cuerpo completo'],
      color: 'from-green-500 to-emerald-600'
    },
    {
      name: 'Chemex',
      icon: Beaker,
      tiempo: '4-6 min',
      temperatura: '92-96°C',
      descripcion: 'Elegante método que produce un café limpio y brillante.',
      caracteristicas: ['Filtro especial', 'Molienda media-gruesa', 'Diseño icónico', 'Sabor puro'],
      color: 'from-purple-500 to-violet-600'
    }
  ]

  const presentaciones = [
    {
      name: 'Grano Entero',
      icon: Grain,
      descripcion: 'Café en su forma más pura para moler justo antes de preparar.',
      ventajas: ['Máxima frescura', 'Control de molienda', 'Mejor aroma', 'Mayor duración'],
      color: 'from-amber-600 to-yellow-600'
    },
    {
      name: 'Café Molido',
      icon: Sparkles,
      descripcion: 'Listo para preparar, aunque con menor frescura que el grano.',
      ventajas: ['Practicidad', 'Disponible en varios tipos', 'Más accesible'],
      color: 'from-brown-500 to-amber-700'
    },
    {
      name: 'Café Instantáneo',
      icon: Zap,
      descripcion: 'Café soluble que se prepara en segundos.',
      ventajas: ['Rápido', 'Duradero', 'Portátil', 'Económico'],
      color: 'from-orange-500 to-red-600'
    },
    {
      name: 'Cápsulas',
      icon: Package,
      descripcion: 'Porciones individuales para máquinas específicas.',
      ventajas: ['Consistencia', 'Conveniencia', 'Variedad de sabores'],
      color: 'from-indigo-500 to-purple-600'
    }
  ]

  const origenes = [
    {
      pais: 'Robusta',
      region: 'África Occidental, Vietnam, Brasil',
      altitud: '200-800m',
      perfil: 'Fuerte, amargo, más cafeína',
      descripcion: 'El café robusta aporta cuerpo y un golpe extra de cafeína.',
      caracteristicas: ['Mayor cafeína', 'Sabor intenso y amargo', 'Resistente a plagas', 'Cuerpo pesado'],
      bandera: '🌍',
      color: 'from-red-600 to-orange-600'
    },
    {
      pais: 'Liberica',
      region: 'Filipinas, Malasia, África Occidental',
      altitud: '200-600m',
      perfil: 'Afrutado, ahumado',
      descripcion: 'Un café poco común con sabores intensos y notas ahumadas.',
      caracteristicas: ['Granos grandes', 'Aroma floral', 'Producción limitada', 'Sabor único'],
      bandera: '🌏',
      color: 'from-purple-500 to-pink-600'
    },
    {
      pais: 'Excelsa',
      region: 'Sudeste Asiático',
      altitud: '1,000-1,300m',
      perfil: 'Ácido, exótico',
      descripcion: 'Aporta complejidad y acidez brillante en las mezclas.',
      caracteristicas: ['Notas afrutadas', 'Alta acidez', 'Muy exclusiva', 'Perfil exótico'],
      bandera: '🌐',
      color: 'from-indigo-500 to-purple-600'
    },
    {
      pais: 'Arábica',
      region: 'América Latina, África del Este',
      altitud: '1,200-2,000m',
      perfil: 'Suave, aromático, menos cafeína',
      descripcion: 'La especie más cultivada y valorada por su suavidad.',
      caracteristicas: ['Mayor acidez', 'Sabor balanceado', 'Menos cafeína', 'Cultivo en altura'],
      bandera: '☕',
      color: 'from-green-500 to-teal-600'
    }
  ]

  const categorias = [
    {
      nombre: 'Arábica',
      cientifico: 'Coffea arabica',
      porcentaje: '60-70%',
      descripcion: 'La más popular y apreciada por su suavidad y aroma.',
      caracteristicas: ['Suave y dulce', 'Menos cafeína', 'Mayor acidez'],
      regiones: ['América Latina', 'África Oriental', 'Asia'],
      color: 'from-emerald-500 to-teal-600'
    },
    {
      nombre: 'Robusta',
      cientifico: 'Coffea canephora',
      porcentaje: '30-40%',
      descripcion: 'Resistente y con más cafeína, aporta intensidad.',
      caracteristicas: ['Sabor amargo', 'Más cafeína', 'Resistente a plagas'],
      regiones: ['África Occidental', 'Brasil', 'Vietnam'],
      color: 'from-red-500 to-orange-600'
    },
    {
      nombre: 'Liberica',
      cientifico: 'Coffea liberica',
      porcentaje: '<2%',
      descripcion: 'Un sabor fuerte y poco común, con notas ahumadas.',
      caracteristicas: ['Granos grandes', 'Aroma floral', 'Producción baja'],
      regiones: ['Filipinas', 'Malasia', 'Liberia'],
      color: 'from-purple-500 to-pink-600'
    },
    {
      nombre: 'Excelsa',
      cientifico: 'Coffea excelsa',
      porcentaje: '<1%',
      descripcion: 'Rara y muy usada para dar complejidad a mezclas.',
      caracteristicas: ['Sabor afrutado', 'Alta acidez', 'Muy exclusiva'],
      regiones: ['Vietnam', 'Filipinas', 'Chad'],
      color: 'from-indigo-500 to-purple-600'
    }
  ]

  useEffect(() => {
    const handleScroll = () => {
      const sections = menuItems.map((item) => item.id)
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-[#D7CCC8] via-[#EFEBE9] to-[#D7CCC8] text-[#3E2723] mt-14'>
      <div className='flex w-full'>
        {/* Sidebar */}
        <aside className='h-screen sticky w-80 top-14 bg-white/90 backdrop-blur-sm border-r border-[#D7CCC8] shadow-lg'>
          <div className='p-6'>
            <div className='text-center mb-8'>
              <div className='w-16 h-16 bg-gradient-to-r from-[#3E2723] to-[#5D4037] rounded-full flex items-center justify-center mx-auto mb-4'>
                <Image
                  width={80}
                  height={80}
                  alt='logo cofeeshop'
                  src='/logo.svg'
                />
              </div>
              <h1 className='text-2xl font-bold text-[#3E2723] mb-2'>Cultura Cafetera</h1>
              <p className='text-sm text-[#5D4037]'>Guía interactiva del mundo del café</p>
            </div>

            <nav className='space-y-2'>
              {menuItems.map((item) => {
                const Icon = item.icon
                return (
                  <Button
                    key={item.id}
                    variant='ghost'
                    className={`w-full justify-start text-left p-4 h-auto transition-all duration-300 ${
                      activeSection === item.id
                        ? 'bg-gradient-to-r from-[#3E2723] to-[#5D4037] text-white shadow-lg'
                        : 'hover:bg-[#D7CCC8]/30 text-[#3E2723]'
                    }`}
                    onClick={() => scrollToSection(item.id)}
                  >
                    <Icon className='h-5 w-5 mr-3 flex-shrink-0' />
                    <span className='flex-1'>{item.label}</span>
                    <ChevronRight
                      className={`h-4 w-4 transition-transform ${activeSection === item.id ? 'rotate-90' : ''}`}
                    />
                  </Button>
                )
              })}
            </nav>

            <div className='mt-8 p-4 bg-gradient-to-r from-[#33691E]/10 to-[#8BC34A]/10 rounded-xl'>
              <h3 className='font-semibold text-[#3E2723] mb-2'>¿Sabías que...?</h3>
              <p className='text-sm text-[#5D4037]'>
                El café es la segunda bebida más consumida en el mundo después del agua, y la segunda mercancía más
                comercializada después del petróleo.
              </p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className='flex-1 p-4'>
          {/* Hero Section */}
          <section className='mb-16 text-center'>
            <div className='relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#3E2723] via-[#5D4037] to-[#3E2723] p-12 text-white'>
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=60 height=60 viewBox=0 0 60 60 xmlns=http://www.w3.org/2000/svg%3E%3Cg fill=none fillRule=evenodd%3E%3Cg fill=%23ffffff fillOpacity=0.05%3E%3Ccircle cx=30 cy=30 r=2/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20" />
              <div className='relative'>
                <h1 className='text-5xl font-bold mb-6'>Descubre el Mundo del Café</h1>
                <p className='text-xl max-w-3xl mx-auto leading-relaxed opacity-90'>
                  Sumérgete en una experiencia interactiva que te llevará desde los métodos de preparación más
                  tradicionales hasta los orígenes más exóticos del café. Aprende, explora y conviértete en un verdadero
                  conocedor de esta fascinante bebida.
                </p>
              </div>
            </div>
          </section>

          {/* Métodos de Preparación */}
          <section id='metodos' className='mb-20'>
            <div className='text-center mb-12'>
              <h2 className='text-4xl font-bold mb-4 text-[#3E2723]'>Métodos de Preparación</h2>
              <p className='text-lg text-[#5D4037] max-w-2xl mx-auto'>
                Cada método de preparación resalta diferentes características del café, desde su cuerpo hasta su acidez
              </p>
            </div>

            <div className='grid md:grid-cols-2 gap-8'>
              {metodos.map((metodo, index) => {
                const Icon = metodo.icon
                return (
                  <Card
                    key={index}
                    className='group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white/80 backdrop-blur-sm border-0 overflow-hidden'
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${metodo.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                    />
                    <CardHeader className='relative z-10'>
                      <CardTitle className='flex items-center text-xl'>
                        <div
                          className={`p-3 rounded-full bg-gradient-to-br ${metodo.color} mr-4 group-hover:scale-110 transition-transform duration-300`}
                        >
                          <Icon className='h-6 w-6 text-white' />
                        </div>
                        {metodo.name}
                      </CardTitle>
                      <div className='flex gap-4 text-sm text-[#5D4037]'>
                        <div className='flex items-center'>
                          <Clock className='h-4 w-4 mr-1' />
                          {metodo.tiempo}
                        </div>
                        <div className='flex items-center'>
                          <Thermometer className='h-4 w-4 mr-1' />
                          {metodo.temperatura}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className='relative z-10'>
                      <CardDescription className='text-[#5D4037] leading-relaxed mb-4'>
                        {metodo.descripcion}
                      </CardDescription>
                      <div className='space-y-2'>
                        {metodo.caracteristicas.map((caracteristica, idx) => (
                          <div key={idx} className='flex items-center text-sm'>
                            <div className='w-2 h-2 bg-[#33691E] rounded-full mr-3 flex-shrink-0' />
                            {caracteristica}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </section>

          {/* Presentaciones */}
          <section id='presentaciones' className='mb-20'>
            <div className='text-center mb-12'>
              <h2 className='text-4xl font-bold mb-4 text-[#3E2723]'>Presentaciones del Café</h2>
              <p className='text-lg text-[#5D4037] max-w-2xl mx-auto'>
                Cada presentación tiene sus ventajas y es ideal para diferentes situaciones y preferencias
              </p>
            </div>

            <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
              {presentaciones.map((presentacion, index) => {
                const Icon = presentacion.icon
                return (
                  <Card
                    key={index}
                    className='group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white/80 backdrop-blur-sm border-0'
                  >
                    <CardHeader className='text-center'>
                      <div
                        className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${presentacion.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                      >
                        <Icon className='h-8 w-8 text-white' />
                      </div>
                      <CardTitle className='text-lg'>{presentacion.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className='text-[#5D4037] leading-relaxed mb-4'>
                        {presentacion.descripcion}
                      </CardDescription>
                      <div className='space-y-2'>
                        {presentacion.ventajas.map((ventaja, idx) => (
                          <Badge key={idx} variant='outline' className='mr-2 mb-2 text-xs'>
                            {ventaja}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </section>

          {/* Orígenes */}
          <section id='origenes' className='mb-20'>
            <div className='text-center mb-12'>
              <h2 className='text-4xl font-bold mb-4 text-[#3E2723]'>Orígenes del Café</h2>
              <p className='text-lg text-[#5D4037] max-w-2xl mx-auto'>
                Cada región cafetera del mundo aporta características únicas que definen el perfil de sabor
              </p>
            </div>

            <div className='space-y-8'>
              {origenes.map((origen, index) => (
                <Card
                  key={index}
                  className='group hover:shadow-2xl transition-all duration-500 bg-white/80 backdrop-blur-sm border-0 overflow-hidden'
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${origen.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                  />
                  <CardContent className='p-8 relative z-10'>
                    <div className='grid md:grid-cols-3 gap-8 items-center'>
                      <div className='text-center'>
                        <div className='text-6xl mb-4'>{origen.bandera}</div>
                        <h3 className='text-2xl font-bold text-[#3E2723] mb-2'>{origen.pais}</h3>
                        <p className='text-[#5D4037] font-medium'>{origen.region}</p>
                      </div>

                      <div className='space-y-4'>
                        <div>
                          <h4 className='font-semibold text-[#3E2723] mb-2'>Perfil de Sabor</h4>
                          <p className='text-[#5D4037]'>{origen.perfil}</p>
                        </div>
                        <div className='flex items-center text-sm text-[#5D4037]'>
                          <Mountain className='h-4 w-4 mr-2' />
                          Altitud: {origen.altitud}
                        </div>
                      </div>

                      <div>
                        <h4 className='font-semibold text-[#3E2723] mb-3'>Características</h4>
                        <div className='space-y-2'>
                          {origen.caracteristicas.map((caracteristica, idx) => (
                            <div key={idx} className='flex items-center text-sm'>
                              <Star className='h-3 w-3 text-[#33691E] mr-2 flex-shrink-0' />
                              {caracteristica}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className='mt-6 pt-6 border-t border-[#D7CCC8]'>
                      <p className='text-[#5D4037] leading-relaxed'>{origen.descripcion}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Categorías */}
          <section id='categorias' className='mb-10'>
            <div className='text-center mb-12'>
              <h2 className='text-4xl font-bold mb-4 text-[#3E2723]'>Categorías del Café</h2>
              <p className='text-lg text-[#5D4037] max-w-2xl mx-auto'>
                Las diferentes especies de café que determinan las características fundamentales de la bebida
              </p>
            </div>

            <div className='grid md:grid-cols-2 gap-8'>
              {categorias.map((categoria, index) => (
                <Card
                  key={index}
                  className='group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white/80 backdrop-blur-sm border-0 overflow-hidden'
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${categoria.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                  />
                  <CardHeader className='relative z-10'>
                    <div className='flex items-center justify-between mb-4'>
                      <CardTitle className='text-2xl'>{categoria.nombre}</CardTitle>
                      <Badge className={`bg-gradient-to-r ${categoria.color} text-white border-0 px-3 py-1`}>
                        {categoria.porcentaje}
                      </Badge>
                    </div>
                    <p className='text-sm text-[#5D4037] italic'>{categoria.cientifico}</p>
                  </CardHeader>
                  <CardContent className='relative z-10'>
                    <CardDescription className='text-[#5D4037] leading-relaxed mb-6'>
                      {categoria.descripcion}
                    </CardDescription>

                    <div className='space-y-4'>
                      <div>
                        <h4 className='font-semibold text-[#3E2723] mb-2'>Características</h4>
                        <div className='space-y-2'>
                          {categoria.caracteristicas.map((caracteristica, idx) => (
                            <div key={idx} className='flex items-center text-sm'>
                              <div className='w-2 h-2 bg-[#33691E] rounded-full mr-3 flex-shrink-0' />
                              {caracteristica}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className='font-semibold text-[#3E2723] mb-2'>Principales Regiones</h4>
                        <div className='flex flex-wrap gap-2'>
                          {categoria.regiones.map((region, idx) => (
                            <Badge key={idx} variant='outline' className='text-xs'>
                              <MapPin className='h-3 w-3 mr-1' />
                              {region}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Call to Action */}
          <section className='text-center py-3'>
            <div className='bg-gradient-to-r from-[#3E2723] via-[#5D4037] to-[#3E2723] rounded-3xl p-12 text-white relative overflow-hidden'>
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=60 height=60 viewBox=0 0 60 60 xmlns=http://www.w3.org/2000/svg%3E%3Cg fill=none fillRule=evenodd%3E%3Cg fill=%23ffffff fillOpacity=0.05%3E%3Ccircle cx=30 cy=30 r=2/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20" />
              <div className='relative z-10'>
                <h2 className='text-3xl font-bold mb-4'>¿Listo para explorar nuestros cafés?</h2>
                <p className='text-lg mb-8 opacity-90 max-w-2xl mx-auto'>
                  Ahora que conoces más sobre la cultura cafetera, descubre nuestra selección de cafés premium de
                  diferentes orígenes y métodos de preparación.
                </p>
                <Button
                  size='lg'
                  className='bg-[#33691E] hover:bg-[#1B5E20] text-white px-8 py-3 text-lg'
                  onClick={() => (window.location.href = '/Tienda')}
                >
                  Explorar Tienda
                </Button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

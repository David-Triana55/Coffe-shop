import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Globe, Leaf, Store, TrendingUp, Truck } from 'lucide-react'

export default function PageVision () {
  return (
    <div className='mt-14 pb-5 px-3 min-h-screen bg-[#D7CCC8] text-[#3E2723]'>
    <section className='text-center py-12'>
    <h1 className='text-4xl font-bold mb-6'>Nuestra Visión</h1>
    <p className='text-xl max-w-3xl mx-auto px-1'>
      En Coffee Shop, aspiramos a ser el puente entre los mejores productores de café y los amantes de esta bebida en todo el mundo. Nuestra visión es revolucionar la industria de la distribución de café, promoviendo la calidad, la sostenibilidad y la innovación en cada grano que entregamos.
    </p>
  </section>

  <section className='mb-12'>
    <div className='grid md:grid-cols-2 gap-8 items-center'>
      <div>
        <h2 className='text-3xl text-center font-bold mb-4 px-3'>Transformando la Distribución del Café</h2>
        <p className='text-lg mb-6 px-2'>
          Imaginamos un futuro donde cada taza de café cuente la historia de su origen, donde los productores reciban un trato justo, y donde la calidad y la sostenibilidad sean la norma. Nos esforzamos por ser líderes en la innovación de la cadena de suministro del café, conectando productores con tostadores y consumidores de manera eficiente y transparente.
        </p>

      </div>
      <div className='rounded-lg overflow-hidden shadow-xl '>
        <img src='https://aradbranding.com/fa/uploads/topics/mceu_91416365841673342171063.jpg' alt='Visión de Coffee Distributors' className='w-full h-auto object-contain ' />
      </div>
    </div>
  </section>

  <section className='py-12'>
    <h2 className='text-3xl font-bold mb-8 text-center'>Pilares de Nuestra Visión</h2>
    <div className='grid md:grid-cols-3 gap-6'>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center'>
            <Globe className='mr-2 h-6 w-6 text-[#33691E]' />
            Alcance Global
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Expandir nuestra red de distribución a nivel internacional, conectando productores de café de calidad con mercados en todo el mundo.</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center'>
            <Leaf className='mr-2 h-6 w-6 text-[#33691E]' />
            Sostenibilidad Integral
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Implementar prácticas sostenibles en toda nuestra cadena de suministro, desde el cultivo hasta la entrega, minimizando nuestro impacto ambiental.</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center'>
            <TrendingUp className='mr-2 h-6 w-6 text-[#33691E]' />
            Innovación Logística
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Desarrollar tecnologías y sistemas logísticos avanzados para optimizar la distribución y garantizar la frescura del café en cada entrega.</p>
        </CardContent>
      </Card>
    </div>
  </section>

  <section className='py-6  bg-white rounded-lg shadow-lg'>
    <h2 className='text-3xl font-bold mb-8 text-center'>Nuestro Camino Hacia el Futuro</h2>
    <div className='grid md:grid-cols-2 gap-8 px-6'>
      <div>
        <h3 className='text-2xl font-semibold mb-4 flex items-center'>
          <Truck className='mr-2 h-6 w-6 text-[#33691E]' />
          Objetivos de Distribución
        </h3>
        <ul className='list-disc list-inside space-y-2'>
          <li>Establecer centros de distribución en distintos puntos a lo largo del mundo</li>
          <li>Desarrollar empaques 100% biodegradables para todas nuestras líneas de productos</li>
          <li>Lograr una flota de vehículos de entrega 100% eléctrica en áreas urbanas</li>
        </ul>
      </div>
      <div>
        <h3 className='text-2xl font-semibold mb-4 flex items-center'>
          <Store className='mr-2 h-6 w-6 text-[#33691E]' />
          Impacto en la Industria
        </h3>
        <ul className='list-disc list-inside space-y-2'>
          <li>Establecer asociaciones directas con 1,000 pequeños productores de café</li>
          <li>Crear un programa de certificación de calidad y sostenibilidad líder en la industria</li>
          <li>Lanzar una plataforma educativa en línea sobre café para profesionales y entusiastas</li>
        </ul>
      </div>
    </div>
  </section>

  </div>
  )
}

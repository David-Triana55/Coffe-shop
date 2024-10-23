import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Coffee, Leaf, Scale, Truck, Users } from 'lucide-react'

export default function PageMision () {
  return (
    <div className='min-h-screen bg-[#D7CCC8] text-[#3E2723] mt-14'>

    <main className='container mx-auto p-4'>
      <section className='text-center py-12'>
        <h1 className='text-4xl font-bold mb-6'>Nuestra Misión</h1>
        <p className='text-xl max-w-3xl mx-auto'>
          En Coffee Shop, nuestra misión es conectar a los amantes del café con los mejores granos del mundo,
          promoviendo prácticas sostenibles y apoyando a las comunidades productoras, mientras ofrecemos un servicio
          de distribución excepcional y eficiente.
        </p>
      </section>

      <section className='mb-12'>
        <div className='grid md:grid-cols-2 gap-8 items-center'>
          <div className='rounded-lg overflow-hidden shadow-xl'>
            <img src='https://th.bing.com/th/id/R.fc15352c8c9a8b9ed1d84ee3ae69eca2?rik=5xt%2f0tjGyW9oEg&riu=http%3a%2f%2fwww.lacasadelcafe.net%2fwp-content%2fuploads%2f2016%2f01%2fgranos-cafe.jpg&ehk=PBDlZHeDtGO0%2bAsAlOAmtF3Rf5vfYV4PKkA0aPEknts%3d&risl=&pid=ImgRaw&r=0' alt='Misión de Coffee Distributors' className='w-full h-auto' />
          </div>
          <div>
            <h2 className='text-3xl font-bold mb-4'>Nuestro Compromiso</h2>
            <p className='text-lg mb-6'>
              Nos dedicamos a elevar la experiencia del café en cada etapa de la cadena de suministro.
              Desde la selección cuidadosa de los mejores granos hasta la entrega puntual a nuestros clientes,
              nos esforzamos por mantener los más altos estándares de calidad y servicio.
            </p>
          </div>
        </div>
      </section>

      <section className='py-12'>
        <h2 className='text-3xl font-bold mb-8 text-center'>Pilares de Nuestra Misión</h2>
        <div className='grid md:grid-cols-3 gap-6'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <Scale className='mr-2 h-6 w-6 text-[#33691E]' />
                Calidad Superior
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Nos comprometemos a distribuir solo los granos de café de la más alta calidad,
                 cuidadosamente seleccionados y manejados para preservar su frescura y sabor.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <Leaf className='mr-2 h-6 w-6 text-[#33691E]' />
                Sostenibilidad
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Promovemos prácticas sostenibles en toda nuestra cadena de suministro,
                 desde el cultivo hasta la distribución, minimizando nuestro impacto ambiental.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <Users className='mr-2 h-6 w-6 text-[#33691E]' />
                Apoyo Comunitario
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Trabajamos en estrecha colaboración con las comunidades productoras de café,
                 asegurando prácticas de comercio justo y apoyando su desarrollo económico.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className='py-12 bg-white rounded-lg shadow-lg'>
        <h2 className='text-3xl font-bold mb-8 text-center'>Cómo Cumplimos Nuestra Misión</h2>
        <div className='grid md:grid-cols-2 gap-8 px-6'>
          <div>
            <h3 className='text-2xl font-semibold mb-4 flex items-center'>
              <Coffee className='mr-2 h-6 w-6 text-[#33691E]' />
              Selección y Control de Calidad
            </h3>
            <ul className='list-disc list-inside space-y-2'>
              <li>Evaluación rigurosa de cada lote de café</li>
              <li>Colaboración con expertos catadores de café</li>
              <li>Implementación de estándares de calidad estrictos</li>
              <li>Inversión en tecnología de análisis de granos</li>
            </ul>
          </div>
          <div>
            <h3 className='text-2xl font-semibold mb-4 flex items-center'>
              <Truck className='mr-2 h-6 w-6 text-[#33691E]' />
              Distribución Eficiente
            </h3>
            <ul className='list-disc list-inside space-y-2'>
              <li>Optimización de rutas de distribución</li>
              <li>Uso de vehículos de bajo impacto ambiental</li>
              <li>Sistemas de seguimiento en tiempo real</li>
              <li>Embalaje sostenible para preservar la frescura</li>
            </ul>
          </div>
        </div>
      </section>

    </main>

  </div>
  )
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Coffee, Leaf, Scale, Truck, Users, Globe, TrendingUp, Award, Store, Heart, Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default function SobreNosotros () {
  return (
    <div className='min-h-screen bg-gradient-to-br bg-[#D7CCC8]  text-[#3E2723] mt-14'>
      <main className='container mx-auto p-4'>
        {/* Hero Section */}
        <section className='text-center py-16 relative'>
          <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-3xl' />
          <div className='relative '>
            <Badge className='mb-4 bg-[#33691E] text-white px-6 py-2 text-sm font-medium'>
              Desde 2009 conectando el mundo del café
            </Badge>
            <h1 className='text-6xl font-bold mb-6 bg-gradient-to-r from-[#3E2723] to-[#33691E] bg-clip-text text-transparent'>
              Sobre Nosotros
            </h1>
            <p className='text-xl max-w-4xl mx-auto leading-relaxed text-[#5D4037]'>
              En Coffee Shop, somos más que distribuidores de café. Somos apasionados por conectar a los amantes del
              café con los mejores granos del mundo, promoviendo prácticas sostenibles y creando experiencias
              excepcionales.
            </p>
          </div>
        </section>

        {/* Nuestra Historia */}
        <section className='mb-20'>
          <div className='text-center mb-12'>
            <h2 className='text-5xl font-bold mb-6 text-[#3E2723]'>Nuestra Historia</h2>
            <div className='w-24 h-1 bg-gradient-to-r from-[#33691E] to-[#8BC34A] mx-auto mb-8' />
          </div>

          <div className='bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-2xl mb-12'>
            <p className='text-lg mb-12 max-w-4xl mx-auto text-center leading-relaxed text-[#5D4037]'>
              Coffee Shop nació de la idea de crear un espacio donde la simplicidad y el buen café se encuentren. Todo
              empezó cuando Ana y Lucas, grandes amigos y amantes del café, decidieron abrir un pequeño lugar que
              reflejara su pasión por los sabores auténticos. Inspirados en los cafés tradicionales y en los pequeños
              productores locales, se propusieron ofrecer una experiencia única: un café de calidad, hecho con cuidado y
              dedicado a aquellos que buscan disfrutar cada sorbo.
            </p>
          </div>

          <div className='grid md:grid-cols-2 gap-12 items-center'>
            <div className='relative group'>
              <div className='absolute -inset-4 bg-gradient-to-r from-[#33691E] to-[#8BC34A] rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000' />
              <div className='relative rounded-2xl overflow-hidden shadow-2xl'>
                <img
                  src='https://th.bing.com/th/id/R.c77de196074e48d2cf4aa25515334f22?rik=1x5chQ%2f5MYk8sg&riu=http%3a%2f%2fmexico.infoagro.com%2fwp-content%2fuploads%2f2016%2f06%2fCafe2.jpg&ehk=T79kdnOMFlo8zvHIoHg1bgkLH0XNV0mil31wp9B2goY%3d&risl=&pid=ImgRaw&r=0'
                  alt='Plantación de café'
                  className='w-full h-auto transform group-hover:scale-105 transition duration-700'
                />
              </div>
            </div>
            <div className='bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-xl'>
              <div className='flex items-center mb-4'>
                <Heart className='h-8 w-8 text-[#33691E] mr-3' />
                <h3 className='text-3xl font-bold text-[#3E2723]'>Un Viaje de Descubrimiento</h3>
              </div>
              <p className='text-lg leading-relaxed text-[#5D4037]'>
                Ana y Lucas pasaron meses explorando distintas regiones cafeteras, desde las montañas de Colombia hasta
                pequeñas fincas en Centroamérica. En cada lugar, descubrieron técnicas artesanales de cultivo y tueste,
                aprendiendo de productores locales comprometidos con el café de calidad. Estas conexiones y aprendizajes
                inspiran cada taza en Coffee Shop, donde se refleja la dedicación y el amor por el buen café.
              </p>
            </div>
          </div>
        </section>

        {/* Nuestra Misión */}
        <section className='mb-20'>
          <div className='bg-gradient-to-r from-[#3E2723] to-[#5D4037] rounded-3xl p-12 text-white shadow-2xl'>
            <div className='text-center mb-12'>
              <h2 className='text-5xl font-bold mb-6'>Nuestra Misión</h2>
              <div className='w-24 h-1 bg-gradient-to-r from-[#8BC34A] to-[#CDDC39] mx-auto mb-8' />
              <p className='text-xl max-w-4xl mx-auto leading-relaxed opacity-90'>
                Conectar a los amantes del café con los mejores granos del mundo, promoviendo prácticas sostenibles y
                apoyando a las comunidades productoras, mientras ofrecemos un servicio de distribución excepcional y
                eficiente.
              </p>
            </div>

            <div className='grid md:grid-cols-2 gap-12 items-center'>
              <div className='bg-white/10 backdrop-blur-sm rounded-2xl p-8'>
                <h3 className='text-3xl font-bold mb-6 flex items-center'>
                  <Coffee className='h-8 w-8 text-[#8BC34A] mr-3' />
                  Nuestro Compromiso
                </h3>
                <p className='text-lg leading-relaxed opacity-90'>
                  Nos dedicamos a elevar la experiencia del café en cada etapa de la cadena de suministro. Desde la
                  selección cuidadosa de los mejores granos hasta la entrega puntual a nuestros clientes, nos esforzamos
                  por mantener los más altos estándares de calidad y servicio.
                </p>
              </div>
              <div className='relative group'>
                <div className='absolute -inset-4 bg-gradient-to-r from-[#8BC34A] to-[#CDDC39] rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000' />
                <div className='relative rounded-2xl overflow-hidden shadow-2xl'>
                  <img
                    src='https://th.bing.com/th/id/R.fc15352c8c9a8b9ed1d84ee3ae69eca2?rik=5xt%2f0tjGyW9oEg&riu=http%3a%2f%2fwww.lacasadelcafe.net%2fwp-content%2fuploads%2f2016%2f01%2fgranos-cafe.jpg&ehk=PBDlZHeDtGO0%2bAsAlOAmtF3Rf5vfYV4PKkA0aPEknts%3d&risl=&pid=ImgRaw&r=0'
                    alt='Granos de café de calidad'
                    className='w-full h-auto transform group-hover:scale-105 transition duration-700'
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Nuestra Visión */}
        <section className='mb-20'>
          <div className='text-center mb-12'>
            <h2 className='text-5xl font-bold mb-6 text-[#3E2723]'>Nuestra Visión</h2>
            <div className='w-24 h-1 bg-gradient-to-r from-[#33691E] to-[#8BC34A] mx-auto mb-8' />
            <p className='text-xl max-w-4xl mx-auto leading-relaxed text-[#5D4037]'>
              Aspiramos a ser el puente entre los mejores productores de café y los amantes de esta bebida en todo el
              mundo. Nuestra visión es revolucionar la industria de la distribución de café, promoviendo la calidad, la
              sostenibilidad y la innovación en cada grano que entregamos.
            </p>
          </div>

          <div className='grid md:grid-cols-2 gap-12 items-center'>
            <div className='bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-xl'>
              <div className='flex items-center mb-6'>
                <Star className='h-8 w-8 text-[#33691E] mr-3' />
                <h3 className='text-3xl font-bold text-[#3E2723]'>Transformando la Distribución del Café</h3>
              </div>
              <p className='text-lg leading-relaxed text-[#5D4037]'>
                Imaginamos un futuro donde cada taza de café cuente la historia de su origen, donde los productores
                reciban un trato justo, y donde la calidad y la sostenibilidad sean la norma. Nos esforzamos por ser
                líderes en la innovación de la cadena de suministro del café, conectando productores con tostadores y
                consumidores de manera eficiente y transparente.
              </p>
            </div>
            <div className='relative group'>
              <div className='absolute -inset-4 bg-gradient-to-r from-[#33691E] to-[#8BC34A] rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000' />
              <div className='relative rounded-2xl overflow-hidden shadow-2xl'>
                <img
                  src='https://aradbranding.com/fa/uploads/topics/mceu_91416365841673342171063.jpg'
                  alt='Visión de Coffee Distributors'
                  className='w-full h-auto object-contain transform group-hover:scale-105 transition duration-700'
                />
              </div>
            </div>
          </div>
        </section>

        {/* Nuestros Pilares */}
        <section className='py-16 mb-20'>
          <div className='text-center mb-16'>
            <h2 className='text-5xl font-bold mb-6 text-[#3E2723]'>Nuestros Pilares</h2>
            <div className='w-24 h-1 bg-gradient-to-r from-[#33691E] to-[#8BC34A] mx-auto mb-8' />
            <p className='text-lg text-[#5D4037] max-w-2xl mx-auto'>
              Los valores fundamentales que guían cada decisión y acción en nuestra empresa
            </p>
          </div>

          <div className='grid md:grid-cols-3 gap-8'>
            {[
              {
                icon: Scale,
                title: 'Calidad Superior',
                description:
                  'Nos comprometemos a distribuir solo los granos de café de la más alta calidad, cuidadosamente seleccionados y manejados para preservar su frescura y sabor.',
                gradient: 'from-[#FF6B6B] to-[#FF8E53]'
              },
              {
                icon: Leaf,
                title: 'Sostenibilidad',
                description:
                  'Promovemos prácticas sostenibles en toda nuestra cadena de suministro, desde el cultivo hasta la distribución, minimizando nuestro impacto ambiental.',
                gradient: 'from-[#4ECDC4] to-[#44A08D]'
              },
              {
                icon: Users,
                title: 'Apoyo Comunitario',
                description:
                  'Trabajamos en estrecha colaboración con las comunidades productoras de café, asegurando prácticas de comercio justo y apoyando su desarrollo económico.',
                gradient: 'from-[#A8E6CF] to-[#7FCDCD]'
              },
              {
                icon: Globe,
                title: 'Alcance Global',
                description:
                  'Expandimos nuestra red de distribución a nivel internacional, conectando productores de café de calidad con mercados en todo el mundo.',
                gradient: 'from-[#FFD93D] to-[#FF6B6B]'
              },
              {
                icon: Award,
                title: 'Excelencia',
                description:
                  'Cada grano es seleccionado y tostado con precisión, garantizando una experiencia de café excepcional en cada sorbo.',
                gradient: 'from-[#74B9FF] to-[#0984E3]'
              },
              {
                icon: TrendingUp,
                title: 'Innovación',
                description:
                  'Desarrollamos tecnologías y sistemas logísticos avanzados para optimizar la distribución y garantizar la frescura del café en cada entrega.',
                gradient: 'from-[#FD79A8] to-[#E84393]'
              }
            ].map((pilar, index) => (
              <Card
                key={index}
                className='group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white/80 backdrop-blur-sm border-0 overflow-hidden'
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${pilar.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                />
                <CardHeader className='relative z-10'>
                  <CardTitle className='flex items-center text-xl'>
                    <div
                      className={`p-3 rounded-full bg-gradient-to-br ${pilar.gradient} mr-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <pilar.icon className='h-6 w-6 text-white' />
                    </div>
                    {pilar.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className='relative z-10'>
                  <CardDescription className='text-[#5D4037] leading-relaxed'>{pilar.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Cómo Cumplimos Nuestros Objetivos */}
        <section className='py-16 bg-white/60 backdrop-blur-sm rounded-3xl shadow-2xl mb-20'>
          <h2 className='text-5xl font-bold mb-16 text-center text-[#3E2723]'>Cómo Cumplimos Nuestros Objetivos</h2>
          <div className='grid md:grid-cols-2 gap-12 px-8'>
            <div className='space-y-8'>
              <div className='bg-gradient-to-r from-[#33691E]/10 to-[#8BC34A]/10 rounded-2xl p-6'>
                <h3 className='text-2xl font-semibold mb-6 flex items-center text-[#3E2723]'>
                  <div className='p-2 rounded-full bg-gradient-to-r from-[#33691E] to-[#8BC34A] mr-4'>
                    <Coffee className='h-6 w-6 text-white' />
                  </div>
                  Selección y Control de Calidad
                </h3>
                <ul className='space-y-3 text-[#5D4037]'>
                  <li className='flex items-start'>
                    <div className='w-2 h-2 bg-[#33691E] rounded-full mt-2 mr-3 flex-shrink-0' />
                    Evaluación rigurosa de cada lote de café
                  </li>
                  <li className='flex items-start'>
                    <div className='w-2 h-2 bg-[#33691E] rounded-full mt-2 mr-3 flex-shrink-0' />
                    Colaboración con expertos catadores de café
                  </li>
                  <li className='flex items-start'>
                    <div className='w-2 h-2 bg-[#33691E] rounded-full mt-2 mr-3 flex-shrink-0' />
                    Implementación de estándares de calidad estrictos
                  </li>
                  <li className='flex items-start'>
                    <div className='w-2 h-2 bg-[#33691E] rounded-full mt-2 mr-3 flex-shrink-0' />
                    Inversión en tecnología de análisis de granos
                  </li>
                </ul>
              </div>

              <div className='bg-gradient-to-r from-[#8BC34A]/10 to-[#CDDC39]/10 rounded-2xl p-6'>
                <h3 className='text-2xl font-semibold mb-6 flex items-center text-[#3E2723]'>
                  <div className='p-2 rounded-full bg-gradient-to-r from-[#8BC34A] to-[#CDDC39] mr-4'>
                    <Truck className='h-6 w-6 text-white' />
                  </div>
                  Distribución Eficiente
                </h3>
                <ul className='space-y-3 text-[#5D4037]'>
                  <li className='flex items-start'>
                    <div className='w-2 h-2 bg-[#8BC34A] rounded-full mt-2 mr-3 flex-shrink-0' />
                    Optimización de rutas de distribución
                  </li>
                  <li className='flex items-start'>
                    <div className='w-2 h-2 bg-[#8BC34A] rounded-full mt-2 mr-3 flex-shrink-0' />
                    Uso de vehículos de bajo impacto ambiental
                  </li>
                  <li className='flex items-start'>
                    <div className='w-2 h-2 bg-[#8BC34A] rounded-full mt-2 mr-3 flex-shrink-0' />
                    Sistemas de seguimiento en tiempo real
                  </li>
                  <li className='flex items-start'>
                    <div className='w-2 h-2 bg-[#8BC34A] rounded-full mt-2 mr-3 flex-shrink-0' />
                    Embalaje sostenible para preservar la frescura
                  </li>
                </ul>
              </div>
            </div>

            <div className='space-y-8'>
              <div className='bg-gradient-to-r from-[#FF6B6B]/10 to-[#FF8E53]/10 rounded-2xl p-6'>
                <h3 className='text-2xl font-semibold mb-6 flex items-center text-[#3E2723]'>
                  <div className='p-2 rounded-full bg-gradient-to-r from-[#FF6B6B] to-[#FF8E53] mr-4'>
                    <Globe className='h-6 w-6 text-white' />
                  </div>
                  Objetivos de Expansión
                </h3>
                <ul className='space-y-3 text-[#5D4037]'>
                  <li className='flex items-start'>
                    <div className='w-2 h-2 bg-[#FF6B6B] rounded-full mt-2 mr-3 flex-shrink-0' />
                    Establecer centros de distribución en distintos puntos del mundo
                  </li>
                  <li className='flex items-start'>
                    <div className='w-2 h-2 bg-[#FF6B6B] rounded-full mt-2 mr-3 flex-shrink-0' />
                    Desarrollar empaques 100% biodegradables
                  </li>
                  <li className='flex items-start'>
                    <div className='w-2 h-2 bg-[#FF6B6B] rounded-full mt-2 mr-3 flex-shrink-0' />
                    Lograr una flota de vehículos 100% eléctrica en áreas urbanas
                  </li>
                </ul>
              </div>

              <div className='bg-gradient-to-r from-[#74B9FF]/10 to-[#0984E3]/10 rounded-2xl p-6'>
                <h3 className='text-2xl font-semibold mb-6 flex items-center text-[#3E2723]'>
                  <div className='p-2 rounded-full bg-gradient-to-r from-[#74B9FF] to-[#0984E3] mr-4'>
                    <Store className='h-6 w-6 text-white' />
                  </div>
                  Impacto en la Industria
                </h3>
                <ul className='space-y-3 text-[#5D4037]'>
                  <li className='flex items-start'>
                    <div className='w-2 h-2 bg-[#74B9FF] rounded-full mt-2 mr-3 flex-shrink-0' />
                    Establecer asociaciones directas con 1,000 pequeños productores
                  </li>
                  <li className='flex items-start'>
                    <div className='w-2 h-2 bg-[#74B9FF] rounded-full mt-2 mr-3 flex-shrink-0' />
                    Crear un programa de certificación de calidad líder en la industria
                  </li>
                  <li className='flex items-start'>
                    <div className='w-2 h-2 bg-[#74B9FF] rounded-full mt-2 mr-3 flex-shrink-0' />
                    Lanzar una plataforma educativa sobre café para profesionales
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Final */}
        <section className='relative overflow-hidden'>
          <div className='absolute inset-0 bg-gradient-to-r from-[#3E2723] via-[#5D4037] to-[#3E2723] rounded-3xl' />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=60 height=60 viewBox=0 0 60 60 xmlns=http://www.w3.org/2000/svg%3E%3Cg fill=none fillRule=evenodd%3E%3Cg fill=%23ffffff fillOpacity=0.05%3E%3Ccircle cx=30 cy=30 r=2/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20" />
          <div className='relative z-10 text-center py-16 px-8 text-white'>
            <h2 className='text-4xl font-bold mb-6'>Únete a Nuestra Historia</h2>
            <p className='text-lg max-w-3xl mx-auto mb-12 leading-relaxed opacity-90'>
              Cada taza de café que distribuimos lleva consigo nuestra pasión, compromiso y visión de un mundo donde el
              café de calidad sea accesible para todos, mientras apoyamos a las comunidades que lo hacen posible.
            </p>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto'>
              {[
                { number: '15+', label: 'Años de experiencia', gradient: 'from-[#8BC34A] to-[#CDDC39]' },
                { number: '500+', label: 'Productores aliados', gradient: 'from-[#FF6B6B] to-[#FF8E53]' },
                { number: '25+', label: 'Países de origen', gradient: 'from-[#74B9FF] to-[#0984E3]' }
              ].map((stat, index) => (
                <div key={index} className='group'>
                  <div className='bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 transform hover:scale-105'>
                    <div
                      className={`text-4xl font-bold mb-2 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
                    >
                      {stat.number}
                    </div>
                    <div className='text-sm opacity-90 font-medium'>{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

import { Coffee, Leaf, Users, Heart } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default function SobreNosotros () {
  return (
    <div className='min-h-screen bg-[#d7ccc8] text-[#3E2723] mt-14'>
      <main className='container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12'>
        {/* Hero Section */}
        <section className='text-center py-8 sm:py-12 lg:py-16 relative'>
          <div className='relative  px-4'>
            <Badge className='mb-4 bg-[#33691E] text-white px-4 sm:px-6 py-2 text-xs sm:text-sm font-medium'>
              Conectando corazones con el aroma del café
            </Badge>
            <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-[#3E2723] to-[#5D4037] bg-clip-text text-transparent'>
              Sobre Nosotros
            </h1>
            <p className='text-base sm:text-lg max-w-3xl mx-auto leading-relaxed text-[#5D4037]'>
              En <strong>Coffee Shop</strong>, creemos que cada taza cuenta una historia. Nuestra idea surge del deseo
              de crear un espacio donde los caficultores puedan ofrecer directamente su café, conectando con personas
              que valoran su trabajo y la calidad de cada grano.
            </p>
          </div>
        </section>

        {/* Nuestra Esencia */}
        <section className='grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 items-center mb-12 sm:mb-16 lg:mb-20'>
          <div className='relative group order-2 lg:order-1'>
            <div className='absolute -inset-2 sm:-inset-4 bg-[#8D6E63] rounded-xl sm:rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000' />
            <div className='relative rounded-xl sm:rounded-2xl overflow-hidden shadow-xl sm:shadow-2xl'>
              <img
                src='https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=80'
                alt='Caficultor recogiendo granos de café'
                className='w-auto h-auto transform group-hover:scale-105 transition duration-700'
              />
            </div>
          </div>
          <div className='bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg order-1 lg:order-2'>
            <h2 className='text-2xl sm:text-3xl font-bold mb-4 flex items-center flex-wrap'>
              <Heart className='h-6 w-6 sm:h-8 sm:w-8 text-[#5D4037] mr-3 flex-shrink-0' />
              <span>Nuestra Esencia</span>
            </h2>
            <p className='text-base sm:text-lg leading-relaxed text-[#5D4037]'>
              Más que una tienda, somos un puente entre quienes cultivan con amor y quienes disfrutan cada sorbo. Nos
              apasiona el café artesanal y el impacto positivo que genera apoyar directamente a las familias
              productoras.
            </p>
          </div>
        </section>

        {/* Valores */}
        <section className='text-center py-8 sm:py-12 lg:py-4'>
          <h2 className='text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 text-[#3E2723] px-4'>Lo Que Nos Mueve</h2>
          <div className='w-16 sm:w-24 h-1 bg-gradient-to-r from-[#3E2723] to-[#5D4037] mx-auto mb-6 sm:mb-10' />

          <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8'>
            {[
              {
                icon: Coffee,
                title: 'Autenticidad',
                desc: 'Seleccionamos granos únicos, cultivados con respeto por la tierra y las tradiciones.'
              },
              {
                icon: Leaf,
                title: 'Sostenibilidad',
                desc: 'Apoyamos prácticas responsables que protegen el medio ambiente y a las comunidades.'
              },
              {
                icon: Users,
                title: 'Cercanía',
                desc: 'Valoramos las relaciones humanas detrás de cada taza: del cafetal al corazón.'
              }
            ].map((item, i) => (
              <div
                key={i}
                className='bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-[#BCAAA4]'
              >
                <item.icon className='h-8 w-8 sm:h-10 sm:w-10 text-[#5D4037] mx-auto mb-4' />
                <h3 className='text-xl sm:text-2xl font-semibold mb-3 text-[#3E2723]'>{item.title}</h3>
                <p className='text-sm sm:text-base text-[#5D4037] leading-relaxed'>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Cierre */}
        <section className='relative overflow-hidden mt-12 sm:mt-16 lg:mt-20 rounded-2xl lg:rounded-3xl shadow-xl'>
          <div className='absolute inset-0 bg-gradient-to-r from-[#3E2723] via-[#5D4037] to-[#3E2723]' />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=60 height=60 viewBox=0 0 60 60 xmlns=http://www.w3.org/2000/svg%3E%3Cg fill=none fillRule=evenodd%3E%3Cg fill=%23ffffff fillOpacity=0.05%3E%3Ccircle cx=30 cy=30 r=2/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20" />
          <div className='relative z-10 text-center py-12 sm:py-16 px-6 sm:px-8 text-white'>
            <h2 className='text-2xl sm:text-3xl font-bold mb-4'>Cada taza tiene un propósito</h2>
            <p className='text-sm sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed opacity-90'>
              Cuando eliges nuestro café, estás apoyando a pequeños productores, fomentando la sostenibilidad y
              disfrutando del verdadero sabor del origen.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Leaf, Award, Globe } from 'lucide-react'

export default function PageNosotros () {
  return (
    <div className='mt-14 pb-4 px-3 min-h-screen bg-[#D7CCC8] text-[#3E2723]'>
    <section className='text-center py-12'>
      <h1 className='text-4xl font-bold mb-6 text-center'>Nuestra historia</h1>
      <p className='text-lg mb-12 max-w-3xl mx-auto text-center'>
        Coffee Shop nació de la idea de crear un espacio donde la simplicidad y el buen café se encuentren. Todo empezó cuando Ana y Lucas, grandes amigos y amantes del café, decidieron abrir un pequeño lugar que reflejara su pasión por los sabores auténticos. Inspirados en los cafés tradicionales y en los pequeños productores locales, se propusieron ofrecer una experiencia única: un café de calidad, hecho con cuidado y dedicado a aquellos que buscan disfrutar cada sorbo.
      </p>
    </section>
      <div className='grid md:grid-cols-2 gap-8 mb-12'>
        <img src='https://th.bing.com/th/id/R.c77de196074e48d2cf4aa25515334f22?rik=1x5chQ%2f5MYk8sg&riu=http%3a%2f%2fmexico.infoagro.com%2fwp-content%2fuploads%2f2016%2f06%2fCafe2.jpg&ehk=T79kdnOMFlo8zvHIoHg1bgkLH0XNV0mil31wp9B2goY%3d&risl=&pid=ImgRaw&r=0' alt='plantación de café' className='rounded-lg shadow-lg' />
        <article className='flex flex-col justify-center'>
          <h2 className='text-3xl font-bold mb-4'>Un viaje de Descubrimiento</h2>
          <p className='text-lg'>
            Ana y Lucas pasaron meses explorando distintas regiones cafeteras, desde las montañas de Colombia hasta pequeñas fincas en Centroamérica. En cada lugar, descubrieron técnicas artesanales de cultivo y tueste, aprendiendo de productores locales comprometidos con el café de calidad. Estas conexiones y aprendizajes inspiran cada taza en Coffee Shop, donde se refleja la dedicación y el amor por el buen café.
          </p>
        </article>
      </div>

      <div className='mb-12'>
        <h2 className='text-3xl font-bold mb-8 text-center'>Nuestros pilares</h2>
        <section className='grid md:grid-cols-3 gap-6'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <Globe className='mr-2 h-6 w-6 text-[#33691E]' />
                Diversidad
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Celebramos la rica variedad de sabores que el mundo del café tiene para ofrecer, trayendo a tu taza lo mejor de cada rincón del planeta.
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <Award className='mr-2 h-6 w-6 text-[#33691E]' />
                Excelencia
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Cada grano es seleccionado y tostado con precisión, garantizando una experiencia de café excepcional en cada sorbo.
              </CardDescription>
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
              <CardDescription>
                Nos comprometemos a prácticas éticas y sostenibles, apoyando a las comunidades cafeteras y protegiendo los ecosistemas donde crece nuestro café.
              </CardDescription>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}

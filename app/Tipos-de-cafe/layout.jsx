import Footer from '@/components/shared/Footer'
import './style.css'

export default function LayoutTiposDeCafe ({ children }) {
  return (
    <div className='layout_tipos_de_cafe'>
      {children}
      <Footer />
    </div>
  )
}

import Footer from '@/components/Footer/Footer'
import './layout.css'

export default function LayoutTiposDeCafe ({ children }) {
  return (
    <div className='layout_tipos_de_cafe'>
      {children}
      <Footer />
    </div>
  )
}

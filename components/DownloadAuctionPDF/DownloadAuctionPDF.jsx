'use client'

import JsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

const DownloadAuctionPDF = ({ auctionData }) => {
  if (!auctionData) return null

  const formatPrice = (price) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price)

  const loadImageAsDataURL = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0)
        resolve(canvas.toDataURL('image/png'))
      }
      img.onerror = reject
      img.src = url
    })
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

  const generatePDF = async () => {
    const doc = new JsPDF()

    // 🎨 Colores corporativos
    const brandColor = [62, 39, 35] // #3E2723
    const accentColor = [51, 105, 30] // #33691E
    const lightBrown = [215, 204, 200] // #D7CCC8
    const textDark = [93, 64, 55] // #5D4037

    // ==================== HEADER ====================
    doc.setFillColor(...brandColor)
    doc.rect(0, 0, 210, 35, 'F')

    try {
      const logoDataURL = await loadImageAsDataURL('/logo.svg')
      doc.addImage(logoDataURL, 'PNG', 15, 8, 20, 20)
    } catch (error) {
      console.error('Error al cargar el logo:', error)
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(18)
      doc.setFont('helvetica', 'bold')
      doc.text('COFFEE SHOP', 15, 15)
    }

    doc.setTextColor(255, 255, 255)
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('COFFEE SHOP', 38, 15)

    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.text('Experiencia Premium en Café', 38, 21)

    // Título (derecha)
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text('CERTIFICADO DE SUBASTA', 195, 12, { align: 'right' })

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`Subasta No. ${auctionData.auction_id}`, 195, 19, { align: 'right' })

    const currentDate = new Date().toLocaleDateString('es-CO')
    doc.setFontSize(8)
    doc.text(`Emitido: ${currentDate}`, 195, 25, { align: 'right' })

    // ==================== GANADOR ====================
    const clientY = 45

    doc.setFillColor(...lightBrown)
    doc.rect(15, clientY, 180, 7, 'F')
    doc.setTextColor(...brandColor)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('DATOS DEL GANADOR', 20, clientY + 5)

    const infoY = clientY + 13
    doc.setTextColor(...textDark)
    doc.setFontSize(9)

    doc.setFont('helvetica', 'bold')
    doc.text('Nombre:', 20, infoY)
    doc.setFont('helvetica', 'normal')
    doc.text(auctionData.winner_name || 'N/A', 45, infoY)

    doc.setFont('helvetica', 'bold')
    doc.text('Correo:', 20, infoY + 6)
    doc.setFont('helvetica', 'normal')
    doc.text(auctionData.winner_email || 'N/A', 45, infoY + 6)

    // ==================== PRODUCTO ====================
    const productY = infoY + 18
    doc.setFillColor(...lightBrown)
    doc.rect(15, productY, 180, 7, 'F')
    doc.setTextColor(...brandColor)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('INFORMACIÓN DEL PRODUCTO', 20, productY + 5)

    const pInfoY = productY + 13
    doc.setTextColor(...textDark)
    doc.setFontSize(9)

    doc.setFont('helvetica', 'bold')
    doc.text('Producto:', 20, pInfoY)
    doc.setFont('helvetica', 'normal')
    doc.text(auctionData.product_name || 'N/A', 45, pInfoY)



    doc.setFont('helvetica', 'bold')
    doc.text('Vendedor:', 20, pInfoY + 12)
    doc.setFont('helvetica', 'normal')
    doc.text(auctionData.brand_name || 'N/A', 45, pInfoY + 12)

    // ==================== DETALLES DE SUBASTA ====================
    const tableStartY = pInfoY + 22
    autoTable(doc, {
      startY: tableStartY,
      head: [['Concepto', 'Valor']],
      body: [
        ['Precio Inicial', formatPrice(auctionData.initial_price)],
        ['Incremento Mínimo', formatPrice(auctionData.minimum_increment)],
        ['Total de Pujas', auctionData.total_bids?.toString() || '0'],
        ['Precio Final Ganador', formatPrice(auctionData.final_price)]
      ],
      theme: 'striped',
      styles: {
        fontSize: 9,
        cellPadding: 4,
        textColor: textDark
      },
      headStyles: {
        fillColor: brandColor,
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [250, 248, 247]
      },
      columnStyles: {
        0: { cellWidth: 120 },
        1: { cellWidth: 60, halign: 'right' }
      },
      margin: { left: 15, right: 15 }
    })

    // ==================== CRONOLOGÍA ====================
    const chronoY = doc.lastAutoTable.finalY + 10
    doc.setFillColor(...lightBrown)
    doc.rect(15, chronoY, 180, 7, 'F')
    doc.setTextColor(...brandColor)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('CRONOLOGÍA', 20, chronoY + 5)

    const chronoInfoY = chronoY + 13
    doc.setTextColor(...textDark)
    doc.setFontSize(9)

    doc.setFont('helvetica', 'bold')
    doc.text('Inicio de Subasta:', 20, chronoInfoY)
    doc.setFont('helvetica', 'normal')
    doc.text(formatDate(auctionData.start_date), 65, chronoInfoY)

    doc.setFont('helvetica', 'bold')
    doc.text('Fin de Subasta:', 20, chronoInfoY + 6)
    doc.setFont('helvetica', 'normal')
    doc.text(formatDate(auctionData.end_date), 65, chronoInfoY + 6)

    // ==================== ESTADO DE PAGO ====================
    const paymentY = chronoInfoY + 18
    const paymentColor = [76, 175, 80] 
    const paymentText = 'PAGO COMPLETADO'

    doc.setFillColor(...paymentColor)
    doc.roundedRect(15, paymentY, 180, 12, 3, 3, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.text(paymentText, 105, paymentY + 8, { align: 'center' })

    // ==================== NOTA ====================
    const noteY = paymentY + 22
    doc.setTextColor(...textDark)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'italic')
    doc.text(
      'Este certificado confirma que has ganado la subasta. Conserve este documento como comprobante.',
      15,
      noteY
    )

    // ==================== FOOTER ====================
    const footerY = 275
    doc.setFillColor(...brandColor)
    doc.rect(0, footerY - 10, 210, 17, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(8)
    doc.text('Coffee Shop © Todos los derechos reservados', 105, footerY - 3, { align: 'center' })

    // ==================== GUARDAR ====================
    const fileName = `Certificado_Subasta_${auctionData.auction_id}.pdf`
    doc.save(fileName)
  }

  return (
    <Button
      onClick={generatePDF}
      variant='outline'
      size='sm'
      className='border-[#3E2723] text-[#3E2723] hover:bg-[#D7CCC8] hover:text-[#3E2723] transition-colors bg-transparent'
    >
      <Download className='mr-2 h-4 w-4' />
      Descargar PDF
    </Button>
  )
}

export default DownloadAuctionPDF

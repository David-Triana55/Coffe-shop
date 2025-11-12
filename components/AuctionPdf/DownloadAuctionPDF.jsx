'use client'

import JsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { Button } from '@/components/ui/button'
import { FileDown } from 'lucide-react'
import { formatPrice } from '@/utils/formatter'

const DownloadAuctionPDF = ({ auctionData, variant = 'default', size = 'default' }) => {
  const brandColor = [62, 39, 35] // #3E2723
  const accentColor = [51, 105, 30] // #33691E
  const lightBrown = [215, 204, 200] // #D7CCC8
  const textDark = [93, 64, 55] // #5D4037

  const loadImageAsDataURL = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(img, 0, 0)
          resolve(canvas.toDataURL('image/png'))
        }
      }
      img.onerror = reject
      img.src = url
    })
  }

  const addHeader = async (doc, title, subtitle) => {
    doc.setFillColor(...brandColor)
    doc.rect(0, 0, 210, 35, 'F')

    try {
      const logoDataURL = await loadImageAsDataURL('/logo.svg')
      doc.addImage(logoDataURL, 'PNG', 15, 8, 20, 20)
    } catch (error) {
      console.error('Error loading logo:', error)
    }

    doc.setTextColor(255, 255, 255)
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('COFFEE SHOP', 38, 15)

    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.text('Experiencia Premium en Café', 38, 21)

    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.text(title, 195, 12, { align: 'right' })

    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text(subtitle, 195, 20, { align: 'right' })

    const currentDate = new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    doc.setFontSize(8)
    doc.text(`Fecha: ${currentDate}`, 195, 27, { align: 'right' })
  }

  const addFooter = (doc) => {
    const footerY = 270
    doc.setFillColor(...brandColor)
    doc.rect(0, footerY, 210, 27, 'F')

    doc.setTextColor(255, 255, 255)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('Coffee Shop - Certificado de Subasta', 105, footerY + 7, { align: 'center' })

    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.text('Para consultas: subastas@coffeeshop.com | Tel: +57 (300) 123-4567', 105, footerY + 13, {
      align: 'center'
    })

    doc.setFontSize(14)
    doc.text('☕', 20, footerY + 10)
    doc.text('🏆', 105, footerY + 10)
    doc.text('☕', 190, footerY + 10)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const generateAuctionPDF = async () => {
    const doc = new JsPDF()

    await addHeader(doc, 'CERTIFICADO DE SUBASTA', `Subasta #${auctionData.auction_id}`)

    let yPos = 45

    // Banner de congratulaciones
    doc.setFillColor(...accentColor)
    doc.rect(15, yPos, 180, 12, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('🏆 ¡FELICITACIONES - SUBASTA GANADA! 🏆', 105, yPos + 8, { align: 'center' })

    yPos += 22

    // Información del producto
    doc.setFillColor(...lightBrown)
    doc.rect(15, yPos, 180, 7, 'F')
    doc.setTextColor(...brandColor)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text('INFORMACIÓN DEL PRODUCTO', 20, yPos + 5)

    yPos += 15
    doc.setTextColor(...textDark)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('Producto:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(auctionData.product_name, 195, yPos, { align: 'right' })

    yPos += 7
    doc.setFont('helvetica', 'bold')
    doc.text('Categoría:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(auctionData.category_name || 'N/A', 195, yPos, { align: 'right' })

    yPos += 7
    doc.setFont('helvetica', 'bold')
    doc.text('Vendedor:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(auctionData.seller_name, 195, yPos, { align: 'right' })

    yPos += 15

    // Detalles de la subasta
    doc.setFillColor(...lightBrown)
    doc.rect(15, yPos, 180, 7, 'F')
    doc.setTextColor(...brandColor)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text('DETALLES DE LA SUBASTA', 20, yPos + 5)

    yPos += 15

    // Tabla de detalles financieros
    autoTable(doc, {
      startY: yPos,
      theme: 'striped',
      head: [['Concepto', 'Valor']],
      body: [
        ['Precio Inicial', formatPrice(auctionData.initial_price)],
        ['Incremento Mínimo', formatPrice(auctionData.minimum_increment)],
        ['Total de Pujas', auctionData.total_bids?.toString() || '0'],
        ['PRECIO FINAL GANADOR', formatPrice(auctionData.final_price)]
      ],
      styles: {
        fontSize: 10,
        cellPadding: 5,
        textColor: textDark
      },
      headStyles: {
        fillColor: brandColor,
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: 'bold',
        halign: 'center'
      },
      alternateRowStyles: {
        fillColor: [250, 248, 247]
      },
      columnStyles: {
        0: { cellWidth: 130, halign: 'left', fontStyle: 'bold' },
        1: { cellWidth: 50, halign: 'right' }
      },
      didParseCell: function (data) {
        if (data.row.index === 3 && data.column.index === 1) {
          data.cell.styles.fillColor = accentColor
          data.cell.styles.textColor = [255, 255, 255]
          data.cell.styles.fontStyle = 'bold'
          data.cell.styles.fontSize = 12
        }
        if (data.row.index === 3 && data.column.index === 0) {
          data.cell.styles.fillColor = accentColor
          data.cell.styles.textColor = [255, 255, 255]
          data.cell.styles.fontStyle = 'bold'
        }
      },
      margin: { left: 15, right: 15 }
    })

    yPos = doc.lastAutoTable.finalY + 15

    // Fechas
    doc.setFillColor(...lightBrown)
    doc.rect(15, yPos, 180, 7, 'F')
    doc.setTextColor(...brandColor)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text('CRONOLOGÍA', 20, yPos + 5)

    yPos += 15
    doc.setTextColor(...textDark)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('Inicio de Subasta:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(formatDate(auctionData.start_date), 195, yPos, { align: 'right' })

    yPos += 7
    doc.setFont('helvetica', 'bold')
    doc.text('Fin de Subasta:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(formatDate(auctionData.end_date), 195, yPos, { align: 'right' })

    yPos += 15

    // Estado de pago
    doc.setFillColor(auctionData.payment_status === 'paid' ? [76, 175, 80] : [255, 193, 7])
    doc.rect(15, yPos, 180, 12, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    const paymentText = auctionData.payment_status === 'paid' ? '✓ PAGO COMPLETADO' : '⏳ PAGO PENDIENTE'
    doc.text(paymentText, 105, yPos + 8, { align: 'center' })

    yPos += 20

    // Nota informativa
    doc.setDrawColor(...brandColor)
    doc.setLineWidth(0.5)
    doc.rect(15, yPos, 180, 25)
    doc.setTextColor(...textDark)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.text('NOTA IMPORTANTE:', 20, yPos + 7)
    doc.setFont('helvetica', 'normal')
    const noteText = 'Este certificado confirma que has ganado la subasta. Por favor, conserva este documento como comprobante. Para coordinar la entrega del producto, contacta con nuestro equipo de atención al cliente.'
    const splitNote = doc.splitTextToSize(noteText, 170)
    doc.text(splitNote, 20, yPos + 13)

    addFooter(doc)

    const fileName = `Certificado_Subasta_${auctionData.auction_id}_${new Date()
      .toISOString()
      .split('T')[0]}.pdf`
    doc.save(fileName)
  }

  return (
    <Button
      onClick={generateAuctionPDF}
      variant={variant}
      size={size}
      className='bg-[#33691E] hover:bg-[#1B5E20] text-white'
    >
      <FileDown className='mr-2 h-4 w-4' />
      Descargar Certificado
    </Button>
  )
}

export default DownloadAuctionPDF
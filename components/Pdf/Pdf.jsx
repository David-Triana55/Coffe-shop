'use client'

import JsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { Button } from '../ui/button'
import { Download } from 'lucide-react'

const DownloadPDFButton = ({ detailBill, billProduct, subTotal }) => {
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

  const generatePDF = async () => {
    const doc = new JsPDF()

    // Colores corporativos
    const brandColor = [74, 55, 40] // #3E2723
    const accentColor = [51, 105, 30] // #33691E
    const lightBrown = [215, 204, 200] // #D7CCC8
    const textDark = [93, 64, 55] // #5D4037

    // ==================== ENCABEZADO ====================
    doc.setFillColor(...brandColor)
    doc.rect(0, 0, 210, 35, 'F')

    // Cargar y agregar logo
    try {
      const logoDataURL = await loadImageAsDataURL('/logo.svg')
      // Agregar logo en la esquina superior izquierda
      doc.addImage(logoDataURL, 'PNG', 15, 8, 20, 20)
    } catch (error) {
      console.error('Error al cargar el logo:', error)
      // Si falla, usar texto como fallback
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(18)
      doc.setFont('helvetica', 'bold')
      doc.text('COFFEE SHOP', 15, 12)
    }

    // Nombre de la empresa (al lado del logo)
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('COFFEE SHOP', 38, 15)

    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.text('Experiencia Premium en Café', 38, 21)

    // FACTURA (derecha)
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text('FACTURA', 195, 12, { align: 'right' })

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`No. ${String(detailBill.id).substring(0, 8).padStart(6, '0')}`, 195, 19, { align: 'right' })

    const formattedDate = new Date(detailBill.date).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
    doc.setFontSize(8)
    doc.text(`Fecha: ${formattedDate}`, 195, 25, { align: 'right' })

    // ==================== INFORMACIÓN DEL CLIENTE ====================
    const clientY = 45

    // Título sección
    doc.setFillColor(...lightBrown)
    doc.rect(15, clientY, 180, 7, 'F')
    doc.setTextColor(...brandColor)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('DATOS DEL CLIENTE', 20, clientY + 5)

    // Datos en dos columnas
    doc.setTextColor(...textDark)
    doc.setFontSize(9)

    const clientInfoY = clientY + 13

    // Columna izquierda
    doc.setFont('helvetica', 'bold')
    doc.text('Nombre:', 20, clientInfoY)
    doc.setFont('helvetica', 'normal')
    doc.text(`${detailBill.name} ${detailBill.last_name}`, 40, clientInfoY)

    doc.setFont('helvetica', 'bold')
    doc.text('Correo:', 20, clientInfoY + 6)
    doc.setFont('helvetica', 'normal')
    doc.text(detailBill.email, 40, clientInfoY + 6)

    // Línea divisoria
    doc.setDrawColor(...lightBrown)
    doc.setLineWidth(0.3)
    doc.line(15, clientInfoY + 12, 195, clientInfoY + 12)

    // ==================== TABLA DE PRODUCTOS ====================
    const tableStartY = clientInfoY + 18

    autoTable(doc, {
      head: [['Producto', 'Cant.', 'Precio Unit.', 'Total']],
      body: billProduct.map((item) => [
        item.name,
        item.quantity.toString(),
        formatPrice(item.unit_price),
        formatPrice(item.price)
      ]),
      startY: tableStartY,
      theme: 'striped',
      styles: {
        fontSize: 9,
        cellPadding: 4,
        overflow: 'linebreak',
        halign: 'left',
        valign: 'middle',
        textColor: textDark
      },
      headStyles: {
        fillColor: brandColor,
        textColor: [255, 255, 255],
        fontSize: 9,
        fontStyle: 'bold',
        halign: 'center',
        cellPadding: 5
      },
      alternateRowStyles: {
        fillColor: [250, 248, 247]
      },
      columnStyles: {
        0: { cellWidth: 90, halign: 'left' },
        1: { cellWidth: 20, halign: 'center' },
        2: { cellWidth: 40, halign: 'right' },
        3: { cellWidth: 35, halign: 'right' }
      },
      margin: { left: 15, right: 15 }
    })

    // ==================== TOTALES ====================
    const finalY = doc.lastAutoTable.finalY + 10
    const totalsX = 130

    // Fondo suave para totales
    doc.setFillColor(250, 248, 247)
    doc.roundedRect(totalsX - 3, finalY - 3, 68, 32, 2, 2, 'F')

    // Línea decorativa izquierda
    doc.setFillColor(...accentColor)
    doc.rect(totalsX - 3, finalY - 3, 1.5, 32, 'F')

    const subtotalBeforeTax = subTotal - (subTotal * 0.19)
    const tax = subTotal - subtotalBeforeTax

    doc.setTextColor(...textDark)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')

    // Subtotal
    doc.text('Subtotal:', totalsX, finalY)
    doc.text(formatPrice(subtotalBeforeTax), 193, finalY, { align: 'right' })

    // IVA
    doc.text('IVA (19%):', totalsX, finalY + 6)
    doc.text(formatPrice(tax), 193, finalY + 6, { align: 'right' })

    // Línea separadora
    doc.setDrawColor(...lightBrown)
    doc.setLineWidth(0.3)
    doc.line(totalsX, finalY + 9, 193, finalY + 9)

    // Total - destacado
    doc.setFillColor(...accentColor)
    doc.roundedRect(totalsX - 3, finalY + 12, 68, 10, 2, 2, 'F')

    doc.setTextColor(255, 255, 255)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text('TOTAL:', totalsX, finalY + 18.5)
    doc.text(formatPrice(subTotal), 193, finalY + 18.5, { align: 'right' })

    // ==================== NOTAS ====================
    const notesY = finalY + 35

    if (notesY < 250) {
      doc.setTextColor(...textDark)
      doc.setFontSize(8)
      doc.setFont('helvetica', 'italic')
      doc.text('Nota: Esta factura es un comprobante de su compra. Conserve este documento.', 15, notesY)
    }

    // Guardar PDF
    const fileName = `Factura_${String(detailBill.id).padStart(6, '0')}_${detailBill.name.replace(/\s+/g, '_')}.pdf`
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

export default DownloadPDFButton

'use client' 

import { jsPDF } from 'jspdf'
import 'jspdf-autotable' 
import { Button } from '../ui/button'
import { Download } from 'lucide-react'

const DownloadPDFButton = ({ detailBill, billProduct, subTotal }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(price)
  }

  const generatePDF = () => {
    // eslint-disable-next-line new-cap
    const doc = new jsPDF()

    // Título y estilo
    const invoiceTitle = `Factura #${detailBill.id_factura}`
    doc.setFontSize(20)
    doc.text(invoiceTitle, 10, 10)

    // Detalles de la factura
    doc.setFontSize(12)
    doc.text(`Fecha de emisión: ${detailBill.fecha.toString().slice(0, 10)}`, 10, 20)
    doc.text(`Facturar a: ${detailBill.nombre_cliente} ${detailBill.apellido}`, 10, 30)
    doc.text(`Email: ${detailBill.email}`, 10, 40)

    // Espacio entre secciones
    doc.setFontSize(16)
    doc.text('Detalles de la Factura', 10, 50)

    // Tabla de productos
    doc.autoTable({
      head: [['Descripción', 'Cantidad', 'Precio Unitario', 'Total']],
      body: billProduct.map(item => [
        item.nombre_producto,
        item.cantidad,
        formatPrice(item.precio),
        formatPrice(item.precio_unitario)
      ]),
      startY: 60, 
      styles: {
        fontSize: 12,
        cellPadding: 5,
        overflow: 'linebreak',
        halign: 'center',
        valign: 'middle'
      },
      headStyles: {
        fillColor: '#4A3728', 
        textColor: '#FFFFFF', 
        fontSize: 14,
        halign: 'center'
      },
      margin: { top: 20 }
    })

    // Calcular y añadir el subtotal, impuestos y total
    const tax = subTotal * 0.19
    const total = subTotal + tax

    // Espacio antes de los totales
    const startY = doc.autoTable.previous.finalY + 10 

    doc.setFontSize(12)
    doc.setFont('Helvetica', 'bold')
    doc.text('Totales:', 10, startY)

    doc.setFont('Helvetica', 'normal')
    doc.text(`Subtotal: ${formatPrice(subTotal)}`, 10, startY + 10)
    doc.text(`Impuestos (19%): ${formatPrice(tax)}`, 10, startY + 20)

    doc.setFont('Helvetica', 'bold')
    doc.text(`Total: ${formatPrice(total)}`, 10, startY + 30)

    // Footer
    doc.setFontSize(10)
    doc.setFont('Helvetica', 'normal')
    doc.text('Gracias por su compra!', 10, startY + 50)

    doc.save('factura.pdf')
  }

  return (
    <Button onClick={generatePDF} variant='outline' size='sm'>
      <Download className='mr-2 h-4 w-4' />
      Descargar PDF
    </Button>
  )
}

export default DownloadPDFButton

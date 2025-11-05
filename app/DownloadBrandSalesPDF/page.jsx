'use client'

import JsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { Button } from '@/components/ui/button'
import { Download, FileDown } from 'lucide-react'
import { formatPrice } from '@/utils/formatter'

const DownloadBrandSalesPDF = ({
  brandData,
  allBrandsData,
  sellerData,
  isGeneralReport = false,
  isSellerReport = false,
  variant = 'outline',
  size = 'sm'
}) => {
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
    doc.text('Coffee Shop - Reporte de Ventas', 105, footerY + 7, { align: 'center' })

    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.text('Para consultas: ventas@coffeeshop.com | Tel: +57 (300) 123-4567', 105, footerY + 13, {
      align: 'center'
    })

    doc.setFontSize(14)
    doc.text('☕', 20, footerY + 10)
    doc.text('☕', 190, footerY + 10)
  }

  const generateSingleBrandPDF = async (brand) => {
    const doc = new JsPDF()

    await addHeader(doc, 'REPORTE DE VENTAS', brand.brand_name)

    let yPos = 45
    doc.setFillColor(...lightBrown)
    doc.rect(15, yPos, 180, 7, 'F')
    doc.setTextColor(...brandColor)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text('RESUMEN DE VENTAS', 20, yPos + 5)

    yPos += 15
    doc.setTextColor(...textDark)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('Total de Ventas:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(formatPrice(brand.total_sales), 195, yPos, { align: 'right' })

    yPos += 7
    doc.setFont('helvetica', 'bold')
    doc.text('Meses Activos:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(`${brand.months.length} meses`, 195, yPos, { align: 'right' })

    yPos += 7
    doc.setFont('helvetica', 'bold')
    doc.text('Promedio Mensual:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(formatPrice(brand.total_sales / brand.months.length), 195, yPos, { align: 'right' })

    yPos += 15
    const sortedMonths = [...brand.months].sort((a, b) => a.month.localeCompare(b.month))

    const formattedMonths = sortedMonths.map((m) => {
      const [yearStr, monthStr] = String(m.month).split('-')
      const year = Number(yearStr) || 0
      const monthIndex = Math.max(0, (Number(monthStr) || 1) - 1)

      const date = new Date(year, monthIndex, 1)
      const formatted = date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })

      return {
        ...m,
        monthName: formatted.charAt(0).toUpperCase() + formatted.slice(1)
      }
    })

    autoTable(doc, {
      head: [['Mes', 'Ventas']],
      body: formattedMonths.map((m) => [m.monthName, formatPrice(m.sales)]),
      startY: yPos,
      theme: 'striped',
      styles: {
        fontSize: 9,
        cellPadding: 4,
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
        0: { cellWidth: 100, halign: 'left' },
        1: { cellWidth: 80, halign: 'right' }
      },
      margin: { left: 15, right: 15 }
    })

    addFooter(doc)

    const fileName = `Reporte_Ventas_${brand.brand_name.replace(/\s+/g, '_')}_${new Date()
      .toISOString()
      .split('T')[0]}.pdf`
    doc.save(fileName)
  }

  const generateAllBrandsPDF = async (brands) => {
    const doc = new JsPDF()

    await addHeader(doc, 'REPORTE GENERAL', 'Todas las Marcas')

    let yPos = 45
    doc.setFillColor(...lightBrown)
    doc.rect(15, yPos, 180, 7, 'F')
    doc.setTextColor(...brandColor)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text('RESUMEN GENERAL', 20, yPos + 5)

    yPos += 15
    const totalSales = brands.reduce((sum, b) => sum + b.total_sales, 0)
    const avgSales = totalSales / brands.length

    doc.setTextColor(...textDark)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('Total Marcas:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(`${brands.length}`, 195, yPos, { align: 'right' })

    yPos += 7
    doc.setFont('helvetica', 'bold')
    doc.text('Ventas Totales:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(formatPrice(totalSales), 195, yPos, { align: 'right' })

    yPos += 7
    doc.setFont('helvetica', 'bold')
    doc.text('Promedio por Marca:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(formatPrice(avgSales), 195, yPos, { align: 'right' })

    yPos += 15
    autoTable(doc, {
      head: [['Marca', 'Total Ventas', 'Meses', 'Promedio Mensual']],
      body: brands.map((b) => [
        b.brand_name,
        formatPrice(b.total_sales),
        `${b.months.length}`,
        formatPrice(b.total_sales / b.months.length)
      ]),
      startY: yPos,
      theme: 'striped',
      styles: {
        fontSize: 9,
        cellPadding: 4,
        textColor: textDark
      },
      headStyles: {
        fillColor: brandColor,
        textColor: [255, 255, 255],
        fontSize: 9,
        fontStyle: 'bold',
        halign: 'center'
      },
      alternateRowStyles: {
        fillColor: [250, 248, 247]
      },
      columnStyles: {
        0: { cellWidth: 70, halign: 'left' },
        1: { cellWidth: 45, halign: 'right' },
        2: { cellWidth: 25, halign: 'center' },
        3: { cellWidth: 45, halign: 'right' }
      },
      margin: { left: 15, right: 15 }
    })

    addFooter(doc)

    const fileName = `Reporte_General_Ventas_${new Date().toISOString().split('T')[0]}.pdf`
    doc.save(fileName)
  }

  const generateSellerPDF = async (seller) => {
    const doc = new JsPDF()

    await addHeader(doc, 'REPORTE DE VENTAS', seller.brand_name)

    let yPos = 45
    doc.setFillColor(...lightBrown)
    doc.rect(15, yPos, 180, 7, 'F')
    doc.setTextColor(...brandColor)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text('RESUMEN DE VENTAS', 20, yPos + 5)

    yPos += 15
    const currentDate = new Date()
    doc.setTextColor(...textDark)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('Fecha del Reporte:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(
      currentDate.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      195,
      yPos,
      { align: 'right' }
    )

    yPos += 15
    doc.setFillColor(...accentColor)
    doc.rect(15, yPos, 180, 7, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('VENTAS DEL DÍA', 20, yPos + 5)

    yPos += 15
    doc.setTextColor(...textDark)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Total Vendido Hoy:', 20, yPos)
    doc.setFontSize(14)
    doc.setTextColor(...accentColor)
    doc.text(formatPrice(seller.daily_sales), 195, yPos, { align: 'right' })

    yPos += 15
    doc.setFillColor(...accentColor)
    doc.rect(15, yPos, 180, 7, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('VENTAS DEL MES', 20, yPos + 5)

    yPos += 15
    doc.setTextColor(...textDark)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Total del Mes:', 20, yPos)
    doc.setFontSize(14)
    doc.setTextColor(...accentColor)
    doc.text(formatPrice(seller.monthly_sales), 195, yPos, { align: 'right' })

    yPos += 7
    doc.setTextColor(...textDark)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('Mes:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }), 195, yPos, { align: 'right' })

    addFooter(doc)

    const fileName = `Reporte_Ventas_${seller.brand_name.replace(/\s+/g, '_')}_${currentDate
      .toISOString()
      .split('T')[0]}.pdf`
    doc.save(fileName)
  }

  const handleDownload = async () => {
    try {
      if (isSellerReport && sellerData) {
        await generateSellerPDF(sellerData)
      } else if (isGeneralReport && allBrandsData) {
        await generateAllBrandsPDF(allBrandsData)
      } else if (brandData) {
        await generateSingleBrandPDF(brandData)
      }
    } catch (error) {
      console.error('Error generating PDF:', error)
    }
  }

  return (
    <Button
      onClick={handleDownload}
      variant={variant}
      size={size}
      className='border-[#3E2723] text-[#3E2723] hover:bg-[#D7CCC8] hover:text-[#3E2723] transition-colors'
    >
      {isGeneralReport || isSellerReport
        ? (
        <FileDown className='mr-2 h-4 w-4' />
          )
        : (
        <Download className='mr-2 h-4 w-4' />
          )}
      {isGeneralReport
        ? 'Descargar Reporte Completo'
        : isSellerReport
          ? 'Descargar Mi Reporte'
          : 'Descargar PDF'}
    </Button>
  )
}

export default DownloadBrandSalesPDF

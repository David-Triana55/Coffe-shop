'use client'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ArrowLeft, TrendingUp, Calendar, DollarSign, BarChart3, Package } from 'lucide-react'
import { formatPrice } from '@/utils/formatter'
import useStore from '@/store'
import { ROLES } from '@/utils/roles'
import Link from 'next/link'
import Loading from '@/components/Loading/Loading'
import { Button } from '@/components/ui/button'
import DownloadBrandSalesPDF from '@/app/DownloadBrandSalesPDF/page'

export default function SalesReportPage () {
  const { login } = useStore((state) => state)
  const [brandSalesData, setBrandSalesData] = useState([])
  const [sellerBrandInfo, setSellerBrandInfo] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchBrandSales = async () => {
      setLoading(true)
      try {
        if (login?.role === ROLES.ADMIN) {
          const res = await fetch('/api/brand-sales-report', { credentials: 'include' })
          const data = await res.json()
          console.log(data, 'data')

          const brandMap = new Map()
          data.data.forEach((sale) => {
            if (!brandMap.has(sale.brand_id)) {
              brandMap.set(sale.brand_id, {
                brand_id: sale.brand_id,
                brand_name: sale.brand_name,
                total_sales: 0,
                months: []
              })
            }

            const brand = brandMap.get(sale.brand_id)
            brand.total_sales += Number(sale.total_sales)
            brand.months.push({
              month: sale.month,
              sales: Number(sale.total_sales)
            })
          })

          setBrandSalesData(Array.from(brandMap.values()))
        } else if (login?.role === ROLES.VENDEDOR) {
          const brandInfoRes = await fetch('/api/brandInfo', { credentials: 'include' })
          const brandInfo = await brandInfoRes.json()

          if (brandInfo?.data?.id) {
            setSellerBrandInfo(brandInfo.data)

            const res = await fetch(`/api/sales-report?id=${brandInfo.data.id}`, {
              credentials: 'include'
            })
            const data = await res.json()
            setBrandSalesData(data.data)
          }
        }
      } catch (error) {
        console.error('Error fetching brand sales:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBrandSales()
  }, [login?.role])

  if (loading) {
    return (
      <div className='mt-16 p-6'>
        <Loading />
      </div>
    )
  }

  return (
    <div className='mt-16 p-6 space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <Link href='/dashboard'>
            <Button variant='ghost' size='sm' className='mb-2'>
              <ArrowLeft className='h-4 w-4 mr-2' />
              Volver al Dashboard
            </Button>
          </Link>
          <h1 className='text-4xl font-bold text-[#3E2723]'>
            {login?.role === ROLES.ADMIN ? 'Reporte de Ventas por Marca' : 'Reporte Detallado de Ventas'}
          </h1>
          <p className='text-[#5D4037] mt-1'>
            {login?.role === ROLES.ADMIN
              ? 'Análisis completo de ventas por marca blanca'
              : 'Análisis detallado de tus ventas'}
          </p>
        </div>
        {login?.role === ROLES.ADMIN && brandSalesData.length > 0 && (
          <DownloadBrandSalesPDF allBrandsData={brandSalesData} isGeneralReport size='default' />
        )}
        {login?.role === ROLES.VENDEDOR && brandSalesData.length > 0 && sellerBrandInfo && (
          <DownloadBrandSalesPDF
            sellerData={{
              brand_name: sellerBrandInfo.name,
              daily_sales: Number(brandSalesData[0]?.daily_sales) || 0,
              monthly_sales: Number(brandSalesData[0]?.monthly_sales) || 0
            }}
            isSellerReport
            size='default'
          />
        )}
      </div>

      {login?.role === ROLES.ADMIN
        ? (
        <>
          {/* Summary Cards */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <Card className='bg-gradient-to-br from-[#33691E] to-[#1B5E20] text-white border-0'>
              <CardHeader className='pb-2'>
                <CardTitle className='text-sm font-medium'>Total Marcas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='text-3xl font-bold'>{brandSalesData.length}</div>
              </CardContent>
            </Card>

            <Card className='bg-white/90 backdrop-blur-sm border-[#D7CCC8]'>
              <CardHeader className='pb-2'>
                <CardTitle className='text-sm font-medium text-[#3E2723]'>Ventas Totales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='text-3xl font-bold text-[#3E2723]'>
                  {formatPrice(brandSalesData.reduce((sum, brand) => sum + brand.total_sales, 0))}
                </div>
              </CardContent>
            </Card>

            <Card className='bg-white/90 backdrop-blur-sm border-[#D7CCC8]'>
              <CardHeader className='pb-2'>
                <CardTitle className='text-sm font-medium text-[#3E2723]'>Promedio por Marca</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='text-3xl font-bold text-[#3E2723]'>
                  {formatPrice(
                    brandSalesData.length > 0
                      ? brandSalesData.reduce((sum, brand) => sum + brand.total_sales, 0) / brandSalesData.length
                      : 0
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Brand Sales Table */}
          <Card className='bg-white/90 backdrop-blur-sm border-[#D7CCC8]'>
            <CardHeader>
              <CardTitle className='text-[#3E2723]'>Ventas por Marca</CardTitle>
              <CardDescription>Detalle de ventas de cada marca blanca</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='overflow-x-auto'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Marca</TableHead>
                      <TableHead>Total Ventas</TableHead>
                      <TableHead>Meses Activos</TableHead>
                      <TableHead>Promedio Mensual</TableHead>
                      <TableHead className='text-right'>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {brandSalesData.map((brand) => (
                      <TableRow key={brand.brand_id}>
                        <TableCell className='font-medium'>{brand.brand_name}</TableCell>
                        <TableCell>
                          <span className='font-semibold text-[#33691E]'>{formatPrice(brand.total_sales)}</span>
                        </TableCell>
                        <TableCell>
                          <Badge variant='outline'>{brand.months.length} meses</Badge>
                        </TableCell>
                        <TableCell>{formatPrice(brand.total_sales / brand.months.length)}</TableCell>
                        <TableCell className='text-right'>
                          <DownloadBrandSalesPDF brandData={brand} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
          )
        : (
        <>
          {brandSalesData.length > 0
            ? (
            <>
              {/* Summary Cards Row 1 */}
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <Card className='bg-gradient-to-br from-[#33691E] to-[#1B5E20] text-white border-0'>
                  <CardHeader className='pb-2'>
                    <CardTitle className='text-sm font-medium flex items-center gap-2'>
                      <Package className='h-4 w-4' />
                      Tu Marca
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='text-2xl font-bold'>{sellerBrandInfo?.name || 'N/A'}</div>
                    <p className='text-xs text-white/80 mt-1'>Marca Blanca Registrada</p>
                  </CardContent>
                </Card>

                <Card className='bg-white/90 backdrop-blur-sm border-[#D7CCC8]'>
                  <CardHeader className='pb-2'>
                    <CardTitle className='text-sm font-medium text-[#3E2723] flex items-center gap-2'>
                      <Calendar className='h-4 w-4 text-[#33691E]' />
                      Ventas del Día
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='text-3xl font-bold text-[#33691E]'>
                      {formatPrice(Number(brandSalesData[0]?.daily_sales) || 0)}
                    </div>
                    <p className='text-xs text-[#5D4037] mt-1'>
                      {new Date().toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                  </CardContent>
                </Card>

                <Card className='bg-white/90 backdrop-blur-sm border-[#D7CCC8]'>
                  <CardHeader className='pb-2'>
                    <CardTitle className='text-sm font-medium text-[#3E2723] flex items-center gap-2'>
                      <TrendingUp className='h-4 w-4 text-[#33691E]' />
                      Ventas del Mes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='text-3xl font-bold text-[#33691E]'>
                      {formatPrice(Number(brandSalesData[0]?.monthly_sales) || 0)}
                    </div>
                    <p className='text-xs text-[#5D4037] mt-1'>
                      {new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Analysis Cards */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <Card className='bg-white/90 backdrop-blur-sm border-[#D7CCC8]'>
                  <CardHeader>
                    <CardTitle className='text-[#3E2723] flex items-center gap-2'>
                      <BarChart3 className='h-5 w-5 text-[#33691E]' />
                      Análisis Diario
                    </CardTitle>
                    <CardDescription>Rendimiento de ventas del día actual</CardDescription>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <div className='flex justify-between items-center p-4 bg-[#F5F5F5] rounded-lg'>
                      <div>
                        <p className='text-sm text-[#5D4037] font-medium'>Total Vendido Hoy</p>
                        <p className='text-2xl font-bold text-[#33691E] mt-1'>
                          {formatPrice(Number(brandSalesData[0]?.daily_sales) || 0)}
                        </p>
                      </div>
                      <div className='h-12 w-12 rounded-full bg-[#33691E]/10 flex items-center justify-center'>
                        <DollarSign className='h-6 w-6 text-[#33691E]' />
                      </div>
                    </div>

                  </CardContent>
                </Card>

                <Card className='bg-white/90 backdrop-blur-sm border-[#D7CCC8]'>
                  <CardHeader>
                    <CardTitle className='text-[#3E2723] flex items-center gap-2'>
                      <TrendingUp className='h-5 w-5 text-[#33691E]' />
                      Análisis Mensual
                    </CardTitle>
                    <CardDescription>Rendimiento acumulado del mes</CardDescription>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <div className='flex justify-between items-center p-4 bg-[#F5F5F5] rounded-lg'>
                      <div>
                        <p className='text-sm text-[#5D4037] font-medium'>Total del Mes</p>
                        <p className='text-2xl font-bold text-[#33691E] mt-1'>
                          {formatPrice(Number(brandSalesData[0]?.monthly_sales) || 0)}
                        </p>
                      </div>
                      <div className='h-12 w-12 rounded-full bg-[#8BC34A]/10 flex items-center justify-center'>
                        <Calendar className='h-6 w-6 text-[#33691E]' />
                      </div>
                    </div>

                  </CardContent>
                </Card>
              </div>

            </>
              )
            : (
            <Card className='bg-white/90 backdrop-blur-sm border-[#D7CCC8]'>
              <CardContent className='py-12 text-center'>
                <DollarSign className='mx-auto h-12 w-12 text-gray-400 mb-4' />
                <h3 className='text-lg font-medium text-gray-900 mb-2'>No hay datos de ventas</h3>
                <p className='text-gray-500'>Aún no se han registrado ventas para tu marca.</p>
              </CardContent>
            </Card>
              )}
        </>
          )}
    </div>
  )
}

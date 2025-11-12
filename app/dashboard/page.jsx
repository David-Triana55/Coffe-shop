'use client'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DollarSign, Package, Gavel, Users, AlertTriangle, ArrowUpRight, TrendingUp, Calendar } from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import useStore from '@/store'
import { ROLES } from '@/utils/roles'
import { formatPrice } from '@/utils/formatter'
import Link from 'next/link'
import Loading from '@/components/Loading/Loading'
import { useProtectedRedirect } from '@/hooks/useProtectedRedirect'

export default function DashboardPage () {
  useProtectedRedirect('/')
  const { login, clientInfo } = useStore((state) => state)
  const [metrics, setMetrics] = useState({
    totalSales: 0,
    activeProducts: 0,
    activeAuctions: 0,
    activeVendors: 0
  })
  const [lowStockProducts, setLowStockProducts] = useState([])
  const [categoryData, setCategoryData] = useState([])
  const [brandSalesData, setBrandSalesData] = useState([])
  const [loading, setLoading] = useState(false)

  const COLORS = ['#33691E', '#8BC34A', '#CDDC39', '#FFC107', '#FF9800']

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true)
      try {
        const data = await fetch('/api/dashboard', { credentials: 'include' })
        const res = await data.json()

        console.log(res)

        setLowStockProducts(res?.stock || [])
        setMetrics((prev) => ({
          totalSales: res?.sales[0]?.total_ventas ?? prev.totalSales,
          activeProducts: res?.products[0]?.productos_activos ?? prev.activeProducts,
          activeAuctions: res?.auctions[0]?.subastas_activas ?? prev.activeAuctions,
          activeVendors: res?.sellers[0]?.vendedores_activos ?? prev.activeVendors
        }))

        setCategoryData(
          res?.category?.map((c) => ({
            name: c.name,
            cantidad: c.cantidad,
            value: Number.parseFloat(c.value)
          })) || []
        )

        if (login?.role === ROLES.ADMIN) {
          const brandSalesRes = await fetch('/api/brand-sales-report', { credentials: 'include' })
          const brandSales = await brandSalesRes.json()
          console.log(brandSales)

          // Group by brand and get latest month data for preview
          const brandMap = new Map()
          brandSales.data.forEach((sale) => {
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
            brand.months.push({ month: sale.month, sales: Number(sale.total_sales) })
          })

          setBrandSalesData(Array.from(brandMap.values()).slice(0, 5))
        } else if (login?.role === ROLES.VENDEDOR) {
          const brandInfoRes = await fetch('/api/brandInfo', { credentials: 'include' })
          const brandInfo = await brandInfoRes.json()

          console.log(brandInfo.data.id)

          if (brandInfo?.data?.id) {
            const brandSalesRes = await fetch(`/api/sales-report?id=${brandInfo.data.id}`, {
              credentials: 'include'
            })
            const brandSales = await brandSalesRes.json()
            setBrandSalesData(brandSales.data)

            console.log(brandSales)
          }
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
  }, [login?.role])

  if (loading) {
    return (
      <div className='mt-16 p-6'>
        <Loading />
      </div>
    )
  }

  return (
    <div className='mt-16 p-6'>
      {/* Header */}
      <div>
        <h1 className='text-4xl font-bold text-[#3E2723] mb-2'>Dashboard</h1>
        <p className='text-[#5D4037]'>
          Bienvenido, <span className='font-semibold'>{clientInfo?.data?.name || login?.name}</span>
        </p>
      </div>

      {/* Metrics Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-3'>
        <Card className='bg-gradient-to-br from-[#33691E] to-[#1B5E20] text-white border-0'>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm font-medium'>Total Ventas</CardTitle>
            <DollarSign className='h-4 w-4 opacity-70' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{formatPrice(metrics.totalSales)}</div>
          </CardContent>
        </Card>

        <Card className='bg-white/90 backdrop-blur-sm border-[#D7CCC8]'>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm font-medium text-[#3E2723]'>Productos Activos</CardTitle>
            <Package className='h-4 w-4 text-[#33691E]' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-[#3E2723]'>{metrics.activeProducts}</div>
          </CardContent>
        </Card>

        <Card className='bg-white/90 backdrop-blur-sm border-[#D7CCC8]'>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm font-medium text-[#3E2723]'>
              {login?.role === ROLES.ADMIN ? 'Vendedores Activos' : 'Subastas Activas'}
            </CardTitle>
            {login?.role === ROLES.ADMIN
              ? (
              <Users className='h-4 w-4 text-[#33691E]' />
                )
              : (
              <Gavel className='h-4 w-4 text-[#33691E]' />
                )}
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-[#3E2723]'>
              {login?.role === ROLES.ADMIN ? metrics.activeVendors : metrics.activeAuctions}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-5'>
        <Card className='bg-white/90 backdrop-blur-sm border-[#D7CCC8]'>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <div>
                <CardTitle className='text-[#3E2723]'>
                  {login?.role === ROLES.ADMIN ? 'Ventas por Marca' : 'Reporte de Ventas'}
                </CardTitle>
                <CardDescription>
                  {login?.role === ROLES.ADMIN ? 'Top 5 marcas' : 'Ventas diarias y mensuales'}
                </CardDescription>
              </div>
              <Link href='/dashboard/sales-report'>
                <Button variant='outline' size='sm'>
                  Ver detalle
                  <ArrowUpRight className='h-4 w-4 ml-2' />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {login?.role === ROLES.ADMIN
              ? (
              <ResponsiveContainer width='100%' height={300}>
                <BarChart data={brandSalesData}>
                  <CartesianGrid strokeDasharray='3 3' stroke='#D7CCC8' />
                  <XAxis dataKey='brand_name' stroke='#5D4037' angle={-45} textAnchor='end' height={80} />
                  <YAxis stroke='#5D4037' tickFormatter={(value) => `$${value / 1000}k`} />
                  <Tooltip
                    formatter={(value) => formatPrice(value)}
                    contentStyle={{ backgroundColor: 'white', border: '1px solid #D7CCC8' }}
                  />
                  <Bar dataKey='total_sales' fill='#33691E' />
                </BarChart>
              </ResponsiveContainer>
                )
              : (
              <div className='space-y-4'>
                {brandSalesData.map((data, index) => (
                  <div key={index} className='space-y-2'>
                    <div className='flex items-center justify-between p-4 bg-gradient-to-r from-[#33691E]/10 to-transparent rounded-lg border border-[#D7CCC8]'>
                      <div className='flex items-center gap-3'>
                        <Calendar className='h-5 w-5 text-[#33691E]' />
                        <div>
                          <p className='text-sm font-medium text-[#3E2723]'>Ventas del Día</p>
                          <p className='text-xs text-[#5D4037]'>{new Date().toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className='text-right'>
                        <p className='text-2xl font-bold text-[#33691E]'>
                          {formatPrice(Number(data.daily_sales) || 0)}
                        </p>
                      </div>
                    </div>

                    <div className='flex items-center justify-between p-4 bg-gradient-to-r from-[#8BC34A]/10 to-transparent rounded-lg border border-[#D7CCC8]'>
                      <div className='flex items-center gap-3'>
                        <TrendingUp className='h-5 w-5 text-[#33691E]' />
                        <div>
                          <p className='text-sm font-medium text-[#3E2723]'>Ventas del Mes</p>
                          <p className='text-xs text-[#5D4037]'>
                            {new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <div className='text-right'>
                        <p className='text-2xl font-bold text-[#33691E]'>
                          {formatPrice(Number(data.monthly_sales) || 0)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {brandSalesData.length === 0 && (
                  <div className='text-center py-8 text-[#5D4037]'>No hay datos de ventas disponibles</div>
                )}
              </div>
                )}
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className='bg-white/90 backdrop-blur-sm border-[#D7CCC8]'>
          <CardHeader>
            <CardTitle className='text-[#3E2723]'>Productos por Categoría</CardTitle>
            <CardDescription>Distribución actual</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx='50%'
                  cy='50%'
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill='#8884d8'
                  dataKey='value'
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Products */}
      {login?.role === ROLES.VENDEDOR && lowStockProducts?.length > 0 && (
        <Card className='bg-white/90 backdrop-blur-sm border-[#D7CCC8] mt-5'>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <div>
                <CardTitle className='text-[#3E2723] flex items-center gap-2'>
                  <AlertTriangle className='h-5 w-5 text-orange-500' />
                  Productos con Stock Bajo
                </CardTitle>
                <CardDescription>Stock menor a 5 unidades</CardDescription>
              </div>
              <Link href='/products'>
                <Button variant='outline' size='sm'>
                  Ver todos
                  <ArrowUpRight className='h-4 w-4 ml-2' />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className='flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200'
                >
                  <div className='flex items-center gap-4'>
                    <Package className='h-8 w-8 text-orange-500' />
                    <div>
                      <p className='font-medium text-[#3E2723]'>{product.name}</p>
                      <p className='text-sm text-[#5D4037]'>{product.category}</p>
                    </div>
                  </div>
                  <Badge variant='outline' className='bg-orange-100 text-orange-700 border-orange-300'>
                    Stock: {product.stock}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

'use client'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DollarSign, Package, Gavel, Users, AlertTriangle, ArrowUpRight } from 'lucide-react'
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import useStore from '@/store'
import { ROLES } from '@/utils/roles'
import { formatPrice } from '@/utils/formatter'
import Link from 'next/link'
import Loading from '@/components/Loading/Loading'

export default function DashboardPage () {
  const { login, clientInfo } = useStore((state) => state)
  const [metrics, setMetrics] = useState({
    totalSales: 0,
    activeProducts: 0,
    activeAuctions: 0,
    activeVendors: 0
  })
  const [salesData, setSalesData] = useState([])
  const [lowStockProducts, setLowStockProducts] = useState([])
  const [categoryData, setCategoryData] = useState([])
  const [loading, setLoading] = useState(false)

  const COLORS = ['#33691E', '#8BC34A', '#CDDC39', '#FFC107', '#FF9800']

  useEffect(() => {
    const metrics = async () => {
      setLoading(true)
      const data = await fetch('/api/dashboard', { credentials: 'include' })
      const res = await data.json()
      console.log(res)
      setSalesData(res?.monthly)
      setLowStockProducts(res?.stock)
      setMetrics((prev) => ({
        totalSales: res?.sales[0]?.total_ventas ?? prev.totalSales,
        activeProducts: res?.products[0]?.productos_activos ?? prev.activeProducts,
        activeAuctions: res?.auctions[0]?.subastas_activas ?? prev.activeAuctions,
        activeVendors: res?.sellers[0]?.vendedores_activos ?? prev.activeVendors
      }))
      console.log(res, 'respuesta')
      setCategoryData(
        res?.category.map(c => ({
          name: c.name,
          cantidad: c.cantidad,
          value: parseFloat(c.value)
        })))

      setLoading(false)
    }

    metrics()
  }, [])

  if (loading) {
    return (
      <div>
        <Loading />
      </div>
    )
  }

  console.log(categoryData)
  return (
    <div className='mt-16 p-6'>
      {/* Header */}
      <div>
        <h1 className='text-4xl font-bold text-[#3E2723] mb-2'>Dashboard</h1>
        <p className='text-[#5D4037]'>
          Bienvenido, <span className='font-semibold'>{clientInfo?.name}</span>
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
        {/* Sales Chart */}
        <Card className='bg-white/90 backdrop-blur-sm border-[#D7CCC8]'>
          <CardHeader>
            <CardTitle className='text-[#3E2723]'>Ventas Mensuales</CardTitle>
            <CardDescription>Últimos 5 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray='3 3' stroke='#D7CCC8' />
                <XAxis dataKey='month' stroke='#5D4037' />
                <YAxis stroke='#5D4037' tickFormatter={(value) => `$${value / 1000}k`} />
                <Tooltip
                  formatter={(value) => formatPrice(value)}
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #D7CCC8' }}
                />
                <Line type='monotone' dataKey='ventas' stroke='#33691E' strokeWidth={2} dot={{ fill: '#33691E' }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className='bg-white/90 backdrop-blur-sm border-[#D7CCC8] '>
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

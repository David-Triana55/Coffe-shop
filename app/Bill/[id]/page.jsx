import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatPrice } from '@/utils/formatter'

import DownloadPDFButton from '@/components/Pdf/Pdf'
import Link from 'next/link'

export default async function pageBill ({ params }) {
  const { id } = params
  const detailBill = await fetch(`$/api/bill/${id}`).then((res) => res.json())
  const billProduct = await fetch(`/api/getProductsByBill/${id}`).then((res) => res.json())

  let data
  let subTotal
  if (billProduct.length === 0) {
    data = billProduct.precio
    subTotal = billProduct.precio
  } else {
    data = billProduct?.map(item => Number(item.precio) * item.cantidad)
    subTotal = data.reduce((a, b) => a + b, 0)
  }

  return (
    <main className='container mt-16 mx-auto p-4'>
      <Card className='w-full max-w-4xl mx-auto'>
        <CardHeader className='flex flex-col md:flex-row justify-between items-start md:items-center'>
          <div>
            <CardTitle className='text-2xl'>Factura #{detailBill[0].id_factura}</CardTitle>
            <CardDescription>Fecha de emisión: {detailBill[0].fecha.toString().slice(0, 10)}</CardDescription>
          </div>
          <div className='mt-4 md:mt-0 flex space-x-2'>

            <DownloadPDFButton
              detailBill={detailBill[0]}
              billProduct={billProduct}
              subTotal={subTotal}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
            <div>
              <h3 className='font-semibold mb-2'>Facturar a:</h3>
              <p>{detailBill[0].nombre_cliente + ' ' + detailBill[0].apellido}</p>
              <p>{detailBill[0].email}</p>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descripción</TableHead>
                <TableHead className='text-right'>Cantidad</TableHead>
                <TableHead className='text-right'>Precio Unitario</TableHead>
                <TableHead className='text-right'>Total</TableHead>
              </TableRow>
            </TableHeader>
              <TableBody>
                {billProduct.map((item) => (
                  <TableRow key={item.id_producto}>
                    <TableCell>
                      <Link href={`/ProductDetail/${item.id_producto}`}>
                        {item.nombre_producto}
                      </Link>
                    </TableCell>
                    <TableCell className='text-right'>
                      <Link href={`/ProductDetail/${item.id_producto}`}>
                        {item.cantidad}
                      </Link>
                    </TableCell>
                    <TableCell className='text-right'>
                      <Link href={`/ProductDetail/${item.id_producto}`}>
                        {formatPrice(item.precio)}
                      </Link>
                    </TableCell>
                    <TableCell className='text-right'>
                      <Link href={`/ProductDetail/${item.id_producto}`}>
                        {formatPrice(item.precio_unitario * item.cantidad)}
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>

          </Table>
          <div className='mt-6 flex justify-end'>
            <div className='w-full max-w-xs'>
              <div className='flex justify-between mb-2'>
                <span>Subtotal: </span>
                <span>{formatPrice(subTotal)}</span>
              </div>
              <div className='flex justify-between mb-2'>
                <span>Impuestos (19%):</span>
                <span>{formatPrice(subTotal * 0.19)}</span>
              </div>
              <div className='flex justify-between font-bold text-lg'>
                <span>Total:</span>
                <span>{formatPrice(detailBill[0].total)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}

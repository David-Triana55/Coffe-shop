import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatPrice } from '@/utils/formatter'
import DownloadAuctionPDF from '@/components/DownloadAuctionPDF/DownloadAuctionPDF'
import Link from 'next/link'

export default async function AuctionDetailsPage({ params }) {
  const { id } = params
  const auctionDetails = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auction-details/?id=${id}`,
    { cache: 'no-store' }
  ).then((res) => res.json())

  if (!auctionDetails || auctionDetails.length === 0) {
    return (
      <main className='container mt-16 mx-auto p-4'>
        <Card className='w-full max-w-4xl mx-auto'>
          <CardContent className='pt-6 text-center'>
            <p className='text-[#5D4037] mb-4'>No se encontró la subasta</p>
            <Link href='/Profile' className='text-blue-600 underline'>
              Volver al perfil
            </Link>
          </CardContent>
        </Card>
      </main>
    )
  }

  const detail = auctionDetails[0]

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })

  return (
    <main className='container mt-16 mx-auto p-4'>
      <Card className='w-full max-w-4xl mx-auto'>
        {/* ENCABEZADO */}
        <CardHeader className='flex flex-col md:flex-row justify-between items-start md:items-center'>
          <div>
            <CardTitle className='text-2xl'>
              Subasta #{detail.auction_purchase_id.substring(0, 8)}
            </CardTitle>
            <CardDescription>
              Fecha de emisión: {formatDate(detail.purchase_date)}
            </CardDescription>
          </div>
          <div className='mt-4 md:mt-0 flex space-x-2'>
            <DownloadAuctionPDF auctionData={detail} />
          </div>
        </CardHeader>

        {/* CONTENIDO */}
        <CardContent>
          {/* DATOS DEL GANADOR */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
            <div>
              <h3 className='font-semibold mb-2'>Ganador:</h3>
              <p>{detail.winner_name}</p>
              <p>{detail.winner_email}</p>
            </div>
            <div>
              <h3 className='font-semibold mb-2'>Marca:</h3>
              <p>{detail.brand_name || 'N/A'}</p>
            </div>
          </div>

          {/* TABLA DE PRODUCTO */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descripción</TableHead>
                <TableHead className='text-right'>Cantidad</TableHead>
                <TableHead className='text-right'>Precio Inicial</TableHead>
                <TableHead className='text-right'>Precio Final</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Link href={`/ProductDetail/${detail.product_id}`}>
                    {detail.product_name}
                  </Link>
                </TableCell>
                <TableCell className='text-right'>1</TableCell>
                <TableCell className='text-right'>
                  {formatPrice(detail.initial_price)}
                </TableCell>
                <TableCell className='text-right'>
                  {formatPrice(detail.final_price)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          {/* SECCIÓN DE TOTALES */}
          <div className='mt-6 flex justify-end'>
            <div className='w-full max-w-xs'>
              <div className='flex justify-between mb-2'>
                <span>Precio Inicial:</span>
                <span>{formatPrice(detail.initial_price)}</span>
              </div>

              <div className='flex justify-between mb-2'>
                <span>Total de Pujas:</span>
                <span>{detail.total_bids}</span>
              </div>

              <div className='flex justify-between mb-2'>
                <span>Incremento Mínimo:</span>
                <span>{formatPrice(detail.minimum_increment)}</span>
              </div>

              <div className='flex justify-between mb-2'>
                <span>Estado:</span>
                <span
                  className={`font-medium ${
                    detail.status === 'paid' ? 'text-green-600' : 'text-yellow-600'
                  }`}
                >
                  {detail.status === 'paid' ? 'Pagado' : 'Pendiente'}
                </span>
              </div>

              <div className='flex justify-between font-bold text-lg mt-2 border-t pt-2'>
                <span>Total:</span>
                <span>{formatPrice(detail.final_price)}</span>
              </div>
            </div>
          </div>

          {/* FECHAS DE SUBASTA */}
          <div className='mt-6 grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <h3 className='font-semibold mb-1'>Inicio de Subasta:</h3>
              <p>{formatDate(detail.start_date)}</p>
            </div>
            <div>
              <h3 className='font-semibold mb-1'>Fin de Subasta:</h3>
              <p>{formatDate(detail.end_date)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}

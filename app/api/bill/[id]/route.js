import { detailBillById } from '@/lib/data'

export async function GET (req, { params }) {
  const { id } = params

  if (!id) {
    return new Response(JSON.stringify({ message: 'ID del bill es requerido' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const bill = await detailBillById(id)

  if (!bill) {
    return new Response(JSON.stringify({ message: 'Bill not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  return new Response(JSON.stringify(bill), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}

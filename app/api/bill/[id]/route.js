import { getDetailBillId } from '@/lib/data/bills'

export async function GET (req, { params }) {
  const { id } = params
  console.log(id, 'id bill')
  if (!id) {
    return new Response(JSON.stringify({ message: 'ID del bill es requerido' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const bill = await getDetailBillId(id)
  console.log(bill)

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

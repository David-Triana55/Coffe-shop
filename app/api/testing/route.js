import { deleteClientDataTransaction } from "@/lib/data"

export async function POST (req) {
  const {email} = await req.json()
  try {
    console.log(email)

    const res = await deleteClientDataTransaction(email)
    console.log(res, 'res')
    if(!res.success) {
      return new Response(JSON.stringify({message: 'error'}),{ status: 409})
    } 
    
    return new Response(JSON.stringify({message: 'deleted'}), {status: 200})
    
  } catch(e) {
    console.log(e)
    return new Response(JSON.stringify({message: 'internal error'}), {status: 500})
  }
}
export async function fetchBrands () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/brands`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  if (!res.ok) throw new Error('Error fetching brands')
  const { data } = await res.json()
  return data
}

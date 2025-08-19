export async function fetchAccesories () {
  const res = await fetch('/api/accesories', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  if (!res.ok) throw new Error('Error fetching brands')
  const { data } = await res.json()
  return data
}

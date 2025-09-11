import { getProductsByFilter } from '@/lib/data/products'

export async function GET (request) {
  try {
    const { searchParams } = new URL(request.url)

    // aceptamos plural y singular por compatibilidad
    const categories = searchParams.get('categories') || searchParams.get('category') || null
    const brands = searchParams.get('brands') || searchParams.get('brand') || null
    const types = searchParams.get('types') || searchParams.get('type') || searchParams.get('presentation') || null
    const origins = searchParams.get('origins') || searchParams.get('origin') || null
    const accessories = searchParams.get('accessories') || searchParams.get('accessory') || null

    const search = searchParams.get('search') || null
    const sortBy = searchParams.get('sortBy') || null
    const limit = parseInt(searchParams.get('limit') || '0', 10) || null
    const offset = parseInt(searchParams.get('offset') || '0', 10) || null

    const products = await getProductsByFilter({
      categories,
      brands,
      types,
      origins,
      accessories,
      search,
      sortBy,
      limit,
      offset
    })

    console.log('GET /api/getProductsByFilter ->', request.url, 'returned', products.length)
    return new Response(JSON.stringify(products), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}

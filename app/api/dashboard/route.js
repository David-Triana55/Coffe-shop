import { totalSales, activeAuctions, activeProducts, lowStock, monthlySales, categoryPercentage, activeSellers } from '@/lib/data/dashboard'

import { CONSTANTS } from '@/utils/constants'
import { ROLES } from '@/utils/roles'
import { verifyToken } from '@/utils/verifyToken'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET () {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get(CONSTANTS.COOKIE_NAME)?.value

    let sales, auctions, products, stock, montly, category
    let sellers = []
    const decodedToken = await verifyToken(token)

    if (decodedToken.role === ROLES.ADMIN) {
      sellers = await activeSellers()
      sales = await totalSales()
      auctions = await activeAuctions()
      products = await activeProducts()
      montly = await monthlySales()
      category = await categoryPercentage()
    } else {
      sales = await totalSales(decodedToken.brandId)
      auctions = await activeAuctions(decodedToken.brandId)
      products = await activeProducts(decodedToken.brandId)
      montly = await monthlySales(decodedToken.brandId)
      stock = await lowStock(decodedToken.brandId)
      category = await categoryPercentage(decodedToken.brandId)
    }

    return NextResponse.json({ sales, auctions, products, montly, stock, sellers, category }, { status: 200 })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: 'Error interno del servidor', status: 500 })
  }
}

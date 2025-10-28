import { validateAuctionState, registerWinnersJob } from '@/lib/data/auctions'

export async function POST () {
  try {
    const now = new Date()

    const closedAuctions = await validateAuctionState()

    const winners = await registerWinnersJob()

    return Response.json({
      message: 'Job ejecutado correctamente',
      closedCount: closedAuctions.length,
      winnersCount: winners.length,
      closedAuctions,
      insertedPurchases: winners,
      runAt: now
    })
  } catch (e) {
    console.log(e)
  }
}

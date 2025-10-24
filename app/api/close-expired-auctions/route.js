import { proofJob, validateAuctionState } from '@/lib/data/auctions'

export async function POST () {
  console.log('aqui')
  const now = new Date()

  // Actualiza todas las subastas que ya expiraron
  const auctions = await validateAuctionState()
  await proofJob()

  return Response.json({
    closedCount: auctions.length,
    closedAuctions: auctions,
    runAt: now
  })
}

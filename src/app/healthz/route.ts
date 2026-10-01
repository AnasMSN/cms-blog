import { payloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'

/** Used by Docker / uptime monitors. Checks the app and the database. */
export async function GET() {
  try {
    const payload = await payloadClient()
    await payload.count({ collection: 'categories' })
    return Response.json({ status: 'ok', time: new Date().toISOString() })
  } catch (e) {
    return Response.json({ status: 'error', message: (e as Error).message }, { status: 503 })
  }
}

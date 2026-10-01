import config from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

export const payloadClient = cache(() => getPayload({ config }))

export const getSettings = cache(async () => {
  const payload = await payloadClient()
  return payload.findGlobal({ slug: 'settings', depth: 1 })
})

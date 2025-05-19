import payload, { Payload } from 'payload'
import config from '../payload.config'

declare global {
  const cachedPayloadClient: Payload | undefined
  const payloadInitialized: boolean | undefined
}

const globalForPayload = globalThis as typeof globalThis & {
  cachedPayloadClient: Payload
  payloadInitialized: boolean
}

export const getPayloadClient = async (): Promise<Payload> => {
  if (globalForPayload.cachedPayloadClient) {
    return globalForPayload.cachedPayloadClient
  }

  if (!globalForPayload.payloadInitialized) {
    globalForPayload.payloadInitialized = true
    await payload.init({ config })
    globalForPayload.cachedPayloadClient = payload
  }

  return globalForPayload.cachedPayloadClient
}

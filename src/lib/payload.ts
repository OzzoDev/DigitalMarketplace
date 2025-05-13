import payload, { Payload } from 'payload'
import config from '../payload.config'

let cached = (global as any).payload

if (!cached) {
  ;(global as any).payload = {
    client: null,
    promise: null,
  }
  cached = (global as any).payload
}

export const getPayloadClient = async (): Promise<Payload> => {
  if (!process.env.PAYLOAD_SECRET) {
    throw new Error('Missing PAYLOAD_SECRET in environment')
  }

  if (cached.client) {
    return cached.client
  }

  if (!cached.promise) {
    cached.promise = payload.init({ config })
  }

  try {
    cached.client = await cached.promise
  } catch (e: unknown) {
    cached.promise = null
    throw e
  }

  return cached.client
}

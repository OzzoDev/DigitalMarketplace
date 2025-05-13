import payload, { Payload } from 'payload'
import config from '../payload.config'

let cached = (globalThis as any).payload

if (!cached) {
  cached = (globalThis as any).payload = {
    client: null,
    promise: null,
  }
}

export const getPayloadClient = async (): Promise<Payload> => {
  if (cached.client) {
    return cached.client
  }

  if (!cached.promise) {
    cached.promise = payload.init({ config })
  }

  try {
    cached.client = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.client
}

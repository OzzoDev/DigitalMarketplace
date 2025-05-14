import { type FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'

export const createContext = async ({ req }: FetchCreateContextFnOptions) => {
  return {
    req,
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>

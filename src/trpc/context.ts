import { type FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'
import { NextResponse } from 'next/server'

export const createContext = async ({ req }: FetchCreateContextFnOptions) => {
  const res = new NextResponse()

  return {
    req,
    res,
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>

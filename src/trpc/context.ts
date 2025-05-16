import { cookies } from 'next/headers'

export const createContext = async ({ req }: { req: Request }) => {
  const resCookies = await cookies()

  return {
    resCookies,
    req,
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>

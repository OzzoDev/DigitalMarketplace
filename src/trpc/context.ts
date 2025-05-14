import { cookies } from 'next/headers'

export const createContext = async () => {
  const resCookies = await cookies()

  return {
    resCookies,
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>

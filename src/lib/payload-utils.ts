import { User } from '../payload-types'
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'
import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

export const getServerSideUser = async (
  cookies: NextRequest['cookies'] | ReadonlyRequestCookies,
) => {
  const token = cookies.get('payload-token')?.value

  const meRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/me`, {
    headers: {
      Authorization: `JWT ${token}`,
    },
  })

  if (!meRes.ok) {
    return { user: null }
  }

  const { user } = (await meRes.json()) as {
    user: User | null
  }

  return { user }
}

export const decodedToken = <T>(token: string): string | null | T => {
  try {
    const decoded = jwt.decode(token, { complete: true })

    if (decoded) {
      return decoded.payload as T
    }

    return null
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      throw new Error('Your session has expired')
    }

    return null
  }
}

import type { Context } from './context'
import { initTRPC, TRPCError } from '@trpc/server'
import { User } from '@/payload-types'
import { decodedToken } from '@/lib/payload-utils'

const t = initTRPC.context<Context>().create()
const middleware = t.middleware

const isAuth = middleware(async ({ ctx, next }) => {
  const user = decodedToken<User>(ctx.resCookies.get('payload-token')?.value || '') as User

  const userId = user.id

  if (!userId) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }

  return next({
    ctx: {
      userId,
    },
  })
})

export const router = t.router
export const publicProcedure = t.procedure
export const privateProcedure = t.procedure.use(isAuth)

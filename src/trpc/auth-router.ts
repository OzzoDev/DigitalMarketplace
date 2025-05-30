import { AuthCredentialsValidator } from '@/lib/validators/account-credentials-validator'
import { publicProcedure, router } from './trpc'
import { getPayloadClient } from '@/lib/payload'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

export const authRouter = router({
  createPayloadUser: publicProcedure.input(AuthCredentialsValidator).mutation(async ({ input }) => {
    const { email, password } = input

    const payload = await getPayloadClient()

    const { docs: users } = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: email,
        },
      },
    })

    if (users.length !== 0) {
      throw new TRPCError({ code: 'CONFLICT' })
    }

    await payload.create({
      collection: 'users',
      data: {
        role: 'user',
        email,
        password,
      },
    })

    return { success: true, sentToEmail: email }
  }),

  verifyEmail: publicProcedure.input(z.object({ token: z.string() })).query(async ({ input }) => {
    const { token } = input

    const payload = await getPayloadClient()

    const isVerified = await payload.verifyEmail({
      collection: 'users',
      token,
    })

    if (!isVerified) {
      throw new TRPCError({ code: 'UNAUTHORIZED' })
    }

    return { success: true }
  }),

  signIn: publicProcedure.input(AuthCredentialsValidator).mutation(async ({ input, ctx }) => {
    const { email, password } = input
    const payload = await getPayloadClient()

    try {
      const { token, exp } = await payload.login({
        collection: 'users',
        data: {
          email,
          password,
        },
      })

      if (!token) throw new Error('Login failed: token not returned')

      ctx.resCookies.set('payload-token', token, {
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        expires: new Date((exp ?? Date.now() / 1000 + 60 * 60 * 24 * 7) * 1000),
      })

      return { success: true }
    } catch (err) {
      console.log(err)

      throw new TRPCError({ code: 'UNAUTHORIZED' })
    }
  }),
})

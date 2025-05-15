import { z } from 'zod'
import { authRouter } from './auth-router'
import { publicProcedure, router } from './trpc'
import { QueryValidator } from '@/lib/validators/query-validator'
import { getPayloadClient } from '../lib/payload'
import { productRouter } from './product-router'

export const appRouter = router({
  auth: authRouter,
  product: productRouter,

  // getInfiniteProducts: publicProcedure
  //   .input(
  //     z.object({
  //       limit: z.number().min(1).max(1000),
  //       cursor: z.number().nullish(),
  //       query: QueryValidator,
  //     }),
  //   )
  //   .query(async ({ input }) => {
  //     try {
  //       const { query, cursor } = input
  //       const { sort, limit, ...queryOpts } = query

  //       const payload = await getPayloadClient()

  //       const parsedQueryOpts: Record<string, { equals: string }> = {}

  //       Object.entries(queryOpts).forEach(([key, value]) => {
  //         parsedQueryOpts[key] = {
  //           equals: value,
  //         }
  //       })

  //       const page = cursor || 1

  //       const {
  //         docs: items,
  //         hasNextPage,
  //         nextPage,
  //       } = await payload.find({
  //         collection: 'products',
  //         where: {
  //           approvedForSale: {
  //             equals: 'approved',
  //           },
  //           ...parsedQueryOpts,
  //         },
  //         sort,
  //         depth: 1,
  //         limit,
  //         page,
  //       })

  //       return {
  //         items,
  //         nextPage: hasNextPage ? nextPage : null,
  //       }
  //     } catch (err) {
  //       console.log(err)
  //     }
  //   }),
})

export type AppRouter = typeof appRouter

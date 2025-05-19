import { getServerSideUser } from '@/lib/payload-utils'
import Image from 'next/image'
import { cookies } from 'next/headers'
import { getPayloadClient } from '@/lib/payload'
import { notFound, redirect } from 'next/navigation'
import { Product, ProductFile, User } from '@/payload-types'
import { PRODUCT_CATEGORIES } from '@/config'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import PaymentStatus from '@/components/PaymentStatus'

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams
  const orderId = resolvedParams.orderId
  const nextCookies = await cookies()

  const { user } = await getServerSideUser(nextCookies)
  const payload = await getPayloadClient()

  const { docs: orders } = await payload.find({
    collection: 'orders',
    depth: 2,
    where: {
      id: {
        equals: orderId,
      },
    },
  })

  const [order] = orders

  if (!order) {
    return notFound()
  }

  const orderUserId = typeof order.user === 'string' ? order.user : order.user.id

  if (orderUserId !== user?.id) {
    return redirect(`/sign-in?origin=thank-you?orderId=${order.id}`)
  }

  const products = order.products as Product[]

  const orderTotal = products.reduce((total, product) => {
    return total + product.price
  }, 0)

  return (
    <main className="relative lg:min-h-fulll">
      <div className="hidden lg:block h-80 overflow-hidden lg:absolute lg:h-full lg:w-1/2 lg:pr-4 xl:pr-12">
        <Image
          fill
          src="/checkout-thank-you.jpg"
          className="h-full w-full obejct-cover object-center"
          alt="thank you for your order"
        />
      </div>

      <div>
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-32 xl:gap-x-24">
          <div className="lg:col-start-2">
            <p className="text-sm font-medium text-blue-600">Order successful</p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray sm:text-5xl">
              Thanks for ordering
            </h1>
            {order._isPaid ? (
              <p className="mt-2 text-base text-muted-foreground">
                Your order was processed and your assets are available to downlaod below. We&apos;ve
                sent your receipt and order details to{' '}
                {typeof order.user !== 'string' ? (
                  <span className="font-medium text-gray-900">{order.user.email}</span>
                ) : null}
                .
              </p>
            ) : (
              <p className="mt-2 text-base text-muted-foreground">
                We appreciate your order, and we&apos;re currentlty processing it. So hang tight and
                we&apos;ll send your confirmation very soon!
              </p>
            )}

            <div className="mt-16 text-sm font-medium">
              <div className="text-muted-foreground">
                Order nr.
                <div className="mt-2 text-gray-900">{order.id}</div>
                <ul className="mt-6 divide-y- divide-gray-200 border-t border-gray-200 text-sm font-medium text-muted-foreground">
                  {(order.products as Product[]).map((product) => {
                    const label = PRODUCT_CATEGORIES.find(
                      (prod) => prod.value === product.category,
                    )?.label
                    const downloadUrl = (product.product_files as ProductFile).url as string

                    const { image } = product.Images[0]

                    return (
                      <li key={product.id} className="flex space-x-6 py-6">
                        <div className="relative h-24 w-24">
                          {typeof image !== 'string' && image.url ? (
                            <Image
                              fill
                              src={image.url}
                              alt={`${product.name} image`}
                              className="flex-none rounded-md bg-gray-100 object-cover object-center"
                            />
                          ) : null}
                        </div>

                        <div className="flex-auto flex flex-col justify-between">
                          <div className="space-y-1">
                            <h3 className="text-gray-900">{product.name}</h3>
                            <p className="my-1">{label}</p>
                          </div>

                          {order._isPaid ? (
                            <a
                              href={downloadUrl}
                              download={product.name}
                              className="text-blue-600 hover:underline underline-offset-2"
                            >
                              Download asset
                            </a>
                          ) : null}
                        </div>

                        <p className="flex-none font-medium text-gray-900">
                          {formatPrice(product.price)}
                        </p>
                      </li>
                    )
                  })}
                </ul>
                <div className="space-y-6 border-t border-gray-200 pt-6 text-sm font-medium text-muted-foreground">
                  <div className="flex justify-between">
                    <p className="text-gray-900">Subtotal</p>
                    <p>{formatPrice(orderTotal)}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-gray-900">Transaction Fee</p>
                    <p>{formatPrice(1)}</p>
                  </div>
                  <div className="flex items-center justify-between border-t broder-gray-200 pt-6 text-gray-900">
                    <p className="text-base">Total</p>
                    <p className="text-base">{formatPrice(orderTotal + 1)}</p>
                  </div>
                </div>
                <PaymentStatus
                  orderEmail={(order.user as User).email}
                  orderId={order.id}
                  isPaid={order._isPaid}
                />
                <div className="mt-16 border-t border-gray-200 py-6 text-right">
                  <Link
                    href="/href"
                    className="text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    Continue shopping &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

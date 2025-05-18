import { NextRequest } from 'next/server'
import Stripe from 'stripe'
import { getPayloadClient } from '../../../../lib/payload'
import { ReceiptEmailHtml } from '../../../../components/emails/ReceiptEmail'
import { Resend } from 'resend'
import type { Product } from '@/payload-types'
import { stripe } from '../../../../lib/stripe'

export const config = {
  api: {
    bodyParser: false,
  },
}

const resend = new Resend(process.env.RESEND_API_KEY)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  const rawBody = await req.arrayBuffer()
  const bodyBuffer = Buffer.from(rawBody)
  const sig = req.headers.get('stripe-signature') || ''

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(bodyBuffer, sig, webhookSecret)
  } catch (err: any) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }

  const session = event.data.object as Stripe.Checkout.Session

  if (!session?.metadata?.userId || !session?.metadata?.orderId) {
    return new Response('Webhook Error: Missing user or order ID', { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const payload = await getPayloadClient()

    const { docs: users } = await payload.find({
      collection: 'users',
      where: {
        id: {
          equals: session.metadata.userId,
        },
      },
    })

    const user = users[0]
    if (!user) return new Response('User not found', { status: 404 })

    const { docs: orders } = await payload.find({
      collection: 'orders',
      depth: 2,
      where: {
        id: {
          equals: session.metadata.orderId,
        },
      },
    })

    const order = orders[0]
    if (!order) return new Response('Order not found', { status: 404 })

    await payload.update({
      collection: 'orders',
      data: {
        _isPaid: true,
      },
      where: {
        id: {
          equals: session.metadata.orderId,
        },
      },
    })

    try {
      const data = await resend.emails.send({
        from: 'DigitalHippo <hello@joshtriedcoding.com>',
        to: [user.email],
        subject: 'Thanks for your order! This is your receipt.',
        html: await ReceiptEmailHtml({
          date: new Date(),
          email: user.email,
          orderId: session.metadata.orderId,
          products: order.products as Product[],
        }),
      })

      return new Response(JSON.stringify({ data }), { status: 200 })
    } catch (error) {
      console.error('Email sending failed:', error)
      return new Response(JSON.stringify({ error }), { status: 500 })
    }
  }

  return new Response('Event handled', { status: 200 })
}

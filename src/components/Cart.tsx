'use client'

import { ShoppingCartIcon } from 'lucide-react'
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet'
import { Separator } from './ui/separator'
import Link from 'next/link'
import { buttonVariants } from './ui/button'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'

const Cart = () => {
  const itemsCount = 1

  const fee = 1

  return (
    <Sheet>
      <SheetTrigger className="group -m-2 flex items-center p-2 cursor-pointer">
        <ShoppingCartIcon
          aria-hidden="true"
          className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
        />
        <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">0</span>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg [&>button]:cursor-pointer">
        <SheetHeader className="space-y-2.5 pr-6">
          <SheetTitle className="text-center">Cart (0)</SheetTitle>
        </SheetHeader>
        {itemsCount > 0 ? (
          <>
            <div className="flex w-full flex-col px-6">
              {/*TODO: cart logic*/}
              cart items
            </div>
            <div className="space-y-4 px-6">
              <Separator />
              <div className="space-y-1.5">
                <div className="flex">
                  <span className="flex-1">Shipping</span>
                  <span>Fee</span>
                </div>
                <div className="flex">
                  <span className="flex-1">Transaction Fee</span>
                  <span>{formatPrice(fee)}</span>
                </div>
                <div className="flex">
                  <span className="flex-1">Total</span>
                  <span>{formatPrice(fee)}</span>
                </div>
              </div>
              <SheetFooter className="px-0">
                <SheetTrigger asChild>
                  <Link href="/cart" className={buttonVariants({ className: 'w-full' })}>
                    Continue to Checkout
                  </Link>
                </SheetTrigger>
              </SheetFooter>
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center space-y-1">
            <div className="relative mb-4 w-60 h-60 text-muted-foreground">
              <Image src="/hippo-empty-cart.png" fill alt="empty shopping cart hippo" />
            </div>
            <div className="text-xl font-semibold">Your cart is empty</div>
            <SheetTrigger asChild>
              <Link
                href="/products"
                className={buttonVariants({
                  variant: 'link',
                  size: 'sm',
                  className: 'text-sm text-muted-foreground',
                })}
              >
                Add items to your cart to checkout
              </Link>
            </SheetTrigger>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

export default Cart

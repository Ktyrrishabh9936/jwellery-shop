'use client'

import { useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useDispatch, useSelector } from 'react-redux'
import { removefromCart, setsidebarCart } from '@/lib/reducers/cartReducer'
import Link from 'next/link'
import { FiShoppingCart } from 'react-icons/fi';
import Arrow from '@/assets/Arrow.svg'
import { useRouter } from 'next/navigation'
import { formatPrice } from '@/utils/productDiscount'
import { Button } from '@material-tailwind/react'
const products = [
  {
    id: 1,
    name: 'Throwback Hip Bag',
    href: '#',
    color: 'Salmon',
    price: '$90.00',
    quantity: 1,
    imageSrc: 'https://tailwindui.com/plus/img/ecommerce-images/shopping-cart-page-04-product-01.jpg',
    imageAlt: 'Salmon orange fabric pouch with match zipper, gray zipper pull, and adjustable hip belt.',
  },
  {
    id: 2,
    name: 'Medium Stuff Satchel',
    href: '#',
    color: 'Blue',
    price: '$32.00',
    quantity: 1,
    imageSrc: 'https://tailwindui.com/plus/img/ecommerce-images/shopping-cart-page-04-product-02.jpg',
    imageAlt:
      'Front of satchel with blue canvas body, black straps and handle, drawstring top, and front zipper pouch.',
  },
  // More products...
]

export default function CartSidebar() {
  const {openSideCart,totalItem,loading,Items,loadingRemoveProduct,totalDiscountedPrice} = useSelector((state)=>state.cart);
  const dispatch = useDispatch();
  const navigate = useRouter();

  return (
    <Dialog open={openSideCart} onClose={()=>dispatch(setsidebarCart(false))} className="relative z-[100]">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity duration-500 ease-in-out data-[closed]:opacity-0"
      />
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <DialogPanel
              transition
              className="pointer-events-auto w-screen max-w-md transform transition  ease-in-out data-[closed]:translate-x-full duration-300 sm:duration-400"
            >
              <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                  <div className="flex items-start justify-between">
                    <DialogTitle className="text-lg font-medium text-gray-900">Shopping cart</DialogTitle>
                    <div className="ml-3 flex h-7 items-center">
                      <button
                        type="button"
                        onClick={() => dispatch(setsidebarCart(false))}
                        className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                      >
                        <span className="absolute -inset-0.5" />
                        <span className="sr-only">Close panel</span>
                        <XMarkIcon aria-hidden="true" className="size-6" />
                      </button>
                    </div>
                  </div>

                  {totalItem === 0 ?
    <div className='flex flex-col items-center justify-center  p-10 text-center'>
      <div className='mb-6'>
        <FiShoppingCart className='mx-auto text-6xl text-gray-400' />
      </div>
      <div className='mb-4'>
        <h2 className='text-xl font-semibold text-gray-800 mb-2'>Your shelf looks a little empty!</h2>
        <p className='text-gray-600'>Let’s start adding your first product. It’s quick, easy, and you can always customize it later.</p>
      </div>
      <Button
        onClick={()=>{dispatch(setsidebarCart(false) )
          navigate.push('/')
        }}
        className="mt-6 inline-flex shrink-0 items-center gap-2 rounded-full border border-rose-600 px-5 py-3 text-rose-600 transition hover:bg-rose-600 text-white bg-pink-500 md:mt-0"
      >
        <span className="font-medium"> Continue Shopping</span>
        <span className="w-[30px]"><Arrow/></span>
      </Button>
    </div>
      :<div className="mt-8">
                    <div className="flow-root">
                      <ul role="list" className="-my-6 divide-y divide-gray-200">
                        {
                          loading ? Array(3).fill(0).map((_,ind) => (<li className="flex py-6" key={ind}>
                          {/* Image skeleton */}
                          <div className="size-24 shrink-0 overflow-hidden rounded-md bg-gray-200 animate-pulse"></div>
                    
                          <div className="ml-4 flex flex-1 flex-col">
                            {/* Title and Price skeleton */}
                            <div>
                              <div className="flex justify-between text-base font-medium">
                                <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded"></div>
                                <div className="h-4 w-1/4 bg-gray-200 animate-pulse rounded ml-4"></div>
                              </div>
                              <div className="mt-1 h-3 w-1/2 bg-gray-200 animate-pulse rounded"></div>
                            </div>
                            {/* Quantity and Remove Button skeleton */}
                            <div className="flex flex-1 items-end justify-between text-sm mt-4">
                              <div className="h-3 w-1/4 bg-gray-200 animate-pulse rounded"></div>
                              <div className="flex">
                                <div className="h-3 w-16 bg-gray-200 animate-pulse rounded"></div>
                              </div>
                            </div>
                          </div>
                        </li> ))
                       : Items?.map((item,ind) => (
                          <li key={ind} className={`flex py-6 relative box ${loadingRemoveProduct === item.productId ? 'blur' : ''}`}>
                            <div className="size-24 shrink-0 overflow-hidden rounded-md border border-gray-200">
                              <img alt={`cartitems${ind}`} src={item.img_src} className="size-full object-cover" />
                            </div>

                            <div className="ml-4 flex flex-1 flex-col">
                              <div>
                                <div className="flex justify-between text-base font-medium text-gray-900">
                                  <h3 className=' line-clamp-2'>
                                    {item.name}
                                  </h3>
                                  <p className="ml-4">{formatPrice(item.discountedPrice*item.quantity)}</p>
                                </div>
                                <p className="mt-1 text-sm text-gray-500 capitalize">{item.category}</p>
                              </div>
                              <div className="flex flex-1 items-end justify-between text-sm">
                                <p className="text-gray-500">Qty {item.quantity}</p>

                                <div className="flex">
                                  <button type="button" className="font-medium text-indigo-600 hover:text-indigo-500" onClick={()=>dispatch(removefromCart(item.productId))}>
                                    Remove
                                  </button>
                                </div>
                              </div>
                            </div>
                            {loadingRemoveProduct === item.productId && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="loader"></div>
        </div>
      )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>}
                </div>

                {totalItem  &&<div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <p>Subtotal</p>
                    <p>{formatPrice(totalDiscountedPrice)}</p>
                  </div>
                  <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                  <div className="mt-6">
                    <button
                      onClick={()=>{dispatch(setsidebarCart(false));navigate.push("/checkout")}}
                      className=" cursor-pointer flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 w-full"
                    >
                      Checkout
                    </button>
                  </div>
                  <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                    <p>
                      or{' '}
                      <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Continue Shopping
                        <span aria-hidden="true"> &rarr;</span>
                      </button>
                    </p>
                  </div>
                </div>}
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  )
}

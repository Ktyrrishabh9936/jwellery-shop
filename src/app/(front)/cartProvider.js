"use client"
import React from 'react'
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart } from '@/lib/reducers/cartReducer';
export default function CartProvider({children}) {
const dispatch = useDispatch();
  const {isFetched} = useSelector((state)=>state.cart)
  const session = useSession();
  useEffect(()=>{
    if(session.status === "authenticated")
      if(!isFetched){
    dispatch(fetchCart());
      }
  },[session])
  return (
    <div>
      {children}
    </div>
  )
}

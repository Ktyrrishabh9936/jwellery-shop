"use client"
import React from 'react'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart } from '@/lib/reducers/cartReducer';
export default function CartProvider({children}) {
const dispatch = useDispatch();
  const {isFetched} = useSelector((state)=>state.cart)
  const {user} = useSelector((store)=>store.user);
  useEffect(()=>{
    
      if(!isFetched){
    dispatch(fetchCart());
      }
  },[dispatch,user])
  return (
    <div>
      {children}
    </div>
  )
}

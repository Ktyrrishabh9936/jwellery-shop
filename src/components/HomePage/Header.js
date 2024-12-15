"use client";
import React, { useState, useEffect } from 'react';
import {
  Navbar,
  Collapse,
  Typography,
  Button,
  IconButton,
  Badge,
} from "@/MaterialTailwindNext";
import {
  Bars2Icon,
} from "@heroicons/react/24/solid";
//  import Cart from '@/assets/Cart.svg'
import Link from "next/link";
import Image from "next/image";
import dynamic from 'next/dynamic';
const ProfileMenu = dynamic(() => import('./ProfileMenu'));
const NavList = dynamic(() => import('./Navlist'));
const Search = dynamic(() => import('./Search'));

import { useRouter } from 'next/navigation.js';
import { useDispatch, useSelector } from 'react-redux';
import { setsidebarCart } from '@/lib/reducers/cartReducer';
import { FaHeart } from 'react-icons/fa';
import { FaCartShopping, FaRegHeart } from 'react-icons/fa6';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { FiShoppingCart } from 'react-icons/fi';

export default function Header() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const {user} = useSelector((store)=>store.user);
  const {totalItem} = useSelector((store)=>store.cart);
  const {wishListByID} = useSelector((store)=>store.wishlist);
  const navigate = useRouter();
  const dispatch = useDispatch();

  const toggleIsNavOpen = () => setIsNavOpen((cur) => !cur);
 
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 960) {
        setIsNavOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
   
    <Navbar className="mx-auto p-2 lg:pl-6 shadow-none sticky top-0 z-50">
      <div className="relative mx-auto flex items-center justify-between text-blue-gray-900">
        <Typography as="a" href="#" className="mr-4 ml-2 cursor-pointer py-1.5 font-medium">
         <Link href="/"> <Image width={80} height={80} src="/Jenii-Logo.svg" alt="Jenii" /></Link>
        </Typography>
        {/*  */}
        <Search/>
        {/*  */}
        <IconButton
          size="sm"
          color="blue-gray"
          variant="text"
          onClick={toggleIsNavOpen}
          className="ml-auto mr-2 lg:hidden"
        >
          <Bars2Icon className="h-6 w-6" />
        </IconButton>
        <div className="flex justify-center items-center  gap-2 ">
        <button onClick={()=>navigate.push('/mywishlist')} className=' shadow-none cursor-pointer relative py-2 px-1.5 h-max inline-flex items-center  text-sm font-medium text-center bg-transparent text-black rounded-full    dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800   hover:text-red-400' >
                <FaRegHeart fontSize={22} />
<div class="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold  rounded-full -top-2 -end-2 dark:border-gray-900">{wishListByID.length}</div>
          </button>
            <button onClick={()=>{dispatch(setsidebarCart(true)); }} className=' relative cursor-pointer  pr-2 pb-2 pl-1 pt-1 h-max inline-flex items-center shadow-none  text-sm font-medium text-center bg-transparent text-black rounded-full     dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800  hover:text-red-400' >
                <FiShoppingCart fontSize={25}/>
                <div class="absolute inline-flex z-40 items-center justify-center w-6 h-6 text-xs font-bold   rounded-full -top-2 -end-2 dark:border-gray-900">{totalItem}</div>
                </button>
         

          {/* Conditionally render ProfileMenu or Login button */}
          {user ? (
            <ProfileMenu user={user} />
          ) : (
              <Link href='/login'>
            <Button
              className="whitespace-nowrap bg-gray-200 text-pink-600 hover:bg-pink-200 hover:text-white "
              size="sm"
              variant="text"
              
            >
              <span>Log In</span>
                </Button>
              </Link>
          )}
        </div>
      </div>
      <Collapse open={isNavOpen} className="overflow-scroll">
        <NavList />
        <Search />
      </Collapse>
    </Navbar>
  );
}
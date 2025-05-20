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

import { usePathname, useRouter } from 'next/navigation.js';
import { useDispatch, useSelector } from 'react-redux';
import { setsidebarCart } from '@/lib/reducers/cartReducer';
import { FaHeart, FaStore } from 'react-icons/fa';
import { FaCartShopping, FaRegHeart } from 'react-icons/fa6';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { FiShoppingCart } from 'react-icons/fi';
import MobMenu from "../navcomponents/MobMenu";
import { Menus } from '@/utils/NavData';
import { Store } from 'lucide-react';
import { FaRegUserCircle } from "react-icons/fa";


export default function Header() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const {user} = useSelector((store)=>store.user);
  const {totalItem} = useSelector((store)=>store.cart);
  const {wishListByID} = useSelector((store)=>store.wishlist);
  const navigate = useRouter();
  const dispatch = useDispatch();
  const pathname = usePathname()

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
   
    <Navbar className="mx-auto p-2 lg:pl-6 shadow-none sticky top-0 z-20">
      <div className="relative mx-auto flex items-center justify-between text-blue-gray-900">
      <div className=' flex'>
      <div className="lg:hidden flex items-center">
              <MobMenu Menus={Menus} />
      </div>

        <Typography  className="mr-4 ml-3 cursor-pointer py-1.5 font-medium">
         <Link href="/"> <Image width={80} height={80} src="/Jenii-Logo.svg" alt="Jenii" /></Link>
        </Typography>
        </div>
        {/*  */}
        <Search/>
        {/*  */}
        {/* <IconButton
          size="sm"
          color="blue-gray"
          variant="text"
          onClick={toggleIsNavOpen}
          className="ml-auto mr-2 lg:hidden"
        >
          <Bars2Icon className="h-6 w-6" />
        </IconButton> */}

        <div className="flex justify-center items-center  gap-1.5 ">
                {user ? 
                <div className=' flex flex-col justify-center items-center'>
                 <button onClick={()=>navigate.push('/mywishlist')} className=' shadow-none cursor-pointer relative py-2 px-1.5 h-max inline-flex items-center  text-sm font-medium text-center bg-transparent text-black rounded-full    dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800   hover:text-red-400 mx-auto' >
                <FaRegHeart fontSize={22}  />
<div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold  rounded-full -top-2 -end-2 dark:border-gray-900">{wishListByID.length}</div>
          </button> 
          <p className='hidden md:block'>Wishlist</p>
          </div>
          :""}
        { pathname === "/delivery" ? "": <div className='mx-0 md:mx-2'>
            <button onClick={()=>{dispatch(setsidebarCart(true)); }} className=' relative cursor-pointer  pr-2  pl-1 pt-2 h-max inline-flex items-center shadow-none  text-sm font-medium text-center bg-transparent text-black rounded-full     dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800  hover:text-red-400' >
                <FiShoppingCart fontSize={25}/>
                <div className="absolute inline-flex  items-center justify-center w-6 h-6 text-xs font-bold   rounded-full -top-2 -end-2 dark:border-gray-900">{totalItem}</div>
                </button>
                <p className='hidden md:block text-center'>Cart</p>
                </div>}


                <Link  href="/store" className="text-[#C41E56]  font-medium cursor-pointer mx-0 md:mx-2">
          <IconButton size='md' className=' bg-pink-400'> 
                <FaStore fontSize={22} />
                </IconButton>
                <p className='hidden md:block'>Store</p>
          </Link>

          {/* Conditionally render ProfileMenu or Login button */}
          {user ? (
            <ProfileMenu user={user} />
          ) : (
              <Link href='/login'>
            <Button
              className="whitespace-nowrap bg-gray-200 text-black hover:bg-pink-200 hover:text-white ml-0  md:ml-1.5"
              size="sm"
              variant="text"
            >
              <span><FaRegUserCircle fontSize={22} className='mx-auto mb-2 hidden md:block'/></span>
              <span >Sign In</span>
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
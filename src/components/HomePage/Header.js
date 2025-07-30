"use client";
import React, { useState, useEffect } from 'react';
import {
  Navbar,
  Collapse,
  Typography,
  Button,
  IconButton,
} from "@/MaterialTailwindNext";
import ThemeToggle from "@/components/ui/theme-toggle";
import Link from "next/link";
import Image from "next/image";
import dynamic from 'next/dynamic';
const ProfileMenu = dynamic(() => import('./ProfileMenu'));
const NavList = dynamic(() => import('./Navlist'));
const Search = dynamic(() => import('./Search'));
import { usePathname, useRouter } from 'next/navigation.js';
import { useDispatch, useSelector } from 'react-redux';
import { setsidebarCart } from '@/lib/reducers/cartReducer';
import { FaStore } from 'react-icons/fa';
import { FaRegHeart } from 'react-icons/fa6';
import { FiShoppingCart } from 'react-icons/fi';
import MobMenu from "../navcomponents/MobMenu";
import { Menus } from '@/utils/NavData';
import { FaRegUserCircle } from "react-icons/fa";

export default function Header() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const { user } = useSelector((store) => store.user);
  const { totalItem } = useSelector((store) => store.cart);
  const { wishListByID } = useSelector((store) => store.wishlist);
  const navigate = useRouter();
  const dispatch = useDispatch();
  const pathname = usePathname();


  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 960) {
        setIsNavOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Navbar className="mx-auto p-2 lg:pl-6 shadow-none sticky top-0 z-20 dark:bg-gray-900 dark:text-white">
      <div className="relative mx-auto flex items-center justify-between text-blue-gray-900 dark:text-white">
        <div className="flex">
          <div className="lg:hidden flex items-center">
            <MobMenu Menus={Menus} />
          </div>

          <Typography className="mr-4 ml-3 cursor-pointer py-1.5 font-medium">
            <Link href="/">
              <Image width={80} height={80} src="/Jenii-Logo.svg" alt="Jenii" />
            </Link>
          </Typography>
        </div>

        <Search />

        <div className="flex justify-center items-center gap-1.5">
          {user && (
            <div className="flex flex-col justify-center items-center">
              <button
                onClick={() => navigate.push('/mywishlist')}
                className="shadow-none cursor-pointer relative pt-1.5 px-1.5 h-max inline-flex items-center text-sm font-medium text-center bg-transparent text-black dark:text-white rounded-full hover:text-primary"
              >
                <div>
                <FaRegHeart fontSize={22} className='mx-auto ' />
                <p className="hidden md:block text-sm pt-0.5">Wishlist</p>
                </div>
                <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold rounded-full -top-1 -end-1 dark:border-gray-900">
                  {wishListByID.length}
                </div>
              </button>
              
            </div>
          )}

          <Link href="/store" className="font-medium cursor-pointer mx-0 md:mx-2">
            <button  className=" hover:bg-primary-dark text-black dark:text-white pt-1.5 " >
              <FaStore fontSize={22} className='mx-auto' />
              <p className="hidden md:block text-sm pt-0.5">Store</p>
            </button>
            
          </Link>

          {pathname !== "/delivery" && (
            <div className="mx-0 md:mx-2">
              <button
                onClick={() => dispatch(setsidebarCart(true))}
                className="relative cursor-pointer pr-2 pl-1 pt-2 h-max inline-flex items-center shadow-none text-sm font-medium text-center bg-transparent text-black dark:text-white rounded-full hover:text-primary"
              >
                <div >
                <FiShoppingCart fontSize={22} />
                <p className="hidden md:block text-center">Cart</p>
                </div>
                <div className="absolute inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full -top-1 -end-1 dark:border-gray-900 ">
                  {totalItem}
                </div>
              </button>
              
            </div>
          )}

          

          {/* <ThemeToggle /> */}

          {user ? (
            <ProfileMenu user={user} />
          ) : (
              <button
                className="whitespace-nowrap bg-gray-200 text-black dark:bg-gray-700 dark:text-white hover:bg-primary hover:text-white ml-0 md:ml-1.5 text-sm px-3 py-2 rounded-md"
                size="sm"
                
                onClick={() => navigate.push('/login')}
              >
                <span>
                  <FaRegUserCircle fontSize={22} className="mx-auto  hidden md:block" />
                </span>
                <span>Login</span>
              </button>
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

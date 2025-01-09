"use client"
import { Menus } from "@/utils/NavData";
import DesktopMenu from "../navcomponents/DesktopMenu";
import { useState } from "react";
import {
  Typography,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Card,
} from "@/MaterialTailwindNext";
import {

  Square3Stack3DIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/solid";
import Image from "next/image";
const navListMenuItems = [
  {
    title: "Men",
    description:
      "Men's jewelry has evolved to be more than mere simplicity and functionality.",
      image:"/images/menBanner.jpeg"
  },
  {
    title: "Women",
    description:
      "The jewellery worn by the modern woman is a statement of individuality, strength, style and love.",
      image:"/images/womenBanner.webp"
  }
];
// components/NavBar.js
export default function NavBar() {
    const renderItems = navListMenuItems.map(({ title, description },ind) => (
      <a href="#" key={title}>
        <MenuItem onMouseEnter={()=>setImagesInd(ind+1)} onMouseLeave={()=>setImagesInd(0)}>
          <Typography variant="h6" color="pink" className="mb-1">
            {title}
          </Typography>
          <Typography variant="small" color="gray" className="font-normal">
            {description}
          </Typography>
        </MenuItem>
      </a>
    ));
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [imagesInd, setImagesInd] = useState(0);
        return (
          <div className="hidden lg:block ">
             <header className="h-16 text-[15px]  relative inset-0 z-[15] flex-center bg-white text-[#18181A]  dark:bg:[#18181A] ">
        <nav className=" px-3.5 flex-center-between w-full max-w-7xl mx-auto">
        <Menu allowHover open={isMenuOpen} handler={setIsMenuOpen}>
        <MenuHandler>
          <Typography  variant="small" className="font-normal">
            <MenuItem className="hidden items-center gap-2 font-medium text-blue-gray-900 lg:flex lg:rounded-full">
              <Square3Stack3DIcon className="h-[18px] w-[18px] text-blue-gray-500" />{" "}
              Shop by Category{" "}
              <ChevronDownIcon
                strokeWidth={2}
                className={`h-3 w-3 transition-transform ${
                  isMenuOpen ? "rotate-180" : ""
                }`}
              />
            </MenuItem>
          </Typography>
        </MenuHandler>
        <MenuList>
        <MenuItem>Tops (Earrings)</MenuItem>
        <MenuItem>Rings</MenuItem>
        <MenuItem>Set (Pendant Sets with Chain)</MenuItem>
        <MenuItem>Mangalsutra</MenuItem>
        <MenuItem>Chain (Small Necklace)</MenuItem>
        <MenuItem>Bracelet + Ring</MenuItem>
        <MenuItem>Pendant Set + Ring</MenuItem>
        <MenuItem>Payal</MenuItem>
      </MenuList>
      </Menu>

          <ul className="gap-x-1 lg:flex-center hidden lg:block">
            {Menus.map((menu) => (
              <DesktopMenu menu={menu} key={menu.name} />
            ))}
          </ul>
    
        </nav>
      </header>

          {/* <nav className="bg-gray-100 hidden lg:block">
            <div className="container mx-auto flex justify-between p-4">
              <ul className="flex space-x-4 text-gray-600">
        <div className="hidden lg:block">
          <NavList />
        </div>
              </ul>
            </div>
          </nav> */}
          </div>
        );
      }
      
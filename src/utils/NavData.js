import { Bolt, BookHeart, HandHeart, ScanHeart } from "lucide-react";
import { ShoppingBag } from "lucide-react";
import { BellDot } from "lucide-react";
import { BookOpenText } from "lucide-react";
import { BriefcaseBusiness } from "lucide-react";
import { CircleHelp } from "lucide-react";
import { TriangleAlert } from "lucide-react";
import { Users } from "lucide-react";
import { Lock } from "lucide-react";
import { Dessert } from "lucide-react";
import { ShieldPlus } from "lucide-react";
import { MessageCircle } from "lucide-react";
import { Images } from "lucide-react";
import { Figma } from "lucide-react";
import { Play } from "lucide-react";
import { MapPin } from "lucide-react";
import { Database } from "lucide-react";
import { PanelsTopLeft } from "lucide-react";
import { PanelTop } from "lucide-react";
import { FaHeartbeat, FaRing } from "react-icons/fa";
import { AiFillProduct } from "react-icons/ai";
import { GiRose } from "react-icons/gi";
import { IoMdRose } from "react-icons/io";
import {  MdOutlineFestival } from "react-icons/md";
import { FaShieldHeart } from "react-icons/fa6";

export const Menus = [
  {
    name: "Shop By Category",
    subMenuHeading: ["Elegant", "Sylish"],
    subMenu: [
      { name: "Tops (Earrings)", link: "/categories/tops" ,icon:null},
      { name: "Rings", link: "/categories/rings",icon:null},
      { name: "Pendant Sets with Chain", link: "/categories/sets",icon:null },
      { name: "Mangalsutra", link: "/categories/ring" ,icon:null},
      { name: "Chain (Small Necklace)", link: "/categories/necklace" ,icon:null},
      { name: "Bracelet + Ring", link: "/categories/bracelet/rings" ,icon:null},
      { name: "Pendant Set + Ring", link: "/categories/pendent/rings",icon:null },
      { name: "Payal", link: "/categories/anklet",icon:null },
    ],
    gridCols: 2,
  },
  // {
  //   name: "Shop By Collection",
  //   subMenuHeading: ["Fashion", "gold"],
  //   subMenu: [
  //     {
  //       name: "Wedding Collection",
  //       desc: "Bride & Groom",
  //       icon: PanelsTopLeft,
  //       link:"/collections/wedding"
  //     },
  //     {
  //       name: "Luxury Vault",
  //       desc: "Premium",
  //       icon: Bolt,
  //        link:"/collections/luxury-vault"
  //     },
  //     {
  //       name: "Budget Picks",
  //       desc: "Cost oriented",
  //       icon: PanelTop,
  //        link:"/collections/budget-picks"
  //     },
  //     {
  //       name: "Hot Picks",
  //       desc: "High Quality",
  //       icon: Database,
  //        link:"/collections/hot-picks"
  //     },
  //     {
  //       name: "Top Products",
  //       desc: "Best Sellings",
  //       icon: AiFillProduct,
  //        link:"/collections/top-products"
  //     },
  //   ],
  //   gridCols: 2,
  // },
  {
    name: "Shop By Relation",
    subMenuHeading: ["Love", "Wealthy", "Recent"],
    subMenu: [
      {
        name: "For Mother",
        desc: "love",
        icon: HandHeart,
         link:"/collections/for-mother"
      },
      {
        name: "For Girlfriend",
        desc: "love",
        icon: BookHeart,
         link:"/collections/for-girlfriend"
      },
      {
        name: "For Husbands",
        desc: "Changelog",
        icon: FaShieldHeart,
         link:"/collections/for-husbands"
      },
      {
        name: "For Sister",
        desc: "Watch lessions",
         link:"/collections/for-sister",
        icon: ScanHeart,
        
      },
      {
        name: "For Wife",
        desc: " Wife",
        icon: FaHeartbeat,
         link:"/categories/for-wife"
      },
     
    ],
    gridCols: 2,
  },
  {
    name: "Shop By Occasion",
    subMenuHeading: ["Event", "Features"],
    subMenu: [
      {
        name: "Proposal",
        desc: "Time",
        icon: GiRose,
         link:"/collections/proposal"
      },
      {
        name: "Engagement",
        desc: "Love",
        icon: FaRing,
         link:"/collections/engagement"
      },
      {
        name: "Wedding",
        desc: "Special",
        icon: IoMdRose,
         link:"/collections/wedding"
      },
      {
        name: "Festivals",
        desc: "Enjoying",
        icon: MdOutlineFestival,
         link:"/collections/festivals"
      },
    ],
    gridCols: 2,
  },

];


export const collections = [
  { value: 'wedding', label: 'Weddings'},
  { value: 'luxury-vault', label: 'Luxury Vault'},
  { value: 'budget-picks', label: 'Budget Picks', },
  { value: 'top-products', label: 'Top Products',},
  { value: 'hot-picks', label: 'Hot Picks', },
]

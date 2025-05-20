import { BookHeart, HandHeart, HeartHandshake, ScanHeart } from "lucide-react";

import { FaRing } from "react-icons/fa";
import { GiRose } from "react-icons/gi";
import { IoMdRose } from "react-icons/io";
import {  MdOutlineFestival } from "react-icons/md";
import { FaShieldHeart } from "react-icons/fa6";

export const Menus = [
  {
    name: "Shop By Category",
    subMenuHeading: ["Elegant", "Sylish"],
    subMenu: [
      {
        name:"Rings",
        link:"/categories/rings",
        icon:null
      },
      {
        name:"Pendant Sets",
        link:"/categories/pendant-sets",icon:null
        
      },
      {
        name:"Earrings",
        link:"/categories/earrings",icon:null
       
      },
      {
        name:"Pendant Chain",
        link:"/categories/chain",icon:null
        
      },
      {
        name:"Payal",
        link:"/categories/payal",icon:null
        
      },
      {
        name:"Bracelets",
        link:"/categories/bracelets",icon:null
        
      },
      {
        name:"Mangalsutra",
        link:"/categories/mangal-sutra",icon:null
       
      }
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
        name: "For Sister",
        desc: "Watch lessions",
         link:"/collections/for-sister",
        icon: ScanHeart,
        
      },
      {
        name: "For Wife",
        desc: " Wife",
        icon: HeartHandshake,
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

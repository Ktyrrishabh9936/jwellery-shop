import { Bolt } from "lucide-react";
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

export const Menus = [
  {
    name: "By Collection",
    subMenuHeading: ["silver", "gold"],
    subMenu: [
      {
        name: "Rings",
        desc: "Blue cut Rings",
        icon: PanelsTopLeft,
        link:"/categories/rings"
      },
      {
        name: "Anklets",
        desc: "payal",
        icon: Bolt,
         link:"/categories/anklets"
      },
      {
        name: "Tops",
        desc: "ear wear",
        icon: PanelTop,
         link:"/categories/tops"
      },
      {
        name: "Bangles",
        desc: "hand wear",
        icon: Database,
         link:"/categories/bangles"
      },
    ],
    gridCols: 2,
  },
  {
    name: "By Relation",
    subMenuHeading: ["Love", "Wealthy", "Recent"],
    subMenu: [
      {
        name: "For Mother",
        desc: "love",
        icon: ShoppingBag,
         link:"/collections/for-mother"
      },
      {
        name: "For Girlfriend",
        desc: "love",
        icon: MapPin,
         link:"/collections/for-girlfriend"
      },
      {
        name: "For Husbands",
        desc: "Changelog",
        icon: BellDot,
         link:"/collections/for-husbands"
      },
      {
        name: "For Sister",
        desc: "Watch lessions",
         link:"/collections/for-sister",
        icon: Play,
        
      },
      {
        name: "For Wife",
        desc: " Wife",
        icon: BookOpenText,
         link:"/categories/for-wife"
      },
     
    ],
    gridCols: 2,
  },
  {
    name: "By Occasion",
    subMenuHeading: ["Event", "Features"],
    subMenu: [
      {
        name: "Proposal",
        desc: "time",
        icon: ShieldPlus,
         link:"/collections/proposal"
      },
      {
        name: "Engagement",
        desc: "love",
        icon: Users,
         link:"/collections/engagement"
      },
      {
        name: "Wedding",
        desc: " special",
        icon: Dessert,
         link:"/collections/wedding"
      },
      {
        name: "Festivals",
        desc: "enjoying",
        icon: Lock,
         link:"/collections/festivals"
      },
    ],
    gridCols: 2,
  },

];


export const collections = [
  { value: 'gold-with-lab', label: 'Gold with Lab Daimonds'},
  { value: 'wedding-collection', label: 'Wedding Collection'},
  { value: 'luxury-vault', label: 'Luxury Vault'},
  { value: 'budget-picks', label: 'Budget Picks', },
  { value: 'top-products', label: 'Top Products',},
  { value: 'hot-picks', label: 'Hot Picks', },
]

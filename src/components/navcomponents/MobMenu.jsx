import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X, ChevronDown, ChevronFirst, ChevronLast } from "lucide-react";
import Link from "next/link";
import { Button, IconButton } from "@/MaterialTailwindNext";
import Image from "next/image";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
export default function MobMenu({ Menus }) {
  const [isOpen, setIsOpen] = useState(false);
  const [clicked, setClicked] = useState(null);
  const {user} = useSelector((store)=>store.user);
  const navigate = useRouter();
  const toggleDrawer = () => {
    setIsOpen(!isOpen);
    setClicked(null);
  };
  const genericHamburgerLine = `h-1 w-8 my-1 rounded-full bg-white transition ease transform duration-300`;

  const subMenuDrawer = {
    enter: {
      height: "auto",
      overflow: "hidden",
    },
    exit: {
      height: 0,
      overflow: "hidden",
    },
  };

  return (
    <div>
     
      <IconButton
        className="flex flex-col h-12 w-12  rounded justify-center items-center group  lg:hidden z-[100] relative bg-transparent text-pink-500 border-2 border-pink-300 "
        onClick={toggleDrawer}
    >
        <div
            className={`${genericHamburgerLine} ${
                isOpen
                    ? "rotate-45 translate-y-3 opacity-50 group-hover:opacity-100"
                    : "opacity-50 group-hover:opacity-100"
            }`}
        />
        <div className={`${genericHamburgerLine} ${isOpen ? "opacity-0" : "opacity-50 group-hover:opacity-100"}`} />
        <div
            className={`${genericHamburgerLine} ${
                isOpen
                    ? "-rotate-45 -translate-y-3 opacity-50 group-hover:opacity-100"
                    : "opacity-50 group-hover:opacity-100"
            }`}
        />
    </IconButton>
     
      <motion.div
        className="fixed left-0 right-0 top-0  overflow-y-auto h-screen text-[#18181A] backdrop-blur bg-white px-6 pt-3  pb-20 z-[99] "
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? "0%" : "-100%" }}
      >
        <p  className=" ml-12 cursor-pointer py-1.5 font-medium">
         <Link href="/"> <Image width={80} height={80} src="/Jenii-Logo.svg" alt="Jenii" /></Link>
        </p>
        <div className=" w-full pt-5 mt-4">
      { user ? <div className=" mx-auto my-10 bg-white rounded-lg shadow-md p-5">
    <Image height={600} width={600}  className="w-32 h-32 rounded-full mx-auto"  src={user?.image || "/images/user.svg"} alt="Profile picture"/>
    <h2 className="text-center text-2xl font-semibold mt-3 capitalize">{user?.name}</h2>
    <p className="text-center text-gray-600 mt-1">{user?.email}</p>
  </div> : <Button size="lg" className=" bg-pink-700 text-white" onClick={()=>navigate.push("/login")}> 
    Login / SignUp
    </Button>
    }
    </div>
        <ul>
          {Menus.map(({ name, subMenu }, i) => {
            const isClicked = clicked === i;
            const hasSubMenu = subMenu?.length;
            return (
              <li key={name} className="">
                <span
                  className="flex-center-between p-4 hover:bg-white/5 rounded-md cursor-pointer relative"
                  onClick={() => setClicked(isClicked ? null : i)}
                >
                  {name}
                  {hasSubMenu && (
                    <ChevronDown
                      className={`ml-auto ${isClicked && "rotate-180"} `}
                    />
                  )}
                </span>
                {hasSubMenu && (
                  <motion.ul
                    initial="exit"
                    animate={isClicked ? "enter" : "exit"}
                    variants={subMenuDrawer}
                    className="ml-5"
                  >
                    {subMenu.map(({ name,link, icon: Icon }) => (
                     <Link href={link || "/"}   key={name}> <span
                      
                        className="p-2 flex-center hover:bg-white/5 rounded-md gap-x-2 cursor-pointer"
                      >
                      { Icon && <Icon size={17} />}
                        {name}
                      </span>
                      </Link>
                    ))}
                  </motion.ul>
                )}
              </li>
            );
          })}
          <Link key={"contact"} href="/ContactUs" className="">
                <span
                  className="flex-center-between p-4 hover:bg-white/5 rounded-md cursor-pointer relative"
                 
                >
                  Contact Us
                </span>
            
              </Link>
        </ul>
      </motion.div>
    </div>
  );
}

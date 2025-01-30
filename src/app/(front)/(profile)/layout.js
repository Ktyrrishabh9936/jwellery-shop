"use client"
import { User } from "iconoir-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";

export default function profile({children}) {
        const {user} = useSelector((store)=>store.user);
        const pathname = usePathname()
        const list = [
          {
            title: "Overview",
            link: "/overview",
          },
          {
            title: "Profile",
            link: "/profile",
          },
        
          {
            title: "My Address",
            link: "/address",
          },
          {
            title: "Orders",
            link: "/orders",
          },
          {
            title: "Wishlist",
            link: "/mywishlist",
          },
          // {
          //   title: "Help Desk & Support",
          //   link: "/support",
          // },
        ];
  return (
    <div className="flex  min-h-screen  max-w-7xl mx-auto">
    
      <aside className="w-1/4 bg-pink-50 mt-3 md:mt-6 p-3 md:p-6 rounded-lg max-w-7xl">
        <div className="text-center mb-5">
          <div className="w-[clamp(10rem,12vw,14rem)] mx-auto overflow-hidden rounded-xl">
            <Image
              src={user?.image || "/images/user.svg"} // Replace with your image URL
              alt="User Avatar"
              width={100}
              height={100}
              className="object-cover w-full"
            />
          </div>
        </div>
            <p className=" font-semibold text-xl text-center">{user?.name}</p>
        <ul className="space-y-2 text-gray-700 mt-4">
          {list.map((item, i) => (
            <li key={i} className="text-sm">
              <Link href={item.link}>
                  <span className={`
        relative flex items-center py-2 px-3 my-1
        font-medium rounded-md cursor-pointer
        transition-colors group
        ${
          pathname.startsWith(item.link)
            ? "bg-[rgba(196,30,86,0.2)] text-[rgba(196,30,86,1)] "
            : "hover:bg-[rgba(196,30,86,0.2)] text-gray-600"
        }
    `}>{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="w-3/4 pl-3 md:pl-6 space-y-8">
      
       {children}
      </main>
      </div>

  );
}

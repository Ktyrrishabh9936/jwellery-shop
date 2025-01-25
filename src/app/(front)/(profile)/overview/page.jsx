"use client"
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import React from 'react'
import { useSelector } from 'react-redux';

export default function page() {
        const {user} = useSelector((store)=>store.user);
        const navigate = useRouter();
        const items = [
          {
            title: "Change Your Password",
            description: "Keep your account secure by regularly updating your password.",
            icon: "🔒",
            bgColor: "bg-blue-100",
            textColor: "text-blue-700",
            click:()=>navigate.push('/forgot-password')
          },
          {
            title: "Contact Number",
            description: "Update your contact details to stay informed about account updates.",
            icon: "📞",
            bgColor: "bg-green-100",
            textColor: "text-green-700",
            click:()=>navigate.push('/profile')
          },
          {
            title: "Recent Orders",
            description: "View and track your recent orders for better management.",
            icon: "📦",
            bgColor: "bg-teal-100",
            textColor: "text-teal-700",
            click:()=>navigate.push('/orders')
          },
          {
            title: "Logout",
            description: "Log out of your account securely when you're done.",
            icon: "↩️",
            bgColor: "bg-red-100",
            textColor: "text-red-700",
            click:()=>signOut()
          },
        ];
  return (
    <div>
      <div
			className="flex justify-center  relative bg-no-repeat bg-center bg-cover h-[clamp(13rem,19vw,20rem)]"
			style={{
				backgroundImage: "url(/profile-banner.jpg)",
			}}
		>
			<div className="absolute top-0 ltr:left-0 rtl:right-0 bg-black w-full h-full opacity-50 transition-opacity duration-500 group-hover:opacity-80 " />
			<div className="w-full flex items-center justify-center relative z-10 py-10 md:py-14 lg:py-20 xl:py-24 2xl:py-32">
				<h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white text-center">
					<span className="font-satisfy block font-normal mb-3">
						Explore
					</span>
					My Profile
				</h2>
			</div>
		</div>
       {/* Order History */}
       <div className="grid grid-cols-2 gap-6">
       <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-4">Profile</h2>
            <p>{user?.name}</p>
            <p>{user?.email}</p>
            <p>{user?.phone}</p>
            <Link href="/mywishlist" className="text-pink-600 text-sm mt-4 block">
              My Wishlist
            </Link>
            <div onClick={()=>signOut()} className="text-red-600 text-sm mt-2 block cursor-pointer">
              Sign Out
            </div>
            
          </div>
       
        </div>

        {/* Profile & Account Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {items.map((item, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer ${item.bgColor}`}
            onClick={item.click}
          >
            <div className="flex items-center gap-3">
              <span className={`text-3xl ${item.textColor}`}>{item.icon}</span>
              <h2 className="text-lg font-semibold">{item.title}</h2>
            </div>
            <p className="text-sm mt-2 text-gray-600">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

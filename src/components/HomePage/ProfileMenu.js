import React from 'react';
import { Button, Avatar, Menu, MenuHandler, MenuList, MenuItem, Typography } from '@material-tailwind/react'; // Ensure you have Material Tailwind components installed
import { UserCircleIcon, Cog6ToothIcon, InboxArrowDownIcon, LifebuoyIcon, PowerIcon, ChevronDownIcon } from '@heroicons/react/24/outline'; // Make sure you have heroicons installed

import Image from 'next/image';
import { signOut } from 'next-auth/react';
import { usePathname, useRouter, } from 'next/navigation';
import { User, View } from 'lucide-react';
import { FaAddressBook } from 'react-icons/fa';



function ProfileMenu({user}) {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const navigate = useRouter()
    const path = usePathname()
    const closeMenu = () => setIsMenuOpen(false);
    const profileMenuItems = [
  
        {
            label: "Profile",
            icon: User,
            onClickNavItem:()=>{
                navigate.push('/profile');
                closeMenu()},
        },
        {
            label: "Overview",
            icon: View,
            onClickNavItem:()=>{
                navigate.push('/overview');
                closeMenu()},
        },
        {
            label: "Our Address",
            icon: FaAddressBook,
            onClickNavItem:()=>{
                navigate.push('/address');
                closeMenu()},
        },
        {
            label: "My Orders",
            icon: InboxArrowDownIcon,
            onClickNavItem:()=>{
                navigate.push('/orders');
                closeMenu()},
        },
        {
            label: "Sign Out",
            icon: PowerIcon,
            onClickNavItem:()=>{
                signOut({callbackUrl:  '/login'});
                closeMenu();
            },
        },
    ];


    return (
        <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
            <MenuHandler>
                <Button
                    variant="text"
                    color="blue-gray"
                    className="flex items-center gap-1 rounded-full py-0.5 pr-2 pl-0.5 lg:ml-auto"
                >
                     <Avatar
                        variant="circular"
                        size="sm"
                        alt="User Profile"
                        className="border border-pink-300 p-0.5 text-black"
                        src={user?.image || "/images/user.svg"}
                    /> 
                    <ChevronDownIcon
                        strokeWidth={2.5}
                        className={`h-3 w-3 transition-transform text-pink-500 ${isMenuOpen ? "rotate-180" : ""}`}
                    />
                </Button>
            </MenuHandler>
            <MenuList className="p-1">
            <div className="flex items-center gap-3 px-4 py-3">
                <div className="relative aspect-square w-10 rounded-full">
                  {user ? <Image
                  height={30}
                  width={30}
                    src={user?.image}
                    alt="account"
                    className="w-full rounded-full object-cover object-center"
                  />:<Image
                  height={30}
                  width={30}
                    src="/images/user.svg"
                    alt="account"
                    className="w-full rounded-full object-cover object-center"
                  />}
                  <span className="absolute -right-0.5 -top-0.5 block h-3.5 w-3.5 rounded-full border-2 border-white bg-green dark:border-dark"></span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-dark dark:text-white">
                   {user?.name}
                  </p>
                  <p className="text-sm text-body-color dark:text-dark-6 line-clamp-1">
                    {user?.email}
                  </p>
                </div>
              </div>
              
                {profileMenuItems.map(({ label, icon,onClickNavItem }, key) => {
                    const isLastItem = key === profileMenuItems.length - 1;
                    return (
                        <MenuItem
                            key={label}
                            onClick={onClickNavItem} // Handle Sign Out on last item
                            className={`flex items-center gap-2 rounded ${isLastItem ? "hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10" : ""}`}
                        >
                            {React.createElement(icon, {
                                className: `h-4 w-4 ${isLastItem ? "text-red-500" : ""}`,
                                strokeWidth: 2,
                            })}
                            <Typography
                                as="span"
                                variant="small"
                                className="font-normal"
                                color={isLastItem ? "red" : "inherit"}
                            >
                                {label}
                            </Typography>
                        </MenuItem>
                    );
                })}
            </MenuList>
        </Menu>
    );
}

export default ProfileMenu;

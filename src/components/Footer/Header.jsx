import Image from "next/image";
import logo from "@/assets/logo.png"
import { FaLocationDot, FaStore } from "react-icons/fa6";
import Link from "next/link";

const ContactUsHeader = () => {
    return (
      <>
        <div className="flex w-full justify-between items-center py-3 px-6">
          {/* Logo */}
          <div className="pl-10">
            <Link href="/">
            <Image src={logo} alt="Jenii Logo" className="h-20 w-20 sm:w-[70%] md:w-auto object-contain " />
            </Link>
          </div>
  
          {/* Navigation Links */}
          <div className=" text-base sm:text-lg">
            <ul className="flex gap-5 sm:gap-8 items-center">
              {/* About Us */}
              <Link  href="https://jeniijewellery.bio.link/" className="text-[#C41E56]  font-medium cursor-pointer ">
                About Us
              </Link>
              {/* Visit Store Button */}
              <li>
                <Link href='https://www.google.co.in/maps/dir//Broadway+Empire,+Nilamber+Circle,+Vasna+Bhayli+Main+Rd,+near+Akshar+Pavilion,+Saiyed+Vasna,+Vadodara,+Gujarat+391410/@22.301387,73.0587415,12z/data=!3m1!4b1!4m8!4m7!1m0!1m5!1m1!1s0x395fc97a52df2dff:0x8a31a8ec9fed0ebb!2m2!1d73.1411431!2d22.3014078?entry=ttu&g_ep=EgoyMDI0MTAxNS4wIKXMDSoASAFQAw%3D%3D'><button className="bg-[#C41E56] text-white px-4 py-1.5 sm:py-2 my-auto rounded-full font-medium hover:bg-[#a71745] transition flex ">
                  <span className="mt-1 mr-2 hidden sm:block"><FaStore size={20} /></span>
                  <p>Offline Store</p>
                </button>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </>
    );
  };
  
  export default ContactUsHeader;
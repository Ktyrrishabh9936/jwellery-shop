import Image from "next/image";
import logo from "../../assets/image.png";
import { IoLogoFacebook } from "react-icons/io";
import { FaInstagram } from "react-icons/fa";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-[#EFEFEF] p-6">
      <div className="container mx-auto flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-6xl">

          {/* Left Section */}
          <div className="m-5">
            {/* Logo Section */}
            <div className="mb-8 flex justify-center md:justify-start">
              <Image
                src={logo}
                width={144}
                height={84}
                alt="Company Logo"
                className="mb-4"
              />
            </div>

            {/* Footer Cards */}
            <div>
              <FooterCard
                title={"Our Collection"}
                items={["Ring", "Necklace", "Pendants", "Bracelet", "Anklets"]}
              />
              <FooterCard
                title={"Shop by Price"}
                items={["₹500+", "₹1000+", "₹1499+", "₹2499+", "₹5000+"]}
              />
              <FooterCard
                title={"Shop by Occasion"}
                items={["Anniversary", "Engagement", "Proposal", "Wedding", "Festivals"]}
              />
              <FooterCard
                title={"Shop by Relation"}
                items={["For Mother", "For Sister", "For Wife", "For Husbands", "For Girlfriend"]}
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex flex-col justify-between mx-9 md:mx-16">
            {/* Newsletter Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-center md:text-left">Subscribe to Our Newsletter</h2>
              <input
                type="email"
                placeholder="Enter your Email ID"
                className="w-full md:w-2/3 p-2 border text-black rounded-md bg-[#D8D8D8]"
              />
            </div>

            {/* Menu Section */}
            <div className="mb-8 mt-2">
            <h2 className="text-xl font-semibold mb-4">Our Menu</h2>
            <ul className="text-black space-y-2 flex flex-col">
              <li>Account</li>
              <Link href="">About Us</Link>
              <Link href="/ContactUs">Contact Us</Link>
              <Link href="/shipping-policy">Shipping Policy</Link>
              {/* <Link href="">Our Blogs</Link> */}
              <Link href="/">Store Locator</Link>
              <Link href="/faq-and-support">FAQ's & Support</Link>
              <Link href="/terms-and-conditions">Terms & Conditions</Link>
              <Link href="/policies">Privacy Policy</Link>
            </ul>
          </div>

          {/* Social Media Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Follow Us</h2>
            <div className="mx-2 flex space-x-4">
                <a href="#" aria-label="Instagram" className="text-black text-xl">
                  <FaInstagram/>
                </a>
                <a href="#" aria-label="Facebook" className="text-black text-xl">
                  <IoLogoFacebook/>
                </a>
              </div>
          </div>
        </div>
      </div>
    </div>
            

      {/* Footer Bottom */}
      <div className="mt-8 text-center text-gray-500 text-sm">
        <p>All Rights Reserved © JP Jewellers</p>
        <p>Developed and Maintained by <Link href="https://www.arevei.com/" className=" text-pink-200 hover:text-pink-500 hover:underline"> AREVEI </Link></p>
      </div>
    </footer>
  );
};

const FooterCard = ({ title, items }) => {
  return (
    <div className="mt-9">
      <h3 className="text-2xl font-bold text-black mb-2">{title}</h3>
      <p className="text-md text-[#2A2A2A] mt-2">{items.join(" | ")}</p>
    </div>
  );
};

export default Footer;

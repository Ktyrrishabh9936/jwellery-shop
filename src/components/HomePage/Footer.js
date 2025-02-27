"use client"
import Image from "next/image";
import logo from "../../assets/image.png";
import { IoLogoFacebook } from "react-icons/io";
import { FaInstagram } from "react-icons/fa";
import Link from "next/link";
import { useState } from "react";

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const catgo = [ {link:"/categories/rings",name:"Ring"},{link:"/categories/necklace",name:"Necklace"}, {link:"/categories/anklet",name:"Anklet"}, {link:"/categories/bangle",name:"Bangle"}]

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage('Thank you for subscribing!');
        setEmail('');
      } else {
        setMessage(result.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error submitting form. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <footer className="bg-gray-100 p-6">
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
            <div className="mt-9">
      <h3 className="text-2xl font-bold text-black mb-2">Our Collection</h3>
      <div className="text-md text-[#2A2A2A] mt-2">
        {catgo.map((item, index) => (
          <Link
            key={index}
            href={item.link}
            className=""
          >
            {item.name}
            {index < catgo.length - 1 && " | "}
          </Link>
        ))}
      </div>
    </div>
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
            <div className="my-8 ">
      <h2 className="text-2xl font-semibold mb-4 text-center md:text-left">
        Subscribe to Our Newsletter
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3 items-center md:items-start">
        <input
          type="email"
          placeholder="Enter your Email ID"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full md:w-2/3 p-2 border-[1px] border-red-200 text-black rounded-md bg-[#f4f7ff]   mb-4"
        />
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full md:w-1/3 p-2 rounded-md text-white ${
            isLoading ? 'bg-gray-400 cursor-not-allowed ' : 'bg-pink-500'
          }`}
        >
          
          {isLoading ? <div className="flex"> <div className="h-5 w-5 border-t-transparent border-solid animate-spin rounded-full border-white border-4 mr-2"></div> Submitting...</div> : 'Subscribe'}
        </button>
      </form>
      {message && <p className="mt-4 text-center md:text-left">{message}</p>}
    </div>

            {/* Menu Section */}
            <div className="mb-8 mt-2">
            <h2 className="text-xl font-semibold mb-4">Our Menu</h2>
            <ul className="text-black space-y-2 flex flex-col">
              {/* <li>Account</li> */}
              {/* <Link href="">About Us</Link> */}
              <Link href="/ContactUs">Contact Us</Link>
              <Link href="/refund-and-cancellation-policy">Refund and Cancellation Policy</Link>
              <Link href="/shipping-policy">Shipping Policy</Link>
              {/* <Link href="">Our Blogs</Link> */}
              {/* <Link href="/">Store Locator</Link> */}
              <Link href="/faq-and-support">FAQ's & Support</Link>
              <Link href="/terms-and-conditions">Terms & Conditions</Link>
              <Link href="/policies">Privacy Policy</Link>
            </ul>
          </div>

          {/* Social Media Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Follow Us</h2>
            <div className="mx-2 flex space-x-4">
                <Link href="https://www.instagram.com/jenii.jp.jewellery?igsh=eXZ1ajkwMTZyeDlt" aria-label="Instagram" className="text-black text-xl">
                  <FaInstagram/>
                </Link>
                <Link href="https://m.facebook.com/jenii.jp.jewellery/" aria-label="Facebook" className="text-black text-xl">
                  <IoLogoFacebook/>
                </Link>
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
      <div className="text-md text-[#2A2A2A] mt-2">
        {items.map((item, index) => (
          <Link
            key={index}
            href={`/collections/${item.replace(/\s+/g, "-").toLowerCase()}`}
            className=""
          >
            {item}
            {index < items.length - 1 && " | "}
          </Link>
        ))}
      </div>
    </div>
  );
};


export default Footer;

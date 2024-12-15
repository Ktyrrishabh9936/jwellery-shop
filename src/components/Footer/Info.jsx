'use client'
import ring from "@/assets/ring.png";
import Image from "next/image";
import { FaFacebook, FaInstagram, FaWhatsapp, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import { FaAngleRight } from "react-icons/fa6";
import { FaLocationDot } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Link from "next/link";
import 'swiper/css';
const Info = () => {
  return <>
    <div className="">
      <MidText />
      <div className=" flex justify-center">
        <Slideshow />
      </div>

      <div className="mt-8 flex justify-center">
        <FormComponent />
      </div>

      <div className="mt-8 justify-center p-4">
        <Footer />
      </div>
    </div>
    </>
};

// MidText Component
function MidText() {
  
  return (
    <div className="flex flex-col items-center px-6  mx-auto text-center max-w-4xl">
      {/* Coming Soon Main Text */}
      <p className="text-gray-800 text-lg  mt-2">
      For any suggestions, queries or complaints please contact us:
      </p>
      <p className="text-gray-800 font-semibold text-3xl">Jenii ( J.P Sterling Silver )</p>
    </div>
  );
};


function Slideshow() {
  const Message = encodeURIComponent("Hello! Jenii I'm interested in exploring more jewelry. Could you show me options like rings, bracelets, or other pieces?");
  return (
    <div className="relative flex flex-col md:flex-row  items-center justify-center">
      {/* Social Media Icons */}
      <div className="  static md:absolute left-1/3 md:left-6 top-0  md:top-1/2 transform -translate-y-1/2 flex flex-row md:flex-col gap-4">
        <SocialIcon href="https://m.facebook.com/jenii.jp.jewellery/" Icon={FaFacebook} />
        <SocialIcon href={`https://wa.me/919157071575?text=${Message}`}Icon={FaWhatsapp} />
        <SocialIcon href="https://www.instagram.com/jenii.jp.jewellery?igsh=eXZ1ajkwMTZyeDlt" Icon={FaInstagram} />
      </div>

      {/* Ring Image */}
      <div className="flex flex-col w-[90vw] md:w-[70vw]  ">
      <Image
      width={300}
      height={300}
        src={ring}
        alt="Diamond Ring"
        className="w-30 h-30 mx-auto "
      />
      <div className="h-10 w-[80%] md:w-[60%] lg:w-[50%] mx-auto bg-[radial-gradient(49.69%_46.99%_at_49.42%_42.82%,#AAAAAA_0%,#B6B6B6_8%,#e0e0e0_33%,#ECECEC_57%,transparent_80%,transparent_100%)]"></div>
     
      </div>
     
      {/* Right Arrow Button */}
      {/* <div className="absolute right-6 top-1/2 transform -translate-y-1/2">
        <button className="flex items-center justify-center w-12 h-12 bg-white shadow-lg rounded-full text-[#C41E56] text-2xl">
          <FaAngleRight />
        </button>
      </div> */}
    </div>
  );
};

function SocialIcon({ href, Icon }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-center w-10 h-10 bg-black text-white rounded-full"
    >
      <Icon size={20} />
    </Link>
  );
};




// Define the validation schema using Yup
const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  phone: yup
    .string()
    .matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits')
    .required('Phone number is required'),
});

const FormComponent = () => {
  const [message, setMessage] = useState('');
  const [isLoading, setLoading] = useState(false);
  
  // Initialize React Hook Form with Yup resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  // Submit handler
  const onSubmit = async (data) => {
    setMessage('Loading....!');
    setLoading(true)
    fetch('https://sheetdb.io/api/v1/9ohsfcjei1vvj', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: [{ Email: data.email, Phone: data.phone }],
      }),
    })
      .then((response) => response.json())
      .then(() => {
        setMessage('You have been added to the waitlist');
        setLoading(false)
        reset();

      })
      .catch(() => {
        setMessage('There was an error. Please try again.');
      setLoading(false)

      });
  };

  return (
    <div className=" flex flex-col w-full gap-y-5">
     
    <div className="flex flex-col items-center justify-center gap-4 w-full max-w-[500px] p-4 mx-auto">
      {/* Email Input */}
      <div className="flex flex-col w-full">
        <div className="flex items-center w-full bg-white rounded-md px-4 py-3 shadow-md">
          <FaEnvelope className="text-[rgba(0,0,0,0.5)] mr-3" size={20} />
          <input
            type="email"
            placeholder="Email"
            {...register('email')}
            className="w-full outline-none text-[rgba(0,0,0,0.5)] text-lg"
          />
        </div>
        {errors.email && <p className="text-red-500 text-sm mt-2">{errors.email.message}</p>}
      </div>

      {/* Phone Input */}
      <div className="flex flex-col w-full">
        <div className="flex items-center w-full bg-white rounded-md px-4 py-3 shadow-md">
          <FaPhoneAlt className="text-[rgba(0,0,0,0.5)] mr-3" size={20} />
          <input
            type="tel"
            placeholder="Phone No"
            {...register('phone')}
            className="w-full outline-none text-[rgba(0,0,0,0.5)] text-lg"
            maxLength={10}
          />
        </div>
        {errors.phone && <p className="text-red-500 text-sm mt-2">{errors.phone.message}</p>}
      </div>

      {/* Submit Button */}
      <button
        className="text-[#C41E56] w-full bg-[#FFFFFF] text-lg font-semibold py-3 rounded-md shadow-md hover:bg-[#a71745] hover:text-white transition relative"
        onClick={handleSubmit(onSubmit)}
      >
        {isLoading?<span className=' text-white'>Joining...</span>:<span className=' pl-2 h-min my-auto '>Join our Contact list</span>}
             {isLoading && <svg aria-hidden="true" class="  inline absolute right-5 bottom-3 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-[#f8739f] dark:fill-gray-300 " viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>}
      </button>

      <p className="text-sm text-[#FFFFFF] mt-2">
        Join a contact List of 1750+ members!
      </p>

      <div className=" mx-auto flex flex-col gap-y-2 text-center justify-between text-[#C41E56] font-semibold">
        <a href="/terms-and-conditions" className="hover:underline">
          Terms and Conditions
        </a>
        <a href="/policies" className="hover:underline">
          Privacy Policy
        </a>
      </div>

      {/* Success/Error Message */}
      {message && <p className="mt-2 text-lg text-center">{message}</p>}
    </div>
    <div className="flex flex-col items-center px-6  mx-auto text-center max-w-4xl ">
      {/* Coming Soon Main Text */}
      <h1 className=" text-4xl sm:text-5xl md:text-6xl text-[#C41E56] font-semibold ">We're Coming to You Online!</h1>
      <p className="text-gray-800 text-lg  mt-2 ">
      Hey Vadodara, something special is on its way!
      </p>
      <p className="text-gray-800">Join our Contact List to be the first to know when our online store opens and enjoy exclusive early access to discounts and offers of up to 40%.</p>
    </div>
    </div>

  );
};




const Footer = () => {
  return (
    <Link  href="https://www.google.co.in/maps/dir//Broadway+Empire,+Nilamber+Circle,+Vasna+Bhayli+Main+Rd,+near+Akshar+Pavilion,+Saiyed+Vasna,+Vadodara,+Gujarat+391410/@22.301387,73.0587415,12z/data=!3m1!4b1!4m8!4m7!1m0!1m5!1m1!1s0x395fc97a52df2dff:0x8a31a8ec9fed0ebb!2m2!1d73.1411431!2d22.3014078?entry=ttu&g_ep=EgoyMDI0MTAxNS4wIKXMDSoASAFQAw%3D%3D"  className="rounded-lg bg-[#C41E56] text-white justify-center flex p-4">
      <p className=" my-auto">
      <FaLocationDot size={20} />
      </p>
      <p className="font-semibold ml-3 hover:underline">
        Broadway Empire, Nilamber Circle, Vasna Bhayli Main Rd, near Akshar Pavilion, Saiyed Vasna, Vadodara, Gujarat 391410
      </p>
    </Link>
  );
};



export default Info;

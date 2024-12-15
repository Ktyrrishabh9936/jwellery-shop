import React from 'react'
// import Footer from '@/components/HomePage/Footer'
import ContactUsHeader from '@/components/Footer/Header';
import Info from '@/components/Footer/Info';
import FooterHead from '@/components/Footer/footerppagesHeader';
 
export default function ContactUs() {
  return (
    <>
    <FooterHead title="Contact Us"/>
    <div className=' bg-white relative -top-16  rounded-t-3xl md:rounded-t-[4rem]  text-black  flex flex-col justify-center items-center space-y-12 bg-cover bg-center bg-no-repeat' style={{ backgroundImage: "url('/bg.png')" }}>
    <ContactUsHeader/>
      <div >
      <Info/>
      </div>
    </div>
    {/* <Footer/> */}
    </>
  )
}


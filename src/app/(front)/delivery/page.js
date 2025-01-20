"use client"
import DeliveryForm from "@/components/Delivery/DeliveryForm";

import OrderCart from "@/components/Delivery/OrderCart";
import NavBar from "@/components/HomePage/Navbar";
import Footer from "@/components/HomePage/Footer";
import { useSelector } from "react-redux";

export default function AddressPage() {
  const {user} = useSelector((store)=>store.user);
  return (
    <div className="">
      <NavBar/>
      <main className="">

      {user && <div className="flex flex-col md:grid grid-cols-2">
          <div className="order-2 md:order-1 p-4 relative">
            <DeliveryForm />
          </div>
          <div className="order-1 md:order-2 p-4">
            <OrderCart />
          </div>
          
        </div>}
        <Footer/>
     </main>
    </div>
  );
}

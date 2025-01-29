
"use client";

import {  Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import {  useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { addAddress, fetchAddresses } from "@/lib/reducers/addressReducer";

import { useSession } from "next-auth/react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { AddressSchema } from "@/components/Delivery/addressSchema";
import Addressform from "@/components/Delivery/Addressform";
import AddressList from "@/components/Delivery/adddressList";
export default function page() {

  const navigate  = useRouter();
  const dispatch  = useDispatch();
  
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { addresses, loading, error } = useSelector((state) => state.address);
  const {user} = useSelector((state)=>state.user);
  const session = useSession();

  useEffect(() => {
    if(session.status === "authenticated" && addresses.length === 0){
    dispatch(fetchAddresses())
    }
  }, []);
  
  const { register, handleSubmit,control,setValue, formState: { errors } } = useForm({
    resolver: yupResolver(AddressSchema),
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleAddAddress = (address) => {
      dispatch(addAddress(address));
    setIsModalOpen(false);
  };


  const handleCreateNewAddress = () => {
    setSelectedAddress(null);
    setIsModalOpen(true);
  };
  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <AddressList addresses={addresses} selectedAddress={selectedAddress} setSelectedAddress={setSelectedAddress} />
      <button type="button" className="relative w-full flex justify-center items-center px-5 my-4 py-2.5 font-medium tracking-wide text-white capitalize bg-pink-400 rounded-md hover:bg-pink-600 focus:outline-none transition duration-300 transform active:scale-95 ease-in-out" onClick={handleCreateNewAddress}>
        <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF">
          <g>
            <rect fill="none" height="24" width="24"></rect>
          </g>
          <g>
            <g>
              <path d="M19,13h-6v6h-2v-6H5v-2h6V5h2v6h6V13z"></path>
            </g>
          </g>
        </svg>
        <span className="pl-2 mx-1">Create new shipping label</span>
      </button>

      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-black opacity-30" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-md bg-white rounded-lg p-6">
            <DialogTitle className="text-lg font-medium text-gray-900">Add New Address</DialogTitle>
           <Addressform register={register} errors={errors} setValue={setValue}/>
         <div className="flex flex-row-reverse p-3">
               <div className="flex-initial pl-3">
                  <button type="button" onClick={(handleSubmit(handleAddAddress))} className="flex items-center px-5 py-2.5 font-medium tracking-wide text-white capitalize   bg-pink-400 rounded-md hover:bg-pink-600  focus:outline-none focus:bg-pink-700  transition duration-300 transform active:scale-95 ease-in-out">
                     <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF">
                        <path d="M0 0h24v24H0V0z" fill="none"></path>2468
                        <path d="M5 5v14h14V7.83L16.17 5H5zm7 13c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-8H6V6h9v4z" opacity=".3"></path>
                        <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm2 16H5V5h11.17L19 7.83V19zm-7-7c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zM6 6h9v4H6z"></path>
                     </svg>
                     <span className="pl-2 mx-1">Save</span>
                  </button>
               </div>
               <div className="flex-initial">
                  <button type="button" className="flex items-center px-5 py-2.5 font-medium tracking-wide text-black capitalize rounded-md  hover:bg-red-200 hover:fill-current hover:text-red-600  focus:outline-none  transition duration-300 transform active:scale-95 ease-in-out" onClick={() => setIsModalOpen(false)}>
             
                     <span className="pl-2 mx-1">Cancel</span>
                  </button>
               </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  )
}

"use client"
import React, { useEffect, useState } from 'react';
import { AddressSchema } from './addressSchema';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { deleteAddress, updateAddress } from '@/lib/reducers/addressReducer';
import { useDispatch } from 'react-redux';
import Addressform from './Addressform';
import {state_arr,s_a} from "./statescitydata";
const AddressList = ({ addresses,selectedAddress,setSelectedAddress }) => {
          const [isModalOpen, setIsModalOpen] = useState(false); 
          const [initalCities, setInitalCities] = useState([]); 
          const dispatch  = useDispatch();
          const { register, handleSubmit,control,setValue, formState: { errors },watch } = useForm({
              resolver: yupResolver(AddressSchema)
            });
            const stat = watch("state");
            const cityval = watch("city");
            const openUpdateModal = (address) =>{
              setValue("id", address._id);
              setValue("firstName", address.firstName);
              setValue("lastName", address.lastName);
              setValue("contact", address.contact);
              setValue("landmark", address.landmark);
              setValue("street", address.street);
              setValue("city", address.city);
              setValue("state", address.state);
              setValue("postalCode", address.postalCode);
              setIsModalOpen(true);
            }
        const handleUpdateAddress = (address) => {
                dispatch(updateAddress(address))
                setSelectedAddress(address);
                setIsModalOpen(false);
            
              };


              useEffect(()=>{
                if(addresses.length){
                  setSelectedAddress(addresses[0])
                }
                
              },[addresses])
  return (
    <div>
      {addresses.length ?  
      addresses.map((address, index) => (
        <div key={index} className={`mt-5  shadow cursor-pointer rounded-xl ${selectedAddress?._id === address._id ? "bg-pink-100": ""}` } onClick={() => setSelectedAddress(address)}>
          <div className="flex">
            <div className="flex-1 py-5 pl-5 overflow-hidden">
              <ul>
                <li className=" text-black-600  font-semibold capitalize ">{address.firstName} {address.lastName}</li>
                <li className="text-sm  ">{address.contact}</li>
                <li className="text-sm ">{address.landmark} {address.street}</li>
                <li className="text-sm ">{address.city}, {address.state} - {address.postalCode}</li>
              </ul>
            </div>
            <div className="flex-none pt-2.5 pr-2.5 pl-1">
            <button type="button" className="px-2 py-2 font-medium tracking-wide  text-black  rounded-md  hover:bg-red-200 hover:fill-current hover:text-red-600  focus:outline-none  transition duration-300 transform active:scale-95 ease-in-out" onClick={() => dispatch(deleteAddress(address?._id))}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px">
                                  <path d="M0 0h24v24H0V0z" fill="none"></path>
                                  <path d="M8 9h8v10H8z" opacity=".3"></path>
                                  <path d="M15.5 4l-1-1h-5l-1 1H5v2h14V4zM6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9z"></path>
                               </svg>
          </button>
              <button type="button" className="px-2 py-2 font-medium tracking-wide text-black capitalize transition duration-300 ease-in-out transform rounded-xl hover:bg-gray-300 focus:outline-none active:scale-95" onClick={()=>openUpdateModal(address)}>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">
                  <path d="M0 0h24v24H0V0z" fill="none"></path>
                  <path d="M5 18.08V19h.92l9.06-9.06-.92-.92z" opacity=".3"></path>
                  <path d="M20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29s-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83zM3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM5.92 19H5v-.92l9.06-9.06.92.92L5.92 19z"></path>
                </svg>
              </button>
            </div>
          </div>
           <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="relative z-50">
                  <DialogBackdrop className="fixed inset-0 bg-black opacity-30" />
                  <div className="fixed inset-0 flex items-center justify-center p-4">
                    <DialogPanel className="w-full max-w-md bg-white rounded-lg p-6">
                      <DialogTitle className="text-lg font-medium text-gray-900">Update Address</DialogTitle>
                     <Addressform register={register} errors={errors} setValue={setValue} stat={stat} cityval={cityval}/>
                   <div className="flex flex-row-reverse p-3">
                         <div className="flex-initial pl-3">
                            <button type="button" onClick={handleSubmit(handleUpdateAddress)} className="flex items-center px-5 py-2.5 font-medium tracking-wide text-white capitalize   bg-pink-600 rounded-md hover:bg-pink-700  focus:outline-none focus:bg-pink-900  transition duration-300 transform active:scale-95 ease-in-out">
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
      )):<p className="text-center text-2xl font-semibold bg-slate-100 border-2 border-gray-500 flex justify-center items-center h-36 rounded-lg w-full ">No Address Found</p> 
    }
    </div>
  );
};

export default AddressList;
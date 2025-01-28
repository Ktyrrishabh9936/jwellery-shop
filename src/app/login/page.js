"use client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import Link from "next/link";
import { toast } from "react-toastify"; 
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from "react";
import Image from "next/image";
import { signIn, signOut, useSession } from 'next-auth/react';
import { FaGoogle } from "react-icons/fa6";

// Yup validation schema
const schema = yup.object().shape({
  email: yup.string().required('Email is required').email('Must be a valid email'),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters long"),
});

export default function Login() {
  const router = useRouter();
  const [loading,setLoading] = useState(false);
  const { data: session } = useSession();
  const searchparams = useSearchParams()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });


  const onSubmit = async (data) => {
    try {
      setLoading(true)
      const result = await signIn('credentials',{
        redirect:false,
        email:data.email,
        password:data.password,
        callbackUrl: searchparams.get('callbackUrl')|| '/',
      })
      if(result?.error){
        if(result.error === "CredentialsSignIn"){
          alert("Incorrect Password")
        }
        else{
          alert(result.error)
        }
      }
      if(result?.url){
        router.push(result.url)
      }
    }catch (error) {
      console.error("Error logging in:", error);
      toast.error(
        "Error logging in: " + (error.response?.data?.message || error.message)
      );
    }
    finally{
      setLoading(false)
    }
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-[100vh] py-10 bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
            Login
          </h2>
          <Link href="/"> <Image width={80} height={80} src="/Jenii-Logo.svg" alt="Jenii" className=' mx-auto' /></Link>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                autoComplete="email"
                className="mt-1 block w-full px-3 py-2 bg-[#F2F2F2] border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                autoComplete="current-password"
                className="mt-1 block w-full px-3 py-2 bg-[#F2F2F2] border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex justify-between items-center mb-6">
              <Link
                href="/forgot-password"
                className="text-sm text-red-600 hover:underline"
              >
                Forgot password?
              </Link>
             {loading? <button type="button" className="bg-[#fe6161]  h-max w-max rounded-lg text-white font-bold  hover:cursor-not-allowed duration-[500ms,800ms]" disabled>
              <div className="flex gap-1 items-center justify-center m-[10px]"> 
            <div className="h-5 w-5 border-t-transparent border-solid animate-spin rounded-full border-white border-4"></div>
            Processing...
        </div>
            
</button>: <button
                type="submit"
                className="px-4 py-2 bg-[#BC264B] text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Login
              </button>}
            </div>
          </form>
          {!session ? (
            <button onClick={() => signIn('google',{callbackUrl: searchparams.get('callbackUrl') || '/'})} className="flex items-center bg-white dark:bg-gray-900 border border-gray-300 rounded-lg shadow-md px-6 py-2 text-sm font-medium text-gray-800 dark:text-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 mx-auto mb-3">
         <span><FaGoogle/></span>
                <span className="pl-3">Continue with Google</span>
            </button>
      ) : (
        
        <button onClick={() => signOut()} className="flex items-center bg-white dark:bg-gray-900 border border-gray-300 rounded-lg shadow-md px-6 py-2 text-sm font-medium text-gray-800 dark:text-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 mx-auto mb-3">Sign out</button>
      )}
          <div className="text-center">
            <Link
              href="/register"
              className="text-sm text-red-600 hover:underline"
            >
              Create a New Account
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

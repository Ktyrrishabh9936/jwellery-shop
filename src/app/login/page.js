"use client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { signIn } from 'next-auth/react';
import Link from "next/link";
import { toast } from "react-toastify"; 
import { useRouter } from 'next/navigation';
import { useState } from "react";

// Yup validation schema
const schema = yup.object().shape({
  email: yup
    .string()
    .required("Email or Phone number is required")
    .test("emailOrPhone", "Must be a valid email or phone number", (value) => {
      const isValidEmail = yup.string().email().isValidSync(value);
      const isValidPhone = /^[0-9]{10}$/.test(value);
      return isValidEmail || isValidPhone;
    }),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters long"),
});

export default function Login() {
  const router = useRouter();
  const [loading,setLoading] = useState(false);
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
        password:data.password
      })
      if(result?.error){
        if(result.error === "CredentialsSignIn"){
          alert("Incorrect Password")
        }
        else[
          alert(result.error)
        ]
      }
      if(result?.url){
        router.push('/')
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
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email/Number
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

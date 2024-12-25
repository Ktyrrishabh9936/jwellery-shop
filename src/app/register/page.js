"use client";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import NavBar from "@/components/HomePage/Navbar";
import Link from 'next/link';
import { toast } from 'react-hot-toast'; // Import Toastify components
import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Yup validation schema for sign-up
const signupSchema = yup.object().shape({
  name: yup.string().required('Name is required').min(3, 'Name must be at least 3 characters'),
  email: yup.string().required('Email is required').email('Must be a valid email'),
  phone: yup
    .string()
    .matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits')
    .required('Phone number is required'),
  password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
});

export default function SignUp() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(signupSchema),
  });
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState(null);
  const navigate = useRouter();

  const onSubmit = async (data) => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.post('/api/users/signup', {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
      });
      setLoading(false)
      console.log('User created successfully:', response.data);
      toast.success('User created successfully!'); // Show success message
      navigate.push('/login')

    } catch (error) {
      setLoading(false)
      setError(error.response?.data?.message);
      console.error('Error creating user:', error);
      toast.error(error.response?.data?.message || 'Error creating user.'); // Show error message
    }
  };

  return (
    <div className="bg-[url('/spark.png')] bg-white">
      <NavBar />

      {/* <div className="flex justify-center items-center min-h-[100vh] py-0 sm:py-10 bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Sign Up</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                id="name"
                className="mt-1 block w-full px-3 py-2 bg-[#F2F2F2] border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                {...register('name')}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                className="mt-1 block w-full px-3 py-2 bg-[#F2F2F2] border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                {...register('email')}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="text"
                id="phone"
                className="mt-1 block w-full px-3 py-2 bg-[#F2F2F2] border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                {...register('phone')}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                className="mt-1 block w-full px-3 py-2 bg-[#F2F2F2] border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                {...register('password')}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>

            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                className="mt-1 block w-full px-3 py-2 bg-[#F2F2F2] border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <div className="flex justify-between items-center mb-6">
              <Link href="/login" className="text-sm text-red-600 hover:underline">Already have an account? Login</Link>
           { loading?<button type="button" className="bg-[#fe6161]  h-max w-max rounded-lg text-white font-bold  hover:cursor-not-allowed duration-[500ms,800ms]" disabled>
              <div class="flex gap-1 items-center justify-center m-[10px]"> 
            <div className="h-5 w-5 border-t-transparent border-solid animate-spin rounded-full border-white border-4"></div>
            Processing...
        </div>
            
</button> : <button
                type="submit"
                className="px-4 py-2 bg-[#BC264B] text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Sign Up
              </button>}
            </div>
          </form>
              {error && <p  className="text-red-500 text-sm text-center">{error}</p>}
        </div>
      </div> */}

    <div className="flex items-center justify-center min-h-screen  bg-[url('/mask.png')]">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">Create new account</h2>
        <p className="text-center text-gray-600">
          Already have an account? <a href="/login" className="text-pink-500 hover:underline">Log in</a>
        </p>
        <button
          type="button"
          className="flex items-center justify-center w-full px-4 py-2 space-x-2 text-sm font-medium text-gray-600 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
        >
          <img src="/google-icon.svg" alt="Google" className="w-5 h-5" />
          <span>Sign up with Google</span>
        </button>

        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                placeholder="Enter Your Name"
                className="w-full px-3 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="tel"
              placeholder="Enter Your Number"
              className="w-full px-3 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              placeholder="Enter Username"
              className="w-full px-3 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <input
                type="password"
                placeholder="Password"
                className="w-full px-3 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12h3m0 0h-3m0 0a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="terms"
              className="w-4 h-4 text-pink-500 border-gray-300 rounded focus:ring-pink-500"
            />
            <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
              I agree with <a href="/terms" className="text-pink-500 hover:underline">Terms and Conditions</a>
            </label>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-pink-500 rounded-md hover:bg-pink-600"
          >
            Sign Up
          </button>
        </form>

        <p className="text-sm text-center text-gray-500">
          Get trouble signing up? <a href="/contact" className="text-pink-500 hover:underline">Contact us</a>
        </p>
      </div>
    </div>
    </div>
  );
}

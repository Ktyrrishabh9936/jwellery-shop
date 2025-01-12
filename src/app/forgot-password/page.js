"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const [loading, setLoading] = useState('');

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    if (!email) {
      setError('Email/Number is required.');
    } else {
      setError('');
      try {
        const response = await axios.post('/api/users/request-otp', { email });
        if (response.data.message) {
          toast.success(response.data.message); 
          setLoading(false);
          localStorage.setItem('userEmail',email)
          router.push('/verify-otp');

        }
      } catch (error) {
        console.error('Error sending OTP:', error);
        setError('Failed to send OTP.');
        setLoading(false);
        toast.error('Failed to send OTP. Please try again.'); 
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Enter your Email/Number</label>
            <input
              type="text"
              id="email"
              className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
          {loading? <button type="button" className="bg-[#fe6161]  h-max w-max rounded-lg text-white font-bold  hover:cursor-not-allowed duration-[500ms,800ms]" disabled>
              <div className="flex gap-1 items-center justify-center m-[10px]"> 
            <div className="h-5 w-5 border-t-transparent border-solid animate-spin rounded-full border-white border-4"></div>
            Processing...
        </div>
            
</button>: <button
                type="submit"
                className="px-4 py-2 bg-[#BC264B] text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Generate OTP
              </button>}
      
        </form>
      </div>
    </div>
  );
}

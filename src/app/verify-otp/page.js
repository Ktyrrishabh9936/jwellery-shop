"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function VerifyOtp() {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!otp) {
      setError('OTP is required.');
    } else {
      setError('');
      
      const email = localStorage.getItem('userEmail');

      try {
        const response = await axios.post('/api/users/verify-otp', { email, otp });
        toast.success(response.data.message); 

        localStorage.setItem('userId', response.data.userId);
        setLoading(false);
        router.push('/update-password');
      } catch (error) {
        console.error('Error verifying OTP:', error);
        setError('Failed to verify OTP.');
        toast.error('Failed to verify OTP. Please try again.'); 
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Verify OTP</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700">OTP</label>
            <input
              type="text"
              id="otp"
              className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
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
               Verify OTP
              </button>}
       
        </form>
      </div>
    </div>
  );
}

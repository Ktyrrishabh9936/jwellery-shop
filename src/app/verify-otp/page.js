"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function VerifyOtp() {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp) {
      setError('OTP is required.');
    } else {
      setError('');
      
      const email = localStorage.getItem('userEmail');

      try {
        const response = await axios.post('/api/users/verify-otp', { email, otp });
        
        toast.success(response.data.message); 

        localStorage.setItem('userId', response.data.userId);

        router.push('/update-password');
      } catch (error) {
        console.error('Error verifying OTP:', error);
        setError('Failed to verify OTP.');
        toast.error('Failed to verify OTP. Please try again.'); 
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
          <button type="submit" className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors">
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
}

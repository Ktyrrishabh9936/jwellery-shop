import React from 'react';

export default function Page() {
  return (
    <div className='flex flex-col items-center text-center mb-10 lg:mb-20' style={{ fontFamily: "'Times New Roman', Times, serif" }}>

      {/* Main Image Section */}
      <div className="w-full overflow-hidden shadow-lg">
        <img
          src='/images/main.png'
          alt="Main Banner"
          className="w-full object-cover h-80 lg:h-96 transition-transform duration-300 ease-in-out hover:scale-105"
        />
      </div>

      <div className='px-4 sm:px-6 md:px-8 lg:px-16'>
        {/* Logo Variations */}
        <h3 className='text-xl lg:text-2xl font-light text-center p-2 lg:p-4'>LOGO VARIATIONS</h3>
        <div className='flex flex-wrap justify-center w-3/4 lg:w-1/2 mb-4 mx-auto'> {/* Centered logos */}
          <div className='flex justify-center mx-2 mb-4'>
            <img src='/images/logo_1.png' className="h-20 lg:h-24" alt="Logo 1" />
          </div>
          <div className='flex justify-center mx-2 mb-4'>
            <img src='/images/logo_2.png' className="h-20 lg:h-24" alt="Logo 2" />
          </div>
        </div>
        <hr className='border-t-2 border-gray-400 w-3/4 lg:w-1/2 mx-auto mb-4 lg:mb-6' />

        {/* Palette of Color */}

        
        <div className='w-full'>
          <h3 className='text-lg lg:text-2xl font-light text-center p-2 lg:p-4'>PALETTE OF COLOR</h3>
          <div className='flex flex-wrap justify-center gap-4 mb-4'>
            <div className='text-center'>
              <div className='w-28 h-8 lg:w-32 lg:h-10 bg-[#BB2649]'></div>
              <p className='mt-1 lg:mt-2'>BB2649</p>
            </div>
            <div className='text-center'>
              <div className='w-28 h-8 lg:w-32 lg:h-10 bg-[#F7C0BF]'></div>
              <p className='mt-1 lg:mt-2'>F7C0BF</p>
            </div>
            <div className='text-center'>
              <div className='w-28 h-8 lg:w-32 lg:h-10 bg-[#000000]'></div>
              <p className='mt-1 lg:mt-2'>000000</p>
            </div>
          </div>
        </div>

        {/* Horizontal Line */}
        <hr className='border-t-2 border-gray-400 w-3/4 mx-auto mb-4 lg:mb-6' />

        {/* Typography Section */}
        <div className='w-full'>
          <h3 className='text-lg lg:text-xl font-light mb-2'>THE ART OF TYPOGRAPHY</h3>
          <p className='text-gray-600 font-light px-4 lg:px-8'>
            Typography is the art & technique of arranging type to make written language legible, readable, and appealing when displayed. It involves choosing typefaces, point sizes, line lengths, etc.
          </p>
        </div>

        {/* Horizontal Line */}
        <hr className='border-t-2 border-gray-400 w-full mx-auto my-4 lg:my-6' />

        {/* Applications Section */}
        <div className='w-full'>
          <h3 className='text-lg font-light mb-2 lg:mb-4'>APPLICATIONS</h3>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            <div className="w-full h-[200px] lg:h-[300px] bg-cover">
              <img className='w-full h-full object-cover' src='/images/app1.png' alt="Application 1" />
            </div>
            <div className="w-full h-[200px] lg:h-[300px] bg-cover">
              <img className='w-full h-full object-cover' src='/images/app2.png' alt="Application 2" />
            </div>
            <div className="w-full h-[200px] lg:h-[300px] bg-cover">
              <img className='w-full h-full object-cover' src='/images/app3.png' alt="Application 3" />
            </div>
            <div className="w-full h-[200px] lg:h-[300px] bg-cover">
              <img className='w-full h-full object-cover' src='/images/app4.png' alt="Application 4" />
            </div>
            <div className="w-full h-[200px] lg:h-[300px] bg-cover">
              <img className='w-full h-full object-cover' src='/images/app5.png' alt="Application 5" />
            </div>
            <div className="w-full h-[200px] lg:h-[300px] bg-cover">
              <img className='w-full h-full object-cover' src='/images/app6.png' alt="Application 6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

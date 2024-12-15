'use client';
import Skel from '@skel-ui/react';

const HomePageLoader = () => {
  return (
    <div className="space-y-6 p-5">
      
      <div className="w-full h-96 bg-gray-200 shimmer rounded-lg" />

     
      <div className="grid grid-cols-3 overflow-hidden md:flex justify-between space-x-4">
        {Array(6).fill(0).map((_, index) => (
          <div key={index} className="flex flex-col items-center m-2">
            <Skel.Item className="w-16 h-16 bg-gray-200 rounded-full shimmer" /> 
            <Skel.Item className="h-4 w-24 bg-gray-200 shimmer mt-2" /> 
          </div>
        ))}
      </div>

      
      <div className="w-full h-56 bg-gray-200 shimmer rounded-lg" />

      
      <div>
        <Skel.Item className="h-8 w-32 bg-gray-200 shimmer mb-4" /> 

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Array(4).fill(0).map((_, index) => (
            <div key={index} className="space-y-4">
              <Skel.Item className="w-full h-48 bg-gray-200 shimmer rounded-lg" /> 
              <Skel.Item className="h-4 w-24 bg-gray-200 shimmer" /> 
              <Skel.Item className="h-4 w-16 bg-gray-200 shimmer" /> 
              <Skel.Item className="h-4 w-12 bg-gray-200 shimmer" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePageLoader;

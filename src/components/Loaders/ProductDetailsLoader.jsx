'use client';
import Skel from '@skel-ui/react';

const ProductDetailsLoader = () => {
  return (
    <div className="container mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
     
      <div className="space-y-4">
        <div className="w-full h-96 bg-gray-200 rounded-lg shimmer" />
        <div className="flex justify-center space-x-4">
          {Array(4).fill(0).map((_, index) => (
            <Skel.Item key={index} className="h-16 w-16 bg-gray-200 shimmer" />
          ))}
        </div>
      </div>

     
      <div className="space-y-4">
        <Skel.Item className="h-8 w-64 bg-gray-200 shimmer" /> 
        <div className="flex items-center gap-2">
          <Skel.Item className="h-6 w-16 bg-gray-200 shimmer" /> 
          <Skel.Item className="h-6 w-24 bg-gray-200 shimmer" /> 
        </div>

        <h3 className="text-lg font-semibold">
          <Skel.Item className="h-6 w-32 bg-gray-200 shimmer" /> 
        </h3>
        <Skel.Item className="h-20 w-full bg-gray-200 shimmer" />

        <Skel.Item className="h-6 w-48 bg-gray-200 shimmer" />
        
       
        <div className="grid grid-cols-2 gap-4">
          <Skel.Item className="h-6 w-full bg-gray-200 shimmer" /> 
          <Skel.Item className="h-6 w-full bg-gray-200 shimmer" /> 
        </div>
        
       
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">
            <Skel.Item className="h-6 w-32 bg-gray-200 shimmer" /> 
          </h4>
          <Skel.Item className="h-12 w-full bg-gray-200 shimmer" />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsLoader;

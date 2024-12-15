'use client';
import Skel from '@skel-ui/react';

const CheckoutLoader = () => {
  return (
    <>

      <div className="container mx-auto p-6">
        <Skel.Root isLoading={true}>
          <h1 className="text-2xl font-semibold mb-6">
            <Skel.Item className="h-8 w-32 bg-gray-200 shimmer" />
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {Array(2).fill(0).map((_, index) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row md:items-center border p-4 rounded-lg"
                >
                  
                  <Skel.Item className="w-24 h-24 bg-gray-200 mr-4 shimmer" />

                 
                  <div className="flex-grow">
                   
                    <div className="flex items-center gap-2 mt-2">
                      <Skel.Item className="h-4 w-20 bg-gray-200 shimmer" />
                      <Skel.Item className="h-4 w-12 bg-gray-200 shimmer" />
                    </div>

                   
                    <h2 className="font-semibold">
                      <Skel.Item className="h-5 w-48 bg-gray-200 mt-2 shimmer" />
                    </h2>

                  
                    <div className="text-sm">
                      <Skel.Item className="h-4 w-32 bg-gray-200 mt-1 shimmer" />
                    </div>

                  </div>
                </div>
              ))}
            </div>

           
            <div className="border p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">
                <Skel.Item className="h-6 w-32 bg-gray-200 shimmer" />
              </h2>
              <div className="flex justify-between mb-4">
                <span>
                  <Skel.Item className="h-4 w-24 bg-gray-200 shimmer" />
                </span>
                <span className="font-bold">
                  <Skel.Item className="h-4 w-20 bg-gray-200" />
                </span>
              </div>
              <div className="space-y-2">
                <Skel.Item className="h-8 w-full bg-gray-200 rounded-md shimmer" />
                <div className="text-xs">
                  <Skel.Item className="h-3 w-full bg-gray-200 mt-2 shimmer" />
                </div>
              </div>
            </div>
          </div>

          
          <div className="mt-8">
            <Skel.Item className="w-full h-12 bg-pink-300 rounded-lg shimmer"  />
          </div>
        </Skel.Root>
      </div>
    </>
  );
};

export default CheckoutLoader;

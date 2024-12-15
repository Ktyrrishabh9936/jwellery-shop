'use client';
import Skel from '@skel-ui/react';

const DeliveryLoader = () => {
  return (
    <div className="container mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left side: Delivery Form */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          <Skel.Item className="h-6 w-32 bg-gray-200 shimmer" />
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <Skel.Item className="h-12 w-full bg-gray-200 shimmer" />
          <Skel.Item className="h-12 w-full bg-gray-200 shimmer" />
        </div>

        <Skel.Item className="h-12 w-full bg-gray-200 shimmer" />

        <div className="grid grid-cols-2 gap-4">
          <Skel.Item className="h-12 w-full bg-gray-200 shimmer" />
          <Skel.Item className="h-12 w-full bg-gray-200 shimmer" />
        </div>

        <Skel.Item className="h-12 w-full bg-gray-200 shimmer" />

        <div className="flex items-center gap-2">
          <Skel.Item className="h-4 w-4 bg-gray-200 shimmer" />
          <Skel.Item className="h-4 w-32 bg-gray-200 shimmer" />
        </div>

        <h3 className="text-lg font-semibold">
          <Skel.Item className="h-6 w-32 bg-gray-200 shimmer" />
        </h3>
        <Skel.Item className="h-12 w-full bg-gray-200 shimmer" />
      </div>

      {/* Right side: Cart */}
      <div className="border rounded-lg p-4 space-y-4">
        <h2 className="text-xl font-semibold">
          <Skel.Item className="h-6 w-24 bg-gray-200 shimmer" />
        </h2>

        {Array(3).fill(0).map((_, index) => (
          <div key={index} className="flex items-center gap-4 border-b pb-4">
            <Skel.Item className="w-16 h-16 bg-gray-200 shimmer" />
            <div className="flex-grow space-y-2">
              <Skel.Item className="h-4 w-48 bg-gray-200 shimmer" />
              <Skel.Item className="h-4 w-32 bg-gray-200 shimmer" />
              <div className="flex justify-between items-center">
                <Skel.Item className="h-4 w-12 bg-gray-200 shimmer" />
                <Skel.Item className="h-4 w-16 bg-gray-200 shimmer" />
              </div>
            </div>
          </div>
        ))}

        <div className="flex items-center gap-2">
          <Skel.Item className="h-4 w-4 bg-gray-200 shimmer" />
          <Skel.Item className="h-4 w-32 bg-gray-200 shimmer" />
        </div>
      </div>
    </div>
  );
};

export default DeliveryLoader;

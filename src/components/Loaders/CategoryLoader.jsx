'use client'
import Skel from "@skel-ui/react";

const CategoryLoader = () => {
  return (
    <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
       
        {Array(6).fill(0).map((_, index) => (
            <Skel.Root key={index} isLoading={true} className="flex flex-col space-y-3">
                <Skel.Item radius="0.5rem" className="w-full h-48 bg-gray-300 shimmer" />
                <Skel.Item radius="0.25rem" className="w-3/4 h-6 bg-gray-300 shimmer" />
                <Skel.Item radius="0.25rem" className="w-1/2 h-4 bg-gray-300 shimmer" />
            </Skel.Root>
        ))}
    </div>
    </>
  );
}

export default CategoryLoader;

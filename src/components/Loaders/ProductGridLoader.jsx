import Skel from '@skel-ui/react'
import React from 'react'

export default function ProductGridLoader() {
  return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {Array(8).fill(0).map((_, index) => (
          <div key={index} className="space-y-4">
            <Skel.Item className="w-full h-56 bg-gray-200 shimmer rounded-lg" /> 
            <div className="flex justify-between" >
            <Skel.Item className="h-3 w-24 bg-gray-200 shimmer" /> 
            <Skel.Item className="h-3 w-10 bg-gray-200 shimmer" /> 
            </div>
            <Skel.Item className="h-4 w-32 bg-gray-200 shimmer" />
            <Skel.Item className="h-8 w-full rounded-md bg-gray-200 shimmer" />
          </div>
        ))}
      </div>
  )
}

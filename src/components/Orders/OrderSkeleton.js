export default function OrderSkeleton() {
    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
        {/* Order Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex flex-wrap items-center justify-between gap-y-2">
            <div>
              <div className="h-5 w-40 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-6 w-20 bg-gray-300 rounded-full"></div>
              <div className="h-8 w-24 bg-gray-300 rounded-md"></div>
            </div>
          </div>
        </div>
  
        {/* Order Items Preview */}
        <div className="px-6 py-4">
          <div className="flow-root">
            <ul className="-my-6 divide-y divide-gray-200">
              {[1, 2].map((item) => (
                <li key={item} className="py-4 flex">
                  <div className="h-20 w-20 bg-gray-300 rounded-md"></div>
                  <div className="ml-4 flex flex-1 flex-col">
                    <div>
                      <div className="flex justify-between">
                        <div className="h-5 w-40 bg-gray-300 rounded"></div>
                        <div className="h-5 w-16 bg-gray-300 rounded"></div>
                      </div>
                      <div className="mt-1 h-4 w-20 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
  
        {/* Order Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex flex-wrap items-center justify-between gap-y-3">
            <div>
              <div className="h-5 w-32 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="h-9 w-28 bg-gray-300 rounded-md"></div>
              <div className="h-9 w-28 bg-gray-300 rounded-md"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
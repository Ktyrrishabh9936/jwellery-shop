import { CheckCircle, Package, Truck, XCircle, RefreshCw, ShoppingBag } from "lucide-react"

const OrderTimeline = ({ order }) => {
  if (!order) return null

  const getOrderStatus = () => {
    const status = order.orderStatus?.toUpperCase()

    // Define the steps in the order process
    const steps = [
      { key: "PENDING", label: "Order Placed", icon: ShoppingBag, description: "Your order has been received" },
      { key: "CONFIRMED", label: "Order Confirmed", icon: CheckCircle, description: "Your order has been confirmed" },
      { key: "PROCESSING", label: "Processing", icon: RefreshCw, description: "Your order is being processed" },
      { key: "SHIPPED", label: "Shipped", icon: Truck, description: "Your order has been shipped" },
      { key: "DELIVERED", label: "Delivered", icon: Package, description: "Your order has been delivered" },
    ]

    // Handle cancelled orders
    if (status === "CANCELLED" || status === "REFUNDED") {
      return {
        steps: [
          {
            key: "PENDING",
            label: "Order Placed",
            icon: ShoppingBag,
            description: "Your order was received",
            completed: true,
          },
          {
            key: "CANCELLED",
            label: status === "CANCELLED" ? "Cancelled" : "Refunded",
            icon: XCircle,
            description: status === "CANCELLED" ? "Your order has been cancelled" : "Your order has been refunded",
            completed: true,
            isCancelled: true,
          },
        ],
        currentStep: 1,
      }
    }

    // Find the current step index
    let currentStepIndex = steps.findIndex((step) => step.key === status)
    if (currentStepIndex === -1) {
      // If status doesn't match exactly, find the closest step
      if (status === "PENDING") currentStepIndex = 0
      else if (status === "CONFIRMED") currentStepIndex = 1
      else if (status === "PROCESSING") currentStepIndex = 2
      else if (status === "SHIPPED") currentStepIndex = 3
      else if (status === "DELIVERED") currentStepIndex = 4
      else currentStepIndex = 0 // Default to first step
    }

    // Mark steps as completed, current, or upcoming
    const processedSteps = steps.map((step, index) => ({
      ...step,
      completed: index < currentStepIndex,
      current: index === currentStepIndex,
      upcoming: index > currentStepIndex,
    }))

    return {
      steps: processedSteps,
      currentStep: currentStepIndex,
    }
  }

  const { steps, currentStep } = getOrderStatus()

  return (
    <div className="py-4">
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-5 top-0 h-full w-0.5 bg-gray-200"></div>

        {/* Timeline steps */}
        <div className="space-y-8">
          {steps.map((step, index) => (
            <div key={step.key} className="relative flex items-start">
              {/* Timeline dot */}
              <div
                className={`absolute left-5 mt-1.5 -ml-2.5 h-5 w-5 rounded-full border-2 ${
                  step.completed || step.current
                    ? step.isCancelled
                      ? "border-red-500 bg-red-500"
                      : "border-pink-500 bg-pink-500"
                    : "border-gray-300 bg-white"
                }`}
              >
                {(step.completed || step.current) && (
                  <span className="absolute -ml-px -mt-px h-5 w-5 animate-ping rounded-full bg-pink-500 opacity-75"></span>
                )}
              </div>

              {/* Content */}
              <div className="ml-10">
                <div className="flex items-center">
                  <step.icon
                    className={`mr-2 h-5 w-5 ${
                      step.completed || step.current
                        ? step.isCancelled
                          ? "text-red-500"
                          : "text-pink-500"
                        : "text-gray-400"
                    }`}
                  />
                  <h3
                    className={`text-lg font-medium ${
                      step.completed || step.current
                        ? step.isCancelled
                          ? "text-red-700"
                          : "text-gray-900"
                        : "text-gray-500"
                    }`}
                  >
                    {step.label}
                  </h3>
                  {step.current && !step.isCancelled && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                      Current
                    </span>
                  )}
                </div>
                <p
                  className={`mt-1 text-sm ${
                    step.completed || step.current
                      ? step.isCancelled
                        ? "text-red-600"
                        : "text-gray-600"
                      : "text-gray-400"
                  }`}
                >
                  {step.description}
                </p>

                {/* Show date if available */}
                {step.key === "PENDING" && order.createdAt && (
                  <p className="mt-1 text-xs text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                )}

                {/* Show estimated delivery date for shipped orders */}
                {step.key === "SHIPPED" && step.current && order.shipping?.estimatedDelivery && (
                  <p className="mt-2 text-sm text-gray-600">
                    <span className="font-medium">Estimated delivery:</span>{" "}
                    {new Date(order.shipping.estimatedDelivery).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default OrderTimeline

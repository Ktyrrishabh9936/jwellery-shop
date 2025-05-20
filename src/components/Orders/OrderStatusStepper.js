"use client"

import { useState, useEffect } from "react"
import { CheckCircle, Package, Truck, Clock, XCircle } from "lucide-react"

export default function OrderStatusStepper({ status, createdAt }) {
  const [steps, setSteps] = useState([
    { id: "PENDING", label: "Order Placed", icon: Clock, completed: false, active: false },
    { id: "CONFIRMED", label: "Order Confirmed", icon: CheckCircle, completed: false, active: false },
    { id: "PROCESSING", label: "Processing", icon: Package, completed: false, active: false },
    { id: "SHIPPED", label: "Shipped", icon: Truck, completed: false, active: false },
    { id: "DELIVERED", label: "Delivered", icon: CheckCircle, completed: false, active: false },
  ])

  useEffect(() => {
    if (status === "CANCELLED") {
      setSteps([
        { id: "PENDING", label: "Order Placed", icon: Clock, completed: true, active: false },
        { id: "CANCELLED", label: "Cancelled", icon: XCircle, completed: true, active: true },
      ])
      return
    }

    if (status === "REFUNDED") {
      setSteps([
        { id: "PENDING", label: "Order Placed", icon: Clock, completed: true, active: false },
        { id: "CANCELLED", label: "Cancelled", icon: XCircle, completed: true, active: false },
        { id: "REFUNDED", label: "Refunded", icon: CheckCircle, completed: true, active: true },
      ])
      return
    }

    // For normal order flow
    const statusIndex = steps.findIndex((step) => step.id === status)
    if (statusIndex === -1) return

    const updatedSteps = steps.map((step, index) => {
      if (index < statusIndex) {
        return { ...step, completed: true, active: false }
      } else if (index === statusIndex) {
        return { ...step, completed: true, active: true }
      } else {
        return { ...step, completed: false, active: false }
      }
    })

    setSteps(updatedSteps)
  }, [status])

  const formatDate = (date) => {
    if (!date) return ""
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    })
  }

  // Calculate dates for each step
  const getStepDate = (stepIndex) => {
    if (!createdAt) return ""

    // For completed steps, show actual or estimated dates
    if (steps[stepIndex].completed) {
      if (stepIndex === 0) return formatDate(createdAt)

      // For other completed steps, simulate dates based on order creation
      const orderDate = new Date(createdAt)
      orderDate.setHours(orderDate.getHours() + stepIndex * 24) // Add days based on step
      return formatDate(orderDate)
    }

    return "Pending"
  }

  return (
    <div className="py-4">
      <div className="relative">
        {/* Progress Bar */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2">
          <div
            className="h-full bg-pink-500 transition-all duration-500"
            style={{
              width: `${Math.max(0, (steps.findIndex((s) => s.active) / (steps.length - 1)) * 100)}%`,
            }}
          ></div>
        </div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                  step.active
                    ? "border-pink-500 bg-pink-500 text-white"
                    : step.completed
                      ? "border-pink-500 bg-white text-pink-500"
                      : "border-gray-300 bg-white text-gray-400"
                } z-10`}
              >
                <step.icon className="h-5 w-5" />
              </div>
              <div className="mt-2 text-center">
                <p
                  className={`text-sm font-medium ${step.active ? "text-pink-600" : step.completed ? "text-gray-900" : "text-gray-500"}`}
                >
                  {step.label}
                </p>
                <p className="mt-1 text-xs text-gray-500">{getStepDate(index)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

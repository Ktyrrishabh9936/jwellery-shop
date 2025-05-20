"use client"
import { useState, useRef, useEffect } from "react"

const OTPInput = ({ length = 6, onComplete }) => {
  const [otp, setOtp] = useState(Array(length).fill(""))
  const inputRefs = useRef([])

  // Initialize refs array
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length)
  }, [length])

  // Handle input change
  const handleChange = (e, index) => {
    const value = e.target.value

    // Only allow numbers
    if (!/^\d*$/.test(value)) return

    // Update OTP array
    const newOtp = [...otp]

    // Take only the last character if multiple characters are pasted
    newOtp[index] = value.substring(value.length - 1)
    setOtp(newOtp)

    // If value is entered and not the last input, focus next input
    if (value && index < length - 1) {
      inputRefs.current[index + 1].focus()
    }

    // Check if OTP is complete
    const otpValue = newOtp.join("")
    if (otpValue.length === length) {
      onComplete(otpValue)
    }
  }

  // Handle key press
  const handleKeyDown = (e, index) => {
    // If backspace and input is empty, focus previous input
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus()
    }

    // Arrow key navigation
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1].focus()
    }

    if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1].focus()
    }
  }

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault()
    const pasteData = e.clipboardData.getData("text/plain").trim()

    // Check if pasted data is all digits and correct length
    if (!/^\d+$/.test(pasteData)) return

    const newOtp = [...otp]

    // Fill OTP array with pasted digits
    for (let i = 0; i < Math.min(length, pasteData.length); i++) {
      newOtp[i] = pasteData[i]
    }

    setOtp(newOtp)

    // Focus last filled input or last input
    const focusIndex = Math.min(length - 1, pasteData.length - 1)
    if (focusIndex >= 0) {
      inputRefs.current[focusIndex].focus()
    }

    // Check if OTP is complete
    const otpValue = newOtp.join("")
    if (otpValue.length === length) {
      onComplete(otpValue)
    }
  }

  return (
    <div className="flex justify-center space-x-2 sm:space-x-4 w-full max-w-md mx-auto">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={index === 0 ? handlePaste : null}
          className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold border-2 border-gray-300 rounded-md focus:border-red-500 focus:outline-none bg-white"
          aria-label={`Digit ${index + 1} of verification code`}
        />
      ))}
    </div>
  )
}

export default OTPInput

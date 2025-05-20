import axios from "axios"

// Main email sending function using Brevo API
export const sendEmail = async (to, subject, htmlContent, apikey) => {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: { name: "Jenii", email: "info@jenii.in" },
        to: [{ email: to }],
        subject,
        htmlContent,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": apikey || process.env.BREVO_API_KEY,
        },
      },
    )
    return response.data
  } catch (error) {
    console.error("Error sending email:", error.response?.data || error)
    throw new Error("Failed to send email")
  }
}

// Generate OTP verification email
export const generateOTPEmail = (email, otp) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification</title>
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #374151; margin: 0; padding: 0; background-color: #f9fafb;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb;">
        <tr>
          <td align="center" style="padding: 30px 0;">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
              <!-- Header -->
              <tr>
                <td style="padding: 30px 40px; background-color: #BC264B; text-align: center;">
                  <img src="https://img.mailinblue.com/8812198/images/content_library/original/67bb45f0b92c6ab342489ca4.png" alt="Jenii Logo" style="max-width: 150px; height: auto;">
                  <h1 style="color: #ffffff; margin: 20px 0 5px 0; font-size: 24px; font-weight: 700;">Verify Your Email</h1>
                  <p style="color: #ffffff; opacity: 0.9; margin: 0; font-size: 16px;">Please use the code below to complete your verification</p>
                </td>
              </tr>
              
              <!-- OTP Section -->
              <tr>
                <td style="padding: 40px 40px 30px 40px; text-align: center;">
                  <p style="margin: 0 0 20px 0; font-size: 16px;">Hello,</p>
                  <p style="margin: 0 0 30px 0; font-size: 16px;">Thank you for choosing Jenii. To verify your email address, please use the following verification code:</p>
                  
                  <div style="margin: 30px auto; padding: 20px; background-color: #f8fafc; border-radius: 8px; max-width: 300px; border: 1px dashed #d1d5db;">
                    <p style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #BC264B;">${otp}</p>
                  </div>
                  
                  <p style="margin: 30px 0 0 0; font-size: 14px; color: #6b7280;">This code is valid for <strong>5 minutes</strong>. Please do not share this code with anyone.</p>
                </td>
              </tr>
              
              <!-- Security Notice -->
              <tr>
                <td style="padding: 0 40px 40px 40px;">
                  <div style="padding: 20px; background-color: #fffbeb; border-radius: 8px; border-left: 4px solid #f59e0b;">
                    <h3 style="margin: 0 0 10px 0; color: #92400e; font-size: 16px;">Security Notice</h3>
                    <p style="margin: 0; color: #92400e; font-size: 14px;">
                      If you didn't request this code, please ignore this email or contact our support team if you have concerns about your account security.
                    </p>
                  </div>
                </td>
              </tr>
              
              <!-- Help Section -->
              <tr>
                <td style="padding: 30px 40px; background-color: #f8fafc; border-top: 1px solid #e5e7eb; text-align: center;">
                  <p style="margin: 0 0 15px 0; font-size: 16px; color: #4b5563;">Need help?</p>
                  <a href="mailto:support@jenii.in" style="display: inline-block; padding: 10px 24px; background-color: #BC264B; color: white; text-decoration: none; border-radius: 6px; font-weight: 500; margin-bottom: 20px;">Contact Support</a>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding: 30px 40px; background-color: #111827; text-align: center;">
                  <img src="https://img.mailinblue.com/8812198/images/content_library/original/67bb45f0b92c6ab342489ca4.png" alt="Jenii Logo" style="max-width: 120px; height: auto; margin-bottom: 20px;">
                  <p style="margin: 0 0 10px 0; font-size: 14px; color: #e5e7eb;">© 2025 Jenii. All rights reserved.</p>
                  <p style="margin: 0 0 20px 0; font-size: 12px; color: #9ca3af;">Broadway Empire, Nilamber Circle, Near Akshar Pavilion, Vasna Bhayli Main Road, Vadodara, Gujarat, 391410</p>
                  <div>
                    <a href="https://www.facebook.com/jenii" style="display: inline-block; margin: 0 5px;"><img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" style="width: 24px; height: 24px;"></a>
                    <a href="https://www.instagram.com/jenii" style="display: inline-block; margin: 0 5px;"><img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="Instagram" style="width: 24px; height: 24px;"></a>
                    <a href="https://twitter.com/jenii" style="display: inline-block; margin: 0 5px;"><img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" style="width: 24px; height: 24px;"></a>
                  </div>
                </td>
              </tr>
            </table>
            
            <!-- Email Preferences Footer -->
            <table width="600" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding: 20px 0; text-align: center; color: #6b7280; font-size: 12px;">
                  <p style="margin: 0 0 10px 0;">This email was sent to ${email}</p>
                  <p style="margin: 0;">
                    <a href="#" style="color: #6b7280; text-decoration: underline;">Privacy Policy</a> | 
                    <a href="#" style="color: #6b7280; text-decoration: underline;">Terms of Service</a>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
}

// Generate welcome email with password for new users
export const generateWelcomeEmail = (name, email, password) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Jenii</title>
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #374151; margin: 0; padding: 0; background-color: #f9fafb;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb;">
        <tr>
          <td align="center" style="padding: 30px 0;">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
              <!-- Header -->
              <tr>
                <td style="padding: 30px 40px; background-color: #BC264B; text-align: center;">
                  <img src="https://img.mailinblue.com/8812198/images/content_library/original/67bb45f0b92c6ab342489ca4.png" alt="Jenii Logo" style="max-width: 150px; height: auto;">
                  <h1 style="color: #ffffff; margin: 20px 0 5px 0; font-size: 24px; font-weight: 700;">Welcome to Jenii!</h1>
                  <p style="color: #ffffff; opacity: 0.9; margin: 0; font-size: 16px;">Your account has been created successfully</p>
                </td>
              </tr>
              
              <!-- Welcome Section -->
              <tr>
                <td style="padding: 40px 40px 20px 40px;">
                  <p style="margin: 0 0 20px 0; font-size: 16px;">Hello ${name},</p>
                  <p style="margin: 0 0 20px 0; font-size: 16px;">Thank you for joining Jenii! We're excited to have you as part of our community. Your account has been created successfully, and you can now explore our collection of exquisite jewelry.</p>
                  
                  <div style="margin: 30px 0; padding: 25px; background-color: #f8fafc; border-radius: 8px; border: 1px solid #e5e7eb;">
                    <h3 style="margin: 0 0 15px 0; color: #111827; font-size: 18px;">Your Account Information</h3>
                    <p style="margin: 0 0 10px 0; font-size: 14px;"><strong>Email:</strong> ${email}</p>
                    <p style="margin: 0 0 20px 0; font-size: 14px;"><strong>Password:</strong> ${password}</p>
                    <p style="margin: 0; font-size: 14px; color: #ef4444;">Please change your password after your first login for security reasons.</p>
                  </div>
                  
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.NEXT_PUBLIC_API_BASE_URL}/login" style="display: inline-block; padding: 12px 30px; background-color: #BC264B; color: white; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 16px;">Login to Your Account</a>
                  </div>
                </td>
              </tr>
              
              <!-- Features Section -->
              <tr>
                <td style="padding: 0 40px 40px 40px;">
                  <h3 style="color: #111827; margin: 0 0 20px 0; font-size: 18px; font-weight: 600;">What You Can Do Now:</h3>
                  
                  <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: separate; border-spacing: 0 15px;">
                    <tr>
                      <td width="60" style="vertical-align: top;">
                        <div style="width: 50px; height: 50px; background-color: #fdf2f8; border-radius: 50%; text-align: center; line-height: 50px;">
                          <img src="https://cdn-icons-png.flaticon.com/512/3500/3500833.png" alt="Browse" style="width: 25px; height: 25px; margin-top: 12px;">
                        </div>
                      </td>
                      <td style="vertical-align: top;">
                        <p style="margin: 0 0 5px 0; font-weight: 600; color: #111827;">Browse Our Collection</p>
                        <p style="margin: 0; color: #6b7280; font-size: 14px;">Explore our wide range of jewelry pieces, from elegant necklaces to stunning rings.</p>
                      </td>
                    </tr>
                    <tr>
                      <td width="60" style="vertical-align: top;">
                        <div style="width: 50px; height: 50px; background-color: #fdf2f8; border-radius: 50%; text-align: center; line-height: 50px;">
                          <img src="https://cdn-icons-png.flaticon.com/512/2662/2662503.png" alt="Wishlist" style="width: 25px; height: 25px; margin-top: 12px;">
                        </div>
                      </td>
                      <td style="vertical-align: top;">
                        <p style="margin: 0 0 5px 0; font-weight: 600; color: #111827;">Create a Wishlist</p>
                        <p style="margin: 0; color: #6b7280; font-size: 14px;">Save your favorite items to your wishlist for future reference.</p>
                      </td>
                    </tr>
                    <tr>
                      <td width="60" style="vertical-align: top;">
                        <div style="width: 50px; height: 50px; background-color: #fdf2f8; border-radius: 50%; text-align: center; line-height: 50px;">
                          <img src="https://cdn-icons-png.flaticon.com/512/1077/1077976.png" alt="Profile" style="width: 25px; height: 25px; margin-top: 12px;">
                        </div>
                      </td>
                      <td style="vertical-align: top;">
                        <p style="margin: 0 0 5px 0; font-weight: 600; color: #111827;">Complete Your Profile</p>
                        <p style="margin: 0; color: #6b7280; font-size: 14px;">Add your shipping address and preferences to make checkout faster.</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Help Section -->
              <tr>
                <td style="padding: 30px 40px; background-color: #f8fafc; border-top: 1px solid #e5e7eb; text-align: center;">
                  <p style="margin: 0 0 15px 0; font-size: 16px; color: #4b5563;">Need help getting started?</p>
                  <a href="mailto:support@jenii.in" style="display: inline-block; padding: 10px 24px; background-color: #BC264B; color: white; text-decoration: none; border-radius: 6px; font-weight: 500; margin-bottom: 20px;">Contact Support</a>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding: 30px 40px; background-color: #111827; text-align: center;">
                  <img src="https://img.mailinblue.com/8812198/images/content_library/original/67bb45f0b92c6ab342489ca4.png" alt="Jenii Logo" style="max-width: 120px; height: auto; margin-bottom: 20px;">
                  <p style="margin: 0 0 10px 0; font-size: 14px; color: #e5e7eb;">© 2025 Jenii. All rights reserved.</p>
                  <p style="margin: 0 0 20px 0; font-size: 12px; color: #9ca3af;">Broadway Empire, Nilamber Circle, Near Akshar Pavilion, Vasna Bhayli Main Road, Vadodara, Gujarat, 391410</p>
                  <div>
                    <a href="https://www.facebook.com/jenii" style="display: inline-block; margin: 0 5px;"><img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" style="width: 24px; height: 24px;"></a>
                    <a href="https://www.instagram.com/jenii" style="display: inline-block; margin: 0 5px;"><img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="Instagram" style="width: 24px; height: 24px;"></a>
                    <a href="https://twitter.com/jenii" style="display: inline-block; margin: 0 5px;"><img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" style="width: 24px; height: 24px;"></a>
                  </div>
                </td>
              </tr>
            </table>
            
            <!-- Email Preferences Footer -->
            <table width="600" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding: 20px 0; text-align: center; color: #6b7280; font-size: 12px;">
                  <p style="margin: 0 0 10px 0;">This email was sent to ${email}</p>
                  <p style="margin: 0;">
                    <a href="#" style="color: #6b7280; text-decoration: underline;">Privacy Policy</a> | 
                    <a href="#" style="color: #6b7280; text-decoration: underline;">Terms of Service</a>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
}

// Generate order confirmation email
export const generateOrderConfirmationEmail = (order, items, trackingUrl) => {
  // Format currency
  const formatPrice = (price) => {
    return `₹${Number.parseFloat(price).toFixed(2)}`
  }

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Generate items HTML
  const generateItemsHtml = (items) => {
    return items
      .map(
        (item) => `
      <tr>
        <td style="padding: 15px; border-bottom: 1px solid #e5e7eb; width: 80px;">
          <img src="${process.env.NEXT_PUBLIC_IMAGE_URL+item.image}" alt="${item.name}" style="width: 70px; height: 70px; object-fit: cover; border-radius: 6px; border: 1px solid #e5e7eb;">
        </td>
        <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;">
          <p style="margin: 0; font-weight: 600; color: #111827; font-size: 14px;">${item.name}</p>
          <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 12px;">SKU: ${item.sku || "N/A"}</p>
        </td>
        <td style="padding: 15px; border-bottom: 1px solid #e5e7eb; text-align: center; font-size: 14px;">${item.quantity}</td>
        <td style="padding: 15px; border-bottom: 1px solid #e5e7eb; text-align: right; font-size: 14px;">${formatPrice(item.discountedPrice)}</td>
        <td style="padding: 15px; border-bottom: 1px solid #e5e7eb; text-align: right; font-size: 14px; font-weight: 500;">${formatPrice(item.totalPrice)}</td>
      </tr>
    `,
      )
      .join("")
  }

  // Generate tracking section
  const generateTrackingSection = (trackingUrl, courier, estimatedDelivery) => {
    if (!trackingUrl) return ""

    const deliveryDate = estimatedDelivery ? formatDate(estimatedDelivery) : "Not available"

    return `
      <div style="margin: 30px 0; padding: 25px; background-color: #f8fafc; border-radius: 8px; border-left: 4px solid #BC264B;">
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
          <tr>
            <td width="60" style="vertical-align: top;">
              <img src="https://cdn-icons-png.flaticon.com/512/2769/2769339.png" alt="Tracking" style="width: 50px; height: 50px;">
            </td>
            <td style="vertical-align: top; padding-left: 15px;">
              <h3 style="margin: 0 0 10px 0; color: #111827; font-size: 18px;">Track Your Order</h3>
              <p style="margin: 0 0 15px 0; color: #4b5563; font-size: 14px;">
                Your order is on its way! Expected delivery by <strong>${deliveryDate}</strong> via ${courier || "Standard Shipping"}.
              </p>
              <a href="${trackingUrl}" target="_blank" style="display: inline-block; padding: 10px 20px; background-color: #BC264B; color: white; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 14px;">Track Package</a>
            </td>
          </tr>
        </table>
      </div>
    `
  }

  // Generate order status timeline
  const generateOrderTimeline = (status) => {
    
    const steps = [
      { name: "Order Placed", completed: true },
      { name: "Processing", completed: status !== "PENDING" },
      { name: "Shipped", completed: status === "SHIPPED" || status === "DELIVERED" },
      { name: "Delivered", completed: status === "DELIVERED" },
    ]

    return `
      <div style="margin: 30px 0;">
        <h3 style="margin: 0 0 15px 0; color: #111827; font-size: 18px;">Order Status</h3>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
          <tr>
            ${steps
              .map(
                (step, index) => `
              <td style="width: 25%; text-align: center; position: relative;">
                <div style="margin: 0 auto; width: 30px; height: 30px; border-radius: 50%; background-color: ${step.completed ? "#10b981" : "#e5e7eb"}; color: white; line-height: 30px; font-weight: bold; position: relative; z-index: 2;">
                  ${step.completed ? "✓" : ""}
                </div>
                <p style="margin: 8px 0 0 0; font-size: 12px; color: ${step.completed ? "#111827" : "#6b7280"}; font-weight: ${step.completed ? "600" : "400"};">
                  ${step.name}
                </p>
                ${
                  index < steps.length - 1
                    ? `
                  <div style="position: absolute; top: 15px; left: 50%; right: 0; height: 2px; background-color: ${steps[index].completed && steps[index + 1].completed ? "#10b981" : "#e5e7eb"};"></div>
                `
                    : ""
                }
              </td>
            `,
              )
              .join("")}
          </tr>
        </table>
      </div>
    `
  }

  // Main email template
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #374151; margin: 0; padding: 0; background-color: #f9fafb;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb;">
        <tr>
          <td align="center" style="padding: 30px 0;">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
              <!-- Header -->
              <tr>
                <td style="padding: 30px 40px; background-color: #BC264B; text-align: center;">
                  <img src="https://img.mailinblue.com/8812198/images/content_library/original/67bb45f0b92c6ab342489ca4.png" alt="Jenii Logo" style="max-width: 150px; height: auto;">
                  <h1 style="color: #ffffff; margin: 20px 0 5px 0; font-size: 24px; font-weight: 700;">Order Confirmation</h1>
                  <p style="color: #ffffff; opacity: 0.9; margin: 0; font-size: 16px;">Thank you for your purchase!</p>
                </td>
              </tr>
              
              <!-- Order Info -->
              <tr>
                <td style="padding: 40px 40px 20px 40px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td>
                        <p style="margin: 0 0 20px 0; font-size: 16px;">Hello ${order.shippingAddress.name},</p>
                        <p style="margin: 0 0 20px 0; font-size: 16px;">Your order has been confirmed and is now being processed. We'll send you another email when your order ships.</p>
                        
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px; border-collapse: separate; border-spacing: 0 10px;">
                          <tr>
                            <td style="width: 50%; padding: 15px; background-color: #f8fafc; border-radius: 6px;">
                              <p style="margin: 0 0 5px 0; font-size: 14px; color: #6b7280;">Order Number</p>
                              <p style="margin: 0; font-size: 16px; font-weight: 600; color: #111827;">#${order.orderNumber}</p>
                            </td>
                            <td style="width: 50%; padding: 15px; background-color: #f8fafc; border-radius: 6px;">
                              <p style="margin: 0 0 5px 0; font-size: 14px; color: #6b7280;">Order Date</p>
                              <p style="margin: 0; font-size: 16px; font-weight: 600; color: #111827;">${formatDate(order.createdAt || new Date())}</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="width: 50%; padding: 15px; background-color: #f8fafc; border-radius: 6px;">
                              <p style="margin: 0 0 5px 0; font-size: 14px; color: #6b7280;">Payment Method</p>
                              <p style="margin: 0; font-size: 16px; font-weight: 600; color: #111827;">${order.payment.mode}</p>
                            </td>
                            <td style="width: 50%; padding: 15px; background-color: #f8fafc; border-radius: 6px;">
                              <p style="margin: 0 0 5px 0; font-size: 14px; color: #6b7280;">Order Status</p>
                              <p style="margin: 0; font-size: 16px; font-weight: 600; color: #111827;">${order.orderStatus}</p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Tracking Section -->
              <tr>
                <td style="padding: 0 40px;">
                  ${generateTrackingSection(
                    trackingUrl,
                    order.shipping?.courier?.name,
                    order.shipping?.estimatedDelivery,
                  )}
                </td>
              </tr>
              
              <!-- Order Timeline -->
              <tr>
                <td style="padding: 0 40px;">
                  ${generateOrderTimeline(order.orderStatus)}
                </td>
              </tr>
              
              <!-- Order Summary -->
              <tr>
                <td style="padding: 20px 40px 40px 40px;">
                  <h2 style="color: #111827; margin: 0 0 20px 0; font-size: 20px; font-weight: 600;">Order Summary</h2>
                  <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                    <thead>
                      <tr style="background-color: #f8fafc;">
                        <th style="padding: 12px 15px; text-align: left; font-weight: 600; color: #4b5563; font-size: 14px; border-top-left-radius: 6px; border-bottom-left-radius: 6px;"></th>
                        <th style="padding: 12px 15px; text-align: left; font-weight: 600; color: #4b5563; font-size: 14px;">Product</th>
                        <th style="padding: 12px 15px; text-align: center; font-weight: 600; color: #4b5563; font-size: 14px;">Qty</th>
                        <th style="padding: 12px 15px; text-align: right; font-weight: 600; color: #4b5563; font-size: 14px;">Price</th>
                        <th style="padding: 12px 15px; text-align: right; font-weight: 600; color: #4b5563; font-size: 14px; border-top-right-radius: 6px; border-bottom-right-radius: 6px;">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${generateItemsHtml(items)}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colspan="4" style="padding: 15px; text-align: right; font-size: 14px;">Subtotal:</td>
                        <td style="padding: 15px; text-align: right; font-size: 14px;">${formatPrice(order.subtotal)}</td>
                      </tr>
                      <tr>
                        <td colspan="4" style="padding: 15px; text-align: right; font-size: 14px;">Shipping:</td>
                        <td style="padding: 15px; text-align: right; font-size: 14px;">${formatPrice(order.shippingCost)}</td>
                      </tr>
                      ${
                        order.discount > 0
                          ? `
                      <tr>
                        <td colspan="4" style="padding: 15px; text-align: right; font-size: 14px;">Discount:</td>
                        <td style="padding: 15px; text-align: right; font-size: 14px; color: #10b981;">-${formatPrice(order.discount)}</td>
                      </tr>
                      `
                          : ""
                      }
                      ${
                        order.payment.mode === "COD"
                          ? `
                      <tr>
                        <td colspan="4" style="padding: 15px; text-align: right; font-size: 14px;">COD Fee:</td>
                        <td style="padding: 15px; text-align: right; font-size: 14px;">₹50.00</td>
                      </tr>
                      `
                          : ""
                      }
                      <tr>
                        <td colspan="4" style="padding: 15px; text-align: right; font-weight: 700; font-size: 16px; color: #111827;">Total:</td>
                        <td style="padding: 15px; text-align: right; font-weight: 700; font-size: 16px; color: #BC264B;">${formatPrice(order.totalAmount)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </td>
              </tr>
              
              <!-- Shipping & Billing -->
              <tr>
                <td style="padding: 0 40px 40px 40px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="width: 50%; padding-right: 10px; vertical-align: top;">
                        <h3 style="color: #111827; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">Shipping Address</h3>
                        <div style="background-color: #f8fafc; border-radius: 6px; padding: 20px;">
                          <p style="margin: 0 0 5px 0; font-weight: 600; color: #111827;">${order.shippingAddress.name}</p>
                          <p style="margin: 0 0 5px 0;">${order.shippingAddress.address}</p>
                          <p style="margin: 0 0 5px 0;">${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.pincode}</p>
                          <p style="margin: 0 0 5px 0;">${order.shippingAddress.country}</p>
                          <p style="margin: 0;">Phone: ${order.shippingAddress.contact}</p>
                        </div>
                      </td>
                      ${
                        order.billingAddress.contact
                          ? `
                      <td style="width: 50%; padding-left: 10px; vertical-align: top;">
                        <h3 style="color: #111827; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">Billing Address</h3>
                        <div style="background-color: #f8fafc; border-radius: 6px; padding: 20px;">
                          <p style="margin: 0 0 5px 0; font-weight: 600; color: #111827;">${order.billingAddress.name}</p>
                          <p style="margin: 0 0 5px 0;">${order.billingAddress.address}</p>
                          <p style="margin: 0 0 5px 0;">${order.billingAddress.city}, ${order.billingAddress.state} ${order.billingAddress.pincode}</p>
                          <p style="margin: 0 0 5px 0;">${order.billingAddress.country}</p>
                          <p style="margin: 0;">Phone: ${order.billingAddress.contact}</p>
                        </div>
                      </td>
                      `
                          : ""
                      }
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Help Section -->
              <tr>
                <td style="padding: 30px 40px; background-color: #f8fafc; border-top: 1px solid #e5e7eb; text-align: center;">
                  <p style="margin: 0 0 15px 0; font-size: 16px; color: #4b5563;">Questions about your order?</p>
                  <a href="mailto:support@jenii.in" style="display: inline-block; padding: 10px 24px; background-color: #BC264B; color: white; text-decoration: none; border-radius: 6px; font-weight: 500; margin-bottom: 20px;">Contact Support</a>
                  <p style="margin: 0; font-size: 14px; color: #6b7280;">
                    You can also view your order status by visiting your <a href="${process.env.NEXT_PUBLIC_API_BASE_URL}/myitem" style="color: #BC264B; text-decoration: none; font-weight: 500;">account page</a>.
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding: 30px 40px; background-color: #111827; text-align: center;">
                  <img src="https://img.mailinblue.com/8812198/images/content_library/original/67bb45f0b92c6ab342489ca4.png" alt="Jenii Logo" style="max-width: 120px; height: auto; margin-bottom: 20px;">
                  <p style="margin: 0 0 10px 0; font-size: 14px; color: #e5e7eb;">© 2025 Jenii. All rights reserved.</p>
                  <p style="margin: 0 0 20px 0; font-size: 12px; color: #9ca3af;">Broadway Empire, Nilamber Circle, Near Akshar Pavilion, Vasna Bhayli Main Road, Vadodara, Gujarat, 391410</p>
                  <div>
                    <a href="https://www.facebook.com/jenii" style="display: inline-block; margin: 0 5px;"><img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" style="width: 24px; height: 24px;"></a>
                    <a href="https://www.instagram.com/jenii" style="display: inline-block; margin: 0 5px;"><img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="Instagram" style="width: 24px; height: 24px;"></a>
                    <a href="https://twitter.com/jenii" style="display: inline-block; margin: 0 5px;"><img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" style="width: 24px; height: 24px;"></a>
                  </div>
                </td>
              </tr>
            </table>
            
            <!-- Email Preferences Footer -->
            <table width="600" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding: 20px 0; text-align: center; color: #6b7280; font-size: 12px;">
                  <p style="margin: 0 0 10px 0;">This email was sent to ${order.shippingAddress.email}</p>
                  <p style="margin: 0;">
                    <a href="#" style="color: #6b7280; text-decoration: underline;">Unsubscribe</a> | 
                    <a href="#" style="color: #6b7280; text-decoration: underline;">Privacy Policy</a> | 
                    <a href="#" style="color: #6b7280; text-decoration: underline;">View in Browser</a>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
}

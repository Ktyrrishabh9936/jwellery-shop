import { NextResponse } from "next/server"
import { connect } from "@/dbConfig/dbConfig"
import Order from "@/models/orderModel"
import OrderItem from "@/models/orderItemModel"
import Payment from "@/models/paymentModel"
import PDFDocument from "pdfkit"
import QRCode from "qrcode"
import JsBarcode from "jsbarcode"
import { Canvas } from "canvas"
import { UserAuth } from "@/utils/userAuth"

export async function GET(req, { params }) {
  await connect()

  try {
    const userId = await UserAuth()
    const { orderId } = await params

    if (!orderId) {
      return NextResponse.json({ message: "Order ID is required" }, { status: 400 })
    }

    // Fetch order details with populated items
    const order = await Order.findOne({orderNumber:orderId,userId}).populate({
      path: "items",
      // model: OrderItem,
    })

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 })
    }

    // Fetch payment details
    const payment = await Payment.findById(order.payment.paymentId)

    // Generate PDF receipt
    const pdfBuffer = await generateReceipt(order, payment)

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="receipt-${order.orderNumber}.pdf"`,
      },
    })
  } catch (error) {
    console.log("Error generating receipt:", error)
    return NextResponse.json({ message: "Error generating receipt", error: error.message }, { status: 500 })
  }
}

async function generateReceipt(order, payment) {
  return new Promise(async (resolve, reject) => {
    try {
      // Create a PDF document
      const doc = new PDFDocument({
        size: "A4",
        margin: 50,
        info: {
          Title: `Receipt - ${order.orderNumber}`,
          Author: "Jenii Jewelry",
        },
      })
      const fontPath = path.join(process.cwd(), "public/font/Helvetica.ttf");
      doc.registerFont('Helvetica', fontPath);

      // Collect PDF data chunks
      const chunks = []
      doc.on("data", (chunk) => chunks.push(chunk))
      doc.on("end", () => resolve(Buffer.concat(chunks)))
      doc.on("error", reject)

      // Generate barcode
      const canvas = new Canvas(300, 100)
      JsBarcode(canvas, order.orderNumber, {
        format: "CODE128",
        width: 2,
        height: 50,
        displayValue: true,
        fontSize: 12,
        margin: 10,
      })
      const barcodeDataUrl = canvas.toDataURL()

      // Generate QR code with order tracking URL
      const qrCodeDataUrl = await QRCode.toDataURL(
        order.shipping?.trackingUrl || `https://jenii.in/order-tracking/${order.orderNumber}`,
      )

      // Add company logo
      doc.image("public/logo.png", 50, 45, { width: 100 })

      // Add receipt title
      doc.fontSize(20).text("RECEIPT", 0, 50, { align: "right" })

      // Add receipt number and date
      doc.moveDown()
      doc
        .fontSize(10)
        // 
        .text(`Receipt #: ${order.orderNumber}`, { align: "right" })
        .text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, { align: "right" })

      // Add company info
      doc.moveDown(2)
      doc.fontSize(12).text("Jenii Jewelry", 50, 130)
      doc
        .fontSize(10)
        
        .text("Broadway Empire, Nilamber Circle")
        .text("Near Akshar Pavilion, Vasna Bhayli Main Road")
        .text("Vadodara, Gujarat, 391410")
        .text("GSTIN: 24AABCJ1234A1Z5")
        .text("Email: support@jenii.in")

      // Add customer info
      doc.fontSize(12).text("Bill To:", 300, 130)
      doc
        .fontSize(10)
        
        .text(`${order.shippingAddress.name} ${order.shippingAddress.lastname || ""}`)
        .text(order.shippingAddress.address)
        .text(`${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.pincode}`)
        .text(order.shippingAddress.country)
        .text(`Email: ${order.shippingAddress.email}`)
        .text(`Phone: ${order.shippingAddress.contact}`)

      // Add payment info
      doc.moveDown(2)
      doc.fontSize(12).text("Payment Information")
      doc
        .fontSize(10)
        
        .text(`Payment Method: ${order.payment.mode}`)
        .text(`Payment Status: PAID`)
        .text(`Payment Date: ${new Date(payment?.createdAt || order.updatedAt).toLocaleDateString()}`)
        .text(`Payment ID: ${payment?.rzr_payment_id || "N/A"}`)

      // Add order items table
      doc.moveDown(2)
      doc.fontSize(12).text("Order Items")

      // Table headers
      const tableTop = doc.y + 10
      doc.fontSize(10)
      doc.text("Item", 50, tableTop)
      doc.text("Qty", 300, tableTop, { width: 40, align: "center" })
      doc.text("Price", 340, tableTop, { width: 100, align: "right" })
      doc.text("Total", 440, tableTop, { width: 100, align: "right" })

      // Draw header line
      doc
        .moveTo(50, tableTop + 15)
        .lineTo(540, tableTop + 15)
        .stroke()

      // Table rows
      let y = tableTop + 25
      for (const item of order.items) {
        doc.fontSize(10)
        doc.text(item.name, 50, y, { width: 240 })
        doc.text(item.quantity.toString(), 300, y, { width: 40, align: "center" })
        doc.text(`₹${item.discountedPrice.toFixed(2)}`, 340, y, { width: 100, align: "right" })
        doc.text(`₹${(item.discountedPrice * item.quantity).toFixed(2)}`, 440, y, { width: 100, align: "right" })
        y += 20
      }

      // Draw bottom line
      doc.moveTo(50, y).lineTo(540, y).stroke()

      // Add summary
      y += 20
      doc.fontSize(10)
      doc.text("Subtotal:", 350, y, { width: 100, align: "right" })
      doc.text(`₹${order.subtotal.toFixed(2)}`, 450, y, { width: 90, align: "right" })

      y += 20
      doc.text("Shipping:", 350, y, { width: 100, align: "right" })
      doc.text(`₹${order.shippingCost.toFixed(2)}`, 450, y, { width: 90, align: "right" })

      if (order.discount > 0) {
        y += 20
        doc.text("Discount:", 350, y, { width: 100, align: "right" })
        doc.text(`-₹${order.discount.toFixed(2)}`, 450, y, { width: 90, align: "right" })
      }

      y += 20
      doc.fontSize(12)
      doc.text("Total:", 350, y, { width: 100, align: "right" })
      doc.text(`₹${order.totalAmount.toFixed(2)}`, 450, y, { width: 90, align: "right" })

      // Add barcode
      doc.moveDown(4)
      doc.image(barcodeDataUrl, {
        fit: [300, 100],
        align: "center",
      })

      // Add QR code
      doc.moveDown()
      doc.image(qrCodeDataUrl, {
        fit: [100, 100],
        align: "center",
      })

      // Add footer
      const footerY = doc.page.height - 50
      doc
        .fontSize(10)
        
        .text("Thank you for shopping with Jenii Jewelry!", 50, footerY, { align: "center" })
        .text("For any questions, please contact support@jenii.in", { align: "center" })

      // Finalize the PDF
      doc.end()
    } catch (error) {
      reject(error)
    }
  })
}

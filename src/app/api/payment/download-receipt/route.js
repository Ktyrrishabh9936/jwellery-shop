import { NextResponse } from 'next/server';
import fs from 'fs';
import { PDFInvoice } from '@h1dd3nsn1p3r/pdf-invoice';
import razorpayInstance from '@/utils/razorpayInstance';
export async function GET(req) {
  await connect();
  try {
    const { searchParams } = new URL(req.url);
    const payment_id = searchParams.get('payment_id');

    const paymentDetails = await razorpayInstance.payments.fetch(payment_id);
    if (!paymentDetails) {
      throw new Error('Payment details not found');
    }

    const paymentDate = new Date(paymentDetails.created_at).toLocaleDateString();
    const payload = {
      company: {
        logo: '...', // SVG or image link here
        name: 'Paragon Store',
        address: '1711 W. El Segundo Blvd, Hawthorne, Canada - 90250',
        phone: 'Tel: (+11) 245 543 903',
        email: 'Mail: ktyrrishabh99361032@gmail.com',
        website: 'Web: https://www.festrolcorp.io',
        taxId: 'Tax ID: 1234567890',
      },
      customer: {
        name: 'John Doe',
        address: '1234 Main Street, New York, NY 10001',
        phone: `Tel: ${paymentDetails.contact}`,
        email: `Mail: ${paymentDetails.email}`,
        taxId: `Order ID: ${paymentDetails.order_id}`,
      },
      invoice: {
        number: `${paymentDetails.acquirer_data.authentication_reference_number}`,
        date: paymentDate,
        dueDate: '25/12/2023',
        status: `${paymentDetails.status}`,
        currency: 'Rs.',
        path: './invoice.pdf',
      },
      items: [
        { name: 'Cloud VPS Server - Starter Plan', quantity: 1, price: 400, tax: 0 },
        { name: 'Domain Registration - example.com', quantity: 1, price: 20, tax: 0 },
        { name: 'Maintenance Charge - Yearly', quantity: 1, price: 300, tax: 0 },
      ],
      note: { text: 'Thank you for your business.', italic: false },
    };

    const invoice = new PDFInvoice(payload);
    const pdfPath = await invoice.create();

    const pdfStream = fs.createReadStream(pdfPath);
    const headers = {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=Invoice_${payload.invoice.number}.pdf`,
    };

    return new NextResponse(pdfStream, { headers }).on('end', () => {
      fs.unlinkSync(pdfPath); // Clean up the PDF file after download
    });
  } catch (error) {
    console.error('Error generating receipt:', error);
    return NextResponse.json({ message: 'Error generating receipt' }, { status: 500 });
  }
}

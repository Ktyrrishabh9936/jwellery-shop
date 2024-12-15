import nodemailer from 'nodemailer';

// Email sending helper function
export const sendEmail = async (email, subject, message) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  
    await transporter.sendMail({
      from: `"Jenni" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: subject,
      text: message,
    });

    console.log(`Email sent to ${email} successfully!`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};

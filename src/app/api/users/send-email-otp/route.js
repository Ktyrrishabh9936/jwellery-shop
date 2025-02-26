import { NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import { sendEmail } from '@/utils/sendMail';
import crypto from 'crypto';
function generateOTP() {

  return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
}
const hashOTP = (otp, secret) => crypto.createHmac("sha256", secret).update(otp).digest("hex");



export async function POST(request) {
  await connect();
  try {
    const { email } = await request.json();
    
   
    const otp = generateOTP();
    const hashedOTP = hashOTP(otp, process.env.NEXTAUTH_SECRET);
    await sendEmail(email, 'Jenii-Email verifcation Code', `<html><head>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head><body style="background: #f4f7ff;">
        <div
          style="
           max-width: 680px;
            margin: 0 auto;
            padding: 45px 30px 60px;
            background: #f4f7ff;
         background-image: linear-gradient(to bottom right, red, pink);
            background-repeat: no-repeat;
            background-size: 800px 452px;
            background-position: top center;
            font-size: 14px;
            color: #434343;
          "
        >
          <main>
            <div
              style="
                margin: 0;
                margin-top: 30px;
                padding: 92px 30px 115px;
                background: #ffffff;
                border-radius: 30px;
                text-align: center;
              "
            >
              <img src="https://img.mailinblue.com/8812198/images/content_library/original/67bb45f0b92c6ab342489ca4.png" width="324" border="0" style="display: block; width: 50%; margin-left: auto;margin-right: auto;"><div
        style="
          margin: 0;
          font-family: 'Poppins', sans-serif;
          background: #ffffff;
          font-size: 14px;
        "
      >
              <div style="width: 100%; max-width: 489px; margin: 0 auto;">
                <h1
                  style="
                    margin: 0;
                    font-size: 24px;
                    font-weight: 500;
                    color: #1f1f1f;
                  "
                >
                  Your OTP
                </h1>
                <p
                style="
                  margin: 0;
                  margin-top: 40px;
                  font-size: 40px;
                  font-weight: 600;
                  letter-spacing: 17px;
                  color: #ba3d4f;
                "
              >
                ${otp}</p>
                <p
                  style="
                    margin: 0;
                    margin-top: 17px;
                    font-size: 17px;
                    font-weight: 500;
                  "
                >
                  Hey Customer,
                </p>
                <p
                  style="
                    margin: 0;
                    margin-top: 17px;
                    font-weight: 500;
                    font-size:17px;
                    letter-spacing: 0.56px;
                    color: gray;
                  "
                >
                  Thank you for choosing Jenii Company. Use the following OTP
                  to complete the procedure to change your email address. OTP is
                  valid for
                  <span style="font-weight: 600; color: #1f1f1f;">5 minutes</span>.
                  Do not share this code with anyone.
                  employees.
                </p>
            
              </div>
            </div>
    
       </div>
          </main>
          <table cellspacing="0" cellpadding="0" border="0" role="presentation" width="100%" class="r12-o" style="table-layout: fixed; width: 100%; margin-top: 20px;"><tr><td align="center" valign="top" class="r13-i nl2go-default-textstyle" style="color: #3b3f44; font-family: arial,helvetica,sans-serif; font-size: 16px; line-height: 1.5; word-break: break-word; text-align: center;"> <div><p style="margin: 0;"><strong>© 2025 Jenii. All rights reserved.</strong><br>www.jenii.in </p><p style="margin: 0;">📧 Need help? Contact us at info@jenii.in<br>Marketed by AREVEI</p></div> </td> </tr><tr class="nl2go-responsive-hide"><td height="15" style="font-size: 15px; line-height: 15px;">­</td> </tr></table></td> </tr></table>
        </div>
      </body>
</html>`,process.env.BREVO_API_KEY);

    return NextResponse.json({ message: 'OTP sent to your email',hashedOTP });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json({ message: 'Failed to send OTP', error: error.message }, { status: 500 });
  }
}

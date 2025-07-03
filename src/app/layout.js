import localFont from "next/font/local";
import "../styles/globals.css";
import ClientLayout from "./ClientLayout";
import AuthProvider from "@/context/auth-session-proivder";
import SessionManager from "@/context/session-manager";
import StoreProvider from "./StoreProvider";
import { Toaster } from 'react-hot-toast';
import Script from "next/script";
// Define custom fonts
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Metadata for your application
export const metadata = {
  title: "Jenii - A JP Sterling Silver Brand | Premium Sterling Silver Jewellery",
  description: "Jenii offers a premium selection of sterling silver jewellery for gift and wedding purpose, blending timeless elegance with modern designs. ",
  keywords: ["silver jewellery", "Jenii JP", "JP jewellers"," Silver Rings", "Silver Bracelets", "couple Rings", "jwellers for men"," jwellers for women" ,"silver branded jewelleries"]
};

export default function RootLayout({ children }) {
  return (
          <StoreProvider>
    <html lang="en">
    <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-2T3HXDM6TT"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-2T3HXDM6TT');
        `}
      </Script>
      <Script>{`
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
 fbq('init', '487683057550660'); 
fbq('track', 'PageView');`}
</Script>
<noscript>
 <img height="1" width="1" 
src="https://www.facebook.com/tr?id=487683057550660&ev=PageView
&noscript=1"/>
</noscript>
      {/* <Script type="text/javascript">
  {`  (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "q0c2vfolg9");`}
</Script> */}

<Script type="text/javascript">
  {`  (function(c,l,a,r,i,t,y){
        c[a]=c[a]function(){(c[a].q=c[a].q[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "s504eh3aa1");`}
</Script>



      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClientLayout>
      <AuthProvider>
      <SessionManager />
          {children}
    </AuthProvider>
          </ClientLayout> 
          <Toaster />
      </body>
    </html>
    </StoreProvider>
  );
}

import localFont from "next/font/local";
import "../styles/globals.css";
import ClientLayout from "./ClientLayout";
import AuthProvider from "@/context/auth-session-proivder";
import SessionManager from "@/context/session-manager";
import StoreProvider from "./StoreProvider";
import { Toaster } from "react-hot-toast";
import Script from "next/script";

// Fonts
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

// Metadata
export const metadata = {
  title: "Jenii - A JP Sterling Silver Brand | Premium Sterling Silver Jewellery",
  description:
    "Jenii offers a premium selection of sterling silver jewellery for gift and wedding purpose, blending timeless elegance with modern designs.",
  keywords: [
    "silver jewellery",
    "Jenii JP",
    "JP jewellers",
    "Silver Rings",
    "Silver Bracelets",
    "couple Rings",
    "jwellers for men",
    "jwellers for women",
    "silver branded jewelleries",
  ],
};

export default function RootLayout({ children }) {
  return (
    <StoreProvider>
      <html lang="en">
        <head>
          {/* Google Analytics */}
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

          {/* Facebook Pixel */}
          <Script id="facebook-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window,document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '487683057550660'); 
              fbq('track', 'PageView');
            `}
          </Script>

          {/* Google Tag Manager */}
          <Script id="gtm-head" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-WJHS34MC');
            `}
          </Script>

          {/* Microsoft Clarity */}
          <Script id="clarity" strategy="afterInteractive">
            {`
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "s504eh3aa1");
            `}
          </Script>
        </head>

        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          {/* GTM Noscript fallback */}
          <noscript>
            <iframe
              src="https://www.googletagmanager.com/ns.html?id=GTM-WJHS34MC"
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            ></iframe>
          </noscript>

          {/* Facebook Pixel noscript */}
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src="https://www.facebook.com/tr?id=487683057550660&ev=PageView&noscript=1"
              alt=""
            />
          </noscript>

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

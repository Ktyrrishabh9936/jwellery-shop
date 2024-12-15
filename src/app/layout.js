import localFont from "next/font/local";
import "../styles/globals.css";
import ClientLayout from "./ClientLayout";
import AuthProvider from "@/context/auth-session-proivder";
import SessionManager from "@/context/session-manager";
import StoreProvider from "./StoreProvider";
import { Toaster } from 'react-hot-toast';
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

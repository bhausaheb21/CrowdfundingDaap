import localFont from "next/font/local";
import './globals.css'
import ClientLayout from "@/app/Components/ClientLayout";
import RecoilWrapper from "./Components/RecoilWrapper";
// import RecoilWrapper from "@/app/Components/RecoilWrapper";
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

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <RecoilWrapper>{children}</RecoilWrapper>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import localFont from "next/font/local";
import { Open_Sans } from "next/font/google";
import "./globals.scss";
import { ToastContainer } from "react-toastify";
import { Providers } from "@/redux/provider";
import UserProvider from "@/utils/user-provider";

const opensans = localFont({
  src: [
    {
      path: "../../public/assets/fonts/opensans/OpenSans-Semibold-webfont.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/assets/fonts/opensans/OpenSans-Regular-webfont.woff",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--gorditas-font",
});

const open = Open_Sans({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--eb_garamond-font",
});

export const metadata: Metadata = {
  title: "JasmineGraph UI",
  description: "JasmineGraph UI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning={true}
        className={`${open.variable} ${opensans.variable}`}
      >
        <Providers>
        <UserProvider>
          {children}
        </UserProvider>
        <ToastContainer />
        </Providers>
      </body>
    </html>
  );
}

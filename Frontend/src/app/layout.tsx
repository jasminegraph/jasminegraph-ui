/**
Copyright 2024 JasmineGraph Team
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
 */

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

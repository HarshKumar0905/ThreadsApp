import { Inter } from "next/font/google";
import "../globals.css";
import {
  ClerkProvider
} from "@clerk/nextjs";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// export const metadata = {
//   title: "Threads",
//   description: "A Next.js 13 Meta Threads Application",
//   manifest : "/manifest.json"
// };

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* <link rel="manifest" href="/manifest.json" /> */}
      </head>
      <body className=
      {`${inter.className} bg-[url('/assets/ThreadsBackground.jpeg')]
      bg-cover bg-center`}>
        <ClerkProvider>
        <div className="w-full flex justify-center items-center
        min-h-screen">
          {children}
        </div>
        <ToastContainer autoClose={4000} position="top-right"
        hideProgressBar = {false} closeOnClick = {true}
        pauseOnHover = {true} draggable = {true} theme = "colored"/>
        </ClerkProvider>
      </body>
    </html>
  );
}
import { Inter } from "next/font/google";
import "../globals.css";
import {
  ClerkProvider
} from "@clerk/nextjs";

export const metadata = {
  title: "Threads",
  description: "A Next.js 13 Meta Threads Application",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className=
      {`${inter.className} bg-[url('/assets/ThreadsBackground.jpeg')]
      bg-cover bg-center`}>
        <ClerkProvider>
        <div className="w-full flex justify-center items-center
        min-h-screen">
          {children}
        </div>
        </ClerkProvider>
      </body>
    </html>
  );
}
import { ClerkProvider} from '@clerk/nextjs'
import '../globals.css'
import { Inter } from 'next/font/google'
import Topbar from '@/components/shared/Topbar'
import LeftSidebar from '@/components/shared/LeftSidebar'
import RightSidebar from '@/components/shared/RightSidebar'
import Bottombar from '@/components/shared/Bottombar'
import { ToastContainer} from 'react-toastify';
import { NextUIProvider } from '@nextui-org/react';
import 'react-toastify/dist/ReactToastify.css';
import Img from "@/public/assets/ThreadsBackground.jpeg"

const inter = Inter({ subsets: ['latin'] })

// export const metadata = {
//   title: "Threads",
//   description: "A Next.js 13 Meta Threads Application",
//   manifest : "/manifest.json"
// };

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <head>
        {/* <link rel="manifest" href="/manifest.json" />
        <link fetchPriority='high' rel="preload" href="@/public/assets/ThreadsBackground.jpeg" as="image"/>
        <link fetchPriority='high' rel="preload" href="@/public/assets/upload_added.png" as="image"/>
        <link fetchPriority='high' rel="preload" href="@/public/assets/upload_area.png" as="image"/>
        <link fetchPriority='high' rel="preload" href="@/public/assets/upload_cancel.png" as="image"/> */}
      </head>
      <body className={inter.className}>
        <ClerkProvider>
        <NextUIProvider >
        <Topbar />
        <main className='flex'>
          <LeftSidebar/>
          <section className='main-container w-screen'>
            <div className='w-full max-w-4xl'>
              {children}
            </div>
          </section>
          <RightSidebar />
        </main>
        <ToastContainer autoClose={4000} position="top-right"
        hideProgressBar = {false} closeOnClick = {true}
        pauseOnHover = {true} draggable = {true} theme = "colored"/>
        <Bottombar />
        </NextUIProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}
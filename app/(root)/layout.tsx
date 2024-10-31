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

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: "Threads",
  description: "A Next.js 13 Meta Threads Application",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
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
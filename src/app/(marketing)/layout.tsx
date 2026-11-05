'use client'

import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'
import { usePathname } from 'next/navigation'
import React from 'react'

type Props = {
  children: React.ReactNode
}

const Layout = ({ children }: Props) => {
  const pathname = usePathname()
  // These pages bring their own top bar and footer
  const isHomePage = pathname === '/courses' || pathname === '/master-mutual-funds'

  return (
    <div className="flex flex-col w-full h-full font-sans bg-cream text-ink-body leading-[1.65] antialiased">
      {!isHomePage && <Navbar />}
      {children}
      {!isHomePage && <Footer />}
    </div>
  )
}

export default Layout
import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'
import React from 'react'

type Props = {
  children: React.ReactNode
}

const Layout = ({ children }: Props) => {
  return (
    <div className="flex flex-col w-full h-full font-sans bg-cream text-ink-body leading-[1.65] antialiased">
        {/* <Navbar/>  */}
        {children}
        <Footer/>
    </div>
  )
}

export default Layout
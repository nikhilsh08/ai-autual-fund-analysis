import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'
import React from 'react'

type Props = {
  children: React.ReactNode
}

const Layout = ({ children }: Props) => {
  return (
    <div className="flex flex-col w-full h-full font-sans bg-cream text-ink-body leading-[1.65] antialiased">
<<<<<<< HEAD
        <Navbar/> 
=======
        
>>>>>>> 5da359ff0f39f34542ac2b2fa89c5c7b08ed8b32
        {children}
        <Footer/>
    </div>
  )
}

export default Layout
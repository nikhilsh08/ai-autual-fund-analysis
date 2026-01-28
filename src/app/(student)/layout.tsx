import { Navbar } from '@/components/navbar'
import React from 'react'

type Props = {
  children: React.ReactNode
}

const Layout = ({ children }: Props) => {
  return (
    <div className="flex flex-col w-full h-full">
        <Navbar/>
        {children}
    </div>
  )
}

export default Layout
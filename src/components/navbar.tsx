"use client"

import React, { useState } from 'react';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


export const Navbar = () => {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false);
  const cartCount = 1;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link 
        href={"/"}
          className="flex items-center gap-2 font-bold text-lg tracking-tighter text-zinc-900 cursor-pointer"

        >
          <div className="w-6 h-6 bg-black rounded-sm flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full" />
          </div>
          CFC 
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-500">
          <button className="hover:text-zinc-900 transition-colors">Catalog</button>
          <Link href="#" className="hover:text-zinc-900 transition-colors">Enterprise</Link>
          <Link href="#" className="hover:text-zinc-900 transition-colors">Resources</Link>
          <Link href="#" className="hover:text-zinc-900 transition-colors">Pricing</Link>
        </div>

        <div className="flex items-center gap-3">
          <button 
            className="text-zinc-500 hover:text-zinc-900 transition-colors p-2 relative" 
            aria-label="Cart"
            onClick={() => router.push('/cart')}
          >
             <ShoppingBag size={20} />
             {cartCount > 0 && (
               <span className="absolute top-1 right-0.5 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
               </span>
             )}
          </button>
          <Link 
            href={"/sign-in"}
            className="hidden md:block text-sm text-zinc-500 hover:text-zinc-900 cursor-pointer mr-2"
          >
            Sign in
          </Link>
          <Button 
            variant="primary" 
            className="py-2 px-4 h-9 text-xs"
            onClick={()=>router.push('/sign-up')}
          >
            Get Started
          </Button>
          <button className="md:hidden text-zinc-900" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-zinc-200 p-6 space-y-4 shadow-lg">
          <button onClick={() => {  setIsOpen(false); }} className="block w-full text-left text-zinc-600 hover:text-zinc-900">Catalog</button>
          <button onClick={() => {  setIsOpen(false); }} className="block w-full text-left text-zinc-600 hover:text-zinc-900">Sign In</button>
          <button onClick={() => {  setIsOpen(false); }} className="block w-full text-left text-zinc-600 hover:text-zinc-900">Sign Up</button>
        </div>
      )}
    </nav>
  );
};

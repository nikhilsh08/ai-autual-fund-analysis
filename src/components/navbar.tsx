"use client"

import React, { useState } from 'react';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


import HeaderLogo from '../../public/HeaderLogo';

const LogoIcon = () => (
  <svg width="50" height="52" viewBox="0 0 350 221" xmlns="http://www.w3.org/2000/svg" className="shrink-0 h-16 w-auto">
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#4f46e5" />
        <stop offset="100%" stopColor="#3b82f6" />
      </linearGradient>
    </defs>
    <g transform="matrix(1.681, 0, 0, 1.681, 90.94, -11.51)" fill="url(#logoGradient)">
      <path d="M89.28,50.602h-3.826c-1.695-5.234-4.973-9.871-9.367-13.491c-0.924-3.314,0.241-6.345,1.603-8.518 c0.96-1.531-0.283-3.482-2.075-3.259c-7.359,0.915-10.325,4.7-11.611,7.301c-0.044,0.089-0.082,0.183-0.116,0.28 c-0.026,0.052-0.052,0.104-0.077,0.157c-0.157,0.439-0.328,0.871-0.511,1.296c-0.001,0.003-0.002,0.006-0.003,0.008 c-0.013,0.041-0.026,0.07-0.038,0.089c-3.552,8.143-11.776,13.811-21.222,13.811c-6.591,0-12.532-2.778-16.719-7.225 c-1.711,2.013-3.139,4.221-4.232,6.579c-3.182-0.579-5.221-1.814-6.488-3.152c2.095-0.916,3.938-2.194,4.535-3.413 c1.242-2.537-0.532-4.163-0.532-4.163s-5.117-4.996-7.358,2.469c-0.54,1.8-0.264,3.465,0.466,4.956 c-1.81,0.802-3.346,1.361-3.346,1.361c1.047,0.198,2.452,0.029,3.906-0.376c1.935,2.976,5.528,5.138,7.392,6.116 c-0.691,2.367-1.06,4.847-1.06,7.402c0,2.125,0.256,4.198,0.739,6.197l-0.002-0.001c0,0,0.008,0.032,0.025,0.092 c0.509,2.073,1.262,4.068,2.235,5.956c1.285,2.772,3.158,6.019,5.716,8.653c3.707,3.816,4.344,8.551,4.437,10.597v0.889 c0,0.038,0.004,0.076,0.006,0.114c-0.001,0.013-0.001,0.019-0.001,0.019l0.002-0.002c0.068,1.008,0.905,1.805,1.93,1.805h11.811 c1.069,0,1.936-0.867,1.936-1.936v-2.917c1.709,0.231,3.461,0.351,5.244,0.351c1.393,0,2.765-0.075,4.114-0.217v2.782 c0,1.069,0.867,1.936,1.936,1.936h11.811c1.069,0,1.936-0.867,1.936-1.936v-2.92c0.024-0.972,0.355-4.804,3.96-8.089 c0.171-0.146,0.341-0.293,0.508-0.441c0.014-0.012,0.028-0.024,0.043-0.036l-0.006,0.003c4.056-3.61,7.068-8.119,8.612-13.155h3.69 c1.303,0,2.36-1.056,2.36-2.36V52.962C91.64,51.659,90.583,50.602,89.28,50.602z M12.766,39.842 c1.014-4.325,4.857-2.003,4.683,0.507c-0.063,0.91-1.792,2.039-3.725,3.024C12.775,41.904,12.613,40.492,12.766,39.842z M70.392,48.311c0-1.613,1.308-2.92,2.92-2.92c1.613,0,2.92,1.308,2.92,2.92c0,1.613-1.307,2.92-2.92,2.92 C71.699,51.232,70.392,49.924,70.392,48.311z M23.567,25.318c0-10.2,8.269-18.469,18.469-18.469s18.469,8.269,18.469,18.469 s-8.269,18.469-18.469,18.469S23.567,35.518,23.567,25.318z" />
    </g>
  </svg>
);

export const Navbar = () => {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false);
  const cartCount = 1;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href={"/"}
          className="flex items-center gap-2 cursor-pointer"
        >
           <div  className="flex cursor-pointer items-center gap-3">
            <HeaderLogo />

            <div className="flex flex-col">
              {/* Logo row */}
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold max-md:hidden text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  CashFlowCrew
                </span>
              </div>

              {/* Tagline */}
              <span className="text-xs text-gray-500 hidden sm:block">
                Master Your Finances
              </span>
            </div>
          </div>
        </Link>

        {/* <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-500">
          <Link href="#" className="hover:text-zinc-900 transition-colors">Enterprise</Link>
          <Link href="#" className="hover:text-zinc-900 transition-colors">Resources</Link>
          <Link href="#" className="hover:text-zinc-900 transition-colors">Pricing</Link>
        </div> */}

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
            onClick={() => router.push('/sign-up')}
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
          <button onClick={() => { setIsOpen(false); }} className="block w-full text-left text-zinc-600 hover:text-zinc-900">Catalog</button>
          <button onClick={() => { setIsOpen(false); }} className="block w-full text-left text-zinc-600 hover:text-zinc-900">Sign In</button>
          <button onClick={() => { setIsOpen(false); }} className="block w-full text-left text-zinc-600 hover:text-zinc-900">Sign Up</button>
        </div>
      )}
    </nav>
  );
};

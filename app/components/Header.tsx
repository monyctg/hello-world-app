'use client';

import Link from 'next/link';
import { useCart } from '@/lib/store';
import { ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Header() {
  // Use state to avoid hydration mismatch errors with local storage
  const [mounted, setMounted] = useState(false);
  const cart = useCart((state) => state.cart);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl text-white font-sans">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold tracking-tighter hover:opacity-80 transition">
          magfar<span className="text-[#14a800]">.</span>
        </Link>
        
        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
          <Link href="/#work" className="hover:text-white transition-colors">Work</Link>
          <Link href="/store" className="hover:text-white transition-colors text-[#14a800] font-bold">Store</Link>
          <Link href="/#testimonials" className="hover:text-white transition-colors">Reviews</Link>
        </nav>

        {/* Right Side: Cart & Hire Me */}
        <div className="flex items-center gap-4">
          
          {/* Cart Icon */}
          <Link href="/checkout" className="relative p-2 hover:bg-white/10 rounded-full transition group">
            <ShoppingCart className="w-6 h-6 text-gray-300 group-hover:text-white" />
            {mounted && cart.length > 0 && (
              <span className="absolute top-0 right-0 bg-[#14a800] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#050505]">
                {cart.length}
              </span>
            )}
          </Link>

          <Link 
            href="https://www.upwork.com/freelancers/~019c9872d9fceebb74" 
            target="_blank"
            className="hidden sm:block bg-[#14a800] hover:bg-[#118f00] text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-[0_0_20px_rgba(20,168,0,0.3)]"
          >
            Hire Me
          </Link>
        </div>
      </div>
    </header>
  );
}
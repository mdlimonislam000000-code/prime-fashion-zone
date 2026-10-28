'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageCircle, User, Heart, ShoppingBag, Search, LogIn } from 'lucide-react';
import { useSession } from '@/lib/auth-client'; 

const Navbar = () => {
  const pathname = usePathname();

  // BetterAuth Real Session
  const { data: session, isPending } = useSession();
  const userRole = session?.user?.role; // 'admin' ba 'user'

  // Dynamic Profile Link based on Role
  const profileLink = session
    ? userRole === 'admin'
      ? '/dashboard/admin/profile'
      : '/dashboard/user/profile'
    : '/login';

  // Dynamic Wishlist Link based on Role & Auth Status
  const wishlistLink = session
    ? userRole === 'admin'
      ? '/dashboard/admin/wishlist'
      : '/dashboard/user/wishlist'
    : '/wishlist';

  // Dynamic Cart / Bag Link based on Role & Auth Status
  const cartLink = session
    ? userRole === 'admin'
      ? '/dashboard/admin/cart' // Admin display mode for cart/orders
      : '/dashboard/user/cart'
    : '/cart';

  const navItems = [
    { name: 'MEN', href: '/men' },
    { name: 'WOMEN', href: '/women' },
    { name: 'Cosmetics', href: '/cosmetics' },
    { name: 'KIDS', href: '/kids' },
    { name: 'SPORTS', href: '/sports' },
  ];

  // WhatsApp Direct URL with your number
  const whatsappUrl = `https://wa.me/8801301269582?text=Hello%20PRIMEzone,%20I%20want%20to%20know%20more%20about%20your%20products.`;

  return (
    <>
      {/* ================= DESKTOP & TOP HEADER ================= */}
      <header className="w-full bg-white/40 backdrop-blur-xl border-b border-white/70 shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20 gap-2 md:gap-6">
            
            {/* 1. Logo Section */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center gap-1.5 md:gap-2 group">
                <div className="flex flex-col gap-0.5 md:gap-1 transform -rotate-12 group-hover:rotate-0 transition-transform duration-300">
                  <div className="w-4 md:w-6 h-1 md:h-1.5 bg-purple-600 rounded-sm shadow-sm"></div>
                  <div className="w-3.5 md:w-5 h-1 md:h-1.5 bg-blue-500 rounded-sm shadow-sm"></div>
                  <div className="w-2 md:w-3 h-1 md:h-1.5 bg-blue-400 rounded-sm shadow-sm"></div>
                </div>
                <span className="text-base sm:text-lg md:text-2xl flex font-black tracking-tighter">
                  <span className="text-purple-600">PRIME</span>
                  <span className="text-blue-500">zone</span>
                </span>
              </Link>
            </div>

            {/* 2. Desktop Navigation Categories */}
            <nav className="hidden md:flex items-center space-x-6 lg:space-x-8 font-bold text-xs lg:text-sm uppercase tracking-wide">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`relative py-1 transition-colors duration-200 ${
                      isActive ? 'text-purple-600' : 'text-slate-800 hover:text-purple-600'
                    }`}
                  >
                    {item.name}
                    <span
                      className={`absolute bottom-0 left-0 h-0.5 bg-purple-600 transition-all duration-300 ${
                        isActive ? 'w-full' : 'w-0 hover:w-full'
                      }`}
                    />
                  </Link>
                );
              })}
            </nav>

            {/* 3. Search Bar */}
            <div className="flex-1 max-w-[200px] sm:max-w-xs md:max-w-sm lg:max-w-md mx-1 sm:mx-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full bg-white/50 backdrop-blur-md border border-white/70 shadow-inner text-slate-800 placeholder-slate-400 px-3 md:px-4 py-1.5 md:py-2.5 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-xs md:text-sm transition-all"
                />
                <Search className="absolute right-3 top-2 md:top-3 text-slate-400 w-3.5 h-3.5 md:w-4 md:h-4 cursor-pointer hover:text-purple-600" />
              </div>
            </div>

            {/* 4. Top Header Action Area */}
            <div className="flex items-center gap-3 md:gap-6 text-slate-800">
              
              {isPending ? (
                <div className="w-5 h-5 rounded-full bg-slate-200 animate-pulse my-auto" />
              ) : session ? (
                <Link
                  href={profileLink}
                  className="flex flex-col items-center hover:text-purple-600 transition-colors group"
                  title={userRole === 'admin' ? 'Admin Dashboard' : 'User Dashboard'}
                >
                  {session?.user?.image ? (
                    <img
                      src={session.user.image}
                      alt="Profile"
                      className="w-5 h-5 md:w-5 md:h-5 rounded-full object-cover ring-1 ring-purple-600 group-hover:scale-110 transition-transform"
                    />
                  ) : (
                    <User className="w-5 h-5 stroke-[1.75] group-hover:scale-110 transition-transform" />
                  )}
                  <span className="text-[11px] font-bold mt-1 hidden md:block">
                    {userRole === 'admin' ? 'Admin' : 'Profile'}
                  </span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="flex flex-col items-center hover:text-purple-600 transition-colors group"
                  title="Login"
                >
                  <LogIn className="w-5 h-5 stroke-[1.75] group-hover:scale-110 transition-transform" />
                  <span className="text-[11px] font-bold mt-1 hidden md:block">Login</span>
                </Link>
              )}

              {/* Desktop Icons */}
              <div className="hidden md:flex items-center space-x-6">
                {/* WhatsApp Link */}
                <a 
                  href={whatsappUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex flex-col items-center hover:text-emerald-600 transition-colors group"
                  title="Chat on WhatsApp"
                >
                  <MessageCircle className="w-5 h-5 stroke-[1.75] group-hover:scale-110 transition-transform text-emerald-600" />
                  <span className="text-[11px] font-bold mt-1">WhatsApp</span>
                </a>

                {/* Dynamic Wishlist */}
                <Link 
                  href={wishlistLink} 
                  className={`flex flex-col items-center hover:text-purple-600 transition-colors group ${
                    pathname === wishlistLink ? 'text-purple-600' : ''
                  }`}
                >
                  <Heart className="w-5 h-5 stroke-[1.75] group-hover:scale-110 transition-transform" />
                  <span className="text-[11px] font-bold mt-1">Wishlist</span>
                </Link>

                {/* Dynamic Bag / Cart */}
                <Link 
                  href={cartLink} 
                  className={`flex flex-col items-center relative hover:text-purple-600 transition-colors group ${
                    pathname === cartLink ? 'text-purple-600' : ''
                  }`}
                >
                  <ShoppingBag className="w-5 h-5 stroke-[1.75] group-hover:scale-110 transition-transform" />
                  <span className="text-[11px] font-bold mt-1">Bag</span>
                  <span className="absolute -top-1 -right-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-md">
                    0
                  </span>
                </Link>
              </div>

            </div>

          </div>

          {/* Mobile Categories Row */}
          <div className="flex md:hidden items-center justify-center space-x-5 sm:space-x-8 py-2 border-t border-white/30 text-[11px] font-bold uppercase tracking-wider overflow-x-auto scrollbar-none">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative py-1 whitespace-nowrap transition-colors ${
                    isActive ? 'text-purple-600' : 'text-slate-800 hover:text-purple-600'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

        </div>
      </header>

      {/* ================= MOBILE BOTTOM NAVIGATION BAR ================= */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-white/70 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] md:hidden z-40 px-6 py-2">
        <div className="flex items-center justify-around text-slate-800">
          
          {/* Mobile WhatsApp Link */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center transition-colors hover:text-emerald-600 text-emerald-600"
          >
            <MessageCircle className="w-5 h-5 stroke-[1.75]" />
            <span className="text-[10px] font-bold mt-0.5">WhatsApp</span>
          </a>

          {/* Mobile Dynamic Wishlist */}
          <Link
            href={wishlistLink}
            className={`flex flex-col items-center transition-colors ${
              pathname === wishlistLink ? 'text-purple-600' : 'hover:text-purple-600'
            }`}
          >
            <Heart className="w-5 h-5 stroke-[1.75]" />
            <span className="text-[10px] font-bold mt-0.5">Wishlist</span>
          </Link>

          {/* Mobile Dynamic Bag / Cart */}
          <Link
            href={cartLink}
            className={`flex flex-col items-center relative transition-colors ${
              pathname === cartLink ? 'text-purple-600' : 'hover:text-purple-600'
            }`}
          >
            <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
            <span className="text-[10px] font-bold mt-0.5">Bag</span>
            <span className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-600 to-blue-500 text-white text-[9px] font-bold rounded-full h-3.5 w-3.5 flex items-center justify-center">
              0
            </span>
          </Link>

          {/* Mobile Dynamic Profile */}
          <Link
            href={profileLink}
            className={`flex flex-col items-center transition-colors ${
              pathname.includes('/profile') || pathname === '/login' ? 'text-purple-600' : 'hover:text-purple-600'
            }`}
          >
            {session ? (
              session?.user?.image ? (
                <img
                  src={session.user.image}
                  alt="Avatar"
                  className="w-5 h-5 rounded-full object-cover ring-1 ring-purple-600"
                />
              ) : (
                <User className="w-5 h-5 stroke-[1.75]" />
              )
            ) : (
              <LogIn className="w-5 h-5 stroke-[1.75]" />
            )}
            <span className="text-[10px] font-bold mt-0.5">
              {session ? (userRole === 'admin' ? 'Admin' : 'Profile') : 'Login'}
            </span>
          </Link>

        </div>
      </div>
    </>
  );
};

export default Navbar;
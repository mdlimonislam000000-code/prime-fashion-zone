'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  User, 
  ShoppingBag, 
  Heart, 
  Settings, 
  LogOut, 
  LayoutDashboard, 
  Package, 
  Users, 
  Menu, 
  X,
  ChevronRight,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import { useSession, signOut } from '@/lib/auth-client';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // BetterAuth থেকে বর্তমান সেশন ও ইউজার তথ্য ফেচ করা
  const { data: session, isPending } = useSession();

  // ইউজার লগইন করা না থাকলে সরাসরি লগইন পেজে পাঠিয়ে দেওয়া
  useEffect(() => {
    if (!isPending && !session) {
      router.push('/login');
    }
  }, [session, isPending, router]);

  const userRole = session?.user?.role;
  const isAdmin = userRole === 'admin';

  // রাউট প্রটেকশন: ইউজার যদি ভুল ড্যাশবোর্ডে ঢোকার চেষ্টা করে তবে তার সঠিক প্রোফাইলে রিডাইরেক্ট করা
  useEffect(() => {
    if (!isPending && session) {
      if (isAdmin && pathname === '/dashboard/user') {
        router.push('/dashboard/admin/profile');
      } else if (!isAdmin && pathname === '/dashboard/admin') {
        router.push('/dashboard/user/profile');
      }
    }
  }, [session, isPending, isAdmin, pathname, router]);

  // Logout Handler
  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/login');
        },
      },
    });
  };

  // Loading state show করা যতক্ষণ সেশন চেক হচ্ছে
  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          <p className="text-xs font-bold text-slate-500">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Admin ও User-এর জন্য আলাদা আলাদা সাইডবার মেনু আইটেম
  const userNavItems = [
    { name: 'Overview', href: '/dashboard/user', icon: LayoutDashboard },
    { name: 'My Profile', href: '/dashboard/user/profile', icon: User },
    { name: 'My Orders', href: '/dashboard/user/my-orders', icon: ShoppingBag },
    { name: 'Wishlist', href: '/dashboard/user/wishlist', icon: Heart },
    { name: 'Cart', href: '/dashboard/user/cart', icon: ShoppingBag },
    { name: 'Settings', href: '/dashboard/user/settings', icon: Settings },
  ];

  const adminNavItems = [
    { name: 'Dashboard', href: '/dashboard/admin', icon: LayoutDashboard },
    { name: 'Admin Profile', href: '/dashboard/admin/profile', icon: User },
    { name: 'Products List', href: '/dashboard/admin/products', icon: Package },
    { name: 'Manage Orders', href: '/dashboard/admin/orders', icon: ShoppingBag },
    { name: 'Customers', href: '/dashboard/admin/users', icon: Users },
    { name: 'Wishlist', href: '/dashboard/admin/wishlist', icon: Users },
    { name: 'Bag', href: '/dashboard/admin/cart', icon: ShoppingBag },
    { name: 'Settings', href: '/dashboard/admin/settings', icon: Settings },
  ];

  const navItems = isAdmin ? adminNavItems : userNavItems;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-64 bg-white/70 backdrop-blur-xl border-r border-slate-200/85 shadow-sm z-50 transition-transform duration-300 flex flex-col justify-between ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Back to Home Button & Mobile Close Button */}
          <div className="flex items-center justify-between px-5 h-16 md:h-20 border-b border-slate-100">
            <Link
              href="/"
              className="flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-purple-600 bg-slate-100/80 hover:bg-purple-50 px-3 py-2 rounded-xl transition-all border border-slate-200/60"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Store</span>
            </Link>

            <button 
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-slate-500 hover:text-purple-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-md shadow-purple-500/20'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-purple-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 stroke-[2]" />
                    <span>{item.name}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-80" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Bottom / Logout */}
        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT AREA ================= */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="h-16 md:h-20 bg-white/60 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-base sm:text-lg font-bold text-slate-800 capitalize">
              {isAdmin ? 'Admin Dashboard' : 'User Dashboard'}
            </h1>
          </div>

          {/* Profile Quick Pill with Dynamic User Info */}
          <div className="flex items-center gap-3 bg-slate-100/80 px-3 py-1.5 rounded-full border border-slate-200/60">
            {session?.user?.image ? (
              <img 
                src={session.user.image} 
                alt="Profile" 
                className="w-7 h-7 rounded-full object-cover shadow-sm border border-white" 
              />
            ) : (
              <div className="w-7 h-7 bg-gradient-to-tr from-purple-600 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm">
                {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
            <span className="text-xs font-bold text-slate-700 hidden sm:inline-block max-w-[120px] truncate">
              {session?.user?.name || (isAdmin ? 'Admin' : 'My Account')}
            </span>
          </div>
        </header>

        {/* Page Body Content */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {children}
        </main>

      </div>

    </div>
  );
}
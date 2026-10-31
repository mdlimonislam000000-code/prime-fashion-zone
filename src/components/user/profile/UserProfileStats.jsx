'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  DollarSign, 
  ArrowRight,
  Loader2 
} from 'lucide-react';
import { useSession } from '@/lib/auth-client';

const UserProfileStats = () => {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    receivedOrders: 0,
    notReceivedOrders: 0,
    totalSpent: 0
  });

  useEffect(() => {
    const fetchUserStats = async () => {
      if (isPending) return;

      try {
        setLoading(true);
        const userId = session?.user?.id || session?.user?._id;

        if (!userId) {
          setLoading(false);
          return;
        }

        // Next.js এর নিজস্ব API রুট কল করা হলো
        const res = await fetch(`/api/orders/my-stats?userId=${userId}`);
        const data = await res.json();

        if (data.success && data.stats) {
          setStats(data.stats);
        }
      } catch (error) {
        console.error("Error fetching user order stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, [session, isPending]);

  if (loading || isPending) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm h-28 flex items-center justify-center animate-pulse">
            <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 font-sans">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
          Order Statistics
        </h3>
        <button 
          onClick={() => router.push('/dashboard/user/my-orders')}
          className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 cursor-pointer transition-colors"
        >
          <span>See All Orders</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div 
          onClick={() => router.push('/dashboard/user/my-orders')}
          className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">Total</span>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Orders</p>
            <h4 className="text-xl font-black text-slate-900 mt-0.5">{stats.totalOrders} Orders</h4>
          </div>
        </div>

        <div 
          onClick={() => router.push('/dashboard/user/my-orders')}
          className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Pending</span>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pending Orders</p>
            <h4 className="text-xl font-black text-slate-900 mt-0.5">{stats.pendingOrders} Orders</h4>
          </div>
        </div>

        <div 
          onClick={() => router.push('/dashboard/user/my-orders')}
          className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Received</span>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Received</p>
            <h4 className="text-xl font-black text-slate-900 mt-0.5">{stats.receivedOrders} Orders</h4>
          </div>
        </div>

        <div 
          onClick={() => router.push('/dashboard/user/my-orders')}
          className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-colors">
              <XCircle className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">Not Yet</span>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Not Received</p>
            <h4 className="text-xl font-black text-slate-900 mt-0.5">{stats.notReceivedOrders} Orders</h4>
          </div>
        </div>

        <div 
          onClick={() => router.push('/dashboard/user/my-orders')}
          className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-3 sm:col-span-2 lg:col-span-1"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Amount</span>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Amount</p>
            <h4 className="text-xl font-black text-slate-900 mt-0.5">৳{stats.totalSpent.toLocaleString()}</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileStats;
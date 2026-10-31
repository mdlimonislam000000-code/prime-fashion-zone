'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { useSession } from '@/lib/auth-client';
import KidsCollectionAdmin from '@/components/admin/nav-item/kids/KidsCollectionAdmin';
import KidsCollectionUser from '@/components/user/nav-item/kids/KidsCollectionUser';

const KidsPage = () => {
  const { data: session, isPending } = useSession();
  const userRole = session?.user?.role;
  const isAdmin = userRole === 'admin';

  // সেশন লোড হওয়া পর্যন্ত লোডার দেখাবে
  if (isPending) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          <p className="text-xs font-bold text-slate-500">Loading kids collection...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {isAdmin ? (
        <KidsCollectionAdmin />
      ) : (
        /* এখানে currentUser হিসেবে session.user পাস করে দেওয়া হলো */
        <KidsCollectionUser currentUser={session?.user} />
      )}
    </div>
  );
};

export default KidsPage;
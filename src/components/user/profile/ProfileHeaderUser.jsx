'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Settings } from 'lucide-react';
import { useSession } from '@/lib/auth-client';

const ProfileHeaderUser = () => {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const userName = session?.user?.name ;
  const userEmail = session?.user?.email ;
  const userImage = session?.user?.image ;

  if (isPending) {
    return (
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center justify-center animate-pulse h-32">
        <div className="text-xs text-slate-400 font-bold">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center justify-between font-sans">
      
      {/* Left Side: Profile Image, Name & Email */}
      <div className="flex items-center gap-4">
        <div>
          {userImage ? (
            <img 
              src={userImage} 
              alt="Profile" 
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-purple-50 shadow-md bg-white" 
            />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-purple-600 to-blue-500 ring-4 ring-purple-50 shadow-md flex items-center justify-center text-white text-2xl font-black">
              {userName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center gap-1.5">
            <h2 className="text-xl font-black text-slate-900">{userName}</h2>
            <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-100" />
          </div>
          <p className="text-xs font-semibold text-slate-400">{userEmail}</p>
        </div>
      </div>

      {/* Right Side: Settings Button with Redirect */}
      <div>
        <button 
          onClick={() => router.push('/dashboard/user/settings')}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-purple-500/20 text-xs font-black transition-all cursor-pointer"
        >
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </button>
      </div>

    </div>
  );
};

export default ProfileHeaderUser;
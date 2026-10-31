'use client';

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Edit3, 
  Camera, 
  Save, 
  X, 
  Loader2 
} from 'lucide-react';
import { useSession } from '@/lib/auth-client';

const UserProfileInfo = () => {
  const { data: session, isPending } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    address: '',
    image: ''
  });

  useEffect(() => {
    if (session?.user) {
      setProfileData({
        name: session.user.name || '',
        email: session.user.email || '',
        phone: session.user.phone || '',
        city: session.user.city || 'Rangpur',
        address: session.user.address || '',
        image: session.user.image || ''
      });
    }
  }, [session]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileData(prev => ({ ...prev, image: imageUrl }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const userId = session?.user?.id || session?.user?._id;

      if (!userId) {
        alert("User ID missing! Please login again.");
        setLoading(false);
        return;
      }

      // Next.js internal API Route call
      const res = await fetch(`/api/users/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          name: profileData.name,
          phone: profileData.phone,
          city: profileData.city,
          address: profileData.address,
          image: profileData.image
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert('Profile updated and saved to Database successfully!');
        setIsEditing(false);
      } else {
        alert(data.message || 'Failed to save profile');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Network error: Could not save to database');
    } finally {
      setLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm h-64 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-purple-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-5 font-sans">
      
      {/* Header with Edit & Cancel Buttons */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-sm font-black text-slate-900">Personal Information</h3>
          <p className="text-xs text-slate-400 mt-0.5">Update your account details and delivery address.</p>
        </div>

        <div>
          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 bg-purple-50 hover:bg-purple-100 text-purple-600 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Cancel</span>
            </button>
          )}
        </div>
      </div>

      {/* Avatar Image Section */}
      <div className="flex items-center gap-4">
        <div className="relative group">
          {profileData.image ? (
            <img 
              src={profileData.image} 
              alt="Profile" 
              className="w-16 h-16 rounded-2xl object-cover border-2 border-purple-100 shadow-sm"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center text-white text-xl font-black shadow-sm">
              {profileData.name ? profileData.name.charAt(0).toUpperCase() : 'U'}
            </div>
          )}

          {isEditing && (
            <label className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-5 h-5" />
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange} 
                className="hidden" 
              />
            </label>
          )}
        </div>

        <div>
          <h4 className="text-sm font-black text-slate-800">{profileData.name || 'User Name'}</h4>
          <p className="text-xs font-medium text-slate-400">{profileData.email || 'user@email.com'}</p>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSave} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
            <div className="relative">
              <input
                type="text"
                name="name"
                disabled={!isEditing}
                value={profileData.name}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-9 pr-3 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-75 transition-all"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                name="email"
                disabled={true}
                value={profileData.email}
                className="w-full bg-slate-100/60 border border-slate-200 rounded-xl py-2.5 pl-9 pr-3 text-xs font-semibold text-slate-500 cursor-not-allowed"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
            <div className="relative">
              <input
                type="text"
                name="phone"
                disabled={!isEditing}
                value={profileData.phone}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-9 pr-3 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-75 transition-all"
              />
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          {/* City / District */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">City / District</label>
            <div className="relative">
              <input
                type="text"
                name="city"
                disabled={!isEditing}
                value={profileData.city}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-9 pr-3 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-75 transition-all"
              />
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          {/* Default Shipping Address */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">Default Shipping Address</label>
            <div className="relative">
              <textarea
                rows="2"
                name="address"
                disabled={!isEditing}
                value={profileData.address}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-9 pr-3 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-75 resize-none transition-all"
              ></textarea>
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

        </div>

        {/* Save Changes Button */}
        {isEditing && (
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-black text-xs px-6 py-2.5 rounded-xl shadow-lg shadow-purple-500/20 cursor-pointer hover:opacity-95 transition-all"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{loading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default UserProfileInfo;
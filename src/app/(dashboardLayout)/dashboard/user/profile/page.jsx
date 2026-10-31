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
  CheckCircle2, 
  X,
  ShoppingBag,
  PackageCheck,
  Award
} from 'lucide-react';
import { useSession } from '@/lib/auth-client';
import TopDiscountSlider from '@/components/user/profile/TopDiscountCard';
import ProfileHeaderUser from '@/components/user/profile/ProfileHeaderUser';
import UserProfileStats from '@/components/user/profile/UserProfileStats';
import UserProfileInfo from '@/components/user/profile/UserProfileInfo';

export default function UserProfile() {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: ''
  });

  useEffect(() => {
    if (session?.user) {
      setProfileData({
        name: session.user.name || 'Abir',
        email: session.user.email || 'abir@gmail.com',
        phone: session.user.phone || '+880 1700-000000',
        address: session.user.address || 'Rangpur, Bangladesh',
        city: 'Rangpur'
      });
    }
  }, [session]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-sans py-4 px-3 sm:px-4">
      
     <div>
      <ProfileHeaderUser />
     </div>

     {/* Stats Bar */}
     <div>
       <UserProfileStats />
     </div>

     {/* Main Grid: Left Side User Data Form & Right Side Top 10 Discount Slider */}
     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
       
       {/* Left Side: User Data & Editable Form (lg:col-span-2 যুক্ত করা হয়েছে) */}
       <div className="lg:col-span-2">
         <UserProfileInfo />
       </div>

       {/* Right Side: Top 10 Discount Slider Component */}
       <div className="lg:col-span-1">
         <TopDiscountSlider />
       </div>

     </div>

    </div>
  );
}
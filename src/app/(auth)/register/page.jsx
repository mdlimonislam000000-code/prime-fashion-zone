"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  LockKeyhole,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  LoaderCircle,
  Sparkles,
  ShieldCheck,
  Camera,
} from "lucide-react";
import { signUp } from "@/lib/auth-client";

export default function Register() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(""); // Image preview & base64 state
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle device image selection and convert to Base64
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      await signUp.email(
        {
          name: name.trim(),
          email: email.trim(),
          password,
          image: image || undefined, // Selected image base64 or URL
        },
        {
          onSuccess: () => {
            router.push("/dashboard/user/profile");
          },
          onError: (ctx) => {
            setError(
              ctx?.error?.message ||
                "Registration failed. Please try again."
            );
          },
        }
      );
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (googleLoading || loading) return;

    setError("");
    setGoogleLoading(true);

    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch {
      setError("Google signup failed. Please try again.");
      setGoogleLoading(false);
    }
  };

  return (
    <main className="relative min-h-[calc(100vh-80px)] w-full flex items-center justify-center overflow-hidden bg-slate-900 font-sans text-slate-900 px-4 py-6">
      
      {/* Background Image with Blur Effect */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=85&w=2200&auto=format&fit=crop"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover blur-[8px] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/75 via-white/50 to-emerald-100/60" />
      </div>

      {/* Main Container Card inside Viewport */}
      <div className="relative z-10 w-full max-w-5xl mx-auto bg-white/85 backdrop-blur-xl border border-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.1)] overflow-hidden p-5 sm:p-8 md:p-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Side: Brand Text & Info (Hidden on Mobile, Visible on Desktop) */}
          <div className="hidden lg:block lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/80 px-3 py-1 text-emerald-900">
              <Sparkles size={13} className="text-emerald-700" />
              <span className="text-[10px] font-extrabold tracking-wider">
                START YOUR JOURNEY WITH US
              </span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-slate-950 leading-tight">
              Create Your <br />
              <span className="bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent">
                PRIMEzone Account.
              </span>
            </h1>

            <p className="text-sm text-slate-600 max-w-md leading-relaxed">
              Join thousands of happy shoppers. Track orders, save wishlists, and enjoy a personalised shopping experience.
            </p>

            {/* Mini Trust Box Graphic */}
            <div className="flex items-center gap-3.5 max-w-xs rounded-2xl bg-white/80 p-3.5 border border-slate-100 shadow-sm">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 shadow-inner">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900">100% Secure & Trusted</h4>
                <p className="text-[10px] text-slate-500">Your personal data is safe with us.</p>
              </div>
            </div>
          </div>

          {/* Right Side: Compact Register Card (Visible on ALL Devices) */}
          <div className="col-span-1 lg:col-span-5 w-full max-w-md mx-auto">
            <div className="w-full bg-white rounded-2xl p-6 shadow-xl border border-slate-100">
              
              <div className="mb-4 text-center">
                <h2 className="text-xl font-black text-slate-950">Create Account</h2>
                <p className="text-[11px] text-slate-500 mt-0.5">Join PRIMEzone to start shopping</p>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="mb-3 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-[11px] font-medium text-red-700 text-center">
                  {error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleRegister} className="space-y-3">
                
                {/* Profile Image Picker Field */}
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 shrink-0 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shadow-inner">
                    {image ? (
                      <img src={image} alt="Avatar Preview" className="h-full w-full object-cover" />
                    ) : (
                      <User size={20} className="text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Profile Picture <span className="text-[10px] text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={loading}
                      className="w-full text-[11px] text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Md Limon Mia"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      disabled={loading}
                      className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs font-medium text-slate-900 outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-600/10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                      className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs font-medium text-slate-900 outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-600/10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Password</label>
                  <div className="relative">
                    <LockKeyhole size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                      className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-9 text-xs font-medium text-slate-900 outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-600/10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-700"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-1 flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 text-xs font-bold text-white shadow-md shadow-emerald-700/20 transition hover:bg-emerald-800 disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <LoaderCircle size={15} className="animate-spin" />
                      <span>Creating account...</span>
                    </>
                  ) : (
                    <>
                      <span>Register</span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </form>

              {/* Login Link */}
              <p className="mt-3 text-center text-[11px] text-slate-500">
                Already have an account?{" "}
                <Link href="/login" className="font-bold text-emerald-700 hover:underline">
                  Sign In
                </Link>
              </p>

              {/* Divider */}
              <div className="my-3 flex items-center gap-2">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-[10px] font-semibold text-slate-400 uppercase">OR</span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              {/* Google Sign Up */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={googleLoading || loading}
                className="flex h-9 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-[11px] font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60 shadow-sm"
              >
                {googleLoading ? (
                  <LoaderCircle size={15} className="animate-spin" />
                ) : (
                  <svg width="15" height="15" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.76 7.18l7.73 6C44.42 38.05 46.98 31.88 46.98 24.55Z" />
                    <path fill="#FBBC05" d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 2.56 10.78l7.97-6.19Z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.15 1.45-4.92 2.3-8.18 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.97 6.19C6.51 42.62 14.62 48 24 48Z" />
                  </svg>
                )}
                <span>Continue with Google</span>
              </button>

            </div>
          </div>

        </div>

      </div>
    </main>
  );
}
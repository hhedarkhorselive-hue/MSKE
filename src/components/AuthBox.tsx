/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import { Ship, Eye, EyeOff, KeyRound, PhoneCall } from "lucide-react";

interface AuthBoxProps {
  onAuthComplete: (phone: string, isNew: boolean, customPassword?: string) => void;
}

export default function AuthBox({ onAuthComplete }: AuthBoxProps) {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [phone, setPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!phone || phone.length < 10) {
      setErrorMessage("দয়া করে সঠি মোবাইল নম্বর সরবরাহ করুন।");
      return;
    }

    if (!password || password.length < 4) {
      setErrorMessage("পাসওয়ার্ডটি ন্যূনতম ৪টি অক্ষরের হতে হবে।");
      return;
    }

    setIsLoading(true);

    // Simulate database lookup latency
    setTimeout(() => {
      setIsLoading(false);
      onAuthComplete(phone, !isLogin, password);
    }, 850);
  };

  return (
    <div id="auth-box" className="min-h-screen flex items-center justify-center p-4 bg-slate-950">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-slate-900 border border-slate-800 p-8 rounded-2xl w-full max-w-sm shadow-2xl relative text-center"
      >
        {/* Holographic glowing backlights */}
        <div className="absolute -top-10 left-12 right-12 h-20 bg-amber-500/10 rounded-full blur-3xl pointers-event-none"></div>

        <div className="flex justify-center mb-5">
          {/* Custom metal logo element from input_file_0.png */}
          <div className="w-16 h-16 bg-gradient-to-tr from-amber-400 to-yellow-600 rounded-2xl flex items-center justify-center rotate-45 shadow-lg shadow-amber-500/10">
            <Ship className="text-slate-950 w-8 h-8 -rotate-45" />
          </div>
        </div>

        <h1 className="text-3xl font-black bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent tracking-widest leading-none">
          MSKE
        </h1>
        <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1.5 mb-6">
          {isLogin ? "SHIPPING INVESTMENT PLATFORM" : "নতুন অ্যাকাউন্ট রেজিস্ট্রেশন"}
        </p>

        {errorMessage && (
          <div className="mb-4 text-xs font-bold bg-red-950/40 border border-red-500/20 text-red-400 p-2.5 rounded-xl">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 uppercase font-bold tracking-wider flex items-center">
              <PhoneCall className="w-3 h-3 text-amber-500 mr-1" />
              Mobile Number
            </label>
            <input 
              type="tel" 
              placeholder="মোবাইল নাম্বার দিন" 
              required 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500 transition-all font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 uppercase font-bold tracking-wider flex items-center justify-between">
              <span className="flex items-center">
                <KeyRound className="w-3 h-3 text-amber-500 mr-1" />
                Password
              </span>
            </label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="অ্যাকাউন্ট পাসওয়ার্ড" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 pr-10 text-xs text-white focus:outline-none focus:border-amber-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 font-black py-3 rounded-xl text-xs shadow-lg hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center ${
              isLoading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? (
              <span className="flex items-center space-x-2">
                <svg className="animate-spin h-4 w-4 text-slate-950" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>প্রসেসিং হচ্ছে...</span>
              </span>
            ) : (
              <span>{isLogin ? "লগইন করুন" : "রেজিস্ট্রেশন করুন"}</span>
            )}
          </button>
        </form>

        <button 
          type="button"
          onClick={() => {
            setIsLogin(!isLogin);
            setErrorMessage("");
          }}
          className="w-full text-center text-[11px] text-amber-500/80 mt-5 hover:text-amber-400 transition-all underline"
        >
          {isLogin ? "নতুন অ্যাকাউন্ট তৈরি করতে রেজিস্ট্রেশন করুন" : "ইতিমধ্যে অ্যাকাউন্ট আছে? লগইন করুন"}
        </button>
      </motion.div>
    </div>
  );
}

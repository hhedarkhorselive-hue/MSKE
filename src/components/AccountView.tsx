/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  User, 
  HelpCircle, 
  PhoneCall, 
  LogOut, 
  CheckCircle, 
  ShieldAlert, 
  Award, 
  CreditCard,
  ArrowLeft,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  AlertCircle,
  ChevronRight,
  Download,
  Lock,
  Globe,
  Check,
  ExternalLink,
  Copy,
  RefreshCw
} from "lucide-react";
import { generateIdAvatar } from "../utils/avatar";
import { WithdrawalRequest } from "../types";
import DepositView from "./DepositView";
import { initAuth, googleSignIn, getAccessToken } from "../utils/auth";
import { User as FirebaseUser } from "firebase/auth";
import { useEffect, useState as reactUseState } from "react";

interface AccountViewProps {
  phone: string;
  uid: string;
  balance: number;
  onWithdraw: (amount: number, method: string, number: string) => void;
  onLogout: () => void;
  withdrawals: WithdrawalRequest[];
  onDepositComplete: (amount: number, trxId: string, gateway: string) => void;
  usedTrx: string[];
  selectedGateway: string;
  onGatewaySelect: (gateway: string) => void;
  onSetTab: (tab: string) => void;
}

export default function AccountView({
  phone,
  uid,
  balance,
  onWithdraw,
  onLogout,
  withdrawals,
  onDepositComplete,
  usedTrx,
  selectedGateway,
  onGatewaySelect,
  onSetTab
}: AccountViewProps) {
  const [activeSubView, setActiveSubView] = useState<"main" | "withdraw">("main");
  const [amount, setAmount] = useState<string>("");
  const [method, setMethod] = useState<string>("bKash");
  const [receiverNumber, setReceiverNumber] = useState<string>("");
  const [errorMessage, setErrorMessage] = reactUseState<string>("");
  const [successMessage, setSuccessMessage] = reactUseState<string>("");
  const [firebaseUser, setFirebaseUser] = reactUseState<FirebaseUser | null>(null);
  const [needsAuth, setNeedsAuth] = reactUseState<boolean>(false);
  
  useEffect(() => {
    return initAuth(
      (user) => {
        setFirebaseUser(user);
        setNeedsAuth(false);
      },
      () => {
        setFirebaseUser(null);
        setNeedsAuth(true);
      }
    );
  }, []);
  
  // Custom interactive animations states
  const [copiedUid, setCopiedUid] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Premium settings states
  const [showPassForm, setShowPassForm] = useState<boolean>(false);
  const [currentPass, setCurrentPass] = useState<string>("");
  const [newPass, setNewPass] = useState<string>("");
  const [passFeedback, setPassFeedback] = useState<string>("");
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [language, setLanguage] = useState<"BN" | "EN">("BN");
  const [showCompanyDetails, setShowCompanyDetails] = useState<boolean>(false);

  // App download simulation logic
  const handleAppDownload = () => {
    if (isDownloading) return;
    setIsDownloading(true);
    setDownloadProgress(2);
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsDownloading(false);
            // Open user's real APK drive file downloand link in a new tab
            window.open("https://drive.google.com/file/d/1gBSSkmWUUeEi-a_-z4qmdSkcCABAYpk5/view?usp=drivesdk", "_blank");
          }, 800);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 12;
      });
    }, 120);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPass || !newPass) {
      setPassFeedback("দয়া করে সবগুলো পাসওয়ার্ড ইনপুট ফিল্ড পূরণ করুন!");
      return;
    }
    setPassFeedback("সফলভাবে সিকিউর পাসওয়ার্ড আপডেট সম্পন্ন হয়েছে!");
    setTimeout(() => {
      setCurrentPass("");
      setNewPass("");
      setPassFeedback("");
      setShowPassForm(false);
    }, 2200);
  };

  const avatarUri = generateIdAvatar(uid);

  // Four custom payment channels matching user specifications
  const paymentGateways = [
    { key: "bKash", name: "bKash", logo: "https://i.postimg.cc/d0pWchyG/images-(16).jpg" },
    { key: "Nagad", name: "Nagad", logo: "https://i.postimg.cc/L4zxG66m/unnamed.jpg" },
    { key: "Upay", name: "Upay", logo: "https://i.postimg.cc/W1f80dSW/unnamed.png" },
    { key: "CellFin", name: "CellFin", logo: "https://i.postimg.cc/NF47FF5y/images-(17).jpg" }
  ];

  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const withdrawAmt = parseFloat(amount);
    if (!withdrawAmt || isNaN(withdrawAmt)) {
      setErrorMessage("দয়া করে সঠিক বা বৈধ সংখ্যা টাইপ করুন।");
      return;
    }

    if (withdrawAmt < 450) {
      setErrorMessage("দুঃখিত, প্ল্যাটফর্ম সিকিউরিটি পলিসি অনুযায়ী সর্বনিম্ন উইথড্রাল সীমা ৪৫০ টাকা!");
      return;
    }

    if (balance < withdrawAmt) {
      setErrorMessage("আপনার ওয়ালেটে পর্যাপ্ত ফ্রি ফান্ড বা ব্যালেন্স নেই!");
      return;
    }

    if (!receiverNumber || receiverNumber.length < 10) {
      setErrorMessage("দয়া করে সঠিক মোবাইল ব্যাংকিং রিসিভার নাম্বার টাইপ করুন!");
      return;
    }

    // Gmail integration
    let token = await getAccessToken();
    if (!token && needsAuth) {
      try {
        const result = await googleSignIn();
        if (!result) {
            setErrorMessage("লগইন বাতিল করা হয়েছে।");
            return;
        }
        token = result.accessToken;
      } catch (err: any) {
        setErrorMessage("গুগল লগইন করতে সমস্যা হয়েছে।");
        return;
      }
    }
    
    if (!token) {
        setErrorMessage("ইমেইল পাঠানোর জন্য অনুমতি প্রয়োজন। অনুগ্রহ করে আবার লগইন করুন।");
        return;
    }

    try {
        const response = await fetch("/api/withdraw-notification", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ number: receiverNumber, amount: withdrawAmt, method })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Email notification failed");
        }
    } catch(err) {
        console.error("Failed to notify admin", err);
        setErrorMessage("উইথড্র রিকোয়েস্ট অ্যাডমিনের কাছে পাঠানো যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।");
        return;
    }

    onWithdraw(withdrawAmt, method, receiverNumber);
    setSuccessMessage(`আপনার উইথড্রাল রিকোয়েস্ট সফলভাবে সাবমিট করা হয়েছে এবং অ্যাডমিনের কাছে ইমেইল পাঠানো হয়েছে। ${method} পেমেন্ট চ্যানেলে টাকা পাঠানো হবে সংশ্লিট অ্যাডমিনের কাছে।`);
    setAmount("");
    setReceiverNumber("");
  };

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        {activeSubView === "main" && (
          <motion.div
            key="profile-main"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4 pb-6 text-zinc-900"
          >
            {/* High-Fidelity Custom Yellow Profile & White Balance UI */}
            <div className="w-full bg-[#f8cc1b] rounded-[24px] overflow-hidden shadow-sm relative text-zinc-900">
              {/* Profile Yellow Section */}
              <div className="p-6 pb-14 text-zinc-900">
                <div className="flex items-center gap-4.5">
                  <div className="w-18 h-18 rounded-full overflow-hidden border-2 border-white/50 flex-shrink-0 shadow-sm">
                    <img 
                      src={avatarUri} 
                      alt="User Avatar" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 text-left">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-[15px] tracking-wide text-zinc-950 uppercase">
                        {phone}
                      </span>
                      <span className="bg-gradient-to-r from-zinc-400 to-zinc-500 text-white font-black text-[9px] px-2 py-0.5 rounded-full inline-flex items-center gap-1 border border-white/40 shadow-sm">
                        ⭐ VIP0
                      </span>
                    </div>
                    
                    {/* Orange UID Capsule with Active Copy Logic */}
                    <div 
                      onClick={() => {
                        navigator.clipboard.writeText(uid);
                        setCopiedUid(true);
                        setTimeout(() => setCopiedUid(false), 2000);
                      }}
                      className="bg-[#fca34d] px-3 py-1 rounded-full text-[11px] font-bold text-white flex items-center gap-1.5 w-fit cursor-pointer active:scale-95 transition-transform hover:brightness-105"
                      title="ইউজার আইডি কপি করুন"
                    >
                      <span className="opacity-90 font-sans">UID</span>
                      <span className="opacity-50">|</span>
                      <span className="font-mono tracking-wider">{uid}</span>
                      {copiedUid ? (
                        <Check className="w-3 h-3 text-emerald-200 animate-pulse" />
                      ) : (
                        <Copy className="w-3 h-3 opacity-90" />
                      )}
                    </div>
                    
                    {/* Simulated and real Last Login Time */}
                    <div className="text-[11px] text-zinc-900/80 font-medium">
                      Last login: {new Date().toISOString().slice(0, 10)} {new Date().toTimeString().slice(0, 5)}
                    </div>
                  </div>
                </div>
              </div>

              {/* White Overlapping Balance Card */}
              <div className="bg-white mx-3.5 mb-3.5 -mt-10 rounded-[20px] p-5 shadow-[0_4px_15px_rgba(0,0,0,0.05)] relative z-10 text-zinc-800">
                <div className="text-zinc-400 text-xs font-bold font-sans tracking-wide uppercase">
                  Total balance
                </div>
                <div className="flex items-center justify-between border-b border-zinc-100 pb-4 mb-4 mt-1.5">
                  <strong className="text-2xl font-black text-zinc-950 tracking-tight font-sans">
                    ৳ {balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </strong>
                  
                  {/* Rotating Refresh Icon */}
                  <button
                    type="button"
                    onClick={() => {
                      if (isRefreshing) return;
                      setIsRefreshing(true);
                      setTimeout(() => {
                        setIsRefreshing(false);
                      }, 1000);
                    }}
                    className="p-1 rounded-full hover:bg-zinc-50 transition-colors cursor-pointer active:scale-90"
                    title="ব্যালেন্স রিফ্রেশ করুন"
                  >
                    <RefreshCw className={`w-4.5 h-4.5 text-zinc-400 hover:text-amber-500 transition-colors ${isRefreshing ? "animate-spin text-amber-500" : ""}`} />
                  </button>
                </div>

                {/* Highly Polished Action Grid for Deposit and Withdraw */}
                <div className="grid grid-cols-2 text-center relative divide-x divide-zinc-100">
                  {/* Deposit trigger */}
                  <div
                    onClick={() => {
                      onSetTab("deposit");
                    }}
                    className="flex flex-col items-center gap-2 cursor-pointer group active:scale-95 transition-transform"
                  >
                    <div className="w-11 h-11 rounded-[14px] bg-[#ffe8d1] flex items-center justify-center shadow-sm group-hover:bg-[#ffd1a7] transition-colors relative">
                      <span className="text-xl">💰</span>
                      {/* CSS absolute orange dynamic marker inside the icon frame */}
                      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-orange-500 animate-ping" />
                    </div>
                    <span className="text-xs font-extrabold text-zinc-800 group-hover:text-amber-600 transition-colors">
                      Deposit / রিচার্জ
                    </span>
                  </div>

                  {/* Withdraw trigger */}
                  <div
                    onClick={() => {
                      setErrorMessage("");
                      setSuccessMessage("");
                      setActiveSubView("withdraw");
                    }}
                    className="flex flex-col items-center gap-2 cursor-pointer group active:scale-95 transition-transform"
                    style={{ borderLeftWidth: '1px' }}
                  >
                    <div className="w-11 h-11 rounded-[14px] bg-[#dbeafe] flex items-center justify-center shadow-sm group-hover:bg-[#b9d7fe] transition-colors relative">
                      <span className="text-xl">💳</span>
                    </div>
                    <span className="text-xs font-extrabold text-zinc-800 group-hover:text-blue-600 transition-colors">
                      Withdraw / উত্তোলন
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* HIGH FIDELITY MEMO OPTIONS LIST & THEMED SETTINGS PANEL SELECTOR */}
            <div className="space-y-2 bg-white/40 p-2 rounded-[32px] border border-white/60">
              <span className="text-[10px] text-zinc-500 font-extrabold tracking-widest uppercase block pl-3 pt-2">
                নিরাপত্তা ও সেটিংস মেনু
              </span>

              {/* Real Options Item List */}
              <div className="space-y-1.5 text-zinc-900">
                {/* 1. Deposit Action Button Option */}
                <div 
                  onClick={() => onSetTab("deposit")}
                  className="bg-white/60 hover:bg-white p-4 rounded-2xl border border-white/60 transition-all duration-200 flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-400/20 flex items-center justify-center border border-amber-400/30 group-hover:scale-105 transition-transform duration-200">
                      <ArrowDownLeft className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <span className="text-[12px] font-extrabold text-zinc-900 block">অনলাইন রিচার্জ যুক্ত করুন</span>
                      <span className="text-[9px] text-zinc-600 block">বিকাশ, নগদ, রকেট, উপায় মাধ্যমে ইনস্ট্যান্ট ডিপোজিট</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-amber-600 transition-colors" />
                </div>

                {/* 2. Withdraw Action Button Option */}
                <div 
                  onClick={() => setActiveSubView("withdraw")}
                  className="bg-white/60 hover:bg-white p-4 rounded-2xl border border-white/60 transition-all duration-200 flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-400/20 flex items-center justify-center border border-emerald-400/30 group-hover:scale-105 transition-transform duration-200">
                      <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <span className="text-[12px] font-extrabold text-zinc-900 block">অর্জনকৃত টাকা উত্তোলন করুন</span>
                      <span className="text-[9px] text-zinc-600 block">সহজ পেমেন্ট গেটওয়েতে প্রফিট উইথড্র রিকোয়েস্ট</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-emerald-600 transition-colors" />
                </div>

                {/* 3. APP DOWNLOAD OPTION with simulated progress */}
                <div 
                  onClick={handleAppDownload}
                  className="bg-white/60 p-4 rounded-2xl border border-white/60 transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3.5">
                      <div className="w-9 h-9 rounded-xl bg-blue-400/20 flex items-center justify-center border border-blue-400/30 group-hover:scale-105 transition-transform duration-200">
                        <Download className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <span className="text-[12px] font-extrabold text-zinc-900 block">এমএসকেএ অফিশিয়াল অ্যাপ (.APK)</span>
                        <span className="text-[9px] text-zinc-600 block">সরাসরি ফোনে দ্রুত ব্যবহারের জন্য অ্যান্ড্রয়েড অ্যাপ</span>
                      </div>
                    </div>
                    {isDownloading ? (
                      <span className="text-[10px] font-black text-amber-700 font-mono">{downloadProgress}%</span>
                    ) : (
                      <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-amber-600 transition-colors" />
                    )}
                  </div>
                  
                  {isDownloading && (
                    <div className="mt-3 w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden border border-zinc-200 relative">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 transition-all duration-250 rounded-full"
                        style={{ width: `${downloadProgress}%` }}
                      ></div>
                    </div>
                  )}
                </div>

                {/* 4. COMPANY PROFILE & ROUTE DETAILS (Toggler Accordion) */}
                <div className="bg-white/60 rounded-2xl border border-white/60 overflow-hidden shadow-sm">
                  <div 
                    onClick={() => setShowCompanyDetails(!showCompanyDetails)}
                    className="p-4 flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center space-x-3.5">
                      <div className="w-9 h-9 rounded-xl bg-purple-400/20 flex items-center justify-center border border-purple-400/30 group-hover:scale-105 transition-transform duration-200">
                        <ShieldCheck className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <span className="text-[12px] font-extrabold text-zinc-900 block">আমাদের কোম্পানির বিবরণ ও লাইসেন্স</span>
                        <span className="text-[9px] text-zinc-600 block">লাইসেন্স নং ও সচল কার্গো জাহাজের রুট ম্যাপ</span>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${showCompanyDetails ? "rotate-90 text-amber-600" : ""}`} />
                  </div>

                  <AnimatePresence>
                    {showCompanyDetails && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-white/60 bg-white/40 text-zinc-700 text-[10px] p-4 space-y-2.5 leading-relaxed"
                      >
                        <p className="font-extrabold text-zinc-900 text-[11px] border-b border-zinc-200 pb-1.5 flex items-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mr-1.5"></span>
                          কোম্পানি নিবন্ধন ও হেডকোয়ার্টার
                        </p>
                        <ul className="space-y-1 pl-1 list-none font-medium">
                          <li>• <strong className="text-zinc-900">নিবন্ধন নম্বর :</strong> MSK-CO-8293-BD</li>
                          <li>• <strong className="text-zinc-900">হেড অদিত :</strong> পান্থপথ, ঢাকা ১২১৫, বাংলাদেশ</li>
                          <li>• <strong className="text-zinc-900">অফিশিয়াল রুট :</strong> চট্টগ্রাম পোর্ট ৩ - পিয়ারা হার্বার - মংলা</li>
                          <li>• <strong className="text-zinc-900">নিরাপত্তা সিস্টেম :</strong> ৩-লেয়ার ডিজিটাল ট্র্যাকিং সিস্টেম</li>
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 5. SECURE PASSWORD CHANGE (Toggler Accordion) */}
                <div className="bg-white/60 rounded-2xl border border-white/60 overflow-hidden shadow-sm">
                  <div 
                    onClick={() => setShowPassForm(!showPassForm)}
                    className="p-4 flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center space-x-3.5">
                      <div className="w-9 h-9 rounded-xl bg-orange-400/20 flex items-center justify-center border border-orange-400/30 group-hover:scale-105 transition-transform duration-200">
                        <Lock className="w-4 h-4 text-orange-600" />
                      </div>
                      <div>
                        <span className="text-[12px] font-extrabold text-zinc-900 block">সিকিউর পাসওয়ার্ড পরিবর্তন সেটিংস</span>
                        <span className="text-[9px] text-zinc-600 block">আপনার একাউন্ট সম্পূর্ণ সুরক্ষিত রাখতে পাসওয়ার্ড পরিবর্তন</span>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${showPassForm ? "rotate-90 text-amber-600" : ""}`} />
                  </div>

                  <AnimatePresence>
                    {showPassForm && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-white/60 bg-white/40 p-4"
                      >
                        <form onSubmit={handlePasswordSubmit} className="space-y-3">
                          {passFeedback && (
                            <div className="text-[11px] font-bold text-amber-900 bg-amber-400/20 p-2 rounded-lg border border-amber-400/30">
                              {passFeedback}
                            </div>
                          )}
                          <div className="space-y-1.5">
                            <input 
                              type="password" 
                              placeholder="বর্তমান পাসওয়ার্ড" 
                              required
                              value={currentPass}
                              onChange={(e) => setCurrentPass(e.target.value)}
                              className="w-full bg-white/50 border border-white/60 rounded-lg p-2.5 text-xs text-zinc-900 font-bold focus:outline-none focus:border-amber-500 placeholder-zinc-500"
                            />
                            <input 
                              type="password" 
                              placeholder="নতুন পাসওয়ার্ড" 
                              required
                              value={newPass}
                              onChange={(e) => setNewPass(e.target.value)}
                              className="w-full bg-white/50 border border-white/60 rounded-lg p-2.5 text-xs text-zinc-900 font-bold focus:outline-none focus:border-amber-500 placeholder-zinc-500"
                            />
                          </div>
                          <button 
                            type="submit"
                            className="bg-gradient-to-r from-amber-400 to-yellow-500 text-zinc-950 text-[10px] font-black px-4 py-2 rounded-xl"
                          >
                            পাসওয়ার্ড আপডেট করুন
                          </button>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 6. TELEGRAM GROUP OPTION */}
                <a 
                  href="https://t.me/mskeshipping"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white/60 p-4 rounded-2xl border border-white/60 transition-all duration-200 flex items-center justify-between cursor-pointer group shadow-sm"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-9 h-9 rounded-xl bg-sky-400/20 flex items-center justify-center border border-sky-400/30 group-hover:scale-105 transition-transform duration-200">
                      <ExternalLink className="w-4 h-4 text-sky-600" />
                    </div>
                    <div>
                      <span className="text-[12px] font-extrabold text-zinc-900 block flex items-center">
                        অফিশিয়াল টেলিগ্রাম গ্রুপ জয়েন করুন
                        <span className="inline-flex w-2 h-2 rounded-full bg-emerald-500 animate-ping ml-1.5"></span>
                      </span>
                      <span className="text-[9px] text-zinc-600 block">সর্বশেষ নোটিশ এবং মেম্বার পেমেন্ট প্রুফ দেখতে যুক্ত হোন</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-amber-600 transition-colors" />
                </a>

                {/* 7. LANGUAGE SELECTION OPTION */}
                <div className="bg-white/60 p-4 rounded-2xl border border-white/60 flex items-center justify-between shadow-sm">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-9 h-9 rounded-xl bg-teal-400/20 flex items-center justify-center border border-teal-400/30">
                      <Globe className="w-4 h-4 text-teal-600" />
                    </div>
                    <div>
                      <span className="text-[12px] font-extrabold text-zinc-900 block">ভাষা পরিবর্তন করুন (Language)</span>
                      <span className="text-[9px] text-zinc-600 block">বর্তমান ভাষা : {language === "BN" ? "বাংলা" : "English"}</span>
                    </div>
                  </div>
                  <div className="flex bg-zinc-200 p-1.5 rounded-xl border border-zinc-100">
                    <button 
                      type="button"
                      onClick={() => setLanguage("BN")}
                      className={`px-3 py-1 text-[9px] font-extrabold rounded-lg transition-all ${language === "BN" ? "bg-amber-500 text-zinc-950" : "text-zinc-600 hover:text-black"}`}
                    >
                      বাংলা
                    </button>
                    <button 
                      type="button"
                      onClick={() => setLanguage("EN")}
                      className={`px-3 py-1 text-[9px] font-extrabold rounded-lg transition-all ${language === "EN" ? "bg-amber-500 text-zinc-950" : "text-zinc-600 hover:text-black"}`}
                    >
                      EN
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Helpline Notice Block */}
            <div className="bg-white/60 border border-white/60 rounded-[28px] p-4 text-center space-y-2 shadow-sm">
              <div className="flex items-center justify-center space-[#0.5rem] space-x-2 text-amber-700">
                <PhoneCall className="w-4 h-4 animate-bounce text-amber-600" />
                <h4 className="font-extrabold text-[11px]">২৪/৭ অফিশিয়াল কাস্টমার কন্ট্যাক্ট ও হেল্পলাইন</h4>
              </div>
              <p className="text-[9px] text-zinc-600 leading-normal">
                এমএসকেএ শিপিং এর যেকোনো তথ্যের জন্য সরাসরি অফিশিয়াল হেল্পলাইন নাম্বারে যোগাযোগ করুন :
              </p>
              <a 
                href="tel:09658988145"
                className="text-amber-700 hover:text-amber-800 font-mono text-[14px] font-black flex items-center justify-center space-x-2 bg-amber-400/20 hover:bg-amber-400/30 p-2.5 rounded-xl border border-amber-400/40 tracking-wider transition-all cursor-pointer active:scale-95 shadow-sm group"
                title="সরাসরি কল করতে ট্যাপ করুন"
              >
                <span className="w-5 h-5 rounded-full bg-amber-400/30 flex items-center justify-center group-hover:bg-amber-400/40 transition-colors">
                  <PhoneCall className="w-3 h-3 text-amber-700 group-hover:scale-110 transition-transform" />
                </span>
                <span>09658988145</span>
              </a>
            </div>

            {/* Simulated past transactions list */}
            {withdrawals.length > 0 && (
              <div className="p-5 bg-white/40 rounded-[32px] border border-white/60 space-y-3 shadow-sm">
                <h4 className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">
                  উইথড্র ট্র্যাকিং ইতিহাস
                </h4>
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {withdrawals.map((w) => (
                    <div key={w.id} className="p-2.5 bg-white/60 rounded-2xl border border-white/60 flex justify-between items-center text-[10px]">
                      <div className="space-y-0.5">
                        <p className="font-bold text-zinc-900">৳ {w.amount.toFixed(2)} ({w.method})</p>
                        <p className="text-[9px] text-zinc-500 font-mono">{w.number}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black ${
                        w.status === "approved" 
                          ? "bg-emerald-400/20 text-emerald-800 border border-emerald-400/30" 
                          : "bg-amber-400/20 text-amber-800 border border-amber-400/30"
                      }`}>
                        {w.status === "approved" ? "APPROVED" : "PENDING"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={onLogout}
              className="w-full text-center text-xs text-rose-600 hover:text-rose-700 pt-2 block transition-colors underline font-bold cursor-pointer"
            >
              অ্যাকাউন্ট থেকে লগআউট করুন
            </button>

          </motion.div>
        )}

        {activeSubView === "withdraw" && (
          <motion.div
            key="profile-withdraw"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* Back to main button */}
            <button
              type="button"
              onClick={() => setActiveSubView("main")}
              className="inline-flex items-center text-slate-400 hover:text-white text-xs font-bold space-x-1.5 py-1"
            >
              <ArrowLeft className="w-4 h-4 text-amber-500" />
              <span>প্রধান প্রোফাইলে ফিরে যান</span>
            </button>

            {/* Secure withdrawal request forms */}
            <div className="bg-white/60 p-6 rounded-[32px] border border-white/60 shadow-sm space-y-4">
              <h3 className="font-black text-xs text-amber-700 uppercase tracking-widest flex items-center border-b border-white/60 pb-2.5">
                <CreditCard className="w-4 h-4 mr-1.5" />
                সিকিউর গেটওয়ে উইথড্রাল রিকোয়েস্ট
              </h3>

              <div className="text-[10px] bg-rose-400/10 border border-rose-400/20 text-rose-800 p-3.5 rounded-xl leading-relaxed space-y-1">
                <div className="flex items-start space-x-1.5">
                  <ShieldAlert className="w-2.5 h-2.5 text-rose-600 shrink-0 mt-0.5" />
                  <p className="font-semibold">
                    * ন্যূনতম উইথড্রাল অথবা ক্লেম প্রফিট <strong className="text-rose-700 font-black">৪৫০ টাকা</strong>। আপনার সাবমিটকৃত বিকাশ, নগদ, উপায় অথবা সেলফিন পার্সোনাল নাম্বারে দ্রুততম সময়ে পেমেন্ট প্রদান করা হয়।
                  </p>
                </div>
              </div>

              {errorMessage && (
                <div className="text-xs bg-red-400/10 border border-red-500/20 text-red-700 p-2.5 rounded-xl font-bold">
                  {errorMessage}
                </div>
              )}

              {successMessage && (
                <div className="text-xs bg-emerald-400/10 border border-emerald-500/20 text-emerald-800 p-2.5 rounded-xl font-bold flex items-center">
                  <CheckCircle className="w-4 h-4 text-emerald-600 mr-2 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              <form onSubmit={handleWithdrawSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 uppercase font-extrabold tracking-wider">
                    Amount (উইথড্র টাকার পরিমাণ)
                  </label>
                  <input
                    type="number"
                    placeholder="সর্বনিম্ন ৪৫০"
                    min="450"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-white/60 border border-white/60 rounded-xl p-3 text-xs text-zinc-900 focus:outline-none focus:border-amber-500 font-bold font-mono placeholder-zinc-500"
                  />
                  <span className="text-[9px] text-zinc-500 block">
                    উইথড্র কাজের জন্য উপলব্ধ মোট ফান্ড: ৳ {balance.toFixed(2)}
                  </span>
                </div>

                {/* Secure Payment Gateway Select with small beautiful logos provided by the user */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-500 uppercase font-extrabold tracking-wider block">
                    Select Channel (পেমেন্ট চ্যানেল সিলেক্ট করুন)
                  </label>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {paymentGateways.map((channel) => {
                      const isSelected = method === channel.key;
                      return (
                        <button
                          key={channel.key}
                          type="button"
                          onClick={() => setMethod(channel.key)}
                          className={`p-2 bg-white/60 border rounded-xl flex items-center justify-between transition-all text-left ${
                            isSelected 
                              ? "border-amber-400 shadow-sm bg-amber-400/10" 
                              : "border-white/60 hover:border-zinc-300"
                          }`}
                        >
                          <span className="text-[11px] font-bold text-zinc-900 ml-1">
                            {channel.name}
                          </span>
                          <img 
                            src={channel.logo} 
                            alt={channel.name} 
                            className="w-7 h-7 rounded-lg object-cover" 
                            referrerPolicy="no-referrer"
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 uppercase font-extrabold tracking-wider">
                    Receiver Mobile No. (রিসিভার মোবাইল নাম্বার)
                  </label>
                  <input
                    type="tel"
                    placeholder="পার্সোনাল নাম্বার দিন"
                    required
                    value={receiverNumber}
                    onChange={(e) => setReceiverNumber(e.target.value)}
                    className="w-full bg-white/60 border border-white/60 rounded-xl p-3 text-xs text-zinc-900 focus:outline-none focus:border-amber-500 font-mono text-center placeholder-zinc-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-tr from-amber-400 to-yellow-500 hover:brightness-110 active:scale-[0.98] text-zinc-950 font-black py-3.5 rounded-xl text-xs shadow-sm transition-all cursor-pointer"
                >
                  উইথড্রাল রিকোয়েস্ট সাবমিট করুন
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

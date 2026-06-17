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
  ExternalLink
} from "lucide-react";
import { generateIdAvatar } from "../utils/avatar";
import { WithdrawalRequest } from "../types";
import DepositView from "./DepositView";

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
  onGatewaySelect
}: AccountViewProps) {
  const [activeSubView, setActiveSubView] = useState<"main" | "deposit" | "withdraw">("main");
  const [amount, setAmount] = useState<string>("");
  const [method, setMethod] = useState<string>("bKash");
  const [receiverNumber, setReceiverNumber] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

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
          }, 1000);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 8;
      });
    }, 180);
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

  const handleWithdrawSubmit = (e: React.FormEvent) => {
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

    onWithdraw(withdrawAmt, method, receiverNumber);
    setSuccessMessage(`আপনার উইথড্রাল রিকোয়েস্ট সফলভাবে সাবমিট করা হয়েছে। ${method} পেমেন্ট চ্যানেলে টাকা পাঠানো হবে।`);
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
            className="space-y-4 pb-6"
          >
            {/* Account Profile Header Card with Premium Cover Art */}
            <div className="relative rounded-[32px] overflow-hidden border border-slate-800/80 shadow-2xl bg-[#020406]/95 backdrop-blur-md">
              {/* Cover Banner Image with elegant depth */}
              <div className="w-full h-36 relative overflow-hidden">
                <img 
                  src="https://i.postimg.cc/mrXB7f5k/1781727535216.png" 
                  alt="MSKE Profile Theme Cover" 
                  className="w-full h-full object-cover brightness-[0.75] contrast-[1.1]"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020406] via-[#020406]/20 to-[#020406]/40"></div>
              </div>

              {/* Profile details container - offset to overlap the brand cover art banner */}
              <div className="px-5 pb-5 -mt-12 relative z-10 flex flex-col items-center text-center space-y-3">
                <div className="relative">
                  {/* Glowing luxury golden halo behind user avatar */}
                  <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 rounded-full blur-[8px] opacity-80 animate-pulse"></div>
                  <div className="relative w-22 h-22 rounded-full overflow-hidden border-4 border-[#020406] bg-[#020406] shadow-2xl flex items-center justify-center p-0.5">
                    <img 
                      src={avatarUri} 
                      alt="Verified User Avatar" 
                      className="w-full h-full object-cover rounded-full" 
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>

                <div className="space-y-1 bg-[#020406]/70 p-3 rounded-2.5xl border border-slate-800/60 backdrop-blur-md shadow-2xl max-w-[260px]">
                  <div className="flex items-center justify-center space-x-2">
                    <h3 id="user-phone" className="font-black text-base text-white tracking-widest font-sans">
                      {phone}
                    </h3>
                    <span className="inline-flex items-center bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-400 text-[9px] font-black px-2 py-0.5 rounded-full border border-amber-500/35 uppercase tracking-widest">
                      <Award className="w-3 h-3 mr-0.5 text-amber-500" />
                      VIP
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-bold flex items-center justify-center space-x-1">
                    <span>ইউজার আইডি:</span>
                    <span id="user-uid" className="font-mono text-amber-400 tracking-wider select-all bg-slate-950/90 px-2 py-0.5 rounded border border-slate-800/80">{uid}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Balance Statistics Card */}
            <div className="bg-[#020406]/90 p-5.5 rounded-[32px] border border-slate-800/80 shadow-xl text-center space-y-4 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-24 h-24 bg-amber-500/[0.03] rounded-full blur-2xl"></div>
              
              <div className="space-y-1 relative">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block font-sans">
                  আপনার অ্যাকাউন্টের মোট ব্যালেন্স
                </span>
                <strong className="text-3xl text-amber-400 tracking-tight font-sans block drop-shadow-[0_2px_15px_rgba(245,158,11,0.25)]">
                  ৳ {balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </strong>
              </div>

              {/* Action Buttons for Deposit & Withdraw integrated explicitly side-by-side */}
              <div className="grid grid-cols-2 gap-4 relative">
                <button
                  type="button"
                  id="action-deposit-view"
                  onClick={() => {
                    setErrorMessage("");
                    setSuccessMessage("");
                    setActiveSubView("deposit");
                  }}
                  className="bg-gradient-to-r from-amber-500/[0.08] to-yellow-500/[0.08] hover:from-amber-500/15 hover:to-yellow-500/15 text-amber-400 border border-amber-500/35 font-extrabold py-3.5 rounded-2xl text-[11px] transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer active:scale-95 shadow-[0_4px_12px_rgba(245,158,11,0.05)]"
                >
                  <ArrowDownLeft className="w-4 h-4 text-amber-400 animate-pulse shrink-0" />
                  <span>ব্যালেন্স ডিপোজিট</span>
                </button>

                <button
                  type="button"
                  id="action-withdraw-view"
                  onClick={() => {
                    setErrorMessage("");
                    setSuccessMessage("");
                    setActiveSubView("withdraw");
                  }}
                  className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:brightness-105 hover:shadow-amber-500/25 text-slate-950 font-black py-3.5 rounded-2xl text-[11px] transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer active:scale-95 shadow-md shadow-amber-500/10 border-none"
                >
                  <ArrowUpRight className="w-4 h-4 text-slate-950 shrink-0" />
                  <span>ফান্ড উইথড্রাল</span>
                </button>
              </div>
            </div>

            {/* HIGH FIDELITY MEMO OPTIONS LIST & THEMED SETTINGS PANEL SELECTOR */}
            <div className="space-y-2 bg-[#020406]/60 p-2 rounded-[32px] border border-slate-800/40">
              <span className="text-[10px] text-slate-500 font-extrabold tracking-widest uppercase block pl-3 pt-2">
                নিরাপত্তা ও সেটিংস মেনু
              </span>

              {/* Real Options Item List */}
              <div className="space-y-1.5">
                {/* 1. Deposit Action Button Option */}
                <div 
                  onClick={() => setActiveSubView("deposit")}
                  className="bg-[#020406]/90 hover:bg-[#05070a]/90 p-4 rounded-2xl border border-slate-800/80 transition-all duration-200 flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 group-hover:scale-105 transition-transform duration-200">
                      <ArrowDownLeft className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                      <span className="text-[12px] font-extrabold text-slate-200 block">অনলাইন রিচার্জ যুক্ত করুন</span>
                      <span className="text-[9px] text-slate-500 block">বিকাশ, নগদ, রকেট, উপায় মাধ্যমে ইনস্ট্যান্ট ডিপোজিট</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-amber-500 transition-colors" />
                </div>

                {/* 2. Withdraw Action Button Option */}
                <div 
                  onClick={() => setActiveSubView("withdraw")}
                  className="bg-[#020406]/90 hover:bg-[#05070a]/90 p-4 rounded-2xl border border-slate-800/80 transition-all duration-200 flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
                      <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <span className="text-[12px] font-extrabold text-slate-200 block">অর্জনকৃত টাকা উত্তোলন করুন</span>
                      <span className="text-[9px] text-slate-500 block">সহজ পেমেন্ট গেটওয়েতে প্রফিট উইথড্র রিকোয়েস্ট</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-500 transition-colors" />
                </div>

                {/* 3. APP DOWNLOAD OPTION with simulated progress */}
                <div 
                  onClick={handleAppDownload}
                  className="bg-[#020406]/90 p-4 rounded-2xl border border-slate-800/80 transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3.5">
                      <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:scale-105 transition-transform duration-200">
                        <Download className="w-4 h-4 text-blue-400" />
                      </div>
                      <div>
                        <span className="text-[12px] font-extrabold text-slate-200 block">এমএসকেএ অফিশিয়াল অ্যাপ (.APK)</span>
                        <span className="text-[9px] text-slate-500 block">সরাসরি ফোনে দ্রুত ব্যবহারের জন্য অ্যান্ড্রয়েড অ্যাপ</span>
                      </div>
                    </div>
                    {isDownloading ? (
                      <span className="text-[10px] font-black text-amber-400 font-mono">{downloadProgress}%</span>
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-amber-500 transition-colors" />
                    )}
                  </div>
                  
                  {isDownloading && (
                    <div className="mt-3 w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800 relative">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-250 rounded-full"
                        style={{ width: `${downloadProgress}%` }}
                      ></div>
                    </div>
                  )}
                </div>

                {/* 4. COMPANY PROFILE & ROUTE DETAILS (Toggler Accordion) */}
                <div className="bg-[#020406]/90 rounded-2xl border border-slate-800/80 overflow-hidden">
                  <div 
                    onClick={() => setShowCompanyDetails(!showCompanyDetails)}
                    className="p-4 flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center space-x-3.5">
                      <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 group-hover:scale-105 transition-transform duration-200">
                        <ShieldCheck className="w-4 h-4 text-purple-400" />
                      </div>
                      <div>
                        <span className="text-[12px] font-extrabold text-slate-200 block">আমাদের কোম্পানির বিবরণ ও লাইসেন্স</span>
                        <span className="text-[9px] text-slate-500 block">লাইসেন্স নং ও সচল কার্গো জাহাজের রুট ম্যাপ</span>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 text-slate-600 transition-transform duration-200 ${showCompanyDetails ? "rotate-90 text-amber-500" : ""}`} />
                  </div>

                  <AnimatePresence>
                    {showCompanyDetails && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-slate-900 bg-slate-950/60 text-slate-400 text-[10px] p-4 space-y-2.5 leading-relaxed"
                      >
                        <p className="font-extrabold text-slate-200 text-[11px] border-b border-slate-900 pb-1.5 flex items-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></span>
                          কোম্পানি নিবন্ধন ও হেডকোয়ার্টার
                        </p>
                        <ul className="space-y-1 pl-1 list-none font-medium">
                          <li>• <strong className="text-slate-300">নিবন্ধন নম্বর :</strong> MSK-CO-8293-BD</li>
                          <li>• <strong className="text-slate-300">হেড অদিত :</strong> পান্থপথ, ঢাকা ১২১৫, বাংলাদেশ</li>
                          <li>• <strong className="text-slate-300">অফিশিয়াল রুট :</strong> চট্টগ্রাম পোর্ট ৩ - পিয়ারা হার্বার - মংলা</li>
                          <li>• <strong className="text-slate-300">নিরাপত্তা সিস্টেম :</strong> ৩-লেয়ার ডিজিটাল ট্র্যাকিং সিস্টেম</li>
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 5. SECURE PASSWORD CHANGE (Toggler Accordion) */}
                <div className="bg-[#020406]/90 rounded-2xl border border-slate-800/80 overflow-hidden">
                  <div 
                    onClick={() => setShowPassForm(!showPassForm)}
                    className="p-4 flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center space-x-3.5">
                      <div className="w-9 h-9 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20 group-hover:scale-105 transition-transform duration-200">
                        <Lock className="w-4 h-4 text-orange-400" />
                      </div>
                      <div>
                        <span className="text-[12px] font-extrabold text-slate-200 block">সিকিউর পাসওয়ার্ড পরিবর্তন সেটিংস</span>
                        <span className="text-[9px] text-slate-500 block">আপনার একাউন্ট সম্পূর্ণ সুরক্ষিত রাখতে পাসওয়ার্ড পরিবর্তন</span>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 text-slate-600 transition-transform duration-200 ${showPassForm ? "rotate-90 text-amber-500" : ""}`} />
                  </div>

                  <AnimatePresence>
                    {showPassForm && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-slate-900 bg-slate-950/80 p-4"
                      >
                        <form onSubmit={handlePasswordSubmit} className="space-y-3">
                          {passFeedback && (
                            <div className="text-[11px] font-bold text-amber-400 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
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
                              className="w-full bg-[#020406] border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 font-bold focus:outline-none focus:border-amber-500"
                            />
                            <input 
                              type="password" 
                              placeholder="নতুন পাসওয়ার্ড" 
                              required
                              value={newPass}
                              onChange={(e) => setNewPass(e.target.value)}
                              className="w-full bg-[#020406] border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 font-bold focus:outline-none focus:border-amber-500"
                            />
                          </div>
                          <button 
                            type="submit"
                            className="bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 text-[10px] font-black px-4 py-2 rounded-xl"
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
                  className="bg-[#020406]/90 p-4 rounded-2xl border border-slate-800/80 transition-all duration-200 flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-9 h-9 rounded-xl bg-sky-500/10 flex items-center justify-center border border-sky-500/20 group-hover:scale-105 transition-transform duration-200">
                      <ExternalLink className="w-4 h-4 text-sky-400" />
                    </div>
                    <div>
                      <span className="text-[12px] font-extrabold text-slate-200 block flex items-center">
                        অফিশিয়াল টেলিগ্রাম গ্রুপ জয়েন করুন
                        <span className="inline-flex w-2 h-2 rounded-full bg-emerald-500 animate-ping ml-1.5"></span>
                      </span>
                      <span className="text-[9px] text-slate-500 block">সর্বশেষ নোটিশ এবং মেম্বার পেমেন্ট প্রুফ দেখতে যুক্ত হোন</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-amber-500 transition-colors" />
                </a>

                {/* 7. LANGUAGE SELECTION OPTION */}
                <div className="bg-[#020406]/90 p-4 rounded-2xl border border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-9 h-9 rounded-xl bg-teal-500/10 flex items-center justify-center border border-teal-500/20">
                      <Globe className="w-4 h-4 text-teal-400" />
                    </div>
                    <div>
                      <span className="text-[12px] font-extrabold text-slate-200 block">ভাষা পরিবর্তন করুন (Language)</span>
                      <span className="text-[9px] text-slate-500 block">বর্তমান ভাষা : {language === "BN" ? "বাংলা" : "English"}</span>
                    </div>
                  </div>
                  <div className="flex bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                    <button 
                      type="button"
                      onClick={() => setLanguage("BN")}
                      className={`px-3 py-1 text-[9px] font-extrabold rounded-lg transition-all ${language === "BN" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"}`}
                    >
                      বাংলা
                    </button>
                    <button 
                      type="button"
                      onClick={() => setLanguage("EN")}
                      className={`px-3 py-1 text-[9px] font-extrabold rounded-lg transition-all ${language === "EN" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"}`}
                    >
                      EN
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Helpline Notice Block */}
            <div className="bg-[#05070A]/85 border border-slate-800 rounded-[28px] p-4 text-center space-y-2">
              <div className="flex items-center justify-center space-x-2 text-amber-400">
                <PhoneCall className="w-4 h-4 animate-bounce" />
                <h4 className="font-extrabold text-[11px]">২৪/৭ অফিশিয়াল কাস্টমার কন্ট্যাক্ট ও হেল্পলাইন</h4>
              </div>
              <p className="text-[9px] text-slate-400 leading-normal">
                এমএসকেএ শিপিং এর যেকোনো তথ্যের জন্য সরাসরি অফিশিয়াল হেল্পলাইন নাম্বারে যোগাযোগ করুন :
              </p>
              <span className="text-amber-400 font-mono text-[13px] font-black block bg-slate-900/60 p-2 rounded-xl border border-slate-800 tracking-wider">
                09658988145
              </span>
            </div>

            {/* Simulated past transactions list */}
            {withdrawals.length > 0 && (
              <div className="p-5 bg-slate-900/40 rounded-[32px] border border-slate-800/80 space-y-3">
                <h4 className="text-[10px] text-slate-400 uppercase font-black tracking-widest">
                  উইথড্র ট্র্যাকিং ইতিহাস
                </h4>
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {withdrawals.map((w) => (
                    <div key={w.id} className="p-2.5 bg-[#05070A]/50 rounded-2xl border border-slate-800 flex justify-between items-center text-[10px]">
                      <div className="space-y-0.5">
                        <p className="font-bold text-slate-200">৳ {w.amount.toFixed(2)} ({w.method})</p>
                        <p className="text-[9px] text-slate-500 font-mono">{w.number}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black ${
                        w.status === "approved" 
                          ? "bg-emerald-950/40 text-emerald-400 border border-emerald-500/10" 
                          : "bg-amber-950/40 text-amber-400 border border-amber-500/10"
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
              className="w-full text-center text-xs text-rose-500 hover:text-rose-400 pt-2 block transition-colors underline font-bold cursor-pointer"
            >
              অ্যাকাউন্ট থেকে লগআউট করুন
            </button>
          </motion.div>
        )}

        {activeSubView === "deposit" && (
          <motion.div
            key="profile-deposit"
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

            {/* Render the core DepositView internally inside Profile tab */}
            <DepositView 
              balance={balance}
              selectedGateway={selectedGateway}
              onGatewaySelect={onGatewaySelect}
              onDepositComplete={onDepositComplete}
              usedTrx={usedTrx}
            />
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
            <div className="bg-slate-900/40 p-6 rounded-[32px] border border-slate-800 shadow-xl space-y-4">
              <h3 className="font-black text-xs text-amber-400 uppercase tracking-widest flex items-center border-b border-slate-800 pb-2.5">
                <CreditCard className="w-4 h-4 mr-1.5" />
                সিকিউর গেটওয়ে উইথড্রাল রিকোয়েস্ট
              </h3>

              <div className="text-[10px] bg-rose-950/20 border border-slate-800/80 text-rose-300 p-3.5 rounded-xl leading-relaxed space-y-1">
                <div className="flex items-start space-x-1.5">
                  <ShieldAlert className="w-2.5 h-2.5 text-rose-400 shrink-0 mt-0.5" />
                  <p className="font-semibold">
                    * ন্যূনতম উইথড্রাল অথবা ক্লেম প্রফিট <strong className="text-rose-400 font-black">৪৫০ টাকা</strong>। আপনার সাবমিটকৃত বিকাশ, নগদ, উপায় অথবা সেলফিন পার্সোনাল নাম্বারে দ্রুততম সময়ে পেমেন্ট প্রদান করা হয়।
                  </p>
                </div>
              </div>

              {errorMessage && (
                <div className="text-xs bg-red-950/20 border border-red-500/20 text-red-400 p-2.5 rounded-xl font-bold">
                  {errorMessage}
                </div>
              )}

              {successMessage && (
                <div className="text-xs bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 p-2.5 rounded-xl font-bold flex items-center">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mr-2 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              <form onSubmit={handleWithdrawSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider">
                    Amount (উইথড্র টাকার পরিমাণ)
                  </label>
                  <input
                    type="number"
                    placeholder="সর্বনিম্ন ৪৫০"
                    min="450"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-bold font-mono"
                  />
                  <span className="text-[9px] text-slate-500 block">
                    উইথড্র কাজের জন্য উপলব্ধ মোট ফান্ড: ৳ {balance.toFixed(2)}
                  </span>
                </div>

                {/* Secure Payment Gateway Select with small beautiful logos provided by the user */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider block">
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
                          className={`p-2 bg-[#05070A]/60 border rounded-xl flex items-center justify-between transition-all text-left ${
                            isSelected 
                              ? "border-amber-500 shadow-md bg-amber-500/5" 
                              : "border-slate-800 hover:border-slate-700"
                          }`}
                        >
                          <span className="text-[11px] font-bold text-slate-200 ml-1">
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
                  <label className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider">
                    Receiver Mobile No. (রিসিভার মোবাইল নাম্বার)
                  </label>
                  <input
                    type="tel"
                    placeholder="পার্সোনাল নাম্বার দিন"
                    required
                    value={receiverNumber}
                    onChange={(e) => setReceiverNumber(e.target.value)}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono text-center"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-tr from-amber-500 to-yellow-600 hover:brightness-110 active:scale-[0.98] text-black font-black py-3.5 rounded-xl text-xs shadow-lg shadow-amber-500/15 transition-all cursor-pointer"
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

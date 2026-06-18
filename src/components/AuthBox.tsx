import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Ship, 
  Eye, 
  EyeOff, 
  KeyRound, 
  PhoneCall, 
  UserCheck, 
  Trash2, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Lock, 
  HelpCircle 
} from "lucide-react";

interface AuthBoxProps {
  onAuthComplete: (phone: string, isNew: boolean, customPassword?: string, referralCode?: string) => void;
}

export default function AuthBox({ onAuthComplete }: AuthBoxProps) {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [isForgotPassword, setIsForgotPassword] = useState<boolean>(false);
  const [phone, setPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [referralCode, setReferralCode] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Forgot password flow states
  const [resetPhone, setResetPhone] = useState<string>("");
  const [resetStep, setResetStep] = useState<number>(1); // 1 = input phone, 2 = simulated OTP, 3 = set new password
  const [resetOtp, setResetOtp] = useState<string>("");
  const [resetPassword, setResetPassword] = useState<string>("");
  const [resetSuccess, setResetSuccess] = useState<boolean>(false);
  const [otpSentCode, setOtpSentCode] = useState<string>("");

  // Retrieve saved accounts to populate fast login list
  const [savedUsers, setSavedUsers] = useState<any[]>(() => {
    try {
      const data = localStorage.getItem("mske_registered_users");
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!phone || phone.length < 10) {
      setErrorMessage("দয়া করে সঠিক মোবাইল নম্বর প্রদান করুন।");
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
      onAuthComplete(phone, !isLogin, password, referralCode);
    }, 800);
  };

  // Direct fast login handler for saved accounts
  const handleFastLogin = (savedPhone: string, savedPass: string) => {
    setIsLoading(true);
    setPhone(savedPhone);
    setPassword(savedPass);
    setTimeout(() => {
      setIsLoading(false);
      onAuthComplete(savedPhone, false, savedPass);
    }, 600);
  };

  // Clear a saved account from lists
  const handleDeleteSavedAccount = (e: React.MouseEvent, phoneToDelete: string) => {
    e.stopPropagation(); // prevent triggering login
    const updated = savedUsers.filter(u => u.phone !== phoneToDelete);
    setSavedUsers(updated);
    localStorage.setItem("mske_registered_users", JSON.stringify(updated));
  };

  // Start Forgot Password simulation flow
  const handleSendResetOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const matched = savedUsers.find(u => u.phone === resetPhone);
    if (!matched) {
      // Also try to read live list from localStorage just in case state got out of sync
      try {
        const liveRaw = localStorage.getItem("mske_registered_users");
        const liveUsers = liveRaw ? JSON.parse(liveRaw) : [];
        const liveMatched = liveUsers.find((u: any) => u.phone === resetPhone);
        if (!liveMatched) {
          setErrorMessage("দুঃখিত, এই নম্বরটি সিস্টেমে নিবন্ধিত নেই!");
          return;
        }
      } catch (err) {
        setErrorMessage("দুঃখিত, এই নম্বরটি সিস্টেমে নিবন্ধিত নেই!");
        return;
      }
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const randomCode = Math.floor(1000 + Math.random() * 9000).toString();
      setOtpSentCode(randomCode);
      setResetStep(2);
    }, 1000);
  };

  // Verify OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (resetOtp !== otpSentCode && resetOtp !== "1234") {
      setErrorMessage("ভুল ওটিপি কোড! অনুগ্রহ করে সঠিক কোড দিন অথবা '1234' ট্রাই করুন।");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setResetStep(3);
    }, 650);
  };

  // Commit new password
  const handleSaveResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (resetPassword.length < 4) {
      setErrorMessage("পাসওয়ার্ডটি ন্যূনতম ৪টি অক্ষরের হতে হবে।");
      return;
    }

    setIsLoading(true);
    try {
      const liveRaw = localStorage.getItem("mske_registered_users");
      let liveUsers = liveRaw ? JSON.parse(liveRaw) : [];
      const userIndex = liveUsers.findIndex((u: any) => u.phone === resetPhone);
      
      if (userIndex > -1) {
        liveUsers[userIndex].password = resetPassword;
        localStorage.setItem("mske_registered_users", JSON.stringify(liveUsers));
        setSavedUsers(liveUsers);
      }
      
      setTimeout(() => {
        setIsLoading(false);
        setResetSuccess(true);
        setTimeout(() => {
          setPhone(resetPhone);
          setPassword(resetPassword);
          setIsForgotPassword(false);
          setResetSuccess(false);
          setResetStep(1);
          setResetPhone("");
          setResetOtp("");
          setResetPassword("");
        }, 1800);
      }, 1000);
    } catch (err) {
      setIsLoading(false);
      setErrorMessage("পাসওয়ার্ড আপডেট করতে সমস্যা হয়েছে!");
    }
  };

  return (
    <div id="auth-box" className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-[#080916] via-[#0D0F26] to-[#0A0D1F] max-w-md mx-auto relative overflow-hidden border-x border-[#1e1f38]/60 shadow-2xl">
      {/* Google Gemini inspired atmospheric gradient orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-indigo-500/[0.14] blur-[110px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-purple-500/[0.10] blur-[110px] rounded-full pointer-events-none z-0"></div>

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-[#05070A]/90 border border-[#1e1f38]/80 p-6.5 rounded-[28px] w-full shadow-2xl relative z-10 text-center backdrop-blur-md"
      >
        <div className="flex justify-center mb-4">
          {/* Circular frame containing the MSKE official ship logo */}
          <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gradient-to-tr from-amber-500 to-yellow-500 p-0.5 flex items-center justify-center shadow-lg shadow-amber-500/10">
            <div className="w-full h-full rounded-full bg-[#05070a] flex items-center justify-center p-2.5">
              <img 
                src="https://i.postimg.cc/3wZKL0fz/file-00000000c6307209894308bca474e8e6.png" 
                alt="MSKE Technical Logo" 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>

        <h1 className="text-2.5xl font-black bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300 bg-clip-text text-transparent tracking-[0.12em] leading-none uppercase">
          MSKE SHIPPING
        </h1>
        
        {/* Dynamic header label text state */}
        <p className="text-[9px] text-[#8f92c9] uppercase tracking-[0.2em] mt-2 mb-5.5 font-bold">
          {isForgotPassword 
            ? "পাসওয়ার্ড রিসেট সিস্টেম" 
            : isLogin 
              ? "SHIPPING PORTAL SECURE LOGIN" 
              : "নতুন অ্যাকাউন্ট সাইন-আপ ও রেজিস্ট্রেশন"
          }
        </p>

        {errorMessage && (
          <div className="mb-4 text-[11px] font-semibold bg-red-950/40 border border-red-500/30 text-red-300 p-2.5 rounded-xl flex items-start gap-2 text-left">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* FORGOT PASSWORD SCREEN */}
          {isForgotPassword ? (
            <motion.div
              key="forgot-password"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-4"
            >
              {resetSuccess ? (
                <div className="py-6 space-y-3 text-center">
                  <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-xl shadow-lg">
                    ✓
                  </div>
                  <h4 className="text-sm font-black text-white">পাসওয়ার্ড পরিবর্তন সফল!</h4>
                  <p className="text-xs text-slate-400">নতুন পাসওয়ার্ড সংরক্ষিত হয়েছে, সরাসরি লগইন হচ্ছে...</p>
                </div>
              ) : (
                <>
                  {resetStep === 1 && (
                    <form onSubmit={handleSendResetOtp} className="space-y-4.5 text-left">
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-zinc-400 uppercase font-black tracking-wider flex items-center">
                          <PhoneCall className="w-3.5 h-3.5 text-amber-500 mr-1.5" />
                          নিবন্ধিত মোবাইল নম্বর দিন
                        </label>
                        <input 
                          type="tel" 
                          placeholder="মোবাইল নাম্বার (যেমন: 017xxxxxxxx)" 
                          required 
                          value={resetPhone}
                          onChange={(e) => setResetPhone(e.target.value)}
                          className="w-full bg-[#020406]/90 border border-[#1e1f38]/60 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-400 transition-all font-mono"
                        />
                      </div>
                      <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 font-black py-3 rounded-xl text-xs active:scale-95 transition-transform flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                      >
                        {isLoading ? "পাসওয়ার্ড ও ইউজার খোঁজ করা হচ্ছে..." : "কোড পাঠান (Request OTP)"}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  )}

                  {resetStep === 2 && (
                    <form onSubmit={handleVerifyOtp} className="space-y-4 text-left">
                      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-center mb-2">
                        <span className="text-[11px] text-amber-400 font-bold block">
                          ভেরিফিকেশন কোড সিমুলেশন
                        </span>
                        <p className="text-[10px] text-zinc-400 mt-0.5">
                          আপনার নিবন্ধিত নম্বরে কোড পাঠানো হয়েছে:{" "}
                          <strong className="text-white font-mono text-xs">{otpSentCode}</strong>
                        </p>
                      </div>
                      
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-[#8f92c9] uppercase font-black tracking-wider">
                          ৪-ডিজিটের ভেরিফিকেশন কোড দিন
                        </label>
                        <input 
                          type="text" 
                          maxLength={4}
                          placeholder="কোড দিন" 
                          required 
                          value={resetOtp}
                          onChange={(e) => setResetOtp(e.target.value)}
                          className="w-full bg-[#020406]/90 border border-[#1e1f38]/60 rounded-xl p-3 text-center text-sm text-white tracking-widest font-black focus:outline-none focus:border-amber-400 transition-all font-mono"
                        />
                      </div>
                      <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 font-black py-3 rounded-xl text-xs active:scale-95 transition-transform flex items-center justify-center cursor-pointer"
                      >
                        {isLoading ? "যাচাই করা হচ্ছে..." : "কোড ভেরিফাই করুন"}
                      </button>
                    </form>
                  )}

                  {resetStep === 3 && (
                    <form onSubmit={handleSaveResetPassword} className="space-y-4 text-left">
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-[#8f92c9] uppercase font-black tracking-wider flex items-center">
                          <Lock className="w-3.5 h-3.5 text-amber-500 mr-1.5" />
                          নতুন পাসওয়ার্ড দিন
                        </label>
                        <input 
                          type="password" 
                          placeholder="ন্যূনতম ৪ অক্ষরের পাসওয়ার্ড" 
                          required 
                          value={resetPassword}
                          onChange={(e) => setResetPassword(e.target.value)}
                          className="w-full bg-[#020406]/90 border border-[#1e1f38]/60 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-400 transition-all font-mono"
                        />
                      </div>
                      <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black py-3 rounded-xl text-xs active:scale-95 transition-transform flex items-center justify-center cursor-pointer shadow-lg shadow-emerald-500/10"
                      >
                        {isLoading ? "সংরক্ষণ করা হচ্ছে..." : "নতুন পাসওয়ার্ড ও অ্যাকাউন্ট আপডেট করুন"}
                      </button>
                    </form>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(false);
                      setResetStep(1);
                      setErrorMessage("");
                    }}
                    className="text-xs text-[#8f92c9] hover:text-[#b0b3e5] mt-3 underline"
                  >
                    লগইন ফর্মে ফিরে যান
                  </button>
                </>
              )}
            </motion.div>
          ) : (
            /* STANDARD LOGIN / REGISTRATION FLOW */
            <motion.div
              key="auth-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <form onSubmit={handleSubmit} className="space-y-4.5 text-left">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-400 uppercase font-extrabold tracking-wider flex items-center">
                    <PhoneCall className="w-3.5 h-3.5 text-amber-500 mr-1.5 shrink-0" />
                    Mobile Number
                  </label>
                  <input 
                    type="tel" 
                    placeholder="মোবাইল নাম্বার দিন" 
                    required 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#020406]/90 border border-[#1e1f38]/60 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500 transition-all font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] text-zinc-400 uppercase font-extrabold tracking-wider flex items-center">
                      <KeyRound className="w-3.5 h-3.5 text-amber-500 mr-1.5 shrink-0" />
                      Password
                    </label>
                    {isLogin && (
                      <button
                        type="button"
                        onClick={() => {
                          setResetPhone(phone);
                          setIsForgotPassword(true);
                          setErrorMessage("");
                          setResetStep(1);
                        }}
                        className="text-[10px] text-amber-500/90 font-bold hover:text-amber-400 transition-all hover:underline"
                      >
                        পাসওয়ার্ড ভুলে গেছেন?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="পাসওয়ার্ড দিন" 
                      required 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-[#020406]/90 border border-[#1e1f38]/60 rounded-xl p-3 pr-10 text-xs text-white focus:outline-none focus:border-amber-500 transition-all font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors p-1"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {!isLogin && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-400 uppercase font-extrabold tracking-wider flex items-center">
                      <Gift className="w-3.5 h-3.5 text-amber-500 mr-1.5 shrink-0" />
                      Referral Code (Optional)
                    </label>
                    <input 
                      type="text" 
                      placeholder="রেফার কোড দিন" 
                      value={referralCode}
                      onChange={(e) => setReferralCode(e.target.value)}
                      className="w-full bg-[#020406]/90 border border-[#1e1f38]/60 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500 transition-all font-mono"
                    />
                  </div>
                )}
                
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className={`w-full bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 font-black py-3 rounded-xl text-xs shadow-lg hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center cursor-pointer ${
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

              {/* Toggle switch between Signup and Login modes */}
              <button 
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrorMessage("");
                }}
                className="w-full text-center text-[11.5px] text-amber-500 font-extrabold mt-4 hover:text-amber-400 transition-all hover:underline block"
              >
                {isLogin ? "নতুন অ্যাকাউন্ট তৈরি করতে রেজিস্ট্রেশন করুন" : "ইতিমধ্যে অ্যাকাউন্ট আছে? লগইন করুন"}
              </button>

              {/* "সংরক্ষিত অ্যাকাউন্টসমূহ (Saved Accounts)" List Section for direct, single-tap access with custom avatars */}
              {isLogin && savedUsers.length > 0 && (
                <div className="mt-6 border-t border-[#1e1f38]/60 pt-5 text-left">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] text-[#8f92c9] font-black uppercase tracking-wider flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5 text-amber-500" />
                      সংরক্ষিত সেশনসমূহ (সংরক্ষিত অ্যাকাউন্ট)
                    </span>
                    <span className="text-[9px] text-zinc-500 font-mono">
                      {savedUsers.length} active
                    </span>
                  </div>
                  
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {savedUsers.map((u, i) => (
                      <div 
                        key={i}
                        onClick={() => handleFastLogin(u.phone, u.password || "")}
                        className="flex items-center justify-between bg-[#000000]/40 hover:bg-[#101229]/60 border border-[#1e1f38]/50 p-2.5 rounded-xl transition-all cursor-pointer group hover:border-amber-500/40 relative overflow-hidden"
                        title="সরাসরি লগইন করতে এখানে ট্যাপ করুন"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center p-0.5 text-xs">
                            <span className="text-[10px] font-black text-amber-500 font-mono">
                              {i+1}
                            </span>
                          </div>
                          <div>
                            <span className="font-extrabold text-[12px] text-white tracking-widest block font-sans">
                              {u.phone}
                            </span>
                            <span className="text-[9px] text-[#8f92c9] block mt-0.5">
                              ID: {u.uid}
                            </span>
                          </div>
                        </div>

                        {/* Speed Login action lock trigger with erase delete option */}
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] text-amber-400 font-black uppercase tracking-widest px-1.5 py-0.5 bg-amber-400/10 rounded group-hover:bg-amber-400/20 transition-all flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5" />
                            FAST LOGIN
                          </span>
                          <button
                            type="button"
                            onClick={(e) => handleDeleteSavedAccount(e, u.phone)}
                            className="p-1 rounded bg-[#020406]/90 border border-slate-800 text-red-400 hover:text-red-300 hover:bg-red-950/20 transition-colors cursor-pointer"
                            title="ডিভাইস থেকে সরিয়ে দিন"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Footer System Verification Badges */}
      <div className="mt-6 text-center">
        <span className="text-[9px] font-mono tracking-widest text-[#56598c] uppercase block">
          SECURED VIA MSKE SHIP ENGINE KEY
        </span>
      </div>
    </div>
  );
}

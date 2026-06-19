/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Compass, Coins, Sparkles, Users, User, ShieldAlert, Bot, HelpCircle, Anchor, Ship, Gift } from "lucide-react";
import { doc, getDoc, setDoc, updateDoc, increment, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "./lib/firebase";

import { UserSession, WithdrawalRequest, DepositRequest } from "./types";
import SetupModal from "./components/SetupModal";
import AuthBox from "./components/AuthBox";
import Header from "./components/Header";
import HomeView from "./components/HomeView";
import DepositView from "./components/DepositView";
import ClaimView from "./components/ClaimView";
import ReferView from "./components/ReferView";
import AccountView from "./components/AccountView";
import SupportView from "./components/SupportView";

function generateAlphanumericId(): string {
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  
  // Guarantee presence of capitals, small letters, and numbers matching user specs
  let uid = "MEMBER";
  
  for (let i = 0; i < 4; i++) {
    uid += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
    uid += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
  }
  uid += numbers.charAt(Math.floor(Math.random() * numbers.length));
  
  return uid;
}

export default function App() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [tab, setTab] = useState<string>("home");
  const [globalBanner, setGlobalBanner] = useState<string>("");
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [splashProgress, setSplashProgress] = useState<number>(0);
  const [showBonusModal, setShowBonusModal] = useState<boolean>(false);

  // Splash countdown simulated loading progress timer
  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      // smooth and erratic loading speed mimicking real systems check
      current += Math.floor(Math.random() * 11) + 4;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setTimeout(() => {
          setShowSplash(false);
        }, 350); // elegant fade delay
      }
      setSplashProgress(current);
    }, 110);
    return () => clearInterval(interval);
  }, []);

  // Retrieve session on boot
  useEffect(() => {
    const saved = localStorage.getItem("mske_shipping_session");
    if (saved) {
      try {
        setSession(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to restore session", e);
      }
    }
  }, []);

  // Sync session changes back to localStorage & update master user registry
  const updateSession = (updated: UserSession | null) => {
    setSession(updated);
    if (updated) {
      localStorage.setItem("mske_shipping_session", JSON.stringify(updated));
      // Save or update in master users list so different accounts are persisted
      const registered = localStorage.getItem("mske_registered_users");
      let usersList: any[] = [];
      if (registered) {
        try {
          usersList = JSON.parse(registered);
        } catch (e) {}
      }
      const existingIndex = usersList.findIndex((u: any) => u.phone === updated.phone);
      if (existingIndex > -1) {
        usersList[existingIndex] = updated;
      } else {
        usersList.push(updated);
      }
      localStorage.setItem("mske_registered_users", JSON.stringify(usersList));
    } else {
      localStorage.removeItem("mske_shipping_session");
    }
  };

  // Auth Completed callback supporting distinct users & secure passwords
  const handleAuthComplete = async (phone: string, isNew: boolean, password?: string, referralCode?: string) => {
    const registered = localStorage.getItem("mske_registered_users");
    let usersList: any[] = [];
    if (registered) {
      try {
        usersList = JSON.parse(registered);
      } catch (e) {}
    }

    const matchedUser = usersList.find((u: any) => u.phone === phone);

    if (isNew) {
      if (matchedUser) {
        showBanner("এই মোবাইল নম্বর দিয়ে ইতিমধ্যে অ্যাকাউন্ট খোলা আছে, দয়া করে লগইন করুন!");
        return;
      }

      // Generate a fully unique random ID of caps + letters + numbers
      let randomUid = generateAlphanumericId();
      while (usersList.some((u: any) => u.uid === randomUid)) {
        randomUid = generateAlphanumericId();
      }

      // Generate a unique referral code
      const newReferralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      let referredBy: string | undefined;
      if (referralCode) {
         // Find referee document by referral code in Firestore
         const q = query(collection(db, "users"), where("referralCode", "==", referralCode.toUpperCase()));
         const snapshot = await getDocs(q);
         if (!snapshot.empty) {
             const refereeDoc = snapshot.docs[0];
             referredBy = referralCode;
             // Reward the referrer directly in Firestore
             await updateDoc(refereeDoc.ref, {
                 balance: increment(50.00),
                 referralCount: increment(1)
             });
             showBanner(`আপনার রেফারেল কোডটি সফল হয়েছে!`);
         }
      }

      const newSession: UserSession = {
        phone,
        password,
        balance: 100.00, // Starts off with ৳100 sign up bonus
        uid: randomUid,
        referralCode: newReferralCode,
        referralCount: 0,
        referredBy,
        pack: null,
        lastClaim: "",
        usedTrx: [],
        withdrawals: [],
        depositHistory: [],
        selectedGateway: undefined
      };

      usersList.push(newSession);
      localStorage.setItem("mske_registered_users", JSON.stringify(usersList));
      updateSession(newSession);
      setShowBonusModal(true);
      showBanner(`রেজিস্ট্রেশন সফল! আপনার ওয়ালেটে ৳১০০ জয়েনিং বোনাস জমা করা হয়েছে।`);
    } else {
      if (!matchedUser) {
        showBanner("দুঃখিত, এই নম্বর দিয়ে কোনো অ্যাকাউন্ট পাওয়া যায়নি! দয়া করে নতুন অ্যাকাউন্ট খুলুন।");
        return;
      }
      if (matchedUser.password && matchedUser.password !== password) {
        showBanner("ভুল পাসওয়ার্ড! অনুগ্রহ করে সঠিক পাসওয়ার্ড দিয়ে আবার চেষ্টা করুন।");
        return;
      }
      updateSession(matchedUser);
      showBanner("স্বাগতম! আপনার সেশনে সফলভাবে লগইন করা হয়েছে।");
    }
  };

  // Select Gateway Setup from setup modal
  const handleGatewaySetup = (gateway: string) => {
    if (session) {
      const updated = { ...session, selectedGateway: gateway };
      updateSession(updated);
      showBanner(`আপনার গেটওয়ে সফলভাবে ${gateway} পার্টনার হিসেবে কনফিগার হয়েছে।`);
    }
  };

  // Buy Package
  const handleBuyPackage = (cost: number, daily: number) => {
    if (!session) return;

    if (session.balance < cost) {
      showBanner(`দুঃখিত, পর্যাপ্ত ব্যালেন্স নেই! দয়া করে ডিপোজিট রিচার্জ পোর্টালে যান।`);
      setTab("deposit");
      return;
    }

    // Referral bonus for package purchase
    if (session.referredBy && cost === 500) {
        const registered = localStorage.getItem("mske_registered_users");
        if (registered) {
            const usersList = JSON.parse(registered);
            const referee = usersList.find((u: any) => u.referralCode === session.referredBy);
            if (referee) {
                referee.balance += 100.00;
                localStorage.setItem("mske_registered_users", JSON.stringify(usersList));
                showBanner("আপনার রেফারার ১০০ টাকা বোনাস পেয়েছেন!");
            }
        }
    }

    const updatedSession: UserSession = {
      ...session,
      balance: session.balance - cost,
      pack: {
        cost,
        daily,
        purchasedAt: new Date().toDateString(),
        daysClaimed: 0,
        lastClaimDate: undefined
      }
    };

    updateSession(updatedSession);
    showBanner(`অভিনন্দন! আপনার ভেসেল প্যাকেজটি (৳ ${cost}) সফলভাবে সক্রিয় করা হয়েছে।`);
  };

  // Claim Daily profit
  const handleClaimIncome = () => {
    if (!session || !session.pack) return;

    const todayStr = new Date().toDateString();
    if (session.pack.lastClaimDate === todayStr) {
      showBanner("আপনি ইতিমধ্যে আজকের দৈনিক প্রফিট রিডিম করেছেন!");
      return;
    }

    const claimAmt = session.pack.daily;
    const updatedSession: UserSession = {
      ...session,
      balance: session.balance + claimAmt,
      lastClaim: todayStr,
      pack: {
        ...session.pack,
        daysClaimed: session.pack.daysClaimed + 1,
        lastClaimDate: todayStr
      }
    };

    updateSession(updatedSession);
    showBanner(`সফল প্রফিট সংগ্রহ! ৳ ${claimAmt} আপনার মূল ওয়ালেটে জমা হয়েছে।`);
  };

  // Deposit Complete callback
  const handleDepositComplete = (amount: number, trxId: string, gateway: string) => {
    if (!session) return;

    const updated: UserSession = {
      ...session,
      balance: session.balance + amount,
      usedTrx: [...session.usedTrx, trxId],
      depositHistory: [
        ...session.depositHistory,
        {
          id: `dep-${Date.now()}`,
          amount,
          gateway,
          trxId,
          status: "verified",
          createdAt: new Date().toLocaleString()
        }
      ]
    };

    updateSession(updated);
  };

  // Withdrawal Submit callback
  const handleWithdraw = (amount: number, method: string, number: string) => {
    if (!session) return;

    const newRequest: WithdrawalRequest = {
      id: `wd-${Date.now()}`,
      amount,
      method,
      number,
      status: "pending",
      createdAt: new Date().toLocaleString()
    };

    const updated: UserSession = {
      ...session,
      balance: session.balance - amount,
      withdrawals: [newRequest, ...session.withdrawals]
    };

    updateSession(updated);
  };

  const handleLogout = () => {
    updateSession(null);
    setTab("home");
  };

  const showBanner = (msg: string) => {
    setGlobalBanner(msg);
    setTimeout(() => setGlobalBanner(""), 4500);
  };

  // Render active layout based on selected tab
  const renderActiveView = () => {
    if (!session) return null;

    switch (tab) {
      case "home":
        return <HomeView onBuyPackage={handleBuyPackage} activePackage={session.pack} />;
      case "claim":
        return (
          <ClaimView
            onClaim={handleClaimIncome}
            activePackage={session.pack}
            lastClaimDate={session.pack?.lastClaimDate || ""}
          />
        );
      case "refer":
        return <ReferView uid={session.uid} referralCount={session.referralCount || 0} />;
      case "deposit":
        return (
          <DepositView
            balance={session.balance}
            selectedGateway={session.selectedGateway || "bKash"}
            onGatewaySelect={(gw) => updateSession({ ...session, selectedGateway: gw })}
            onDepositComplete={handleDepositComplete}
            usedTrx={session.usedTrx}
            onBack={() => setTab("home")}
          />
        );
      case "account":
        return (
          <AccountView
            phone={session.phone}
            uid={session.uid}
            balance={session.balance}
            onWithdraw={handleWithdraw}
            onLogout={handleLogout}
            withdrawals={session.withdrawals}
            onDepositComplete={handleDepositComplete}
            usedTrx={session.usedTrx}
            selectedGateway={session.selectedGateway || "bKash"}
            onGatewaySelect={(gw) => updateSession({ ...session, selectedGateway: gw })}
            onSetTab={setTab}
          />
        );
      default:
        return <HomeView onBuyPackage={handleBuyPackage} activePackage={session.pack} />;
    }
  };

  if (showSplash) {
    // Determine elegant loading state labels in Bengali
    let loadingStatus = "সুরক্ষিত ভেসেল নেটওয়ার্ক তৈরি হচ্ছে...";
    if (splashProgress < 35) {
      loadingStatus = "মেরিন রুট ম্যাপ লোড করা হচ্ছে...";
    } else if (splashProgress < 75) {
      loadingStatus = "সার্ভার সিকিউরিটি গেটওয়ে লাইসেন্স ভেরিফাই হচ্ছে...";
    } else if (splashProgress < 95) {
      loadingStatus = "মোবাইল ব্যাংকিং খাতা ইন্টিগ্রেশন সম্পন্ন হচ্ছে...";
    } else {
      loadingStatus = "এমএসকেএ ড্যাশবোর্ড সিস্টেমে স্বাগতম...";
    }

    return (
      <div className="min-h-screen bg-gradient-to-tr from-[#080916] via-[#0D0F26] to-[#0A0D1F] text-slate-200 font-sans flex flex-col items-center justify-center max-w-md mx-auto relative overflow-hidden border-x border-[#1e1f38]/60 shadow-2xl">
        {/* Soft, luxury ambient glow orbs - Google Gemini-inspired pink, indigo, and cyan neon auroras */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-indigo-500/[0.14] blur-[110px] rounded-full pointer-events-none z-0"></div>
        <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-violet-600/[0.12] blur-[110px] rounded-full pointer-events-none z-0"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-amber-500/[0.06] blur-[110px] rounded-full pointer-events-none z-0"></div>

        <div className="z-10 flex flex-col items-center space-y-7 text-center px-6">
          {/* Stunning Spinning and Pulsing Logo Container WITH The Requested App Header Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Third ultra-soft outermost deep pulse ring */}
            <motion.div 
              animate={{ scale: [0.95, 1.35, 0.95], opacity: [0.1, 0.25, 0.1] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -inset-10 rounded-full border border-amber-500/10 pointer-events-none"
            />
            {/* Elegant outer spinning ring of gold dashes */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              className="absolute -inset-6 rounded-full border border-dashed border-amber-500/50"
            />
            {/* Inter rotating reverse slow accent ring */}
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
              className="absolute -inset-4 rounded-full border border-double border-indigo-400/30"
            />
            {/* Soft background pulse radial gradient */}
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.25, 0.45, 0.25] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
              className="absolute -inset-3 rounded-full bg-gradient-to-tr from-indigo-500 via-amber-500 to-yellow-500 opacity-30 blur-xl"
            />
            
            {/* Orbiting golden dots for dynamic loading visual flare */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
              className="absolute inset-0 z-20 pointer-events-none"
            >
              <div className="absolute top-[-26px] left-[54px] w-3 h-3 bg-gradient-to-tr from-amber-400 to-yellow-300 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.8)]"></div>
              <div className="absolute bottom-[-26px] left-[54px] w-2 h-2 bg-gradient-to-tr from-indigo-400 to-purple-400 rounded-full shadow-[0_0_8px_rgba(129,140,248,0.8)]"></div>
            </motion.div>
            
            {/* Elegant luxury circular frame of the official platform logo as requested */}
            <div className="relative w-32 h-32 rounded-full overflow-hidden bg-[#05070A]/95 border-2 border-amber-400 flex items-center justify-center p-4.5 shadow-[0_0_35px_rgba(245,158,11,0.65)]">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                className="w-full h-full flex items-center justify-center"
              >
                <img 
                  src="https://i.postimg.cc/3wZKL0fz/file-00000000c6307209894308bca474e8e6.png" 
                  alt="MSKE Technical Logo" 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "https://i.postimg.cc/RhD5kS4T/file-00000000c6307209894308bca474e8e6.png";
                  }}
                  referrerPolicy="no-referrer"
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 to-transparent pointer-events-none"></div>
            </div>

            {/* Glowing micro-badge on the circular frame */}
            <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-gradient-to-r from-amber-500 to-yellow-600 text-[8px] font-black tracking-widest text-[#020406] rounded-full uppercase border border-amber-400/40 whitespace-nowrap animate-bounce shadow-lg">
              ONLINE FLEET
            </span>
          </motion.div>

          {/* Core branding title in deep aesthetic gradient */}
          <motion.div className="space-y-1 mt-2">
            <h1 className="text-3.5xl font-black tracking-[0.08em] bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300 bg-clip-text text-transparent font-sans">
              MSKE money
            </h1>
            <p className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-[0.25em]">
              Lighterage & Marine Logistics
            </p>
          </motion.div>

          {/* Precision dynamic progressive loading bar */}
          <div className="space-y-2 w-52">
            <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-900 relative">
              <div 
                className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 shadow-[0_0_12px_rgba(245,158,11,1)] transition-all duration-300 rounded-full font-mono"
                style={{ width: `${splashProgress}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-500 tracking-wider">
              <span>SYSTEM CHECK</span>
              <span className="text-amber-400">{splashProgress}%</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 font-semibold tracking-wide h-4">
            {loadingStatus}
          </p>
        </div>

        {/* Brand systems verification tagline */}
        <div className="absolute bottom-8 left-0 right-0 text-center z-10">
          <span className="text-[8px] font-mono tracking-widest text-[#56598c] uppercase">
            SECURED BY MSKE SHIP-SYSTEMS
          </span>
        </div>
      </div>
    );
  }

  if (!session) {
    return <AuthBox onAuthComplete={handleAuthComplete} />;
  }

  // Operator Gateway setting fallback check
  const needGatewaySetup = !session.selectedGateway;

  return (
    <div id="main-applet" className="min-h-screen bg-gradient-to-b from-[#080916] via-[#0D0F26] to-[#080916] text-slate-200 font-sans flex flex-col justify-between max-w-md mx-auto relative shadow-2xl pb-24 overflow-hidden border-x border-[#1e1f38]/60">
      {/* Premium Ambient Textures (Color Glow Orbs) as requested - Gemini Twilight Auroras */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/[0.12] blur-[110px] rounded-full pointer-events-none -mr-32 -mt-20 z-0 animate-pulse"></div>
      <div className="absolute top-[30%] left-0 w-72 h-72 bg-purple-500/[0.08] blur-[110px] rounded-full pointer-events-none -ml-32 z-0"></div>
      <div className="absolute bottom-[10%] right-0 w-80 h-80 bg-indigo-600/[0.08] blur-[115px] rounded-full pointer-events-none -mr-32 z-0"></div>
      <div className="absolute bottom-10 left-0 w-72 h-72 bg-blue-500/[0.10] blur-[100px] rounded-full pointer-events-none -ml-28 z-0"></div>

      {/* Dynamic interactive gateway selection overlay */}
      {needGatewaySetup && <SetupModal onSelect={handleGatewaySetup} />}

      {/* Dynamic interactive registration bonus popup modal */}
      <AnimatePresence>
        {showBonusModal && (
          <div className="fixed inset-0 bg-[#020408]/90 backdrop-blur-md z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0c0f2b] border-2 border-amber-400 rounded-[28px] p-6 text-center max-w-sm w-full relative overflow-hidden shadow-[0_0_50px_rgba(245,158,11,0.25)]"
            >
              {/* Soft visual auroras inside the card */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/15 rounded-full blur-[40px] pointer-events-none"></div>
              
              <div className="flex justify-center mb-5 relative">
                {/* Pulsating gift box animation */}
                <motion.div 
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  className="w-16 h-16 bg-gradient-to-tr from-amber-400 via-yellow-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20 rotate-12"
                >
                  <Gift className="text-slate-950 w-8 h-8 -rotate-12" />
                </motion.div>
                
                {/* Visual stars */}
                <Sparkles className="w-5 h-5 text-amber-300 absolute -top-1 right-12 animate-pulse" />
                <Sparkles className="w-4 h-4 text-amber-400 absolute bottom-0 left-12 animate-bounce" />
              </div>

              <span className="text-amber-400 font-extrabold text-[11px] tracking-[0.2em] uppercase mb-1.5 block">
                🎉 অভিনন্দন ও শুভকামনা!
              </span>
              
              {/* Requested custom sentence block */}
              <h2 className="text-[17px] font-black text-white leading-snug tracking-normal px-1 mt-2 mb-4">
                নতুন যুদ্ধ হওয়ার জন্য ১০০ টাকা বোনাস
              </h2>

              <p className="text-[11px] text-slate-300 leading-relaxed mb-6 px-1">
                আপনার একাউন্টে সরাসরি <span className="text-amber-400 font-bold font-mono">৳১০০.০০</span> টাকা হাদিয়া যুক্ত করা হযেছে! এখনই শিপিং জাহাজের কন্ট্রাক্ট সচল করতে ব্যবহার করুন।
              </p>

              <button
                type="button"
                onClick={() => setShowBonusModal(false)}
                className="w-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black py-3.5 rounded-xl text-xs active:scale-95 transition-transform cursor-pointer shadow-lg shadow-amber-500/20 hover:brightness-105"
              >
                বোনাস গ্রহণ করুন
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Top Header components */}
      <Header balance={session.balance} />

      {/* Global Notice Banner Notification toast */}
      <AnimatePresence>
        {globalBanner && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 bg-amber-500 text-slate-950 font-black text-center text-[10px] tracking-wide leading-relaxed shadow-lg z-30"
          >
            {globalBanner}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Primary viewport content */}
      <main className="p-4 flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.18 }}
          >
            {renderActiveView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Sticky Bottom Premium Navigation Grid (Streamlined to 4 columns) */}
      <nav id="bottom-bar-nav" className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#05070A]/95 backdrop-blur-md border-t border-slate-800/80 py-2.5 px-3 grid grid-cols-4 gap-1 z-40 shadow-2xl">
        <button
          type="button"
          id="btn-tab-home"
          onClick={() => setTab("home")}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer ${
            tab === "home" ? "text-amber-400 bg-slate-900/45 scale-102" : "text-slate-400 hover:text-slate-300"
          }`}
        >
          <Compass className="w-5 h-5 mb-1" />
          <span className="text-[9px] font-bold">হোম</span>
        </button>

        <button
          type="button"
          id="btn-tab-claim"
          onClick={() => setTab("claim")}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer relative ${
            tab === "claim" ? "text-amber-400 bg-slate-900/45 scale-102" : "text-slate-400 hover:text-slate-300"
          }`}
        >
          {session.pack && session.pack.lastClaimDate !== new Date().toDateString() && (
            <span className="absolute top-1 right-2 w-2 h-2 bg-amber-500 rounded-full animate-ping"></span>
          )}
          <Ship className="w-5 h-5 mb-1" />
          <span className="text-[9px] font-bold"> ডেইলি ক্লেম</span>
        </button>

        <button
          type="button"
          id="btn-tab-refer"
          onClick={() => setTab("refer")}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer ${
            tab === "refer" ? "text-amber-400 bg-slate-900/45 scale-102" : "text-slate-400 hover:text-slate-300"
          }`}
        >
          <Users className="w-5 h-5 mb-1" />
          <span className="text-[9px] font-bold">রেফার</span>
        </button>

        <button
          type="button"
          id="btn-tab-account"
          onClick={() => setTab("account")}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer ${
            tab === "account" ? "text-amber-400 bg-slate-900/45 scale-102" : "text-slate-400 hover:text-slate-300"
          }`}
        >
          <User className="w-5 h-5 mb-1" />
          <span className="text-[9px] font-bold">আমার</span>
        </button>
      </nav>
    </div>
  );
}

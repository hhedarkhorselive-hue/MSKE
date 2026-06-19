/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Ship, Route, Compass, Award, ShieldCheck, Flame, BellRing, Coins, TrendingUp, CalendarDays } from "lucide-react";
import { ShipPackage } from "../types";

interface HomeViewProps {
  onBuyPackage: (cost: number, daily: number) => void;
  activePackage: { cost: number; daily: number } | null;
}

export default function HomeView({ onBuyPackage, activePackage }: HomeViewProps) {
  const [bannerIndex, setBannerIndex] = useState<number>(0);

  // The banners list featuring user's official under-hero banner
  const bannerImages = [
    {
      src: "https://i.postimg.cc/HxBkL8wD/file-00000000a2bc71faa50d7adae7d92d88.png",
      alt: "এমএসকেএ শিপিং",
      badge: "OFFICIAL SHIP LINE",
      title: "এমএসকেএ শিপিং লজিস্টিকস লিমিটেড",
      desc: "সরাসরি মেরিন বাণিজ্যে অংশ নিয়ে প্রতিদিনের নিরাপদ মুনাফা সংগ্রহ করুন।"
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % bannerImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const packages = [
    {
      id: "ship_1",
      name: "কোস্টাল কার্গো ভেসেল (Coastal Cargo)",
      cost: 500,
      dailyIncome: 25,
      image: "https://i.postimg.cc/q70YZhyP/file-0000000058387207abcc303bd37095ad.png",
      durationDays: 365,
      category: "Coastal Carrier",
      capacity: "3,500 Tons",
      route: "Chittagong ⇄ Barisal"
    },
    {
      id: "ship_5",
      name: "ফিডার কার্গো ক্যারিয়ার (Feeder Cargo)",
      cost: 840,
      dailyIncome: 60,
      image: "https://i.postimg.cc/T3jNmdFH/copcall-ohsc068g.png",
      durationDays: 365,
      category: "Feeder Carrier",
      capacity: "5,800 Tons",
      route: "Chittagong ⇄ Pangaon"
    },
    {
      id: "ship_2",
      name: "ডিপ সি লাইনার কন্টেইনার (Deep Sea Liner)",
      cost: 1000,
      dailyIncome: 95,
      image: "https://i.postimg.cc/T3jNmdFH/copcall-ohsc068g.png",
      durationDays: 365,
      category: "Container Carrier",
      capacity: "12,000 TEU",
      route: "Chittagong ⇄ Singapore"
    },
    {
      id: "ship_3",
      name: "ওশান গেটওয়ে বাল্কার (Ocean Bulker)",
      cost: 2000,
      dailyIncome: 150,
      image: "https://i.postimg.cc/q70YZhyP/file-0000000058387207abcc303bd37095ad.png",
      durationDays: 365,
      category: "LNG Transporter",
      capacity: "85,000 CBM",
      route: "Mongla ⇄ Kuala Lumpur"
    },
    {
      id: "ship_4",
      name: "মেগা সুপার অয়েল ট্যাংকার (Oil VLCC)",
      cost: 5000,
      dailyIncome: 225,
      image: "https://i.postimg.cc/T3jNmdFH/copcall-ohsc068g.png",
      durationDays: 365,
      category: "A-Class VLCC Tanker",
      capacity: "150,000 DWT",
      route: "Matarbari ⇄ Persian Gulf"
    }
  ];

  const notices = [
    "এমএসকেএ শিপিং লজিস্টিকস লিমিটেডে স্বাগতম! নিরাপদ বিনিয়োগ আমাদের প্রতিশ্রুতি।",
    "নিয়মিত ভেসেল সার্ভিস ও পেমেন্ট রিসিভ করতে আপনার প্রোফাইল আপডেট রাখুন।",
    "যেকোনো সমস্যায় আমাদের সাপোর্ট টিমের সাথে সরাসরি যোগাযোগ করুন।"
  ];

  return (
    <div className="space-y-4">
      {/* Premium Hero Slider Banner */}
      <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-slate-800 shadow-xl group bg-slate-900">
        <AnimatePresence mode="wait">
          <motion.div
            key={bannerIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0"
          >
             <img 
              src={bannerImages[bannerIndex].src} 
              alt={bannerImages[bannerIndex].alt} 
              className="w-full h-full object-cover opacity-100"
              referrerPolicy="no-referrer"
              onError={(e) => {
                const current = e.currentTarget;
                current.onerror = null;
                current.src = "https://i.postimg.cc/Y9dJFrGH/file-00000000a2bc71faa50d7adae7d92d88.png";
              }}
            />
            <div className="absolute inset-0"></div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel indicators */}
        <div className="absolute top-3 right-4 flex space-x-1 z-10">
          {bannerImages.map((_, idx) => (
            <button
              key={idx}
              type="button"
              aria-label={`Slide ${idx + 1}`}
              onClick={() => setBannerIndex(idx)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                idx === bannerIndex ? "bg-amber-400 w-3" : "bg-slate-600"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Official Notice Ticker */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl px-3.5 py-2.5 flex items-center space-x-3 overflow-hidden shadow-md">
        <div className="w-6 h-6 bg-amber-500/10 text-amber-500 rounded-lg flex items-center justify-center flex-shrink-0 border border-amber-500/20">
          <BellRing className="w-3.5 h-3.5 animate-bounce" />
        </div>
        <div className="flex-1 overflow-hidden relative h-4">
          <div className="animate-marquee whitespace-nowrap text-[11px] font-medium text-slate-300 absolute flex space-x-12">
            <span>{notices[0]}</span>
            <span>{notices[1]}</span>
            <span>{notices[2]}</span>
          </div>
        </div>
      </div>

      {/* Section Title */}
      <div className="flex items-center justify-between pt-1">
        <h2 className="font-extrabold text-[11px] uppercase tracking-wider text-slate-400 flex items-center">
          <Compass className="w-4 h-4 text-amber-500 mr-2 animate-spin-slow" />
          একক বিনিয়োগ ভেসেল ফ্লিট সমূহ
        </h2>
        <span className="text-[9px] bg-slate-900/60 text-slate-400 px-2.5 py-1 rounded-full border border-slate-800 font-bold flex items-center">
          <Flame className="w-2.5 h-2.5 text-amber-500 mr-1" /> ACTIVE SHIPS
        </span>
      </div>

      {/* Ship Investments Grid */}
      <div className="grid grid-cols-1 gap-5 pb-4">
        {packages.map((pkg) => {
          const isActive = activePackage !== null && activePackage.cost === pkg.cost;
          return (
            <motion.div
              key={pkg.id}
              whileHover={{ y: -3 }}
              className={`bg-slate-900/45 border ${
                isActive ? "border-amber-500 shadow-amber-500/10 shadow-xl" : "border-slate-800/80"
              } rounded-[32px] p-5 space-y-4 flex flex-col shadow-lg hover:border-amber-500/40 transition-all group relative`}
            >
              {/* Product banner image box - fills edge-to-edge to fit border perfectly as requested */}
              <div className="w-full h-44 rounded-[24px] overflow-hidden border border-slate-800 relative bg-[#05070A]/60 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
                <img 
                  src={pkg.image} 
                  alt={pkg.name} 
                  className="w-full h-full object-cover rounded-[24px] group-hover:scale-105 transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-2.5 left-2.5 bg-slate-900/90 border border-slate-800 backdrop-blur-sm text-amber-400 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {pkg.category}
                </span>
              </div>

              {/* Package Details Section */}
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="font-extrabold text-[12px] md:text-sm text-white group-hover:text-amber-400 transition-colors leading-tight">
                    {pkg.name}
                  </h3>
                  {isActive && (
                    <span className="text-[8px] bg-gradient-to-tr from-amber-500 to-yellow-600 text-black font-black px-2 py-0.5 rounded shrink-0 ml-1.5 animate-pulse">
                      ACTIVE PARTNER
                    </span>
                  )}
                </div>

                {/* Ship specifications */}
                {pkg.route && (
                  <div className="grid grid-cols-2 gap-2 text-[9px] text-slate-400 border-t border-b border-slate-800/40 py-2">
                    <div className="flex items-center space-x-1 flex-shrink-0">
                      <Route className="w-3 h-3 text-amber-500/80 shrink-0" />
                      <span className="truncate">{pkg.route}</span>
                    </div>
                    <div className="flex items-center space-x-1 flex-shrink-0">
                      <Ship className="w-3 h-3 text-amber-500/80 shrink-0" />
                      <span className="truncate">{pkg.capacity || "15,000 DWT"}</span>
                    </div>
                  </div>
                )}

                {/* Pricing & yield information requested by user */}
                <div className="grid grid-cols-3 gap-2 bg-[#020406]/90 p-3.5 rounded-2.5xl border border-slate-800/90 text-center relative overflow-hidden backdrop-blur-md">
                  <div className="space-y-1 flex flex-col items-center justify-between">
                    <span className="text-[9px] font-extrabold text-slate-400 tracking-wide flex items-center justify-center">
                      <Coins className="w-2.5 h-2.5 text-amber-500 mr-0.5" />
                      কেনার মূল্য
                    </span>
                    <strong className="text-[13px] font-black text-amber-400 tracking-tight font-sans drop-shadow-[0_2px_10px_rgba(245,158,11,0.2)]">
                      ৳ {pkg.cost.toLocaleString("en-US")}
                    </strong>
                  </div>
                  <div className="space-y-1 flex flex-col items-center justify-between border-l border-r border-slate-800/80 px-1">
                    <span className="text-[9px] font-extrabold text-slate-400 tracking-wide flex items-center justify-center">
                      <TrendingUp className="w-2.5 h-2.5 text-emerald-400 mr-0.5" />
                      ডেইলি পাবে
                    </span>
                    <strong className="text-[13px] font-black text-emerald-400 tracking-tight font-sans drop-shadow-[0_2px_10px_rgba(16,185,129,0.2)]">
                      ৳ {pkg.dailyIncome.toLocaleString("en-US")}
                    </strong>
                  </div>
                  <div className="space-y-1 flex flex-col items-center justify-between">
                    <span className="text-[9px] font-extrabold text-slate-400 tracking-wide flex items-center justify-center">
                      <CalendarDays className="w-2.5 h-2.5 text-blue-400 mr-0.5" />
                      মেয়াদকাল
                    </span>
                    <strong className="text-[12px] font-extrabold text-slate-200 tracking-tight font-sans">
                      {pkg.durationDays} দিন
                    </strong>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-amber-500/[0.05] to-yellow-500/[0.05] p-2.5 rounded-xl border border-amber-500/20 flex items-center justify-between text-[11px] backdrop-blur-sm shadow-[0_4px_15px_rgba(245,158,11,0.03)]">
                  <span className="text-slate-300 font-bold flex items-center">
                    <Award className="w-3.5 h-3.5 text-amber-500 mr-1.5 shrink-0" />
                    সর্বমোট রিটার্ন প্রফিট লাভ:
                  </span>
                  <strong className="text-[13px] font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-300 drop-shadow-[0_2px_8px_rgba(245,158,11,0.2)]">
                    ৳ {(pkg.dailyIncome * pkg.durationDays).toLocaleString("en-US")}
                  </strong>
                </div>

                <button
                  type="button"
                  id={`buy-ship-${pkg.cost}`}
                  onClick={() => onBuyPackage(pkg.cost, pkg.dailyIncome)}
                  className={`w-full py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer shadow-md ${
                    isActive
                      ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black shadow-lg shadow-amber-500/20 scale-102 border-none"
                      : "bg-[#020406]/90 text-slate-200 border border-slate-800/90 group-hover:bg-gradient-to-r group-hover:from-amber-500 group-hover:to-yellow-500 group-hover:text-slate-950 group-hover:border-transparent active:scale-98"
                  }`}
                >
                  {isActive ? (
                    <span>ভেসেল শেয়ার সক্রিয় রয়েছে</span>
                  ) : (
                    <span>প্যাকেজ ক্রয় করুন (৳ {pkg.cost.toLocaleString("en-US")})</span>
                  )}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

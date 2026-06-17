/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Bolt, Ship, ShieldCheck, Flame, Anchor } from "lucide-react";

interface ClaimViewProps {
  onClaim: () => void;
  activePackage: { cost: number; daily: number } | null;
  lastClaimDate: string;
}

export default function ClaimView({ onClaim, activePackage, lastClaimDate }: ClaimViewProps) {
  const today = new Date().toDateString();
  const alreadyClaimed = lastClaimDate === today;

  return (
    <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-[32px] shadow-xl text-center space-y-5 relative overflow-hidden">
      {/* Visual glowing ring background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-amber-500/5 blur-3xl pointer-events-none"></div>

      <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto border border-amber-500/20 relative shadow-lg shadow-amber-500/5">
        <Bolt className="w-8 h-8 text-amber-500 animate-pulse" />
        <div className="absolute inset-0 rounded-full border-2 border-amber-500/20 border-dashed animate-spin-slow"></div>
      </div>

      <div className="space-y-1 relative">
        <h2 className="font-extrabold text-[12px] text-white tracking-widest uppercase">
          কার্গো ডেইলি রেভিনিউ প্রফিট ক্লেম
        </h2>
        <p className="text-[10px] text-slate-400">
          প্রতি ২৪ ঘণ্টায় একবার জাহাজের ভাড়ার অংশ বা প্রফিট সংগ্রহ করে মূল ব্যালেন্সে যোগ করুন।
        </p>
      </div>

      {/* Package condition view rendering */}
      <div id="pack-info" className="bg-[#05070A]/50 p-4 rounded-2xl text-[11px] text-slate-400 border border-slate-800 leading-relaxed text-center relative max-w-sm mx-auto">
        {!activePackage ? (
          <div className="space-y-2 py-2">
            <Anchor className="w-5 h-5 text-slate-600 mx-auto animate-bounce" />
            <p className="text-slate-400">
              আপনার এই মুহূর্তে কোনো সক্রিয় <span className="text-amber-400 font-bold">ভেসেল ফ্লিট ইন্সুরেন্স বা প্যাকেজ</span> নেই। হোম লবিতে যান এবং প্রথম জাহাজটি সক্রিয় করুন।
            </p>
          </div>
        ) : (
          <div className="space-y-2 py-1">
            <div className="flex items-center justify-center space-x-1.5">
              <Ship className="w-4 h-4 text-amber-400" />
              <span className="text-white font-extrabold text-[12px]">সক্রিয় ফ্লিট শেয়ার:</span>
              <span className="text-amber-400 font-bold">৳ {activePackage.cost}</span>
            </div>
            
            <div className="flex justify-center space-x-6 text-[10px] border-t border-slate-800/80 pt-1.5 mt-1.5">
              <div>
                <span className="text-slate-500 block">দৈনিক রিটার্ন:</span>
                <strong className="text-emerald-400 font-mono text-xs">৳ {activePackage.daily}</strong>
              </div>
              <div className="border-r border-slate-800/80"></div>
              <div>
                <span className="text-slate-500 block">স্ট্যাটাস:</span>
                <span className="text-emerald-400 font-bold flex items-center justify-center">
                  <Flame className="w-3 h-3 text-emerald-400 mr-0.5 animate-pulse" />
                  ONLINE
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <button
        type="button"
        id="claim-revenue-btn"
        disabled={!activePackage || alreadyClaimed}
        onClick={onClaim}
        className={`w-full py-3.5 rounded-xl text-xs font-black transition-all shadow-lg select-none relative z-10 ${
          alreadyClaimed
            ? "bg-[#05070A]/50 border border-slate-800 text-slate-500 cursor-not-allowed"
            : !activePackage
            ? "bg-[#05070A]/50 border border-slate-800 text-slate-600 cursor-not-allowed"
            : "bg-gradient-to-tr from-amber-500 to-yellow-600 text-black shadow-amber-500/10 active:scale-95 hover:brightness-105"
        }`}
      >
        {alreadyClaimed ? (
          <span className="flex items-center justify-center space-x-1">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>আজকের ইনকাম সফলভাবে সংগ্রহ করা হয়েছে</span>
          </span>
        ) : (
          <span>আজকের ইনকাম সংগ্রহ করুন (৳ {activePackage ? activePackage.daily : 0})</span>
        )}
      </button>

      {alreadyClaimed && (
        <p className="text-[9px] text-yellow-500/80 font-bold">
          * আপনার পরবর্তী ক্লেম পেমেন্ট রিডিম করার সুযোগ আগামীকাল সকালে পুনরায় সক্রিয় হবে।
        </p>
      )}
    </div>
  );
}

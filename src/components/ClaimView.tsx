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
    <div className="bg-white/40 border border-white/60 p-8 rounded-[32px] shadow-sm text-center space-y-5 relative overflow-hidden text-zinc-900">
      {/* Visual glowing ring background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none"></div>

      <div className="w-16 h-16 bg-amber-400/20 rounded-full flex items-center justify-center mx-auto border border-amber-400/30 relative shadow-sm">
        <Bolt className="w-8 h-8 text-amber-600 animate-pulse" />
        <div className="absolute inset-0 rounded-full border-2 border-amber-400/30 border-dashed animate-spin-slow"></div>
      </div>

      <div className="space-y-1 relative">
        <h2 className="font-extrabold text-[12px] text-zinc-900 tracking-widest uppercase">
          কার্গো ডেইলি রেভিনিউ প্রফিট ক্লেম
        </h2>
        <p className="text-[10px] text-zinc-600">
          প্রতি ২৪ ঘণ্টায় একবার জাহাজের ভাড়ার অংশ বা প্রফিট সংগ্রহ করে মূল ব্যালেন্সে যোগ করুন।
        </p>
      </div>

      {/* Package condition view rendering */}
      <div id="pack-info" className="bg-white/60 p-4 rounded-2xl text-[11px] text-zinc-700 border border-white/60 leading-relaxed text-center relative max-w-sm mx-auto shadow-sm">
        {!activePackage ? (
          <div className="space-y-2 py-2">
            <Anchor className="w-5 h-5 text-zinc-400 mx-auto animate-bounce" />
            <p className="text-zinc-600">
              আপনার এই মুহূর্তে কোনো সক্রিয় <span className="text-amber-700 font-bold">ভেসেল ফ্লিট ইন্সুরেন্স বা প্যাকেজ</span> নেই। হোম লবিতে যান এবং প্রথম জাহাজটি সক্রিয় করুন।
            </p>
          </div>
        ) : (
          <div className="space-y-2 py-1">
            <div className="flex items-center justify-center space-x-1.5">
              <Ship className="w-4 h-4 text-amber-600" />
              <span className="text-zinc-900 font-extrabold text-[12px]">সক্রিয় ফ্লিট শেয়ার:</span>
              <span className="text-amber-700 font-bold">৳ {activePackage.cost}</span>
            </div>
            
            <div className="flex justify-center space-x-6 text-[10px] border-t border-zinc-200 pt-1.5 mt-1.5">
              <div>
                <span className="text-zinc-500 block">দৈনিক রিটার্ন:</span>
                <strong className="text-emerald-700 font-mono text-xs">৳ {activePackage.daily}</strong>
              </div>
              <div className="border-r border-zinc-200"></div>
              <div>
                <span className="text-zinc-500 block">স্ট্যাটাস:</span>
                <span className="text-emerald-700 font-bold flex items-center justify-center">
                  <Flame className="w-3 h-3 text-emerald-600 mr-0.5 animate-pulse" />
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
        className={`w-full py-3.5 rounded-xl text-xs font-black transition-all shadow-sm select-none relative z-10 ${
          alreadyClaimed
            ? "bg-white/50 border border-white/60 text-zinc-500 cursor-not-allowed shadow-none"
            : !activePackage
            ? "bg-white/50 border border-white/60 text-zinc-400 cursor-not-allowed shadow-none"
            : "bg-gradient-to-tr from-amber-400 to-yellow-500 text-zinc-950 shadow-amber-500/20 active:scale-95 hover:brightness-105"
        }`}
      >
        {alreadyClaimed ? (
          <span className="flex items-center justify-center space-x-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>আজকের ইনকাম সফলভাবে সংগ্রহ করা হয়েছে</span>
          </span>
        ) : (
          <span>আজকের ইনকাম সংগ্রহ করুন (৳ {activePackage ? activePackage.daily : 0})</span>
        )}
      </button>

      {alreadyClaimed && (
        <p className="text-[9px] text-amber-700/80 font-bold">
          * আপনার পরবর্তী ক্লেম পেমেন্ট রিডিম করার সুযোগ আগামীকাল সকালে পুনরায় সক্রিয় হবে।
        </p>
      )}
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Copy, Check, Users, Gift, Share2, Award } from "lucide-react";
import { collection, query, where, getCountFromServer } from "firebase/firestore";
import { db } from "../lib/firebase";

interface ReferViewProps {
  uid: string;
  referralCount?: number;
}

export default function ReferView({ uid, referralCount = 0 }: ReferViewProps) {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(uid);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-[32px] shadow-xl text-center space-y-4">
      <div className="w-14 h-14 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto border border-indigo-500/20 shadow-md">
        <Users className="w-6 h-6 text-indigo-400 animate-pulse" />
      </div>

      <div className="space-y-1">
        <h2 className="font-extrabold text-[12px] text-white uppercase tracking-widest">রেফারেল প্রফিট ও বোনাস হাব</h2>
        <p className="text-[11px] text-slate-400 leading-relaxed px-2">
          আপনার ইউনিক টিম কোড ব্যবহার করে অন্যান্য মেরিন পার্টনারদের যুক্ত করুন এবং পান আজীবন ভাড়ার প্রফিট কমিশন বোনাস।
        </p>
      </div>

      {/* Stats and Rewards */}
      <div className="grid grid-cols-3 gap-2 text-left pt-2 pb-1">
        <div className="p-3 bg-[#05070A]/50 rounded-2xl border border-slate-800 space-y-1">
          <Users className="w-4 h-4 text-indigo-500" />
          <span className="text-[10px] text-slate-400 block font-bold">মোট রেফার:</span>
          <strong className="text-sm text-white font-mono">{referralCount}</strong>
        </div>
        <div className="p-3 bg-[#05070A]/50 rounded-2xl border border-slate-800 space-y-1">
          <Gift className="w-4 h-4 text-amber-500" />
          <span className="text-[10px] text-slate-400 block font-bold">ইনস্ট্যান্ট বোনাস:</span>
          <strong className="text-sm text-white font-mono">৳ ৫০.০০</strong>
        </div>
        <div className="p-3 bg-[#05070A]/50 rounded-2xl border border-slate-800 space-y-1">
          <Award className="w-4 h-4 text-emerald-500" />
          <span className="text-[10px] text-slate-400 block font-bold">ফ্লিট কমিশন:</span>
          <strong className="text-sm text-emerald-400 font-mono">৫%</strong>
        </div>
      </div>

      {/* Clipboard copy box */}
      <div className="bg-[#05070A]/50 p-3 rounded-2xl border border-slate-800 flex items-center justify-between space-x-2">
        <div className="flex items-center space-x-2 overflow-hidden flex-1">
          <Share2 className="w-3.5 h-3.5 text-amber-500/80 shrink-0" />
          <span id="ref-link-lbl" className="font-mono text-[11px] text-amber-400 tracking-wide truncate">
            {uid}
          </span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="bg-gradient-to-tr from-amber-500 to-yellow-600 text-black text-[10px] font-black px-4 py-2.5 rounded-xl transition-all active:scale-95 shrink-0 flex items-center space-x-1"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>কপিড!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>কপি করুন</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

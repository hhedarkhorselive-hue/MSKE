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
    <div className="bg-white/40 border border-white/60 p-8 rounded-[32px] shadow-sm text-center space-y-4 text-zinc-900">
      <div className="w-14 h-14 bg-indigo-400/20 rounded-full flex items-center justify-center mx-auto border border-indigo-400/30 shadow-sm">
        <Users className="w-6 h-6 text-indigo-700 animate-pulse" />
      </div>

      <div className="space-y-1">
        <h2 className="font-extrabold text-[12px] text-zinc-900 uppercase tracking-widest">রেফারেল প্রফিট ও বোনাস হাব</h2>
        <p className="text-[11px] text-zinc-600 leading-relaxed px-2">
          আপনার ইউনিক টিম কোড ব্যবহার করে অন্যান্য মেরিন পার্টনারদের যুক্ত করুন এবং পান আজীবন ভাড়ার প্রফিট কমিশন বোনাস।
        </p>
      </div>

      {/* Stats and Rewards */}
      <div className="grid grid-cols-3 gap-2 text-left pt-2 pb-1">
        <div className="p-3 bg-white/60 rounded-2xl border border-white/60 space-y-1 shadow-sm">
          <Users className="w-4 h-4 text-indigo-700" />
          <span className="text-[10px] text-zinc-500 block font-bold">মোট রেফার:</span>
          <strong className="text-sm text-zinc-900 font-mono">{referralCount}</strong>
        </div>
        <div className="p-3 bg-white/60 rounded-2xl border border-white/60 space-y-1 shadow-sm">
          <Gift className="w-4 h-4 text-amber-600" />
          <span className="text-[10px] text-zinc-500 block font-bold">ইনস্ট্যান্ট বোনাস:</span>
          <strong className="text-sm text-zinc-900 font-mono">৳ ৫০.০০</strong>
        </div>
        <div className="p-3 bg-white/60 rounded-2xl border border-white/60 space-y-1 shadow-sm">
          <Award className="w-4 h-4 text-emerald-600" />
          <span className="text-[10px] text-zinc-500 block font-bold">ফ্লিট কমিশন:</span>
          <strong className="text-sm text-emerald-700 font-mono">৫%</strong>
        </div>
      </div>

      {/* Clipboard copy box */}
      <div className="bg-white/60 p-3 rounded-2xl border border-white/60 flex items-center justify-between space-x-2 shadow-sm">
        <div className="flex items-center space-x-2 overflow-hidden flex-1">
          <Share2 className="w-3.5 h-3.5 text-amber-700/80 shrink-0" />
          <span id="ref-link-lbl" className="font-mono text-[11px] text-amber-800 tracking-wide truncate">
            {uid}
          </span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="bg-gradient-to-tr from-amber-400 to-yellow-500 text-zinc-950 text-[10px] font-black px-4 py-2.5 rounded-xl transition-all active:scale-95 shrink-0 flex items-center space-x-1"
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

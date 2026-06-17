/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import { Copy, Check, ShieldCheck, AlertCircle, Coins } from "lucide-react";
import { DepositRequest } from "../types";

const trxDatabase: Record<string, string[]> = {
  "500": ["DE79WN2C2D", "DEL9FJK7OT", "DEO4K0EKFA", "DE7XPL9M2Q", "DEK5RT8V1N"],
  "840": ["DE84QM7A2K", "DE8N5LP0TX", "DE840RZ6WF", "DE8H2JK9MC", "DE84PV3QAL"],
  "1050": ["DE1050XK7P", "DE10A9LM2R", "DE105QW8TY", "DE10FJ6NC4", "DE105ZP3KD"],
  "2000": ["DE2000LK8M", "DE20QW5RX2", "DE200AZ7PN", "DE20M4YT9K", "DE2000VF6C"]
};

interface DepositViewProps {
  balance: number;
  selectedGateway: string;
  onGatewaySelect: (gateway: string) => void;
  onDepositComplete: (amount: number, trxId: string, gateway: string) => void;
  usedTrx: string[];
}

export default function DepositView({
  balance,
  selectedGateway,
  onGatewaySelect,
  onDepositComplete,
  usedTrx
}: DepositViewProps) {
  const [packCost, setPackCost] = useState<string>("500");
  const [trxId, setTrxId] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const officialNumber = "01333468617";

  const handleCopy = () => {
    navigator.clipboard.writeText(officialNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const cleanTrx = trxId.trim().toUpperCase();
    if (!cleanTrx) {
      setErrorMessage("দয়া করে ট্রানজেকশন আইডি প্রদান করুন।");
      return;
    }

    if (usedTrx.includes(cleanTrx)) {
      setErrorMessage("এই Transaction ID (TrxID) টি ইতিমধ্যে আমাদের ডেটাবেসে ব্যবহৃত হয়েছে!");
      return;
    }

    const validTrxList = trxDatabase[packCost];

    if (validTrxList && validTrxList.includes(cleanTrx)) {
      const creditAmount = parseFloat(packCost);
      onDepositComplete(creditAmount, cleanTrx, selectedGateway);
      setSuccessMessage(`সফল অটো ভেরিফিকেশন! আপনার সাবমিটকৃত ${selectedGateway} TrxID গ্রিন সিগন্যাল পেয়েছে। আপনার অ্যাকাউন্টে ৳${creditAmount} যুক্ত করা হয়েছে।`);
      setTrxId("");
    } else {
      setErrorMessage("ভুল বা অমিল ট্রানজেকশন আইডি! আপনি যে প্যাকেজের পরিমাণটি সিলেক্ট করেছেন তার সাথে এই TrxID মিলছে না। অনুগ্রহ করে সঠিক আইডি টাইপ করুন বা এআই কন্টাক্ট সাপোর্ট এজেন্টের সাহায্য নিন।");
    }
  };

  return (
    <div className="bg-slate-900/40 duration-300 rounded-[32px] p-6 border border-slate-800 shadow-2xl space-y-5">
      {/* Heading */}
      <div className="text-center space-y-1">
        <h2 className="font-extrabold text-[12px] text-amber-400 uppercase tracking-widest flex items-center justify-center">
          <Coins className="w-4 h-4 mr-1.5 text-amber-400 animate-spin-slow" />
          নিরাপদ গেটওয়ে ডিপোজিট চ্যানেল
        </h2>
        <p className="text-[10px] text-slate-400 leading-normal max-w-sm mx-auto">
          পেমেন্ট করার পর ট্রানজেকশন আইডি সাবমিট করলে ডাবল সিকিউরিটি সিস্টেমে ইনস্ট্যান্ট খাতা চেক করে ব্যালেন্স অ্যাড হবে।
        </p>
      </div>

      {/* Gateway channel grid selector */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { key: "bKash", color: "text-pink-500", label: "বিকাশ", logo: "https://i.postimg.cc/d0pWchyG/images-(16).jpg" },
          { key: "Nagad", color: "text-orange-500", label: "নগদ", logo: "https://i.postimg.cc/L4zxG66m/unnamed.jpg" },
          { key: "Upay", color: "text-blue-400", label: "উপায়", logo: "https://i.postimg.cc/W1f80dSW/unnamed.png" },
          { key: "CellFin", color: "text-emerald-400", label: "সেলফিন", logo: "https://i.postimg.cc/NF47FF5y/images-(17).jpg" }
        ].map((item) => {
          const isSelected = selectedGateway === item.key;
          return (
            <button
              key={item.key}
              type="button"
              id={`gt-${item.key}`}
              onClick={() => {
                onGatewaySelect(item.key);
                setErrorMessage("");
                setSuccessMessage("");
              }}
              className={`p-2 bg-[#05070A]/85 border rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer active:scale-95 duration-200 ${
                isSelected 
                  ? "border-amber-500 bg-slate-900/60 shadow-lg shadow-amber-500/10 scale-102" 
                  : "border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/30"
              }`}
            >
              {/* Payment brand image logo */}
              <div className="w-10 h-10 rounded-full overflow-hidden mb-1.5 border border-slate-800 p-0.5 bg-slate-950 flex items-center justify-center">
                <img 
                  src={item.logo} 
                  alt={item.key} 
                  className="w-full h-full object-cover rounded-full"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className={`text-[10px] font-black tracking-wide ${item.color}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Official customer billing address info */}
      <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800 text-center space-y-2">
        <span className="text-[10px] text-slate-400 block font-medium">
          আমাদের অফিশিয়াল কাস্টমার মার্চেন্ট{" "}
          <span className="text-amber-400 font-bold underline underline-offset-2">{selectedGateway}</span>{" "}
          পার্সোনাল নাম্বার:
        </span>
        <div className="flex items-center justify-center space-x-2.5">
          <strong className="text-xl text-amber-500 font-mono tracking-widest select-all">
            {officialNumber}
          </strong>
          <button
            type="button"
            onClick={handleCopy}
            className="p-1 px-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-lg border border-amber-500/25 transition-all text-[9px] font-black flex items-center space-x-1 active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">কপিড!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>কপি</span>
              </>
            )}
          </button>
        </div>
        <p className="text-[9px] text-red-400/90 leading-relaxed font-bold">
          * আপনার ক্যাশ-ইন বা সেন্ডমানি সফল হওয়ার পর ফিরতি এসএমএসের ট্রানজেকশন আইডিটি কপি করে নিচের বক্সে ভেরিফাই করুন।
        </p>
      </div>

      {/* Operation logs alert */}
      {errorMessage && (
        <div className="text-[10px] bg-red-950/25 border border-red-500/20 text-red-300 p-3 rounded-xl flex items-start space-x-2">
          <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
          <p className="leading-relaxed font-semibold">{errorMessage}</p>
        </div>
      )}

      {successMessage && (
        <div className="text-[10px] bg-emerald-950/25 border border-emerald-500/20 text-emerald-300 p-3 rounded-xl flex items-start space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
          <p className="leading-relaxed font-semibold">{successMessage}</p>
        </div>
      )}

      {/* Input submission billing form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-extrabold">
            প্যাকেজের পরিমাণ সিলেক্ট করুন :
          </label>
          <select
            id="dep-pack-type"
            value={packCost}
            onChange={(e) => {
              setPackCost(e.target.value);
              setErrorMessage("");
              setSuccessMessage("");
            }}
            className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-bold cursor-pointer"
          >
            <option value="500">৳ ৫০০ টাকার কোস্টাল কার্গো প্যাকেজ</option>
            <option value="840">৳ ৮৪০ টাকার কন্টেইনার প্যাকেজ</option>
            <option value="1050">৳ ১০৫০ টাকার ওশান এলএনজি প্যাকেজ</option>
            <option value="2000">৳ ২০০০ টাকার মেগা অয়েল প্যাকেজ</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-extrabold flex items-center justify-between">
            <span>Transaction ID (TrxID)</span>
            <span className="text-[8px] bg-amber-500/10 text-amber-500 rounded border border-amber-500/20 px-1 py-0.5 normal-case">
              Required
            </span>
          </label>
          <input
            type="text"
            id="dep-trx"
            placeholder="যেমন: DE79WN2C2D"
            required
            value={trxId}
            onChange={(e) => setTrxId(e.target.value)}
            className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-amber-500 uppercase tracking-widest font-mono text-center"
          />
        </div>

        <button
          type="submit"
          id="verify-deposit-btn"
          className="w-full bg-gradient-to-tr from-amber-500 to-yellow-600 hover:brightness-110 active:scale-[0.98] text-black font-black py-3 rounded-xl text-xs shadow-lg shadow-amber-500/15 transition-all"
        >
          অটো ভেরিফাই ও ব্যালেন্স যোগ করুন
        </button>
      </form>
    </div>
  );
}

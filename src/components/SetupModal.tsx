/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Landmark } from "lucide-react";

interface SetupModalProps {
  onSelect: (gateway: string) => void;
}

export default function SetupModal({ onSelect }: SetupModalProps) {
  return (
    <div id="setup-modal" className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", damping: 25, stiffness: 350 }}
        className="bg-slate-900 border border-amber-500/30 p-6 rounded-2xl w-full max-w-sm text-center space-y-4 shadow-2xl relative overflow-hidden"
      >
        {/* Decorative Light Ring */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-60"></div>
        
        <div className="w-14 h-14 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto border border-amber-500/20 shadow-lg shadow-amber-500/5">
          <Landmark className="w-6 h-6 animate-pulse" />
        </div>
        
        <div className="space-y-1">
          <h2 className="text-lg font-black text-amber-400 tracking-wide">অপারেটর গেটওয়ে সেটআপ</h2>
          <p className="text-[11px] text-slate-400 leading-relaxed px-2">
            প্ল্যাটফর্মে প্রবেশ করার পূর্বে আপনার মোবাইল ব্যাংকিং অপারেটরটি জোড়াতালি বা সেটআপ করে নিশ্চিত করুন। পরবর্তীতে এটি অ্যাকাউন্ট সেটিংস থেকে যেকোনো সময় পরিবর্তন করতে পারবেন।
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs font-bold pt-2">
          <button 
            type="button"
            id="setup-bKash"
            onClick={() => onSelect("bKash")} 
            className="p-3 bg-pink-950/15 border border-pink-500/20 text-pink-400 rounded-xl hover:bg-pink-900/30 hover:border-pink-500/50 transition-all active:scale-95 flex flex-col items-center justify-center space-y-1.5 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden border border-pink-500/30 p-0.5 bg-slate-950">
              <img src="https://i.postimg.cc/d0pWchyG/images-(16).jpg" alt="bKash" className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" />
            </div>
            <span>বিকাশ</span>
          </button>
          <button 
            type="button"
            id="setup-Nagad"
            onClick={() => onSelect("Nagad")} 
            className="p-3 bg-orange-950/15 border border-orange-500/20 text-orange-400 rounded-xl hover:bg-orange-900/30 hover:border-orange-500/50 transition-all active:scale-95 flex flex-col items-center justify-center space-y-1.5 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden border border-orange-500/30 p-0.5 bg-slate-950">
              <img src="https://i.postimg.cc/L4zxG66m/unnamed.jpg" alt="Nagad" className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" />
            </div>
            <span>নগদ</span>
          </button>
          <button 
            type="button"
            id="setup-Upay"
            onClick={() => onSelect("Upay")} 
            className="p-3 bg-blue-950/15 border border-blue-500/20 text-blue-400 rounded-xl hover:bg-blue-900/30 hover:border-blue-500/50 transition-all active:scale-95 flex flex-col items-center justify-center space-y-1.5 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden border border-blue-500/30 p-0.5 bg-slate-950">
              <img src="https://i.postimg.cc/W1f80dSW/unnamed.png" alt="Upay" className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" />
            </div>
            <span>উপায়</span>
          </button>
          <button 
            type="button"
            id="setup-CellFin"
            onClick={() => onSelect("CellFin")} 
            className="p-3 bg-emerald-950/15 border border-emerald-500/20 text-emerald-400 rounded-xl hover:bg-emerald-900/30 hover:border-emerald-500/50 transition-all active:scale-95 flex flex-col items-center justify-center space-y-1.5 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden border border-emerald-500/30 p-0.5 bg-slate-950">
              <img src="https://i.postimg.cc/NF47FF5y/images-(17).jpg" alt="CellFin" className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" />
            </div>
            <span>সেলফিন</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}

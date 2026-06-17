/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Wallet, Eye, EyeOff } from "lucide-react";

interface HeaderProps {
  balance: number;
}

export default function Header({ balance }: HeaderProps) {
  const [showBalance, setShowBalance] = useState<boolean>(false);

  return (
    <header className="bg-[#05070A]/90 backdrop-blur-md px-4 py-3 sticky top-0 flex justify-between items-center border-b border-slate-800/80 z-40 shadow-xl">
      {/* Platform Logo branding using user link - name text removed as requested, raw without border */}
      <div className="flex items-center">
        <img 
          src="https://i.postimg.cc/3wZKL0fz/file-00000000c6307209894308bca474e8e6.png" 
          alt="MSKE Logo" 
          className="h-10 w-auto object-contain"
          onError={(e) => {
            // Direct high status fallback just in case
            e.currentTarget.onerror = null;
            e.currentTarget.src = "https://i.postimg.cc/RhD5kS4T/file-00000000c6307209894308bca474e8e6.png";
          }}
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Interactive balance checker */}
      <button 
        type="button"
        id="toggle-balance"
        onClick={() => setShowBalance(!showBalance)}
        className="bg-slate-900/50 border border-slate-800 hover:border-amber-500/40 px-3.5 py-1.5 rounded-full flex items-center space-x-2 shadow-inner transition-all hover:bg-slate-800/80"
      >
        <Wallet className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
        <span id="bal-txt" className="text-xs font-black text-amber-400 tracking-wide select-none min-w-[76px]">
          {showBalance ? `৳ ${balance.toFixed(2)}` : "ব্যালেন্স দেখুন"}
        </span>
        {showBalance ? (
          <EyeOff className="w-3 h-3 text-amber-500/60" />
        ) : (
          <Eye className="w-3 h-3 text-amber-500/60" />
        )}
      </button>
    </header>
  );
}

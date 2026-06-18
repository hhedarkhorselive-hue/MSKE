import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ChevronLeft, 
  RotateCw, 
  Wallet, 
  CreditCard, 
  Copy, 
  Check, 
  Flame, 
  AlertTriangle, 
  CheckCircle2, 
  Globe, 
  Lock, 
  Search,
  CheckCircle,
  Coins
} from "lucide-react";

// Secure mock verification keys matching the vessel purchase options
const trxDatabase: Record<string, string[]> = {
  "100": ["DE100K7AQS", "DE100W9YUL", "DE100PLXND", "DE100JK8WF"],
  "500": ["DE79WN2C2D", "DEL9FJK7OT", "DEO4K0EKFA", "DE7XPL9M2Q", "DEK5RT8V1N"],
  "840": ["DE84QM7A2K", "DE8N5LP0TX", "DE840RZ6WF", "DE8H2JK9MC", "DE84PV3QAL"],
  "1000": ["DE1000XK7P", "DE1000LM2R", "DE1000W8TY", "DE1000FJ6N", "DE1000ZP3K"],
  "2000": ["DE2000LK8M", "DE20QW5RX2", "DE200AZ7PN", "DE20M4YT9K", "DE2000VF6C"],
  "5000": ["DE5000XK7P", "DE5000LM2R", "DE5000QW8T", "DE5000FJ6N", "DE5000ZP3D"]
};

// Official numbers or wallets matching different channels
const WALLET_NUMBERS: Record<string, string> = {
  "Nagad": "01345632818",
  "bKash": "01333468617",
};

interface DepositViewProps {
  balance: number;
  selectedGateway: string; // e.g. bKash / Nagad / USDT
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
  // Navigation states
  // screenStage: 1 = Main Select Page, 2 = Payment Details Page
  const [screenStage, setScreenStage] = useState<number>(1);
  
  // Selected billing details
  const [rechargeChannel, setRechargeChannel] = useState<string>("OpPay-NAGAD");
  const [depositAmount, setDepositAmount] = useState<number>(500);
  
  // Custom user parameters
  const [enteredTrxId, setEnteredTrxId] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [isRotating, setIsRotating] = useState<boolean>(false);
  const [language, setLanguage] = useState<"EN" | "BN">("EN");
  
  // UI logging flags
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  // Available Channels relative to the selected gateway
  const channelLogos: Record<string, string> = {
    "bKash": "https://i.postimg.cc/d0pWchyG/images-(16).jpg",
    "Nagad": "https://i.postimg.cc/L4zxG66m/unnamed.jpg",
  };

  const channelsList = [
    { id: "oppay", name: `OpPay-${selectedGateway.toUpperCase()}`, limit: "100 - 25K" },
    { id: "cashpay", name: `CashPay-${selectedGateway.toLowerCase()}`, limit: "100 - 25K" },
    { id: "karopay", name: `KaroPay-${selectedGateway.toUpperCase()}`, limit: "100 - 25K" },
    { id: "luckypay", name: `Lucky-${selectedGateway.toLowerCase()}`, limit: "100 - 25K" },
    { id: "starpago", name: `StarPago-${selectedGateway.toUpperCase()}`, limit: "100 - 30K" },
    { id: "rolezpay", name: `RolezPay-${selectedGateway.toLowerCase()}`, limit: "100 - 30K" },
  ];

  // Sync default channel on gateway change
  React.useEffect(() => {
    setRechargeChannel(`OpPay-${selectedGateway.toUpperCase()}`);
    setErrorMessage("");
    setSuccessMessage("");
  }, [selectedGateway]);

  const handleWalletCopy = () => {
    const num = WALLET_NUMBERS[selectedGateway] || "01333468617";
    navigator.clipboard.writeText(num);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleManualBalanceRefresh = () => {
    setIsRotating(true);
    setTimeout(() => setIsRotating(false), 800);
  };

  // Proceed to Step 2 (The payment confirmation check page)
  const handleProceedToPayment = () => {
    setErrorMessage("");
    setEnteredTrxId("");
    setScreenStage(2);
  };

  // Step 2 Submission & Verification Engine
  const handleConfirmTrxId = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const cleanTrx = enteredTrxId.trim().toUpperCase();
    if (!cleanTrx) {
      setErrorMessage("TrxID অবশ্যই পূরণ করতে হবে! (Transaction ID required)");
      return;
    }

    if (usedTrx.includes(cleanTrx)) {
      setErrorMessage("এই Transaction ID (TrxID) টি ইতিমধ্যে আমাদের ডাটাবেসে পেমেন্ট ভেরিফাই হয়েছে!");
      return;
    }

    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);

      // Verify transaction matching the selected amount
      const validTrxList = trxDatabase[depositAmount.toString()];
      const isPredefinedMatch = validTrxList && validTrxList.includes(cleanTrx);
      
      // If it matches pre-defined database OR behaves like a general simulated 10-character code, accept & deposit!
      if (isPredefinedMatch || (cleanTrx.length >= 8 && !usedTrx.includes(cleanTrx))) {
        onDepositComplete(depositAmount, cleanTrx, selectedGateway);
        setSuccessMessage(`পেমেন্ট ভেরিফিকেশন সফল! আপনার ওয়ালেটে ৳${depositAmount} অটোমেটিকভাবে যোগ করা হয়েছে।`);
        
        // Auto-close overlay back to Stage 1 after short success delay
        setTimeout(() => {
          setScreenStage(1);
          setSuccessMessage("");
          setEnteredTrxId("");
        }, 2200);
      } else {
        setErrorMessage("ভুল লেনদেন আইডি! আপনি যে টাকা সিলেক্ট করেছেন তার সাথে এই TrxID মিলছে না। অনুগ্রহ করে সঠিক আইডি টাইপ করুন।");
      }
    }, 1500);
  };

  return (
    <div id="unified-deposit-wrapper" className="min-h-screen max-w-md mx-auto w-full bg-[#f4f5f7] text-slate-800">
      <AnimatePresence mode="wait">
        
        {/* STAGE 1: DEPOSIT CHANNELS & AMOUNTS SELECTION */}
        {screenStage === 1 ? (
          <motion.div
            key="deposit-stage-1"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="flex flex-col h-full bg-[#f4f5f7] pb-5"
          >
            {/* Header section styled match user's custom HTML snippet */}
            <div className="bg-white px-4 py-3.5 flex items-center justify-between border-b border-gray-200">
              <button 
                type="button" 
                onClick={() => {
                  // Direct clean fallback
                  const backBtn = document.getElementById("profile-back-trigger");
                  if (backBtn) backBtn.click();
                }}
                className="text-gray-700 text-lg hover:bg-zinc-100 p-1.5 rounded-full transition-colors cursor-pointer"
                title="ফিরে যান"
              >
                <ChevronLeft className="w-5 h-5 text-gray-800" />
              </button>
              <h1 className="text-[17px] font-bold text-slate-800">Deposit Money</h1>
              <span className="text-xs font-semibold text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full">
                Safe Channel
              </span>
            </div>

            {/* Glowing Golden balance box matching exactly BDT 0.68 mockup styling */}
            <div className="m-3 p-5 bg-gradient-to-r from-[#fcd435] to-[#f59e0b] rounded-[24px] relative overflow-hidden shadow-md text-white">
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full pointer-events-none"></div>
              <div className="absolute -right-5 -top-5 w-24 h-24 bg-white/10 rounded-full pointer-events-none"></div>
              
              <div className="flex items-center gap-1.5 text-white/95 text-xs font-extrabold uppercase tracking-wider mb-1">
                <Wallet className="w-3.5 h-3.5" />
                Current Wallet Balance
              </div>
              <div className="flex items-center gap-3 text-white font-black text-3.5xl">
                <span className="font-sans">৳ {balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                <button 
                  type="button" 
                  onClick={handleManualBalanceRefresh}
                  className={`text-lg text-white/80 hover:text-white transition-all cursor-pointer p-1 rounded-full hover:bg-white/10 ${isRotating ? "rotate-180" : ""}`}
                >
                  <RotateCw className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Stage 1 Method Selector strip - Nagad, bKash */}
            <div className="flex gap-4 px-6 mb-4.5 bg-white py-3 rounded-2xl mx-3 justify-center items-center">
              
              {/* NAGAD SELECTION BUTTON */}
              <div 
                onClick={() => onGatewaySelect("Nagad")}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 ${
                  selectedGateway === "Nagad" 
                    ? "bg-[#fcd435] border-[#fcd435] shadow-md" 
                    : "bg-white border-zinc-200 hover:border-amber-300"
                }`}
              >
                <div className="w-6 h-6 bg-[#f04e36] text-white rounded-full flex items-center justify-center text-[10px] font-black">
                  <span>N</span>
                </div>
                <span className={`text-xs font-extrabold ${selectedGateway === "Nagad" ? "text-slate-900" : "text-slate-700"}`}>Nagad</span>
              </div>

              {/* BKASH SELECTION BUTTON */}
              <div 
                onClick={() => onGatewaySelect("bKash")}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 ${
                  selectedGateway === "bKash" 
                    ? "bg-[#e2136e] border-[#e2136e] shadow-md shadow-pink-500/10" 
                    : "bg-white border-zinc-200 hover:border-pink-300"
                }`}
              >
                <div className="w-6 h-6 bg-[#e2136e] rounded-full flex items-center justify-center text-white text-[8px] font-black">
                  <span>bKash</span>
                </div>
                <span className={`text-xs font-extrabold ${selectedGateway === "bKash" ? "text-white" : "text-slate-700"}`}>bKash</span>
              </div>
            </div>

            {/* Core Channel & Package Grid card */}
            <div className="mx-3 p-4 bg-white rounded-2xl border border-zinc-200 shadow-sm mb-4">
              <div className="flex items-center gap-2 mb-3 text-slate-800 font-extrabold text-[14px]">
                <CreditCard className="w-4.5 h-4.5 text-[#fcd435]" />
                <h2>Select channel (চ্যানেল সিলেক্ট করুন)</h2>
              </div>

              {/* Adaptive list of dynamic channels matching selected gateway */}
              <div className="grid grid-cols-2 gap-2.5 mb-5.5">
                {channelsList.map((ch) => {
                  const isActive = rechargeChannel === ch.name;
                  return (
                    <div 
                      key={ch.id}
                      onClick={() => setRechargeChannel(ch.name)}
                      className={`p-2.5 rounded-xl cursor-pointer border transition-all duration-200 flex items-center gap-2 ${
                        isActive 
                          ? "bg-[#fcd435] border-[#fcd435] text-slate-900 shadow-md" 
                          : "bg-[#f8f9fa] border-zinc-100 hover:border-zinc-300 text-zinc-500"
                      }`}
                    >
                      <img src={channelLogos[selectedGateway]} alt={selectedGateway} className="w-8 h-8 rounded-lg object-cover" referrerPolicy="no-referrer" />
                      <div>
                        <div className="text-[11.5px] font-black tracking-tight">{ch.name}</div>
                        <div className={`text-[9px] mt-0.5 ${isActive ? "text-slate-800/90 font-bold" : "text-zinc-400"}`}>
                          Amount: {ch.limit}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Dynamic packages/amount selection headers */}
              <div className="flex items-center gap-2 mb-3 text-slate-800 font-extrabold text-[14px]">
                <Wallet className="w-4.5 h-4.5 text-[#fcd435]" />
                <h2>Deposit Amount (টাকার পরিমাণ সিলেক্ট করুন)</h2>
              </div>

              {/* Precise grids matching investment packs 500, 840, 1000, 2000, 5000 */}
              <div className="grid grid-cols-3 gap-2.5">
                {[500, 840, 1000, 2000, 5000].map((val) => {
                  const isSelected = depositAmount === val;
                  return (
                    <div 
                      key={val}
                      onClick={() => setDepositAmount(val)}
                      className={`border text-center py-2.5 rounded-xl text-xs font-black cursor-pointer transition-all ${
                        isSelected 
                          ? "bg-amber-100 border-[#fcd435] text-[#fcd435] shadow-inner scale-102"
                          : "border-gray-200 text-slate-800 bg-white hover:bg-slate-50"
                      }`}
                    >
                      ৳ <span className="font-sans font-black text-slate-900 text-xs ml-0.5">{val.toLocaleString("en-US")}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom summary and Action proceeding trigger to screenStage 2 */}
            <div className="bg-white mx-3 p-3.5 rounded-2xl flex items-center justify-between shadow-sm border border-gray-200">
              <div>
                <div className="text-[10px] text-gray-400 font-extrabold uppercase">Recharge Method:</div>
                <div className="text-xs font-black text-slate-800">{rechargeChannel}</div>
              </div>
              <button 
                type="button"
                onClick={handleProceedToPayment}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs transition-all cursor-pointer active:scale-95 shadow-md shadow-amber-500/10"
              >
                টাকা জমা দিন (Deposit)
              </button>
            </div>

          </motion.div>
        ) : (
          
          /* STAGE 2: PAY SERVICE INPUT DETAILS SCREEN MATCHING EXACT NAGAD SUB-FORM */
          <motion.div
            key="deposit-stage-2"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="flex flex-col h-full bg-white pb-6"
          >
            {/* Header with green background from HTML requested layout */}
            <div className="bg-[#006a4e] text-white px-4 py-3 flex justify-between items-start select-none">
              <div className="text-left">
                <h1 className="text-xl font-bold tracking-wide font-sans">BDT {depositAmount}</h1>
                <p className="text-xs font-semibold mt-1">কম বা বেশি ক্যাশআউট করবেন না</p>
              </div>
              <div className="flex flex-col items-end gap-2 text-right">
                <div className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded text-[10px] font-black tracking-widest">
                  <span className="bg-white text-[#006a4e] px-1 rounded text-[10px] font-bold">PAY</span> SERVICE
                </div>
                <div className="bg-emerald-950/40 rounded flex p-0.5 text-[10px] font-bold">
                  <span 
                    onClick={() => setLanguage("EN")}
                    className={`px-1.5 py-0.5 rounded-sm shadow-sm cursor-pointer transition-colors ${language === "EN" ? "bg-white text-gray-800" : "text-gray-300"}`}
                  >
                    EN
                  </span>
                  <span 
                    onClick={() => setLanguage("BN")}
                    className={`px-1.5 py-0.5 rounded-sm cursor-pointer transition-colors ${language === "BN" ? "bg-white text-gray-800" : "text-gray-300"}`}
                  >
                    বাং
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 text-left">
              {/* Back step to cancel/modify amount */}
              <button
                type="button"
                onClick={() => {
                  setScreenStage(1);
                  setErrorMessage("");
                }}
                className="mb-3 text-[11px] text-[#0f766e] font-extrabold flex items-center hover:underline cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> চ্যানাল ও পরিমাণ রিসেট করুন (Back to setup)
              </button>

              <p className="text-[#e14938] font-black text-xs leading-relaxed mb-4 p-2 bg-red-50 border border-red-100 rounded-lg">
                ❌ আপনি যদি টাকার পরিমাণ পরিবর্তন করেন (BDT {depositAmount}), আপনি ক্রেডিট পেতে সক্ষম হবেন না।
              </p>

              {/* Dynamic Active Branding Card based on chosen Gateway */}
              {selectedGateway === "Nagad" && (
                <div className="bg-[#f04e36] rounded-xl p-3.5 flex items-center gap-3 shadow-sm mb-4 text-white">
                  <div className="w-12 h-12 bg-white rounded-full flex flex-col items-center justify-center p-1 border-2 border-white shadow-inner">
                    <span className="text-[#f04e36] text-[10px] font-black leading-none">নগদ</span>
                    <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse mt-0.5" />
                  </div>
                  <span className="text-base font-black tracking-wide">NAGAD Cash Out Deposit</span>
                </div>
              )}

              {selectedGateway === "bKash" && (
                <div className="bg-[#e2136e] rounded-xl p-3.5 flex items-center gap-3 shadow-sm mb-4 text-white">
                  <div className="w-12 h-12 bg-white rounded-full flex flex-col items-center justify-center p-1 border-2 border-white shadow-inner">
                    <span className="text-[#e2136e] text-[9px] font-black leading-none">bKash</span>
                    <Check className="w-4 h-4 text-pink-500 mt-0.5" />
                  </div>
                  <span className="text-base font-black tracking-wide font-sans">BKASH Cash Out Deposit</span>
                </div>
              )}

              {/* Action warnings & messages container log info */}
              {errorMessage && (
                <div className="mb-4 text-xs font-extrabold bg-red-950/90 border border-red-500/30 text-red-300 p-3 rounded-xl flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="mb-4 text-xs font-black bg-emerald-950/90 border border-emerald-500/30 text-emerald-300 p-3 rounded-xl flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Dynamic copyable wallet number block */}
              <div className="mb-4 text-left">
                <label className="block text-black font-extrabold text-[15px] mb-1">
                  Wallet No<span className="text-purple-600 font-bold">*</span>
                </label>
                <p className="text-zinc-600 font-bold text-[12px] mb-2 leading-relaxed">
                  এই {selectedGateway} নাম্বারে শুধুমাত্র <span className="text-red-500 font-black">ক্যাশআউট</span> গ্রহণ করা হয় (অন্যকোন ওযালটে গ্রহণযোগ্য নয়)
                </p>
                
                <div className="bg-[#f1f3f4] rounded-xl p-3.5 flex justify-between items-center border border-gray-200">
                  <span className="text-gray-900 font-mono text-[15px] tracking-wider font-extrabold pl-2 select-all break-all">
                    {WALLET_NUMBERS[selectedGateway] || "01345632818"}
                  </span>
                  <button 
                    type="button"
                    onClick={handleWalletCopy}
                    className="text-[#0f766e] hover:scale-110 active:scale-95 transition-transform text-2xl pr-2 cursor-pointer p-1"
                    title="কপি করুন"
                  >
                    {copied ? <Check className="w-5 h-5 text-emerald-600 font-black" /> : <Copy className="w-4.5 h-4.5 text-zinc-600" />}
                  </button>
                </div>
              </div>

              {/* Form submit confirmation checking box */}
              <form onSubmit={handleConfirmTrxId} className="space-y-4">
                <div className="mb-4">
                  <label className="block text-black font-black text-[14px] mb-1">
                    ক্যাশআউটের TrxID নাম্বারটি লিখুন
                  </label>
                  <span className="block text-[#e14938] font-extrabold text-xs mb-1.5">(প্রয়োজনীয - Required)</span>
                  
                  {/* Floating helpful quick codes recommendation */}
                  <div className="mb-2 bg-amber-50 border border-amber-100 p-2 rounded-lg text-[9px] text-amber-800 leading-normal">
                    <span>💡 টেস্ট করার জন্য যেকোনো একটি সচল TrxID কোড ব্যবহার করুন: </span>
                    <strong className="font-mono text-[10px] text-zinc-900 ml-1">
                      {trxDatabase[depositAmount.toString()]?.[0] || "DE5000XK7P"}
                    </strong>
                  </div>

                  <input 
                    type="text" 
                    required
                    value={enteredTrxId}
                    onChange={(e) => setEnteredTrxId(e.target.value)}
                    placeholder="TrxID অবশ্যই পূরণ করতে হবে!" 
                    className="w-full border-2 border-[#e14938] rounded-xl p-3 text-slate-800 placeholder-gray-400 font-extrabold text-center tracking-widest focus:outline-none focus:border-red-600 uppercase font-mono text-[15px]"
                  />
                </div>

                <div className="flex justify-center mb-5 mt-1">
                  <button 
                    type="submit"
                    disabled={isVerifying}
                    className={`border-2 border-black rounded-xl px-12 py-2.5 text-slate-950 font-black text-sm hover:bg-black hover:text-white transition-all cursor-pointer active:scale-95 ${
                      isVerifying ? "bg-zinc-100 border-zinc-300 text-zinc-400 cursor-not-allowed" : "bg-white"
                    }`}
                  >
                    {isVerifying ? "যাচাই করা হচ্ছে..." : "নিশ্চিত (Confirm Submission)"}
                  </button>
                </div>
              </form>

              {/* Bengali rules and liability disclaimer footer */}
              <div className="text-left px-1 mt-4 border-t border-zinc-100 pt-3">
                <h3 className="text-black font-extrabold text-xs mb-1">সতর্কতাঃ (Cautionary terms)</h3>
                <p className="text-[#e14938] font-bold text-[10.5px] leading-relaxed mb-1.5">
                  লেনদেন আইডি সঠিকভাবে পূরণ করতে হবে, অন্যথায় স্কোর ব্যর্থ হবে এবং পরবর্তীতে পেমেন্ট ক্রেডিট দাবি করা যাবে না!
                </p>
                <p className="text-gray-400 text-[10px] leading-relaxed">
                  অনুগ্রহ করে নিশ্চিত হয়ে নিন যে আপনি {selectedGateway} deposit ওয়ালেট নাম্বারে ক্যাশ আউট করছেন। এই নাম্বারের অন্য কোন ওয়ালেট ভেলু দিলে সেই টাকা পাওয়ার কোনো সম্ভাবনা নাই।
                </p>
              </div>

            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

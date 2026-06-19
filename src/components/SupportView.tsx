/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, HelpCircle, Loader2, Compass } from "lucide-react";
import { ChatMessage } from "../types";

export default function SupportView() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "আসসালামু আলাইকুম! এমএসকেএ শিপিং (MSKE Shipping) এআই মার্চেন্ট অ্যাসিস্ট্যান্ট সার্ভারে আপনাকে স্বাগতম। জাহাজ লিজ, দৈনিক প্রফিট আর্নিং বা ডিপোজিটের ট্রানজেকশন (TrxID) অটো ভেরিফাই করতে কোনো সমস্যা হচ্ছে কি? নিচে প্রশ্ন করুন, আমি সাহায্য করছি।",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputVal, setInputVal] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: "user",
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    setLoading(true);

    try {
      // Send the entire conversation history to maintain context
      const chatHistory = [...messages, userMsg].map((msg) => ({
        role: msg.role === "assistant" ? "assistant" : "user",
        content: msg.content
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ messages: chatHistory })
      });

      if (!res.ok) {
        throw new Error("সাপোর্ট সার্ভারে ত্রুটি ঘটেছে!");
      }

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        role: "assistant",
        content: data.response || "আমি আপনার কথাটি বুঝতে পারছি না। দয়া করে মেইন হেল্পলাইনে যোগাযোগ করুন।",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error("Chat error:", err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content: "দুঃখিত, এই মুহূর্তে এআই মার্চেন্ট সংযোগ বিচ্ছিন্ন রয়েছে। যেকোনো অফিশিয়াল তথ্যের জন্য সরাসরি বিকাশ বা নগদ মার্চেন্ট হেল্পলাইনে (01333468617) যোগাযোগ করতে পারেন।",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickQuestion = (val: string) => {
    handleSend(val);
  };

  return (
    <div className="bg-white/40 border border-white/60 rounded-[32px] shadow-sm flex flex-col h-[460px] overflow-hidden text-zinc-900">
      {/* Support Chat Board Header */}
      <div className="bg-white/60 p-4 border-b border-white/60 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-full bg-amber-400/20 border border-amber-400/30 flex items-center justify-center relative">
            <Bot className="w-4 h-4 text-amber-600 animate-pulse" />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white"></span>
          </div>
          <div>
            <h3 className="text-xs font-black text-zinc-900 hover:text-amber-700 cursor-pointer transition-all flex items-center">
              এমএসকেএ শিপিং অ্যাসিস্ট্যান্ট
            </h3>
            <span className="text-[9px] text-emerald-700 font-bold block flex items-center">
              <Compass className="w-2.5 h-2.5 mr-0.5 animate-spin-slow" /> Active Support Chatbot
            </span>
          </div>
        </div>
        <span className="text-[9px] text-zinc-500 font-mono">MODEL: GEMINI-3.5-FLASH</span>
      </div>

      {/* Messages list bubble viewport */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 Scrollbar bg-white/30">
        {messages.map((msg) => {
          const isBot = msg.role === "assistant";
          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-2 w-full max-w-sm ${
                isBot ? "" : "ml-auto flex-row-reverse space-x-reverse"
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border text-[10px] ${
                isBot 
                  ? "bg-amber-400/20 border-amber-400/30 text-amber-700" 
                  : "bg-zinc-800 border-zinc-700 text-zinc-200"
              }`}>
                {isBot ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
              </div>

              <div className="space-y-0.5">
                <div className={`p-3 rounded-2xl text-[11px] leading-relaxed relative ${
                  isBot 
                    ? "bg-white/70 border border-white/60 text-zinc-800" 
                    : "bg-gradient-to-tr from-amber-400 to-yellow-500 text-zinc-950 font-semibold"
                }`}>
                  <p className="whitespace-pre-line">{msg.content}</p>
                </div>
                <span className={`text-[8px] text-zinc-500 block ${isBot ? "" : "text-right"}`}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-start space-x-2 w-full max-w-sm">
            <div className="w-6 h-6 rounded-full bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-600">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="bg-white/70 border border-white/60 p-3 rounded-2xl text-[11px] text-zinc-700 flex items-center space-x-2.5 shadow-sm">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
              <span>মার্চেন্ট খাতা চেক করে জেনারেট হচ্ছে...</span>
            </div>
          </div>
        )}
        <div ref={scrollRef}></div>
      </div>

      {/* Suggested quick assistance prompts */}
      <div className="px-4 py-2 bg-white/60 border-t border-white/60 flex space-x-1.5 overflow-x-auto select-none">
        <button
          type="button"
          onClick={() => handleQuickQuestion("ন্যূনতম উইথড্র কত?")}
          className="bg-white border border-white/60 hover:border-amber-400/40 hover:text-amber-700 transition-colors text-[9px] text-zinc-600 px-2.5 py-1.5 rounded-full shrink-0 flex items-center space-x-1 font-bold cursor-pointer"
        >
          <HelpCircle className="w-3 h-3 text-amber-600" />
          <span>উইথড্র লিমিট</span>
        </button>
        <button
          type="button"
          onClick={() => handleQuickQuestion("আমার পেমেন্ট এখনও পেন্ডিং কেন?")}
          className="bg-white border border-white/60 hover:border-amber-400/40 hover:text-amber-700 transition-colors text-[9px] text-zinc-600 px-2.5 py-1.5 rounded-full shrink-0 flex items-center space-x-1 font-bold cursor-pointer"
        >
          <HelpCircle className="w-3 h-3 text-amber-600" />
          <span>পেন্ডিং উইথড্রাল</span>
        </button>
        <button
          type="button"
          onClick={() => handleQuickQuestion("টাকা কিভাবে ডিপোজিট করব?")}
          className="bg-white border border-white/60 hover:border-amber-400/40 hover:text-amber-700 transition-colors text-[9px] text-zinc-600 px-2.5 py-1.5 rounded-full shrink-0 flex items-center space-x-1 font-bold cursor-pointer"
        >
          <HelpCircle className="w-3 h-3 text-amber-600" />
          <span>কীভাবে ডিপোজিট করব?</span>
        </button>
      </div>

      {/* Message drafting form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(inputVal);
        }}
        className="p-3 bg-white/60 border-t border-white/60 flex space-x-2"
      >
        <input
          type="text"
          placeholder="এখানে লিখুন (যেমন: আমার ৮৪০ টাকার প্যাকেজ TrxID...)"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          disabled={loading}
          className="bg-white/50 border border-white/60 transition-all focus:border-amber-400 text-xs text-zinc-900 placeholder-zinc-500 rounded-xl px-3 flex-1 focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading || !inputVal.trim()}
          className="bg-gradient-to-tr from-amber-400 to-yellow-500 text-zinc-950 p-2.5 rounded-xl hover:brightness-110 active:scale-95 transition-all shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}

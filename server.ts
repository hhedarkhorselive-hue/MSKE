/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import dns from "dns";

// Ensure Node.js prioritizes IPv4 resolution to prevent container "fetch failed" timeouts
dns.setDefaultResultOrder("ipv4first");

// Load environment variables
dotenv.config();

// ES modules helper
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Setup JSON parsing middleware
  app.use(express.json());

// Helper function to generate deep smart context-aware responses in Bengali/English when Gemini API limits/access issues occur
function getSmartFallbackResponse(lastMessage: string): string {
  const msg = lastMessage.toLowerCase();
  
  if (msg.includes("উইথড্র") || msg.includes("withdraw") || msg.includes("টাকা তুলব") || msg.includes("পেমেন্ট") || msg.includes("payment") || msg.includes("টাকা তোলা")) {
    if (msg.includes("পেন্ডিং") || msg.includes("pending") || msg.includes("দেরি") || msg.includes("delay") || msg.includes("সময়") || msg.includes("টাইম")) {
      return `এমএসকেএ প্ল্যাটফর্মের পেমেন্ট সম্পূর্ণ নিরাপদ ও অটোমেটেড। আমাদের ট্রানজেকশন প্রসেসিং অত্যন্ত দ্রুত কাজ করে। সাধারণত উইথড্র রিকোয়েস্ট সাবমিট করার পর ১ থেকে ৩ ঘণ্টার মধ্যে আপনার বিকাশ বা নগদ নাম্বারে পেমেন্ট পৌঁছে দেয়া হয়। অনুগ্রহ করে একটু ধৈর্য ধরে অপেক্ষা করুন।`;
    }
    if (msg.includes("লিমিট") || msg.includes("কম") || msg.includes("৪৫০") || msg.includes("limit") || msg.includes("মিন")) {
      return `এমএসকেএ শিপিং প্ল্যাটফর্মে সর্বনিম্ন উইথড্রাল লিমিট হলো ৪৫০ টাকা (৳ ৪৫০)। আপনার প্রফিট বা রেফারেল ওয়ালেট ব্যালেন্স ৪৫০ টাকা বা তার বেশি হলে আপনি পেমেন্ট রিকোয়েস্ট করতে পারবেন।`;
    }
    return `এমএসকেএ প্ল্যাটফর্মের পেমেন্ট ও উইথড্র উইন্ডো ২৪/৭ সম্পূর্ণ সচল রয়েছে। সর্বনিম্ন উইথড্রাল লিমিট হলো ৪৫০ টাকা এবং উইথড্র করার পর ১ থেকে ৩ ঘণ্টার মধ্যে সরাসরি আপনার বিকাশ বা নগদ পার্সোনাল নাম্বারে পেমেন্ট পাঠিয়ে দেওয়া হয়।`;
  }
  
  if (msg.includes("ডিপোজিট") || msg.includes("deposit") || msg.includes("টাকা এড") || msg.includes("রিচার্জ") || msg.includes("ব্যালেন্স যোগ") || msg.includes("trxid") || msg.includes("trx") || msg.includes("ট্রানজেকশন") || msg.includes("ভেরিফাই") || msg.includes("verify") || msg.includes("টাকা অ্যাড")) {
    if (msg.includes("পাস") || msg.includes("পেল") || msg.includes("সমস্যা") || msg.includes("অ্যাড হচ্ছে না") || msg.includes("ref") || msg.includes("ভুল") || msg.includes("ত্রুটি")) {
      return `ডিপোজিট ব্যালেন্স অ্যাড হতে সমস্যা হলে অনুগ্রহ করে আপনার পেমেন্ট গেটওয়ে (বিকাশ অথবা নগদ), রিচার্জের টাকার পরিমাণ এবং সঠিক ট্রানজেকশন আইডি (TrxID) মিলিয়ে দেখুন। 'ডিপোজিট' ট্যাব থেকে TrxID সাবমিট করার সাথে সাথে আমাদের ডাবল সিকিউরিটি ইন্টিগ্রেশন মার্চেন্ট খাতা রিড করে ইনস্ট্যান্টলি ব্যালেন্স রিচার্জ করাবে।`;
    }
    return `এমএসকেএ এআই মার্চেন্ট ডিপোজিট সিস্টেমে আপনাকে স্বাগতম। ব্যালেন্স অ্যাড করতে 'ব্যালেন্স অ্যাড করুন' (ডিপোজিট) সেকশন থেকে আপনার পেমেন্ট মেথড সিলেক্ট করুন, আমাদের অফিশিয়াল মার্চেন্ট নাম্বারে (01333468617) নির্দিষ্ট অ্যামাউন্ট সেন্ড মানি করুন এবং অ্যাপে ট্রানজেকশন আইডি (TrxID) বসিয়ে অটো ভেরিফাই বাটনে চাপুন। কয়েক সেকেন্ডের মধ্যে ব্যালেন্স অ্যাড হয়ে যাবে!`;
  }
  
  if (msg.includes("প্যাকেজ") || msg.includes("package") || msg.includes("ভেসেল") || msg.includes("ship") || msg.includes("জাহাজ") || msg.includes("শেয়ার") || msg.includes("বিনিয়োগ") || msg.includes("investment") || msg.includes("আয়") || msg.includes("income") || msg.includes("রিটার্ন")) {
    return `এমএসকেএ শিপিং এ আপনি ৪টি লাভজনক ভেসেল ফ্লিটে অংশ নিতে পারবেন:\n\n১. কোস্টাল কার্গো (৳ ৫০০) - দৈনিক ৳ ৩৫\n২. কন্টেইনার সার্ভিস (৳ ৮৪০) - দৈনিক ৳ ৬০\n৩. ডিপ সি ওশেন গেটওয়ে (৳ ১,০৫০) - দৈনিক ৳ ৮০\n৪. সুপার অয়েল ট্যাঙ্কার (৳ ২,০০০) - দৈনিক ৳ ১৫০\n\nযেকোনো প্যাকেজ কিনে দৈনিক ক্লেম অপশন থেকে প্রতিদিন আপনার রেভিনিউ কালেক্ট করতে পারবেন।`;
  }
  
  if (msg.includes("রেফার") || msg.includes("refer") || msg.includes("কোড") || msg.includes("লিংক") || msg.includes("বোনাস") || msg.includes("কমিশন") || msg.includes("invite") || msg.includes("আমন্ত্রণ")) {
    return `আমাদের রেফারেল হাবে বন্ধুদের আমন্ত্রণ জানালে রয়েছে চমৎকার বোনাস! প্রতিটি সফল রেফারে আপনি পাবেন ইনস্ট্যান্ট ৳ ৫০ বোনাস এবং তাদের অর্জিত দৈনিক প্রফিটের ওপর সরাসরি ৫% আজীবন কমিশন বোনাস। টিম বাড়াতে 'রেফার হাব' থেকে আপনার ইউনিক লিংকটি আজই শেয়ার করুন।`;
  }
  
  if (msg.includes("সালাম") || msg.includes("আসসালামু") || msg.includes("হ্যালো") || msg.includes("hello") || msg.includes("hi") || msg.includes("হেই") || msg.includes("কেমন") || msg.includes("help") || msg.includes("সাহায্য")) {
    return `ওয়ালাইকুম আসসালাম! এমএসকেএ শিপিং এআই মার্চেন্ট অ্যাসিস্ট্যান্ট হিসেবে আপনাকে সহযোগিতা করতে পেরে আমি আনন্দিত। আপনার ডিপোজিট পেন্ডিং, ট্রানজেকশন আইডি সমস্যা, উইথড্রাল রিকোয়েস্ট বা শিপিং শেয়ার লিজ সংক্রান্ত যেকোনো প্রশ্ন করুন, আমি সাহায্য করছি।`;
  }
  
  // Default smart assistant reply
  return `আপনার প্রশ্নের জন্য ধন্যবাদ। এমএসকেএ প্ল্যাটফর্মের অফিসিয়াল ৩-লেয়ার পেমেন্ট ভেরিফিকেশন ও ট্রানজেকশন প্রোটোকল সম্পূর্ণ সচল রয়েছে। উইথড্র প্রক্রিয়া ১ থেকে সর্বোচ্চ ৩ ঘণ্টার মধ্যে আপনার বিকাশ/নগদ ওয়ালেটে কমপ্লিট হবে। যেকোনো জরুরি সাধারণ ডিপোজিট/হেল্পের জন্য সরাসরি আমাদের মার্চেন্ট কেয়ার ও হেল্পলাইন নাম্বার 01333468617 (24/7) এ যোগাযোগ করতে পারেন।`;
}

  // Secure API endpoint for MSKE AI Support Chatbot (using modern @google/genai SDK)
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;

      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Invalid messages array provided." });
      }

      const lastMsg = messages[messages.length - 1]?.content || "";

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        // Handle missing key gracefully using our smart context-aware local response engine
        console.warn("GEMINI_API_KEY is not defined. Falling back to smart simulate mode.");
        const selectedReply = getSmartFallbackResponse(lastMsg);
        return res.json({ response: selectedReply });
      }

      // Format conversation history for Gemini API.
      // Roles are mapped: user -> 'user', assistant -> 'model'
      const formattedContents = messages.map((msg) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      }));

      const systemInstruction = `
        You are MSKE Shipping AI Support (এমএসকেএ শিপিং এআই সাপোর্ট অ্যাসিস্ট্যান্ট).
        MSKE is a premium shipping and marine vessel cargo investment platform in Bangladesh where users can buy shares in cargo fleets (Coastal Cargo, Deep Sea Liner, Ocean Gateway, and Mega Super Vessel Oil Tankers) and make daily profit rewards.

        Our official merchant gateway information is:
        - official mobile banking & helpline: 01333468617 (bKash & Nagad Personal or Merchant Care)
        - Operating hours: 24/7 online
        - Minimum withdrawal or claim limit is ৪৫০ Taka (450 Taka).
        - Withdrawal requests are verified and completed in 1 to 3 hours (১ থেকে ৩ ঘণ্টার মধ্যে পেমেন্ট সফলভাবে সম্পন্ন করা হয়).

        Simulated Transaction ID (TrxID) Verification guidelines for debugging clients:
        - 500 Taka package corresponding TrxIDs: DE79WN2C2D, DEL9FJK7OT, DEO4K0EKFA, DE7XPL9M2Q, DEK5RT8V1N
        - 840 Taka package corresponding TrxIDs: DE84QM7A2K, DE8N5LP0TX, DE840RZ6WF, DE8H2JK9MC, DE84PV3QAL
        - 1050 Taka package corresponding TrxIDs: DE1050XK7P, DE10A9LM2R, DE105QW8TY, DE10FJ6NC4, DE105ZP3KD
        - 2000 Taka package corresponding TrxIDs: DE2000LK8M, DE20QW5RX2, DE200AZ7PN, DE20M4YT9K, DE2000VF6C

        If a customer writes about balance not reflecting, ask for their Deposit gateway name, Package cost, and TrxID, and suggest pasting the TrxID in the Deposit portal to trigger Auto-Verify.

        Important Guidelines:
        1. Always reply in polite, supportive, expert Bengali language mixed with standard English words (Banglish / standard BD business tone) matching typical mobile banking style.
        2. Keep replies professional, scannable, concise, and focused on helping the investor.
        3. Never promise direct unrealistic double yields, remind them of stable maritime business values.
        4. Do not output markdown lists if the reply can be brief. Keep your messages engaging and under 150 words when possible.
      `.trim();

      // Initialize GoogleGenAI SDK lazily as recommended
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      // Send chat log to gemini-3.5-flash
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: formattedContents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });

      const replyText = response.text || "আমি আপনার প্রশ্নটি পরিষ্কারভাবে বুঝতে পারিনি। অনুগ্রহ করে বিস্তারিত বলুন বা হেল্পলাইনে যোগাযোগ করুন।";
      return res.json({ response: replyText });
    } catch (error: any) {
      console.warn("Gemini API call or accessibility issue encountered. Bypassing and using smart simulated assistant.");
      const lastMsg = req.body.messages?.[req.body.messages.length - 1]?.content || "";
      const selectedReply = getSmartFallbackResponse(lastMsg);
      return res.json({ response: selectedReply });
    }
  });

  // Gmail withdraw notification
  app.post("/api/withdraw-notification", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).send("Unauthorized");

    try {
      const { number, amount, method } = req.body;
      console.log(`Withdrawal Notification: Method=${method}, Number=${number}, Amount=${amount}`);

      const messageContent = [
        "Content-Type: text/plain; charset=\"UTF-8\"\n",
        "MIME-Version: 1.0\n",
        "Content-Transfer-Encoding: 7bit\n",
        `To: hhedarkhorselive@gmail.com\n`,
        `Subject: New Withdrawal Request - MSKE Platform\n\n`,
        `A new withdrawal request has been received:\n\n`,
        `Method: ${method}\n`,
        `Number: ${number}\n`,
        `Amount: ${amount} Taka\n`
      ].join("");

      const rawMessage = Buffer.from(messageContent)
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

      console.log(`Sending to Gmail API...`);
      const response = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ raw: rawMessage })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Gmail API Error:", JSON.stringify(errorData, null, 2));
        throw new Error(errorData.error?.message || "Failed to send email");
      }
      
      console.log("Email sent successfully!");
      res.json({ success: true });
    } catch (error) {
      console.error("Failed to send email:", error);
      res.status(500).json({ error: "Failed to send email", details: error instanceof Error ? error.message : String(error) });
    }
  });

  // Secure Image Proxy to bypass Hotlinking Prevention (such as pasteboard.co / postimage.org)
  app.get("/api/image-proxy", async (req, res) => {
    const rawUrl = req.query.url as string;
    if (!rawUrl) {
      return res.status(400).send("No image URL provided");
    }

    try {
      let targetUrl = rawUrl;
      let matchedId: string | null = null;

      // Handle pasteboard url specifically
      if (rawUrl.includes("pasteboard.co")) {
        // Strip out the domain name to find the pasteboard item ID (e.g., 1qfVO522CgsI or 1_Q-237gLipH)
        const idMatch = rawUrl.match(/pasteboard\.co\/([a-zA-Z0-9_-]+)/);
        if (idMatch && idMatch[1]) {
          matchedId = idMatch[1];
        }
      }

      const standardHeaders = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Referer": "https://pasteboard.co/"
      };

      let fetchedBuffer: ArrayBuffer | null = null;
      let resolvedContentType = "image/png";

      if (matchedId) {
        console.log(`Deep profiling Pasteboard.co asset ID: "${matchedId}"...`);
        // Let's try to query the direct page HTML to inspect meta headers for perfect exact match
        try {
          const pageRes = await fetch(`https://pasteboard.co/${matchedId}`, {
            headers: standardHeaders
          });
          if (pageRes.ok) {
            const html = await pageRes.text();
            // Look for og:image content
            const ogMatch = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i) || 
                            html.match(/<meta\s+name="twitter:image:src"\s+content="([^"]+)"/i) ||
                            html.match(/href="(https:\/\/images\.pasteboard\.co\/[^"]+)"/i);
            if (ogMatch && ogMatch[1]) {
              targetUrl = ogMatch[1];
              console.log(`Perfect Match resolved from Pasteboard HTML: ${targetUrl}`);
            }
          }
        } catch (scrapingError: any) {
          console.warn(`Direct scraping fallback warning: ${scrapingError.message}`);
        }

        // Now download target image. If it fails, fallback to iterating extensions
        const tryFetch = async (url: string) => {
          console.log(`Trying fetch URL: ${url}`);
          const fileRes = await fetch(url, { headers: { ...standardHeaders, "Accept": "image/*" } });
          if (fileRes.ok) {
            resolvedContentType = fileRes.headers.get("content-type") || "image/png";
            return await fileRes.arrayBuffer();
          }
          throw new Error(`Status ${fileRes.status}`);
        };

        try {
          fetchedBuffer = await tryFetch(targetUrl);
        } catch {
          // Fallback sequence of endpoints
          const extensions = ["png", "jpg", "jpeg", "webp", "gif"];
          for (const ext of extensions) {
            try {
              const testUrl = `https://images.pasteboard.co/${matchedId}.${ext}`;
              fetchedBuffer = await tryFetch(testUrl);
              console.log(`Success in sequence match on: ${testUrl}`);
              break;
            } catch {
              continue;
            }
          }
        }
      }

      // If we didn't resolve with the specialized sequence (or it's on another service)
      if (!fetchedBuffer) {
        console.log(`Attempting standard target fetch for URL: ${targetUrl}`);
        const finalRes = await fetch(targetUrl, { headers: standardHeaders });
        if (!finalRes.ok) {
          throw new Error(`Final target failed with status ${finalRes.status}`);
        }
        resolvedContentType = finalRes.headers.get("content-type") || "image/png";
        fetchedBuffer = await finalRes.arrayBuffer();
      }

      res.setHeader("Content-Type", resolvedContentType);
      res.setHeader("Cache-Control", "public, max-age=86400, stale-while-revalidate=43200");
      return res.send(Buffer.from(fetchedBuffer));
    } catch (error: any) {
      console.error(`Secure image-proxy system encountered an issue for ${rawUrl}:`, error.message);
      // Fallback redirect directly
      return res.redirect(rawUrl);
    }
  });

  // Handle static assets & development server with Vite
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in development mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in production mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

startServer();

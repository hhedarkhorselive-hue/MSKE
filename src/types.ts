/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ShipPackage {
  id: string;
  name: string;
  cost: number;
  dailyIncome: number;
  image: string;
  durationDays: number;
  category: string;
  capacity?: string;
  route?: string;
}

export interface UserPackage {
  cost: number;
  daily: number;
  purchasedAt: string;
  daysClaimed: number;
  lastClaimDate?: string;
}

export interface UserSession {
  phone: string;
  password?: string;
  balance: number;
  uid: string; // alphanumeric string
  referralCode: string;
  referredBy?: string;
  pack: UserPackage | null;
  lastClaim: string; // date string
  usedTrx: string[];
  withdrawals: WithdrawalRequest[];
  depositHistory: DepositRequest[];
  selectedGateway?: string;
}

export interface WithdrawalRequest {
  id: string;
  amount: number;
  method: string;
  number: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export interface DepositRequest {
  id: string;
  amount: number;
  gateway: string;
  trxId: string;
  status: "verified" | "pending" | "rejected";
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

import React, { useState } from "react";
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  QrCode, 
  CreditCard, 
  Lock, 
  ShieldCheck, 
  History, 
  Plus, 
  Coins, 
  ChevronRight, 
  Sparkles, 
  Clock,
  Smartphone,
  Building,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { Transaction } from "../types";
import { formatRupees, generateId } from "../utils/gameLogic";
import { motion, AnimatePresence } from "motion/react";

interface WalletDashboardProps {
  balance: number;
  bonusBalance: number;
  onUpdateBalance: (newBalance: number) => void;
  transactions: Transaction[];
  onAddTransaction: (tx: Transaction) => void;
  vipTier: string;
}

export default function WalletDashboard({
  balance,
  bonusBalance,
  onUpdateBalance,
  transactions,
  onAddTransaction,
  vipTier,
}: WalletDashboardProps) {
  const [activeTab, setActiveTab] = useState<"deposit" | "withdraw" | "history">("deposit");
  const [depositAmount, setDepositAmount] = useState<string>("1000");
  const [paymentMethod, setPaymentMethod] = useState<string>("upi_gpay");
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");
  const [upiId, setUpiId] = useState<string>("");
  const [bankAccount, setBankAccount] = useState<string>("");
  const [bankIfsc, setBankIfsc] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [step, setStep] = useState<"form" | "confirm" | "success">("form");
  const [withdrawStep, setWithdrawStep] = useState<"form" | "processing" | "success">("form");

  const depositPresets = ["500", "1000", "2000", "5000", "10000", "25000"];
  const withdrawPresets = ["500", "1000", "5000", "10000"];

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(depositAmount);
    if (isNaN(amt) || amt < 100) return;
    setStep("confirm");
  };

  const handleConfirmDeposit = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const amt = parseFloat(depositAmount);
      const newBal = balance + amt;
      const extraBonus = Math.floor(amt * 0.1); // 10% bonus
      onUpdateBalance(newBal);
      
      const newTx: Transaction = {
        id: generateId(),
        type: "deposit",
        amount: amt,
        method: paymentMethod.toUpperCase().replace("_", " "),
        status: "completed",
        date: new Date().toISOString(),
        transactionId: `TXN${Math.floor(100000 + Math.random() * 900000)}`
      };
      
      onAddTransaction(newTx);
      setIsProcessing(false);
      setStep("success");
    }, 2000);
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(withdrawAmount);
    if (isNaN(amt) || amt < 500) return;
    if (amt > balance) return;
    setWithdrawStep("processing");
    setIsProcessing(true);

    setTimeout(() => {
      const remainingBal = balance - amt;
      onUpdateBalance(remainingBal);

      const newTx: Transaction = {
        id: generateId(),
        type: "withdrawal",
        amount: amt,
        method: upiId ? "UPI" : "BANK IMPS",
        status: "completed",
        date: new Date().toISOString(),
        transactionId: `TXN${Math.floor(100000 + Math.random() * 900000)}`
      };

      onAddTransaction(newTx);
      setIsProcessing(false);
      setWithdrawStep("success");
    }, 2500);
  };

  return (
    <div id="wallet-dashboard-root" className="w-full pb-10">
      {/* Wallet Summary Card */}
      <div id="wallet-balance-card" className="relative overflow-hidden mb-8 rounded-2xl border border-amber-500/20 bg-gradient-to-br from-neutral-950 via-neutral-900 to-red-950/40 p-6 shadow-2xl">
        <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-red-600/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-amber-500/5 blur-3xl"></div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold tracking-wider text-amber-400 uppercase">Real Cash Wallet Balance</span>
              <span className="flex items-center gap-1 rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/30">
                <ShieldCheck size={10} /> 100% Secured
              </span>
            </div>
            <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 drop-shadow-[0_2px_4px_rgba(251,191,36,0.2)] tracking-tight">
              {formatRupees(balance)}
            </div>
            
            <div className="flex flex-wrap items-center gap-6 mt-4 text-xs text-neutral-400 border-t border-white/5 pt-4">
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-neutral-500">Unused Cash Bonus</span>
                <span className="text-sm font-semibold text-red-400">{formatRupees(bonusBalance)}</span>
              </div>
              <div className="h-6 w-px bg-white/5"></div>
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-neutral-500">Your VIP Level Tier</span>
                <span className="text-sm font-bold text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]">{vipTier} VIP</span>
              </div>
              <div className="h-6 w-px bg-white/5"></div>
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-neutral-500">24h Direct Payout Limit</span>
                <span className="text-sm font-semibold text-neutral-200">
                  {vipTier === "Royal" ? "₹5,00,000" : vipTier === "Platinum" ? "₹2,00,000" : vipTier === "Gold" ? "₹1,00,000" : "₹50,000"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-neutral-900 border border-neutral-800 p-3 flex flex-col justify-center items-center text-center w-24">
              <span className="text-[10px] text-zinc-500">Fast Cash</span>
              <span className="text-amber-400 text-xs font-bold mt-1">Instant</span>
            </span>
            <span className="rounded-xl bg-neutral-900 border border-neutral-800 p-3 flex flex-col justify-center items-center text-center w-24">
              <span className="text-[10px] text-zinc-500">UPI Pay</span>
              <span className="text-amber-400 text-xs font-bold mt-1">Charge 0%</span>
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Buttons for Tabs */}
      <div id="wallet-actions-tabs" className="flex items-center gap-2 p-1.5 bg-neutral-950/60 rounded-xl border border-neutral-850 mb-6 max-w-md">
        <button
          onClick={() => { setActiveTab("deposit"); setStep("form"); }}
          className={`flex-1 transition-all py-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 ${
            activeTab === "deposit"
              ? "bg-gradient-to-r from-red-700 to-red-900 text-white shadow-[0_0_15px_rgba(185,28,28,0.4)] border border-red-500/20"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          <ArrowUpRight size={14} className={activeTab === "deposit" ? "animate-pulse" : ""} />
          Add Deposit Cash
        </button>
        <button
          onClick={() => { setActiveTab("withdraw"); setWithdrawStep("form"); }}
          className={`flex-1 transition-all py-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 ${
            activeTab === "withdraw"
              ? "bg-gradient-to-r from-amber-600 to-amber-800 text-white shadow-[0_0_15px_rgba(217,119,6,0.3)] border border-amber-500/20"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          <ArrowDownLeft size={14} className={activeTab === "withdraw" ? "animate-pulse" : ""} />
          Withdraw Payout
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`flex-1 transition-all py-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 ${
            activeTab === "history"
              ? "bg-neutral-800 text-white border border-neutral-700"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          <History size={14} />
          Logs
        </button>
      </div>

      {/* Content view transitions */}
      <div className="bg-neutral-900/40 rounded-2xl border border-neutral-800 p-6 shadow-xl">
        <AnimatePresence mode="wait">
          {activeTab === "deposit" && (
            <motion.div
              key="deposit-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              {step === "form" && (
                <form onSubmit={handleDepositSubmit} className="space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-neutral-100 flex items-center gap-2">
                      <Coins className="text-amber-400" size={18} />
                      Enter Deposit Cash Amount
                    </h3>
                    <p className="text-xs text-neutral-400 mt-1">Get an extra 10% Cash Bonus instantly on all deposits!</p>
                  </div>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black text-amber-500">₹</span>
                    <input
                      type="number"
                      required
                      min="100"
                      max="100000"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      className="w-full pl-10 pr-4 py-4 rounded-xl bg-neutral-950 border border-neutral-800 text-xl font-bold text-amber-400 placeholder-neutral-750 focus:outline-none focus:ring-2 focus:ring-red-600/50"
                      placeholder="Min ₹100 - Max ₹1,00,000"
                    />
                  </div>

                  {/* Preset multipliers */}
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {depositPresets.map((preset) => (
                      <button
                        type="button"
                        key={preset}
                        onClick={() => setDepositAmount(preset)}
                        className={`py-2 px-1 rounded-lg text-xs font-bold transition-all border ${
                          depositAmount === preset
                            ? "bg-red-900/30 border-red-500 text-red-200"
                            : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700"
                        }`}
                      >
                        +₹{preset}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-4 pt-2">
                    <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Select Preferred Secure Payment Mode</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("upi_gpay")}
                        className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                          paymentMethod === "upi_gpay"
                            ? "bg-neutral-950 border-amber-500/50 ring-1 ring-amber-500/20"
                            : "bg-neutral-950 border-neutral-800 hover:border-neutral-700"
                        }`}
                      >
                        <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                          <Smartphone size={18} />
                        </span>
                        <div>
                          <span className="block text-xs font-bold text-neutral-200">UPI (Google Pay / PhonePe / Paytm)</span>
                          <span className="text-[10px] text-emerald-400">Instant (No Fee)</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod("credit_card")}
                        className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                          paymentMethod === "credit_card"
                            ? "bg-neutral-950 border-amber-500/50 ring-1 ring-amber-500/20"
                            : "bg-neutral-950 border-neutral-800 hover:border-neutral-700"
                        }`}
                      >
                        <span className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                          <CreditCard size={18} />
                        </span>
                        <div>
                          <span className="block text-xs font-bold text-neutral-200">Visa / Mastercard / RuPay</span>
                          <span className="text-[10px] text-amber-400">Secure Gateway</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod("bank_imps")}
                        className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                          paymentMethod === "bank_imps"
                            ? "bg-neutral-950 border-amber-500/50 ring-1 ring-amber-500/20"
                            : "bg-neutral-950 border-neutral-800 hover:border-neutral-700"
                        }`}
                      >
                        <span className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                          <Building size={18} />
                        </span>
                        <div>
                          <span className="block text-xs font-bold text-neutral-200">Net Banking / IMPS</span>
                          <span className="text-[10px] text-zinc-500">1-3 Mins Processing</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-4 text-sm font-bold tracking-wide text-neutral-950 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500 rounded-xl hover:from-amber-300 hover:via-yellow-400 hover:to-amber-400 transition-all font-sans uppercase flex items-center justify-center gap-2 border border-yellow-300/30 font-extrabold shadow-[0_4px_20px_rgba(251,191,36,0.35)] cursor-pointer"
                  >
                    <Sparkles size={16} />
                    Securely Add ₹{depositAmount} Real Cash
                  </button>

                  <div className="flex items-center justify-center gap-6 text-[11px] text-neutral-400 pt-2">
                    <span className="flex items-center gap-1">
                      <ShieldCheck size={14} className="text-emerald-500" /> PCI-DSS Compliant
                    </span>
                    <span className="h-3 w-px bg-white/10"></span>
                    <span className="flex items-center gap-1">
                      <Lock size={12} className="text-emerald-500" /> SSL 256-Bit Encrypted
                    </span>
                  </div>
                </form>
              )}

              {step === "confirm" && (
                <div className="text-center py-6 max-w-sm mx-auto space-y-6">
                  <div className="mx-auto w-16 h-16 bg-amber-500/10 rounded-full border border-amber-500/30 flex items-center justify-center text-amber-400 animate-bounce">
                    <QrCode size={28} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-neutral-100">Simulating Secure Payment</h3>
                    <p className="text-xs text-neutral-400 mt-2">
                      Scan the premium VIP QR Code or authorize via UPI gateway to credit funds to your game wallet.
                    </p>
                  </div>

                  <div className="bg-neutral-950 p-4 rounded-xl inline-block border border-neutral-800">
                    {/* Simulated visual QR Code using styled cards */}
                    <div className="w-44 h-44 bg-gradient-to-br from-amber-200 to-yellow-500 p-2 rounded-lg flex items-center justify-center mx-auto shadow-lg">
                      <div className="w-full h-full bg-neutral-900 rounded flex flex-col items-center justify-center p-2 text-center text-[10px]">
                        <div className="grid grid-cols-4 gap-2 w-full max-w-28 mb-3">
                          <span className="h-6 w-6 bg-amber-400 rounded"></span>
                          <span className="h-6 w-6 bg-neutral-800 rounded"></span>
                          <span className="h-6 w-6 bg-amber-400 rounded"></span>
                          <span className="h-6 w-6 bg-amber-400 rounded"></span>
                          <span className="h-6 w-6 bg-neutral-800 rounded"></span>
                          <span className="h-6 w-6 bg-amber-400 rounded"></span>
                          <span className="h-6 w-6 bg-neutral-800 rounded"></span>
                          <span className="h-6 w-6 bg-neutral-800 rounded"></span>
                          <span className="h-6 w-6 bg-amber-400 rounded"></span>
                          <span className="h-6 w-6 bg-neutral-800 rounded"></span>
                          <span className="h-6 w-6 bg-amber-400 rounded"></span>
                          <span className="h-6 w-6 bg-amber-400 rounded"></span>
                        </div>
                        <span className="text-[9px] text-amber-400 tracking-widest font-mono font-bold">MOCK MERCHANT ID</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs px-4 py-2.5 bg-neutral-950 rounded-lg">
                      <span className="text-zinc-500">Deposit amount</span>
                      <span className="font-bold text-white">{formatRupees(parseFloat(depositAmount))}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs px-4 py-2.5 bg-neutral-950 rounded-lg">
                      <span className="text-emerald-500">VIP Cash Bonus (10%)</span>
                      <span className="font-bold text-emerald-400">+ {formatRupees(parseFloat(depositAmount) * 0.1)}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => setStep("form")}
                      className="flex-1 py-3 text-xs font-bold tracking-wider text-neutral-400 bg-neutral-950 border border-neutral-800 rounded-xl hover:text-white transition-all"
                    >
                      Cancel Path
                    </button>
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={handleConfirmDeposit}
                      className="flex-1 py-3 text-xs font-bold tracking-wider text-neutral-950 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-xl hover:brightness-110 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center justify-center gap-1.5"
                    >
                      {isProcessing ? (
                        <>
                          <Clock className="animate-spin" size={14} /> Doing Security Verification...
                        </>
                      ) : (
                        "Simulate Success"
                      )}
                    </button>
                  </div>
                </div>
              )}

              {step === "success" && (
                <div className="text-center py-8 max-w-sm mx-auto space-y-5">
                  <div className="mx-auto w-16 h-16 bg-emerald-500/10 rounded-full border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 size={36} className="animate-scale" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-neutral-100">Deposit Successful!</h3>
                    <p className="text-xs text-neutral-400 mt-2">
                      ₹{depositAmount} has been instantly credited to your real cash wallet balance.
                    </p>
                  </div>
                  <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Transaction ID</span>
                      <span className="font-mono text-neutral-200">TP-{Math.floor(100000 + Math.random() * 900000)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Current Balance</span>
                      <span className="font-bold text-amber-400">{formatRupees(balance)}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep("form")}
                    className="w-full py-3 text-xs font-bold tracking-wider text-neutral-950 bg-gradient-to-r from-amber-400 to-amber-500 rounded-xl hover:brightness-115"
                  >
                    Add More Cash
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "withdraw" && (
            <motion.div
              key="withdraw-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              {withdrawStep === "form" && (
                <form onSubmit={handleWithdrawSubmit} className="space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-neutral-100 flex items-center gap-2">
                      <ArrowDownLeft className="text-amber-500 animate-pulse" size={18} />
                      Fast Payout Withdrawal
                    </h3>
                    <p className="text-xs text-neutral-400 mt-1">
                      Direct withdrawal to any Indian Bank Account or verified UPI.
                    </p>
                  </div>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black text-neutral-500">₹</span>
                    <input
                      type="number"
                      required
                      min="500"
                      max={balance}
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="w-full pl-10 pr-4 py-4 rounded-xl bg-neutral-950 border border-neutral-800 text-xl font-bold text-amber-400 placeholder-neutral-700 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                      placeholder="Min ₹500 - Amount to withdraw"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400">
                      Available: <span className="text-amber-400">{formatRupees(balance)}</span>
                    </div>
                  </div>

                  {/* Preset amounts */}
                  <div className="grid grid-cols-4 gap-2">
                    {withdrawPresets.map((preset) => (
                      <button
                        type="button"
                        key={preset}
                        onClick={() => {
                          const amt = Math.min(parseFloat(preset), balance);
                          setWithdrawAmount(amt.toString());
                        }}
                        className="py-2.5 rounded-lg text-xs font-bold transition-all bg-neutral-950 border border-neutral-800 text-neutral-400 hover:border-neutral-700"
                      >
                        ₹{preset}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setWithdrawAmount(balance.toString())}
                      className="py-2.5 rounded-lg text-xs font-bold transition-all bg-amber-500/10 border border-amber-500/20 text-amber-400"
                    >
                      MAX ALL
                    </button>
                  </div>

                  <div className="bg-amber-500/5 rounded-xl border border-amber-500/15 p-4 text-xs space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-amber-400">
                      <AlertTriangle size={14} /> VIP Withdrawal Exemption Rules
                    </div>
                    <p className="text-neutral-400 text-[11px] leading-relaxed">
                      Gold, Platinum, and Royal VIP players qualify for <strong className="text-emerald-400">0% transaction processing fees</strong>. Payout will be processed within 10-15 minutes 24/7.
                    </p>
                  </div>

                  {/* Destinations details */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Configure Cashout Credentials</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-neutral-400 mb-1.5">Primary UPI Address (e.g. yourname@ybl, paytm)</label>
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => {
                            setUpiId(e.target.value);
                            if (e.target.value) {
                              setBankAccount("");
                              setBankIfsc("");
                            }
                          }}
                          className="w-full px-4 py-3 rounded-lg bg-neutral-950 border border-neutral-800 text-sm text-neutral-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                          placeholder="e.g. bhim-pay@oksbi"
                        />
                      </div>

                      <div className="flex items-center justify-center text-[10px] text-zinc-550 py-1 uppercase tracking-wider">OR BANK ACCOUNT</div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-neutral-400 mb-1.5">Bank Account Number</label>
                          <input
                            type="text"
                            value={bankAccount}
                            onChange={(e) => {
                              setBankAccount(e.target.value);
                              if (e.target.value) setUpiId("");
                            }}
                            className="w-full px-4 py-3 rounded-lg bg-neutral-950 border border-neutral-800 text-sm text-neutral-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                            placeholder="e.g. 50200012345678"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-neutral-400 mb-1.5">IFSC Code Route</label>
                          <input
                            type="text"
                            value={bankIfsc}
                            onChange={(e) => {
                              setBankIfsc(e.target.value);
                              if (e.target.value) setUpiId("");
                            }}
                            className="w-full px-4 py-3 rounded-lg bg-neutral-950 border border-neutral-800 text-sm text-neutral-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                            placeholder="e.g. HDFC0000123"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Withdraw Submit Button */}
                  <button
                    type="submit"
                    disabled={!withdrawAmount || parseFloat(withdrawAmount) < 500 || parseFloat(withdrawAmount) > balance || (!upiId && (!bankAccount || !bankIfsc))}
                    className="w-full py-4 text-sm font-bold tracking-wide text-neutral-950 bg-gradient-to-r from-red-600 via-amber-500 to-yellow-500 rounded-xl disabled:opacity-40 disabled:pointer-events-none hover:brightness-110 transition-all font-sans uppercase flex items-center justify-center gap-2 border border-red-500/20 font-extrabold shadow-lg cursor-pointer"
                  >
                    <ArrowDownLeft size={16} />
                    Submit Instacash Payout Request
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[10px] text-neutral-500 text-center">
                    <ShieldCheck size={12} className="text-emerald-500" /> Direct Transfer Assured • 24/7 Processing Support
                  </div>
                </form>
              )}

              {withdrawStep === "processing" && (
                <div className="text-center py-8 max-w-sm mx-auto space-y-6">
                  <div className="mx-auto w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500">
                    <Clock size={28} className="animate-spin" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-neutral-100">Compliance Audit Approved</h3>
                    <p className="text-xs text-neutral-400 mt-2">
                      Frictionless KYC cleared! Generating instant IMPS settlement routes for credit approval.
                    </p>
                  </div>
                  <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-neutral-500 block">Payout Destination</span>
                      <span className="font-bold text-white uppercase">{upiId ? "UPI Link" : "Bank Transfer"}</span>
                    </div>
                    {upiId && (
                      <div className="flex justify-between">
                        <span className="text-neutral-500 block">UPI Address</span>
                        <span className="text-amber-400 font-mono text-[11px]">{upiId}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-neutral-500 block">Payout Capital Settlement</span>
                      <span className="font-bold text-red-400 font-mono">-{formatRupees(parseFloat(withdrawAmount))}</span>
                    </div>
                  </div>
                </div>
              )}

              {withdrawStep === "success" && (
                <div className="text-center py-8 max-w-sm mx-auto space-y-5">
                  <div className="mx-auto w-16 h-16 bg-emerald-500/10 rounded-full border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 size={36} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-neutral-100">Payout Settlement Accepted!</h3>
                    <p className="text-xs text-neutral-400 mt-2">
                      Your payout request for <span className="font-bold text-neutral-100">{formatRupees(parseFloat(withdrawAmount))}</span> has been successfully approved & processed to UPI/Bank.
                    </p>
                  </div>
                  <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Receipt Ref ID</span>
                      <span className="font-mono text-neutral-200">WDR-{Math.floor(100000 + Math.random() * 900000)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Remaining Wallet Balance</span>
                      <span className="font-bold text-amber-400">{formatRupees(balance)}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setWithdrawAmount("");
                      setWithdrawStep("form");
                    }}
                    className="w-full py-3 text-xs font-bold tracking-wider text-neutral-950 bg-gradient-to-r from-amber-400 to-amber-500 rounded-xl hover:brightness-115"
                  >
                    Done
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "history" && (
            <motion.div
              key="history-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-neutral-100 flex items-center gap-2">
                  <History size={16} className="text-amber-500" />
                  Recent Cash Settlement History
                </h3>
              </div>

              {transactions.length === 0 ? (
                <div className="text-center py-10 rounded-xl bg-neutral-950 border border-neutral-850">
                  <div className="h-10 w-10 mx-auto rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-zinc-500 mb-3">
                    <History size={18} />
                  </div>
                  <p className="text-xs text-neutral-400">No transactions recorded yet in this account session.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-neutral-400 border-collapse">
                    <thead>
                      <tr className="border-b border-neutral-800 text-[10px] uppercase tracking-wider text-neutral-500 bg-neutral-950/40">
                        <th className="py-3 px-4">Transaction Details</th>
                        <th className="py-3 px-4">Method / Channel</th>
                        <th className="py-3 px-2">Amount</th>
                        <th className="py-3 px-4 text-center">Settlement Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((tx) => (
                        <tr key={tx.id} className="border-b border-neutral-800 hover:bg-neutral-950/20 transition-all">
                          <td className="py-3.5 px-4 font-medium text-neutral-200">
                            <span className="flex items-center gap-2">
                              {tx.type === "deposit" ? (
                                <span className="h-6 w-6 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                                  <ArrowUpRight size={12} />
                                </span>
                              ) : (
                                <span className="h-6 w-6 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center">
                                  <ArrowDownLeft size={12} />
                                </span>
                              )}
                              <div>
                                <span className="block text-xs font-semibold capitalize text-neutral-200">{tx.type} Cash</span>
                                <span className="text-[10px] text-zinc-500 font-mono">{tx.transactionId}</span>
                              </div>
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-neutral-300 uppercase text-[10px] font-mono">
                            {tx.method}
                          </td>
                          <td className="py-3.5 px-2 font-mono font-bold">
                            <span className={tx.type === "deposit" ? "text-emerald-400" : "text-amber-400"}>
                              {tx.type === "deposit" ? "+" : "-"}{formatRupees(tx.amount)}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 capitalize shadow-[0_0_8px_rgba(16,185,129,0.1)]">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                              Successful
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

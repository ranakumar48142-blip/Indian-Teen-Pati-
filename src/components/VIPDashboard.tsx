import { useState } from "react";
import { 
  Crown, 
  Gift, 
  Trophy, 
  Sparkles, 
  Check, 
  Star, 
  Lock, 
  RefreshCw, 
  Play, 
  ShieldAlert,
  HelpCircle,
  Gem
} from "lucide-react";
import { formatRupees } from "../utils/gameLogic";
import { motion, AnimatePresence } from "motion/react";

interface VIPDashboardProps {
  balance: number;
  onUpdateBalance: (newBalance: number) => void;
  vipTier: string;
  onUpgradeVip: (newTier: string) => void;
}

export default function VIPDashboard({
  balance,
  onUpdateBalance,
  vipTier,
  onUpgradeVip,
}: VIPDashboardProps) {
  const [spinDeg, setSpinDeg] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<string | null>(null);
  const [dailyClaimed, setDailyClaimed] = useState<boolean>(false);
  const [dailyStreak, setDailyStreak] = useState<number>(4);

  const tiers = [
    { name: "Silver", minBet: "₹10", rcvMultiplier: "1.0x", pointsNeeded: "0 - 1K PTS", perks: ["Direct Instant Cashouts", "Standard Match Deposit Bonuses", "Weekly Leaderboard Entry"] },
    { name: "Gold", minBet: "₹100", rcvMultiplier: "1.2x", pointsNeeded: "1.5K - 5K PTS", perks: ["10% Fast Cash Match Deposit Bonus", "Dedicated Whatsapp Live Support", "Exclusive VIP Gold Badge", "0.5% Cashbacks on Weekly Bets"] },
    { name: "Platinum", minBet: "₹500", rcvMultiplier: "1.5x", pointsNeeded: "5K - 15K PTS", perks: ["15% High Depositors Match Extra Cash", "Dedicated Account Compliance Concierge", "Priority Instant Payout Speed (5-8 mins)", "1.0% Real Coins Cashback Backed Every Sunday"] },
    { name: "Royal", minBet: "₹1,000", rcvMultiplier: "2.0x", pointsNeeded: "15K - 50K PTS", perks: ["20% Lifetime Max Match Extra Cash Bonus", "Personalized Relationship Concierge Manager", "Ultra-Premium Cashout Routing Priorities (Under 3 mins)", "1.5% Unlimited Cashback Guarantee", "Royal Golden Special Card Deck Accents"] },
  ];

  const currentTierData = tiers.find(t => t.name === vipTier) || tiers[0];

  const wheelPrizes = ["₹50 Bonus", "₹100 Cash", "₹500 Cash", "₹1,000 VIP Cash", "Better Luck", "2x Cashback Ticket", "₹20 Bonus", "₹250 Gold Cash"];

  const spinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setSpinResult(null);

    // Generate random angle
    const extraSpins = 5 + Math.floor(Math.random() * 5); // 5 to 10 spins
    const prizeIdx = Math.floor(Math.random() * wheelPrizes.length);
    const destDeg = extraSpins * 360 + prizeIdx * (360 / wheelPrizes.length);
    
    setSpinDeg(destDeg);

    setTimeout(() => {
      setIsSpinning(false);
      const prize = wheelPrizes[prizeIdx];
      setSpinResult(prize);
      
      // Credit cash balance if won cash
      if (prize.includes("₹")) {
        const amtStr = prize.replace("₹", "").replace(" Bonus", "").replace(" Cash", "").replace(" VIP Cash", "").replace(",", "").trim();
        const amt = parseFloat(amtStr);
        if (!isNaN(amt)) {
          onUpdateBalance(balance + amt);
        }
      }
    }, 4000);
  };

  const claimDailyBonus = () => {
    if (dailyClaimed) return;
    setDailyClaimed(true);
    setDailyStreak(prev => prev + 1);
    
    // Add ₹150 daily cash reward
    onUpdateBalance(balance + 150);
  };

  return (
    <div id="vip-dashboard-root" className="w-full space-y-8 pb-10">
      
      {/* Tier Progress Hero Card */}
      <div className="relative overflow-hidden rounded-2xl border border-yellow-500/30 bg-gradient-to-br from-neutral-950 via-red-950/20 to-neutral-900 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 h-52 w-52 rounded-full bg-yellow-500/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-red-600/10 blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 text-center lg:text-left w-full lg:w-[60%]">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 text-xs font-bold shadow-[0_0_12px_rgba(245,158,11,0.15)] uppercase">
              <Crown size={14} className="animate-spin" />
              Royal VIP Lounge
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">
              A Taste of Pure <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 font-serif italic">Royalty</span>
            </h2>
            <p className="text-neutral-400 text-xs leading-relaxed">
              Ascend inside our elite VIP high roller ranks! Every cash bet placed on our dynamic Teen Patti tables gets recorded as VIP points. Earn premium prestige payouts, customized avatars, and exclusive private table invites.
            </p>

            {/* Progress Slider */}
            <div className="pt-2">
              <div className="flex justify-between text-[11px] font-semibold text-neutral-400 mb-1.5">
                <span>VIP Points progression tracker</span>
                <span className="text-amber-400 font-bold">12,650 / 15,000 Qubits</span>
              </div>
              <div className="h-2 w-full bg-neutral-950 rounded-full overflow-hidden border border-neutral-800">
                <div className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-yellow-400 rounded-full w-[84%] shadow-[0_0_10px_rgba(251,191,36,0.5)]"></div>
              </div>
              <div className="flex justify-between text-[10px] text-zinc-500 mt-1">
                <span>Current status: <strong className="text-amber-400">Gold Tier VIP</strong></span>
                <span>Next rank: <strong className="text-red-400">Platinum Club</strong></span>
              </div>
            </div>
          </div>

          {/* Golden VIP Crest Representation */}
          <div className="relative flex flex-col items-center justify-center border-l border-white/5 lg:pl-10 w-full lg:w-[35%]">
            <div className="relative p-6 bg-gradient-to-b from-amber-600/10 to-transparent border border-amber-400/20 rounded-2xl text-center w-full max-w-[240px]">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 h-12 w-12 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-neutral-950 shadow-[0_4px_15px_rgba(245,158,11,0.4)]">
                <Crown size={22} className="stroke-[2.5]" />
              </div>
              <div className="pt-4 space-y-1">
                <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold">Active Member Tier</span>
                <h3 className="text-2xl font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-400 uppercase drop-shadow-[0_2px_4px_rgba(245,158,11,0.2)]">
                  {vipTier} CLUB
                </h3>
                <span className="text-xxs font-mono text-zinc-500">MEMBER ID: #TP-849182</span>
              </div>
              
              <div className="mt-4 pt-3 border-t border-white/5">
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">VIP Real Cash multiplier</span>
                <span className="text-lg font-extrabold text-emerald-400">{currentTierData.rcvMultiplier} Payout boost</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Perks and Spin Wheel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Side: VIP Tier Perks Guide */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-neutral-100 flex items-center gap-2">
              <Star className="text-amber-400 fill-amber-400/20" size={18} />
              Prestige VIP Tier Benefits Breakdown
            </h3>
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest">4 Tiers</span>
          </div>

          <div className="space-y-3">
            {tiers.map((tier) => (
              <div 
                key={tier.name}
                className={`p-4 rounded-xl border transition-all ${
                  tier.name === vipTier
                    ? "bg-gradient-to-r from-red-950/40 via-neutral-950 to-neutral-900 border-yellow-500/40 relative shadow-lg"
                    : "bg-neutral-950/40 border-neutral-850 opacity-60 hover:opacity-90"
                }`}
              >
                {tier.name === vipTier && (
                  <span className="absolute top-3 right-3 text-[9px] font-black uppercase bg-yellow-500 text-neutral-950 px-2 py-0.5 rounded-full">
                    YOUR Rank
                  </span>
                )}
                
                <div className="flex items-center gap-2 mb-2">
                  <div className={`h-2 w-2 rounded-full ${
                    tier.name === "Royal" ? "bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]" : 
                    tier.name === "Platinum" ? "bg-zinc-300" :
                    tier.name === "Gold" ? "bg-yellow-500" : "bg-neutral-400"
                  }`}></div>
                  <h4 className="text-xs font-black text-neutral-200">{tier.name} Tier <span className="text-[10px] font-normal text-zinc-500">({tier.pointsNeeded})</span></h4>
                </div>

                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-[10px] text-neutral-400 list-none pl-0">
                  {tier.perks.map((perk, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 leading-snug">
                      <span className="text-amber-400 mt-0.5">✔</span>
                      {perk}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Quick VIP Action: Claim Tier Upgrade (Free Simulate trigger) */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-neutral-950 to-zinc-900 border border-neutral-800 flex items-center justify-between gap-4">
            <div>
              <span className="block text-xxs uppercase text-neutral-500 tracking-wider">Fast-Pass Upgrade Simulation</span>
              <p className="text-xs font-semibold text-neutral-300 mt-0.5">Toggle and upgrade instantly to VIP Royal status for testing</p>
            </div>
            <button
              onClick={() => onUpgradeVip(vipTier === "Royal" ? "Gold" : "Royal")}
              className="py-2 px-4 rounded-lg bg-red-950 border border-red-500/30 hover:border-red-500/50 text-red-200 text-xs font-extrabold uppercase tracking-wider transition-all shadow-md cursor-pointer whitespace-nowrap"
            >
              {vipTier === "Royal" ? "Downgrade Gold" : "VIP Royal Rank"}
            </button>
          </div>
        </div>

        {/* Right Side: Daily Claim Bonus & VIP Lucky Spin Wheel */}
        <div className="space-y-6">
          
          {/* Daily VIP Claim Cards */}
          <div className="p-5 rounded-2xl bg-neutral-950/60 border border-neutral-850 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-neutral-100 flex items-center gap-1.5">
                <Gift className="text-red-500" size={16} />
                Daily VIP Check-In Bonus
              </h3>
              <span className="text-[10px] font-mono text-emerald-400">Day {dailyStreak}/7</span>
            </div>

            <p className="text-[11px] text-neutral-400">
              Claim daily cash bonuses instantly to top up your poker game balance! Continuously checking in for 7 days grants a grand platinum chip box.
            </p>

            <div className="grid grid-cols-7 gap-1">
              {[1, 2, 3, 4, 5, 6, 7].map((day) => {
                const isClaimed = day < dailyStreak;
                const isToday = day === dailyStreak;
                return (
                  <div
                    key={day}
                    className={`flex flex-col items-center justify-center py-2.5 rounded-lg border text-center transition-all ${
                      isClaimed 
                        ? "bg-emerald-900/10 border-emerald-500/20 text-emerald-400" 
                        : isToday 
                          ? "bg-red-950 border-red-500/50 text-red-300 relative shadow-[0_0_10px_rgba(185,28,28,0.2)]" 
                          : "bg-neutral-950 border-neutral-900 text-zinc-650"
                    }`}
                  >
                    <span className="block text-[9px] uppercase font-bold">D{day}</span>
                    <span className="block text-[10px] font-bold mt-1">₹{day * 50}</span>
                  </div>
                );
              })}
            </div>

            <button
              onClick={claimDailyBonus}
              disabled={dailyClaimed}
              className={`w-full py-3.5 rounded-xl text-xs font-extrabold tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 border cursor-pointer ${
                dailyClaimed
                  ? "bg-neutral-900 border-neutral-800 text-zinc-550 pointer-events-none"
                  : "bg-gradient-to-r from-red-600 top-red-800 border-red-500/30 text-white hover:brightness-110"
              }`}
            >
              {dailyClaimed ? (
                <>
                  <Check size={14} /> Checked-In Today (+₹150 claimed)
                </>
              ) : (
                "Claim Today's VIP Bonus Cash (₹150)"
              )}
            </button>
          </div>

          {/* Interactive Spin Wheel */}
          <div className="p-5 rounded-2xl bg-neutral-950/60 border border-neutral-850 flex flex-col items-center justify-center space-y-4">
            <div className="w-full flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-neutral-100 flex items-center gap-1.5">
                <Gem className="text-amber-500" size={16} />
                Lucky Spin Wheel of Gold
              </h3>
              <span className="text-[10px] text-zinc-500">1 Free Spin Every Match</span>
            </div>

            {/* Wheel UI */}
            <div className="relative w-56 h-56 flex items-center justify-center mt-2">
              {/* Central Arrow indicator */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 h-0 w-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[18px] border-t-amber-400 z-20 drop-shadow-[0_2px_4px_rgba(245,158,11,0.5)]"></div>
              
              {/* Circular border plate */}
              <div className="absolute inset-x-0 inset-y-0 border-4 border-amber-400 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.3)] bg-neutral-900 animate-pulse-slow"></div>

              {/* Inside wheel canvas pattern */}
              <motion.div 
                className="w-full h-full rounded-full border border-neutral-800 overflow-hidden relative"
                animate={{ rotate: spinDeg }}
                transition={{ duration: isSpinning ? 4 : 0.5, ease: "easeOut" }}
              >
                {/* 8 Sector colors overlay */}
                <div className="w-full h-full relative" style={{ transform: "rotate(22.5deg)" }}>
                  {wheelPrizes.map((prize, idx) => {
                    const rot = idx * 45;
                    return (
                      <div 
                        key={idx} 
                        className="absolute w-full h-full flex items-center justify-center origin-center"
                        style={{ transform: `rotate(${rot}deg)` }}
                      >
                        {/* Slice divider line */}
                        <div className="absolute h-full w-0.5 bg-neutral-800/80 left-1/2 top-0"></div>
                        
                        {/* Prize text placed near the edge */}
                        <div className="absolute top-6 left-1/2 -translate-x-1/2 -rotate-90 origin-bottom font-sans text-[9px] font-black tracking-tighter text-amber-100 uppercase max-w-14 text-center line-clamp-1">
                          {prize}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Wheel Core click handle */}
              <button
                type="button"
                onClick={spinWheel}
                disabled={isSpinning}
                className="absolute h-14 w-14 bg-gradient-to-r from-red-650 via-red-800 to-red-950 rounded-full border-2 border-amber-400 text-[10px] font-black text-white flex flex-col items-center justify-center shadow-lg hover:brightness-110 active:scale-95 transition-all z-10 uppercase disabled:opacity-80"
              >
                {isSpinning ? (
                  <RefreshCw size={14} className="animate-spin text-amber-400" />
                ) : (
                  <>
                    <Play size={10} className="text-amber-400 fill-amber-400 mb-0.5" />
                    SPIN
                  </>
                )}
              </button>
            </div>

            {/* Spin message feedback */}
            <AnimatePresence mode="wait">
              {spinResult && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="p-3 rounded-lg border border-emerald-500/20 bg-emerald-990/20 text-center text-xs text-emerald-400 w-full"
                >
                  🎉 Reward Unlocked! You won <strong className="text-white font-bold">{spinResult}</strong> credited back to your poker balance!
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>

    </div>
  );
}

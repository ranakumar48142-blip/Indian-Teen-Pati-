import { useState } from "react";
import { 
  Crown, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Sparkles, 
  ShieldAlert, 
  MessageSquare, 
  Gift, 
  Compass, 
  Trophy, 
  PlayCircle,
  TrendingUp,
  Coins,
  History,
  Lock,
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import { LobbyTable } from "./types";
import { formatRupees } from "./utils/gameLogic";
import { motion } from "motion/react";

interface HomeScreenProps {
  balance: number;
  bonusBalance: number;
  vipTier: string;
  onNavigate: (tab: "lobby" | "wallet" | "vip") => void;
  onQuickPlay: () => void;
}

export default function HomeScreen({
  balance,
  bonusBalance,
  vipTier,
  onNavigate,
  onQuickPlay,
}: HomeScreenProps) {
  const [promoSlide, setPromoSlide] = useState(0);

  const promos = [
    { title: "Weekly ₹5 Lakhs Grand Tournament", desc: "Climb leaderboard by scoring consecutive Chaals! First prize wins real gold plated trophies and cash tickets.", badge: "Ends In 2 Days" },
    { title: "100% Match Offer on First UPI Payout", desc: "Deduce 0% fees and claim double points rewards during extended play sessions.", badge: "VIP Exclusive" },
    { title: "Muflis and AK47 Variation Games Room", desc: "Try classic variations inside our Special High Stakes tab rooms with dynamic rules.", badge: "New Variances" },
  ];

  const categories = [
    { name: "Classic Teen Patti", description: "Standard rules with seen & blind bets", minBoot: "₹10", online: "14.2K Playing", bg: "from-red-950 to-neutral-900 border-red-500/20" },
    { name: "Muflis Tournament", description: "Evaluating worst hands as highest victory wins!", minBoot: "₹100", online: "3.8K Active", bg: "from-amber-950 to-neutral-900 border-amber-500/20" },
    { name: "Hukam Variation", description: "One card selected randomly acts as Joker", minBoot: "₹500", online: "1.9K Active", bg: "from-neutral-950 to-zinc-900 border-zinc-500/20" },
  ];

  return (
    <div id="home-screen-root" className="w-full space-y-8 pb-10">
      
      {/* Dynamic Slide Banner carousel */}
      <div className="relative overflow-hidden rounded-2xl border border-yellow-500/25 bg-gradient-to-br from-neutral-950 via-red-950/40 to-neutral-900 p-6 shadow-2xl">
        <div className="absolute top-0 right-0 h-44 w-44 rounded-full bg-red-650/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 h-44 w-44 rounded-full bg-amber-500/5 blur-3xl"></div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10 transition-all duration-500">
          <div className="space-y-3 max-w-md text-left">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-[10px] font-black uppercase tracking-wider text-amber-400">
              <Sparkles size={11} className="animate-pulse" /> {promos[promoSlide].badge}
            </span>
            <h3 className="text-xl md:text-2xl font-black text-white leading-tight">
              {promos[promoSlide].title}
            </h3>
            <p className="text-zinc-400 text-xs leading-relaxed">
              {promos[promoSlide].desc}
            </p>

            <div className="flex gap-2 pt-2">
              <button
                onClick={onQuickPlay}
                className="py-2 px-4 rounded-lg bg-gradient-to-r from-red-600 to-red-800 border border-red-500/20 text-white text-xs font-black uppercase tracking-wide shadow-lg cursor-pointer"
              >
                Instant Buy-In
              </button>
              <button
                onClick={() => setPromoSlide((promoSlide + 1) % promos.length)}
                className="py-2 px-3 rounded-lg bg-neutral-950/80 border border-neutral-850 hover:border-neutral-750 text-neutral-400 hover:text-white text-xs font-bold"
              >
                Next Offer →
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center p-4">
            {/* Visual representation of cascading gold chips */}
            <div className="relative h-24 w-24 flex items-center justify-center bg-gradient-to-b from-amber-500/10 to-transparent border border-amber-500/20 rounded-2xl">
              <Coins size={44} className="text-amber-400 animate-bounce" />
              <div className="absolute top-2 right-2 h-2.5 w-2.5 bg-red-500 rounded-full animate-ping"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Launchers panel */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          onClick={() => onNavigate("lobby")}
          className="p-4 rounded-xl border border-neutral-850 bg-neutral-950/40 hover:border-red-500/20 transition-all text-left space-y-2 group"
        >
          <span className="p-2 inline-block rounded-lg bg-red-500/10 text-red-500 group-hover:scale-105 transition-transform"><Compass size={16} /></span>
          <span className="block text-xs font-black text-neutral-200">Table Lobby</span>
          <span className="block text-[10px] text-zinc-500 leading-snug">Browse available stakes boot rooms</span>
        </button>

        <button
          onClick={() => onNavigate("wallet")}
          className="p-4 rounded-xl border border-neutral-850 bg-neutral-950/40 hover:border-amber-500/20 transition-all text-left space-y-2 group"
        >
          <span className="p-2 inline-block rounded-lg bg-amber-500/10 text-amber-500 group-hover:scale-105 transition-transform"><ArrowUpRight size={16} /></span>
          <span className="block text-xs font-black text-neutral-200">Deposit Money</span>
          <span className="block text-[10px] text-zinc-500 leading-snug">UPI cash instantly updated with 10% bonus</span>
        </button>

        <button
          onClick={() => onNavigate("wallet")}
          className="p-4 rounded-xl border border-neutral-850 bg-neutral-950/40 hover:border-emerald-500/20 transition-all text-left space-y-2 group"
        >
          <span className="p-2 inline-block rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:scale-105 transition-transform"><ArrowDownLeft size={16} /></span>
          <span className="block text-xs font-black text-neutral-200">Withdraw Cash</span>
          <span className="block text-[10px] text-zinc-500 leading-snug">Fast direct payout KYC certified under 3 mins</span>
        </button>

        <button
          onClick={() => onNavigate("vip")}
          className="p-4 rounded-xl border border-neutral-850 bg-neutral-950/40 hover:border-yellow-500/20 transition-all text-left space-y-2 group"
        >
          <span className="p-2 inline-block rounded-lg bg-yellow-500/10 text-yellow-400 group-hover:scale-105 transition-transform"><Crown size={16} /></span>
          <span className="block text-xs font-black text-neutral-200">VIP Club Perks</span>
          <span className="block text-[10px] text-zinc-500 leading-snug">Claim daily cash reward spins and checks</span>
        </button>
      </div>

      {/* Featured variation categories */}
      <div className="space-y-4">
        <h4 className="text-sm font-extrabold text-neutral-100 uppercase tracking-wider flex items-center gap-2">
          <Trophy size={16} className="text-amber-500" />
          Featured Game Variations
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <div 
              key={idx}
              className={`p-5 rounded-2xl border bg-gradient-to-br ${cat.bg} relative overflow-hidden group hover:shadow-lg transition-all`}
            >
              <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-white/5 blur-2xl group-hover:bg-white/10 transition-colors"></div>

              <div className="space-y-3 relative z-10">
                <span className="text-[10px] uppercase font-bold text-emerald-400">{cat.online}</span>
                <h4 className="text-sm font-black text-white">{cat.name}</h4>
                <p className="text-zinc-400 text-xxs leading-relaxed">{cat.description}</p>
                <div className="flex justify-between items-center pt-2 text-[11px]">
                  <span className="text-zinc-500">Stakes Limit: <strong className="text-neutral-200 font-mono">{cat.minBoot} Boot</strong></span>
                  <button 
                    onClick={onQuickPlay}
                    className="flex items-center gap-0.5 text-amber-400 font-bold hover:text-amber-300"
                  >
                    Quick Play <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Assurance Footer panel */}
      <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-900 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div className="flex flex-col items-center justify-center space-y-1">
          <ShieldCheck size={18} className="text-emerald-500" />
          <span className="text-xs font-bold text-neutral-200">Fair Play Certified</span>
          <span className="text-[10px] text-zinc-500">100% Random Number Deck Generator</span>
        </div>
        <div className="flex flex-col items-center justify-center space-y-1 border-y sm:border-y-0 sm:border-x border-white/5 py-2 sm:py-0">
          <Lock size={16} className="text-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-neutral-200">Zero Hack Security</span>
          <span className="text-[10px] text-zinc-500">Encrypted game session state transfers</span>
        </div>
        <div className="flex flex-col items-center justify-center space-y-1">
          <MessageSquare size={16} className="text-amber-500" />
          <span className="text-xs font-bold text-neutral-200">24/7 Whatsapp Support</span>
          <span className="text-[10px] text-zinc-500">Direct instant personal assistant hotline</span>
        </div>
      </div>

    </div>
  );
}

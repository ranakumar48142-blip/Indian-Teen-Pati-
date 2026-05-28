import { useState } from "react";
import { 
  Users, 
  Zap, 
  ShieldCheck, 
  Flame, 
  Coins, 
  Info, 
  Lock, 
  PlayCircle,
  TrendingUp,
  Gift
} from "lucide-react";
import { LobbyTable } from "../types";
import { formatRupees } from "../utils/gameLogic";
import { motion } from "motion/react";

interface LobbySectionProps {
  onSelectTable: (table: LobbyTable) => void;
  balance: number;
}

export default function LobbySection({ onSelectTable, balance }: LobbySectionProps) {
  const [activeCategory, setActiveCategory] = useState<"all" | "classic" | "high" | "turbo">("all");

  const tables: LobbyTable[] = [
    { id: "tbl_1", name: "Chai-Tapri Novice Standard", bootValue: 10, chalLimit: 400, potLimit: 1000, activePlayersCount: 238, maxPlayers: 5, badge: "Low Stakes Practice", speed: "Classic" },
    { id: "tbl_2", name: "Classic Diwali Card Room", bootValue: 100, chalLimit: 2000, potLimit: 10000, activePlayersCount: 849, maxPlayers: 5, badge: "Most Popular", speed: "Classic" },
    { id: "tbl_3", name: "Club Platinum High Rollers", bootValue: 500, chalLimit: 10000, potLimit: 50000, activePlayersCount: 312, maxPlayers: 5, badge: "VIP Choice", speed: "Classic" },
    { id: "tbl_4", name: "Grand Royal Maharajah Arena", bootValue: 1000, chalLimit: 25000, potLimit: 100000, activePlayersCount: 145, maxPlayers: 5, badge: "Elite Stakes", speed: "Turbo" },
    { id: "tbl_5", name: "High Stakes Emperor Table", bootValue: 5000, chalLimit: 100000, potLimit: 500000, activePlayersCount: 42, maxPlayers: 5, badge: "Legend Stakes", speed: "Classic" },
    { id: "tbl_6", name: "Speed Turbo-Buster Rumble", bootValue: 100, chalLimit: 2000, potLimit: 10000, activePlayersCount: 194, maxPlayers: 5, badge: "Fast Action", speed: "Turbo" },
  ];

  const recentWinners = [
    { user: "Rajesh_VIP", amount: 48500, table: "Maharajah Arena", time: "Just now" },
    { user: "Vijay_Patel", amount: 12000, table: "Diwali Card Room", time: "1m ago" },
    { user: "Priya_Pro", amount: 250000, table: "Emperor Table", time: "3m ago" },
    { user: "Amit_Singhania", amount: 9500, table: "Speed Turbo", time: "5m ago" },
  ];

  const filteredTables = tables.filter((t) => {
    if (activeCategory === "all") return true;
    if (activeCategory === "classic") return t.bootValue <= 100 && t.speed === "Classic";
    if (activeCategory === "high") return t.bootValue >= 500;
    if (activeCategory === "turbo") return t.speed === "Turbo";
    return true;
  });

  return (
    <div id="lobby-section-root" className="w-full space-y-8 pb-10">
      
      {/* Dynamic scrolling winners ticker */}
      <div className="overflow-hidden bg-neutral-950/80 border-y border-red-500/10 py-2">
        <div className="flex items-center gap-8 whitespace-nowrap animate-marquee">
          <div className="flex items-center gap-2 text-[10px] font-bold text-amber-400 capitalize">
            <TrendingUp size={12} className="text-emerald-400" />
            LIVE CASH SETTLEMENT TICKER:
          </div>
          {recentWinners.map((winner, idx) => (
            <div key={idx} className="inline-flex items-center gap-1.5 text-[11px] text-neutral-300">
              <span className="font-semibold text-neutral-100">{winner.user}</span>
              <span className="text-zinc-500">won</span>
              <span className="font-bold text-emerald-400 font-mono">₹{winner.amount.toLocaleString()}</span>
              <span className="text-zinc-500">at</span>
              <span className="text-amber-500 font-medium italic">{winner.table}</span>
              <span className="text-[9px] text-zinc-600">({winner.time})</span>
              <span className="h-1.5 w-1.5 rounded-full bg-red-600 mx-4"></span>
            </div>
          ))}
        </div>
      </div>

      {/* Categories and Filters Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Coins size={20} className="text-amber-400 fill-amber-400/15" />
            Cash Tables Active Lobby
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">Choose stakes of choice and challenge real player models instantly</p>
        </div>

        <div className="flex items-center gap-1.5 bg-neutral-950/60 p-1 rounded-xl border border-neutral-850 self-start">
          {[
            { id: "all", label: "All Tables" },
            { id: "classic", label: "Classic/Low Boot" },
            { id: "high", label: "High Stakes Club" },
            { id: "turbo", label: "Hot Turbo" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeCategory === cat.id
                  ? "bg-red-950 text-red-200 border border-red-500/20 shadow-[0_0_8px_rgba(185,28,28,0.2)]"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTables.map((table) => {
          const isInsufficent = balance < table.bootValue;
          return (
            <div 
              key={table.id}
              className={`relative overflow-hidden group rounded-2xl border transition-all ${
                isInsufficent 
                  ? "bg-neutral-950/30 border-neutral-900 opacity-60" 
                  : "bg-gradient-to-b from-neutral-950 via-neutral-950 to-red-950/15 border-neutral-850 hover:border-amber-500/30 hover:shadow-[0_4px_25px_rgba(185,28,28,0.15)]"
              }`}
            >
              {/* Badge top-right */}
              {table.badge && (
                <span className="absolute top-3 right-3 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  {table.badge}
                </span>
              )}

              {/* Speed tracker bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-amber-500 to-yellow-400 opacity-80"></div>

              <div className="p-5 space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-neutral-400">
                    {table.speed === "Turbo" ? (
                      <Zap size={14} className="text-amber-400 fill-amber-400" />
                    ) : (
                      <Flame size={14} className="text-red-500" />
                    )}
                    <span className="text-[10px] font-mono tracking-widest font-bold uppercase">{table.speed} Speed</span>
                  </div>
                  <h4 className="text-sm font-black text-white group-hover:text-amber-300 transition-colors">{table.name}</h4>
                </div>

                {/* Grid values */}
                <div className="grid grid-cols-3 gap-2 bg-neutral-950/80 p-3 rounded-xl border border-neutral-900 font-mono text-[11px]">
                  <div>
                    <span className="block text-[8px] text-neutral-500 uppercase font-bold text-center">BOOT</span>
                    <span className="block text-center font-bold text-amber-400 mt-0.5">₹{table.bootValue}</span>
                  </div>
                  <div className="h-6 w-px bg-white/5 mx-auto self-center"></div>
                  <div>
                    <span className="block text-[8px] text-neutral-500 uppercase font-bold text-center">POT LIMIT</span>
                    <span className="block text-center font-bold text-neutral-200 mt-0.5">₹{table.potLimit.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-neutral-400 pt-1">
                  <span className="flex items-center gap-1">
                    <Users size={13} className="text-zinc-550" />
                    {table.activePlayersCount} Live Players
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-emerald-400 flex items-center gap-1 font-bold">
                    <ShieldCheck size={12} strokeWidth={2.5} /> Secured Safe
                  </span>
                </div>

                {/* Join button */}
                <button
                  type="button"
                  disabled={isInsufficent}
                  onClick={() => onSelectTable(table)}
                  className={`w-full py-3.5 rounded-xl text-xs font-black tracking-wide uppercase transition-all flex items-center justify-center gap-1.5 border cursor-pointer ${
                    isInsufficent
                      ? "bg-neutral-900 border-neutral-850 text-neutral-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-red-600 to-red-800 border-red-500/20 text-white hover:brightness-110 shadow-[0_0_15px_rgba(185,28,28,0.3)] hover:shadow-[0_0_20px_rgba(251,191,36,0.15)] pr-5"
                  }`}
                >
                  {isInsufficent ? (
                    <>
                      <Lock size={12} /> Balance Low (Min ₹{table.bootValue})
                    </>
                  ) : (
                    <>
                      <PlayCircle size={14} className="animate-pulse" /> Enter Premium Table
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bonus Guidelines Bottom Panel */}
      <div className="rounded-2xl border border-red-500/10 bg-gradient-to-b from-red-950/10 to-neutral-950 p-5 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <span className="p-3 bg-red-500/10 rounded-xl text-red-500 flex items-center justify-center">
            <Gift size={24} />
          </span>
          <div className="space-y-1">
            <h5 className="text-sm font-bold text-neutral-100">Claim 100% Free Game Chips to Start!</h5>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-xl">
              No deposit required to try the game! Click the <strong className="text-amber-400">Instant UPI Deposit</strong> or check into our <strong className="text-amber-400">Daily VIP Check-in Card</strong> to unlock unlimited game testing chips.
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            const upiEvObj = document.getElementById("wallet-actions-tabs");
            if (upiEvObj) upiEvObj.scrollIntoView({ behavior: "smooth" });
          }}
          className="py-2.5 px-4 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-neutral-950 text-xs font-black uppercase tracking-wider transition-all shadow-[0_0_12px_rgba(251,191,36,0.35)] cursor-pointer whitespace-nowrap"
        >
          Add Fast Cash Free
        </button>
      </div>

    </div>
  );
}

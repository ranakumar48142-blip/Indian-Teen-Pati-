import { useState, useEffect } from "react";
import { 
  Home, 
  Compass, 
  Coins, 
  Crown, 
  Sparkles, 
  Bell, 
  User, 
  HelpCircle,
  TrendingUp,
  ShieldAlert,
  ChevronRight
} from "lucide-react";
import HomeScreen from "./HomeScreen";
import LobbySection from "./components/LobbySection";
import GameTableRoom from "./components/GameTableRoom";
import WalletDashboard from "./components/WalletDashboard";
import VIPDashboard from "./components/VIPDashboard";
import { Transaction, LobbyTable } from "./types";
import { formatRupees } from "./utils/gameLogic";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  // Balance management with local resilience
  const [balance, setBalance] = useState<number>(() => {
    const saved = localStorage.getItem("tp_real_balance");
    return saved ? parseFloat(saved) : 54250;
  });

  const [bonusBalance, setBonusBalance] = useState<number>(() => {
    const saved = localStorage.getItem("tp_bonus_balance");
    return saved ? parseFloat(saved) : 2250;
  });

  const [vipTier, setVipTier] = useState<string>(() => {
    const saved = localStorage.getItem("tp_vip_tier");
    return saved || "Royal";
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem("tp_transactions");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback to defaults on parse errors
      }
    }
    return [
      { id: "tx_1", type: "deposit", amount: 15000, method: "UPI GPAY", status: "completed", date: "2026-05-28T14:24:00Z", transactionId: "TPN829105" },
      { id: "tx_2", type: "withdrawal", amount: 5000, method: "BANK IMPS", status: "completed", date: "2026-05-27T10:11:00Z", transactionId: "TPN501827" }
    ];
  });

  const [activeTab, setActiveTab] = useState<"home" | "lobby" | "game_table" | "wallet" | "vip">("home");
  const [selectedTable, setSelectedTable] = useState<LobbyTable | null>(null);
  const [notifications, setNotifications] = useState<string[]>([
    "Welcome to Royal Teen Patti Cash Arena! Enjoy your ₹2,250 free matched bonus.",
    "Gold tournament is now live! Submit high bets to win premium points matches."
  ]);
  const [showNotifPanel, setShowNotifPanel] = useState<boolean>(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem("tp_real_balance", balance.toString());
  }, [balance]);

  useEffect(() => {
    localStorage.setItem("tp_bonus_balance", bonusBalance.toString());
  }, [bonusBalance]);

  useEffect(() => {
    localStorage.setItem("tp_vip_tier", vipTier);
  }, [vipTier]);

  useEffect(() => {
    localStorage.setItem("tp_transactions", JSON.stringify(transactions));
  }, [transactions]);

  const handleUpdateBalance = (newVal: number) => {
    setBalance(newVal);
  };

  const handleAddTransaction = (tx: Transaction) => {
    setTransactions(prev => [tx, ...prev]);
  };

  const handleSelectTable = (table: LobbyTable) => {
    setSelectedTable(table);
    setActiveTab("game_table");
  };

  const handleQuickPlay = () => {
    // Pick the Diwali Card room or Novice if balance is low
    const defaultTable: LobbyTable = balance >= 100 
      ? { id: "tbl_2", name: "Classic Diwali Card Room", bootValue: 100, chalLimit: 2000, potLimit: 10000, activePlayersCount: 849, maxPlayers: 5, speed: "Classic" }
      : { id: "tbl_1", name: "Chai-Tapri Novice Standard", bootValue: 10, chalLimit: 400, potLimit: 1000, activePlayersCount: 238, maxPlayers: 5, speed: "Classic" };
    
    handleSelectTable(defaultTable);
  };

  return (
    <div id="casino-applet-viewport" className="min-h-screen bg-neutral-950 font-sans selection:bg-red-500/30 selection:text-white p-2 sm:p-4 md:p-6 lg:p-8 flex items-center justify-center relative overflow-x-hidden">
      
      {/* Decorative backdrop luxury rings */}
      <div className="absolute top-10 left-10 h-72 w-72 rounded-full border border-red-500/5 animate-pulse-slow pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 h-96 w-96 rounded-full border border-amber-500/5 animate-pulse pointer-events-none"></div>

      {/* Outer Golden/Bronze Frame to center the high quality mobile feel */}
      <div className="w-full max-w-5xl rounded-3xl border border-amber-500/20 bg-gradient-to-b from-neutral-900 to-neutral-950 shadow-[0_10px_50px_rgba(185,28,28,0.15)] overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-red-600 via-amber-400 to-red-650"></div>

        {/* Top Header Section */}
        <header className="px-4 sm:px-6 py-4 bg-neutral-950/80 border-b border-neutral-850 flex items-center justify-between sticky top-0 z-35 backdrop-blur">
          
          {/* Logo & Status */}
          <div className="flex items-center gap-3">
            <span className="h-9 w-9 rounded-xl bg-gradient-to-r from-red-650 via-red-800 to-red-950 border border-amber-500/30 flex items-center justify-center text-amber-400 font-serif font-black shadow-[0_0_12px_rgba(251,191,36,0.3)] animate-pulse">
              ♠
            </span>
            <div>
              <span className="block text-[8px] uppercase tracking-widest text-[#B45309] font-black leading-none mb-1">
                ROYAL CASINO DESIGNS
              </span>
              <h1 className="text-sm font-black text-white hover:text-amber-400 transition-colors cursor-default select-none tracking-tight">
                Teen Patti Cash
              </h1>
            </div>
          </div>

          {/* Balance dashboard indicators */}
          <div className="flex items-center gap-2 sm:gap-4 relative">
            <div 
              onClick={() => setActiveTab("wallet")}
              className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 flex items-center gap-2 cursor-pointer transition-all shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
            >
              <Coins size={14} className="text-amber-400 animate-spin" />
              <div>
                <span className="block text-[8px] text-[zinc-500] uppercase font-bold leading-none mb-0.5">Real Money</span>
                <span className="text-xs font-black text-amber-400 font-mono tracking-tight">{formatRupees(balance)}</span>
              </div>
            </div>

            {/* VIP Status Badge Indicator */}
            <div 
              onClick={() => setActiveTab("vip")}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-b from-yellow-500/10 to-transparent hover:brightness-110 border border-yellow-500/25 flex items-center gap-1.5 cursor-pointer transition-all shadow-md"
            >
              <Crown size={14} className="text-yellow-400 fill-yellow-400/20" />
              <div>
                <span className="block text-[8px] text-yellow-500/60 uppercase font-black tracking-widest leading-none mb-0.5">VIP Club</span>
                <span className="text-[10px] font-extrabold text-yellow-400 uppercase leading-none">{vipTier} Status</span>
              </div>
            </div>

            {/* Notification triggers */}
            <button
              onClick={() => setShowNotifPanel(!showNotifPanel)}
              className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white relative"
            >
              <Bell size={15} />
              <span className="absolute top-1 right-1 h-1.5 w-1.5 bg-red-500 rounded-full"></span>
            </button>

            {/* Notifications panel toggle overlay */}
            <AnimatePresence>
              {showNotifPanel && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 top-12 w-64 bg-neutral-900 border border-neutral-800 rounded-xl p-4 shadow-2xl z-40 space-y-3"
                >
                  <span className="block text-[10px] uppercase font-black text-neutral-400 border-b border-white/5 pb-1.5">Table Alerts ({notifications.length})</span>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {notifications.map((n, idx) => (
                      <p key={idx} className="text-[10px] text-neutral-400 leading-snug border-l-2 border-amber-500 pl-2">
                        {n}
                      </p>
                    ))}
                  </div>
                  <button
                    onClick={() => setShowNotifPanel(false)}
                    className="w-full py-1.5 rounded bg-neutral-950 text-xxs text-neutral-500 hover:text-white font-bold"
                  >
                    Clear Notices
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>

        {/* Embedded Body view block */}
        <main className="p-4 sm:p-6 w-full relative z-10 transition-all duration-300">
          <AnimatePresence mode="wait">
            {activeTab === "home" && (
              <motion.div
                key="home-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <HomeScreen 
                  balance={balance}
                  bonusBalance={bonusBalance}
                  vipTier={vipTier}
                  onNavigate={(tab) => setActiveTab(tab)}
                  onQuickPlay={handleQuickPlay}
                />
              </motion.div>
            )}

            {activeTab === "lobby" && (
              <motion.div
                key="lobby-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <LobbySection 
                  onSelectTable={handleSelectTable}
                  balance={balance}
                />
              </motion.div>
            )}

            {activeTab === "game_table" && selectedTable && (
              <motion.div
                key="game-table-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <GameTableRoom 
                  table={selectedTable}
                  playerBalance={balance}
                  onUpdatePlayerBalance={handleUpdateBalance}
                  onExit={() => {
                    setSelectedTable(null);
                    setActiveTab("lobby");
                  }}
                  vipTier={vipTier}
                />
              </motion.div>
            )}

            {activeTab === "wallet" && (
              <motion.div
                key="wallet-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <WalletDashboard 
                  balance={balance}
                  bonusBalance={bonusBalance}
                  onUpdateBalance={handleUpdateBalance}
                  transactions={transactions}
                  onAddTransaction={handleAddTransaction}
                  vipTier={vipTier}
                />
              </motion.div>
            )}

            {activeTab === "vip" && (
              <motion.div
                key="vip-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <VIPDashboard 
                  balance={balance}
                  onUpdateBalance={handleUpdateBalance}
                  vipTier={vipTier}
                  onUpgradeVip={(tier) => setVipTier(tier)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Interactive Bottom Tab navigation with native mobile feeling */}
        {activeTab !== "game_table" && (
          <footer className="bg-neutral-950/90 border-t border-neutral-850 sticky bottom-0 z-30 backdrop-blur px-4 py-2 flex items-center justify-around">
            <button
              onClick={() => setActiveTab("home")}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all ${
                activeTab === "home" ? "text-red-500 scale-105" : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              <Home size={18} />
              <span className="text-[9px] font-bold mt-1 tracking-wider uppercase">HQ Home</span>
            </button>

            <button
              onClick={() => setActiveTab("lobby")}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all ${
                activeTab === "lobby" ? "text-red-500 scale-105" : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              <Compass size={18} />
              <span className="text-[9px] font-bold mt-1 tracking-wider uppercase">Lobbies</span>
            </button>

            {/* Quick entry table link */}
            <button
              onClick={handleQuickPlay}
              className="h-12 w-12 -mt-6 rounded-full bg-gradient-to-r from-red-600 to-red-800 border-2 border-amber-400 flex items-center justify-center text-white shadow-[0_0_15px_rgba(185,28,28,0.5)] transform hover:scale-110 active:scale-95 transition-all text-xs font-black z-30"
            >
              PLAY
            </button>

            <button
              onClick={() => setActiveTab("wallet")}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all ${
                activeTab === "wallet" ? "text-red-400 scale-105" : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              <Coins size={18} />
              <span className="text-[9px] font-bold mt-1 tracking-wider uppercase">Wallet</span>
            </button>

            <button
              onClick={() => setActiveTab("vip")}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all ${
                activeTab === "vip" ? "text-yellow-400 scale-105" : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              <Crown size={18} />
              <span className="text-[9px] font-bold mt-1 tracking-wider uppercase">VIP Perks</span>
            </button>
          </footer>
        )}
      </div>
    </div>
  );
}

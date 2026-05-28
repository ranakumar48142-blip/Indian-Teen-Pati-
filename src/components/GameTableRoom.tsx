import { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  Coins, 
  HelpCircle, 
  Volume2, 
  VolumeX, 
  Info, 
  Award, 
  Sparkles, 
  RefreshCw, 
  Clock, 
  UserCheck, 
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import { Card, Suit, Rank, Player, GameState, LobbyTable, RoundPhase } from "../types";
import { createDeck, shuffleDeck, evaluateHand, formatRupees } from "../utils/gameLogic";
import { motion, AnimatePresence } from "motion/react";

interface GameTableRoomProps {
  table: LobbyTable;
  playerBalance: number;
  onUpdatePlayerBalance: (newBalance: number) => void;
  onExit: () => void;
  vipTier: string;
}

export default function GameTableRoom({
  table,
  playerBalance,
  onUpdatePlayerBalance,
  onExit,
  vipTier,
}: GameTableRoomProps) {
  // Game Audio Mute State
  const [muted, setMuted] = useState<boolean>(false);
  
  // Game log list
  const [logs, setLogs] = useState<string[]>(["Table initiated. Waiting to start round..."]);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [winningHandLabel, setWinningHandLabel] = useState<string>("");

  // Setup round
  const [gameState, setGameState] = useState<GameState>({
    players: [],
    dealerIdx: 0,
    activePlayerIdx: -1,
    pot: 0,
    currentBet: table.bootValue,
    roundPhase: "ended",
    winnerIds: [],
    winningReason: "",
    deckCount: 52,
  });

  const [cardsSeen, setCardsSeen] = useState<boolean>(false);
  const [botThinking, setBotThinking] = useState<boolean>(false);

  // Initialize and start a round
  const startNewRound = () => {
    if (playerBalance < table.bootValue) {
      alert("Insufficient funds to post boot. Please add deposit cash!");
      onExit();
      return;
    }

    setCardsSeen(false);
    setShowCelebration(false);
    setWinningHandLabel("");

    const deck = shuffleDeck(createDeck());
    const boot = table.bootValue;

    // Deduct boot from player
    const updatedBalance = playerBalance - boot;
    onUpdatePlayerBalance(updatedBalance);

    // Initial 3 Players
    const initialPlayers: Player[] = [
      {
        id: "human_user",
        name: "You (VIP Royal)",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150",
        balance: updatedBalance,
        isBot: false,
        cards: [deck[0], deck[3], deck[6]],
        isFolded: false,
        isBlind: true,
        lastAction: "Posted Boot",
        vipTier: vipTier as any,
      },
      {
        id: "bot_rajesh",
        name: "Rajesh (VIP Pro)",
        avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=150",
        balance: 14500,
        isBot: true,
        cards: [deck[1], deck[4], deck[7]],
        isFolded: false,
        isBlind: true, // Bots usually play blind for some turns
        lastAction: "Posted Boot",
        vipTier: "Gold",
      },
      {
        id: "bot_amit",
        name: "Amit (Elite)",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
        balance: 9200,
        isBot: true,
        cards: [deck[2], deck[5], deck[8]],
        isFolded: false,
        isBlind: true,
        lastAction: "Posted Boot",
        vipTier: "Silver",
      }
    ];

    addLog(`Round Started! Boot posted: ₹${boot} from each player.`);

    setGameState({
      players: initialPlayers,
      dealerIdx: 0,
      activePlayerIdx: 0, // Human plays first
      pot: boot * 3,
      currentBet: boot,
      roundPhase: "betting",
      winnerIds: [],
      winningReason: "",
      deckCount: 43,
    });
  };

  // Run automatically when table loads
  useEffect(() => {
    startNewRound();
  }, [table]);

  const addLog = (msg: string) => {
    setLogs((prev) => [msg, ...prev.slice(0, 15)]);
  };

  const getActivePlayer = (): Player | null => {
    if (gameState.activePlayerIdx < 0 || gameState.activePlayerIdx >= gameState.players.length) return null;
    return gameState.players[gameState.activePlayerIdx];
  };

  // Bot Intelligent Turn Handling
  useEffect(() => {
    if (gameState.roundPhase !== "betting") return;
    const active = getActivePlayer();
    if (!active || !active.isBot || active.isFolded) return;

    setBotThinking(true);
    const delay = 1500 + Math.random() * 1500; // Realistic human delay

    const timer = setTimeout(() => {
      setBotThinking(false);
      handleBotMove(active);
    }, delay);

    return () => clearTimeout(timer);
  }, [gameState.activePlayerIdx, gameState.roundPhase]);

  const handleBotMove = (bot: Player) => {
    const activeIndex = gameState.activePlayerIdx;
    
    // Simple Teen Patti bot intelligence
    const handEval = evaluateHand(bot.cards);
    
    // Decide whether to see cards
    let willSee = !bot.isBlind;
    // Bots see cards if pot gets high or they have finished 1 blind round
    if (bot.isBlind && (Math.random() < 0.4 || gameState.pot > table.bootValue * 10)) {
      willSee = true;
      bot.isBlind = false;
      addLog(`${bot.name} looked at his cards!`);
    }

    // Hand evaluation strategy
    // High card has low probability, flush/sequences are good, trios always win
    let option: "chaal" | "pack" | "show" = "chaal";
    const strength = handEval.strength;

    if (willSee) {
      if (strength < 20100 && Math.random() < 0.6) {
        // Weak hand (no pair, low card) - fold!
        option = "pack";
      } else if (strength > 40000 && Math.random() < 0.2 && countActivePlayers() === 2) {
        // Strong Hand and only 2 players left - Show showdown!
        option = "show";
      }
    } else {
      // Blind behaves differently. Blind players rarely pack!
      if (Math.random() < 0.05) {
        option = "pack";
      }
    }

    // Force show if pot exceeds limit or current bet exceeds bot's cash
    if (gameState.pot >= table.potLimit || bot.balance < gameState.currentBet * 2) {
      option = countActivePlayers() === 2 ? "show" : "pack";
    }

    // Execute Bot chosen move
    if (option === "pack") {
      bot.isFolded = true;
      bot.lastAction = "Folded (Pack)";
      addLog(`${bot.name} folded.`);
      advanceTurn(gameState.players);
    } else if (option === "show") {
      triggerShowdown();
    } else {
      // Chaal (Bet)
      // If bot is blind, bet = current_bet
      // If bot is seen, bet = 2 * current_bet (or same as chaal equivalent)
      const betMultiplier = bot.isBlind ? 1 : 2;
      const betAmount = gameState.currentBet * betMultiplier;

      bot.balance -= betAmount;
      bot.lastAction = bot.isBlind ? `Blind ₹${betAmount}` : `Chaal ₹${betAmount}`;
      
      addLog(`${bot.name} played ${bot.lastAction}`);

      const newPlayers = [...gameState.players];
      newPlayers[activeIndex] = bot;

      setGameState(prev => ({
        ...prev,
        players: newPlayers,
        pot: prev.pot + betAmount,
      }));

      advanceTurn(newPlayers);
    }
  };

  const countActivePlayers = (playersList = gameState.players): number => {
    return playersList.filter(p => !p.isFolded).length;
  };

  // Move token to next active player
  const advanceTurn = (playersList: Player[]) => {
    // Check if only 1 player remains (Everyone else folded)
    const activeRank = playersList.filter(p => !p.isFolded);
    if (activeRank.length === 1) {
      handleSingleWinner(activeRank[0].id);
      return;
    }

    let nextIdx = (gameState.activePlayerIdx + 1) % playersList.length;
    while (playersList[nextIdx].isFolded) {
      nextIdx = (nextIdx + 1) % playersList.length;
    }

    setGameState(prev => ({
      ...prev,
      activePlayerIdx: nextIdx,
    }));
  };

  // Single winner remaining
  const handleSingleWinner = (winnerId: string) => {
    const winner = gameState.players.find(p => p.id === winnerId);
    if (!winner) return;

    if (winnerId === "human_user") {
      const winnings = gameState.pot;
      const newBal = playerBalance + winnings;
      onUpdatePlayerBalance(newBal);
      addLog(`Victory! All opponents folded. You won the Pot of ₹${winnings}!`);
      setShowCelebration(true);
      setWinningHandLabel("Defeated Opponents");
    } else {
      addLog(`${winner.name} won the pot of ₹${gameState.pot} as everyone folded.`);
    }

    setGameState(prev => ({
      ...prev,
      roundPhase: "ended",
      winnerIds: [winnerId],
      winningReason: "Opponents Folded",
    }));
  };

  // Player action triggers
  const handleUserWatchCards = () => {
    setCardsSeen(true);
    const newPlayers = [...gameState.players];
    const player = newPlayers[0];
    player.isBlind = false;
    player.lastAction = "Saw Cards";
    addLog("You saw your cards!");
    setGameState(prev => ({ ...prev, players: newPlayers }));
  };

  const handleUserChaal = (multiply = 1) => {
    const playerIndex = 0;
    const player = gameState.players[playerIndex];
    if (player.isFolded) return;

    // Bet calculation
    // Blind player plays: currentBet
    // Seen player plays: 2 * currentBet
    const multiplier = player.isBlind ? 1 : 2;
    const baseBet = gameState.currentBet * multiplier * multiply;

    if (playerBalance < baseBet) {
      alert("Insufficient balance to place this Chaal! Please add deposits first.");
      return;
    }

    const nextBal = playerBalance - baseBet;
    onUpdatePlayerBalance(nextBal);

    const newPlayers = [...gameState.players];
    newPlayers[playerIndex] = {
      ...player,
      balance: nextBal,
      lastAction: player.isBlind ? `Blind ₹${baseBet}` : `Chaal ₹${baseBet}`,
    };

    addLog(`You played ${newPlayers[playerIndex].lastAction}`);

    setGameState(prev => ({
      ...prev,
      players: newPlayers,
      pot: prev.pot + baseBet,
    }));

    advanceTurn(newPlayers);
  };

  const handleUserPack = () => {
    const playerIndex = 0;
    const player = gameState.players[playerIndex];
    if (player.isFolded) return;

    const newPlayers = [...gameState.players];
    newPlayers[playerIndex] = {
      ...player,
      isFolded: true,
      lastAction: "Folded (Pack)"
    };

    addLog("You folded (Pack).");
    setGameState(prev => ({ ...prev, players: newPlayers }));
    
    // Check if bots are left
    advanceTurn(newPlayers);
  };

  // Showdown action
  const triggerShowdown = () => {
    const activePlayers = gameState.players.filter(p => !p.isFolded);
    if (activePlayers.length > 2) {
      // Teen Patti showdown usually only allowed when 2 players remain
      alert("A Showdown is only allowed when exactly 2 players remain in the round!");
      return;
    }

    // Evaluate hands
    let bestHandVal = -1;
    let winnerId = "";
    let reason = "";

    activePlayers.forEach(p => {
      const evalResult = evaluateHand(p.cards);
      addLog(`${p.name} had ${evalResult.label}`);
      if (evalResult.strength > bestHandVal) {
        bestHandVal = evalResult.strength;
        winnerId = p.id;
        reason = evalResult.label;
      }
    });

    const winner = gameState.players.find(p => p.id === winnerId);
    if (!winner) return;

    if (winnerId === "human_user") {
      const winnings = gameState.pot;
      const newBal = playerBalance + winnings;
      onUpdatePlayerBalance(newBal);
      setShowCelebration(true);
      setWinningHandLabel(reason);
      addLog(`🏆 Showdown Winner: You won ₹${winnings} with ${reason}!`);
    } else {
      addLog(`🏆 Showdown Winner: ${winner.name} won ₹${gameState.pot} with ${reason}.`);
    }

    setGameState(prev => ({
      ...prev,
      roundPhase: "ended",
      winnerIds: [winnerId],
      winningReason: reason,
    }));
  };

  const getSuitSymbol = (suit: Suit) => {
    switch (suit) {
      case "spades": return "♠";
      case "hearts": return "♥";
      case "diamonds": return "♦";
      case "clubs": return "♣";
    }
  };

  const getSuitColorClass = (suit: Suit) => {
    return suit === "hearts" || suit === "diamonds" ? "text-red-500" : "text-neutral-200";
  };

  return (
    <div id="game-table-room-root" className="w-full min-h-[92vh] flex flex-col justify-between py-4 bg-radial-at-t from-red-950 via-neutral-950 to-neutral-950 text-white rounded-3xl overflow-hidden relative border border-amber-500/25">
      {/* Golden Confetti Shower effect */}
      {showCelebration && (
        <div className="absolute inset-0 z-40 bg-black/70 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.15),transparent_60%)] pointer-events-none"></div>
          
          <div className="space-y-6 max-w-sm relative z-50">
            {/* Spinning coin animation inside */}
            <div className="mx-auto h-24 w-24 bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 rounded-full border-4 border-amber-300 animate-spin flex items-center justify-center shadow-[0_0_25px_rgba(251,191,36,0.6)]">
              <Coins size={44} className="text-zinc-950" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] uppercase font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-400">GRAND TOURNAMENT WINNER</span>
              <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-100 via-amber-300 to-yellow-500 uppercase tracking-tight">
                Victory Is Yours!
              </h2>
              <p className="text-xs text-neutral-300">
                You evaluated {countActivePlayers() === 1 ? "the winning folded strategy" : `a premium ${winningHandLabel}`} and conquered the entire pot accumulation!
              </p>
            </div>

            <div className="bg-gradient-to-b from-neutral-900 to-neutral-950 p-4 rounded-2xl border border-amber-500/20 shadow-xl space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-500">Credited Pot Value</span>
                <span className="font-extrabold text-emerald-400 font-mono text-base">+{formatRupees(gameState.pot)}</span>
              </div>
              <div className="h-px bg-white/5"></div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-500">Your Current Cash</span>
                <span className="font-black text-amber-400">{formatRupees(playerBalance)}</span>
              </div>
            </div>

            <button
              onClick={startNewRound}
              className="w-full py-3 text-xs font-black tracking-wider uppercase bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 rounded-xl text-neutral-950 hover:brightness-110 shadow-[0_4px_15px_rgba(16,185,129,0.35)] cursor-pointer"
            >
              Start Next Round Deal
            </button>
            
            <button
              onClick={() => { setShowCelebration(false); }}
              className="text-xs text-zinc-500 hover:text-neutral-300 underline block mx-auto"
            >
              Close and Audit Table
            </button>
          </div>
        </div>
      )}

      {/* Header bar controls */}
      <div className="px-6 flex items-center justify-between z-10">
        <button
          onClick={onExit}
          className="flex items-center gap-1 text-xs font-bold text-neutral-400 hover:text-white transition-colors bg-neutral-950/80 px-3.5 py-2 rounded-xl border border-neutral-850"
        >
          <ArrowLeft size={14} /> Lobby Exit
        </button>

        {/* Pot and stakes tracker */}
        <div className="text-center">
          <span className="block text-[8px] uppercase tracking-widest font-black text-amber-400">Active Game Table</span>
          <span className="text-xs font-bold text-neutral-100">{table.name}</span>
        </div>

        {/* Sound toggle and help */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMuted(!muted)}
            className="p-2 rounded-xl bg-neutral-950/80 border border-neutral-850 text-neutral-400 hover:text-white"
          >
            {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
          <div className="hidden sm:flex items-center gap-1 bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-2.5 py-1 text-xs text-amber-400 font-bold">
            <Coins size={12} />
            {formatRupees(playerBalance)}
          </div>
        </div>
      </div>

      {/* Center Gaming Oval Area */}
      <div className="flex-1 flex flex-col justify-between py-6 relative">
        <div className="absolute inset-0 flex items-center justify-center p-6">
          {/* Plush Oval Felt Table */}
          <div className="w-full max-w-[580px] aspect-[1.8/1] rounded-full border-4 border-amber-500/30 bg-radial-at-c from-neutral-950 via-red-950 to-neutral-950 shadow-[0_0_50px_rgba(185,28,28,0.3),inset_0_0_30px_rgba(0,0,0,0.8)] relative flex flex-col items-center justify-center">
            {/* Neon Border Lining Edge */}
            <div className="absolute inset-2 border border-yellow-500/10 rounded-full pointer-events-none"></div>

            {/* Micro chips overlay container */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center space-y-1 text-center z-10 pointer-events-none">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">ROUND POT TOTAL</span>
              <div className="flex items-center gap-1.5 px-4 py-1.5 bg-neutral-950 rounded-full border border-amber-500/40 shadow-lg glow-gold">
                <Coins size={14} className="text-amber-400 animate-spin" />
                <span className="text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-400 font-mono">
                  {formatRupees(gameState.pot)}
                </span>
              </div>
              <span className="text-[8px] text-zinc-500">BOOT PRESET: ₹{table.bootValue}</span>
            </div>

            {/* Rajesh Player Slot (Top Left) */}
            <div className="absolute -top-4 left-6 md:left-14 flex flex-col items-center text-center">
              <div className={`relative p-0.5 rounded-full border-2 ${gameState.players[1]?.isFolded ? "border-neutral-800" : "border-yellow-500/50"}`}>
                <img 
                  src={gameState.players[1]?.avatar} 
                  alt="avatar" 
                  className={`h-11 w-11 rounded-full object-cover ${gameState.players[1]?.isFolded ? "grayscale" : ""}`}
                />
                <span className="absolute bottom-0 right-0 bg-yellow-500 text-neutral-950 text-[7px] font-black uppercase px-1 rounded-full">
                  G
                </span>
              </div>
              <span className="text-[10px] font-bold text-neutral-300 mt-1">{gameState.players[1]?.name || "Rajesh"}</span>
              <span className="text-[9px] text-emerald-400 font-bold mt-0.5">{gameState.players[1]?.isFolded ? "Folded" : `Cash: ₹${gameState.players[1]?.balance || 0}`}</span>
              <span className="text-[10px] font-semibold text-amber-500 uppercase mt-1 font-mono tracking-wider">
                {gameState.players[1]?.id === gameState.players[gameState.activePlayerIdx]?.id && gameState.roundPhase === "betting" ? "Thinking..." : gameState.players[1]?.lastAction}
              </span>
            </div>

            {/* Amit Player Slot (Top Right) */}
            <div className="absolute -top-4 right-6 md:right-14 flex flex-col items-center text-center">
              <div className={`relative p-0.5 rounded-full border-2 ${gameState.players[2]?.isFolded ? "border-neutral-800" : "border-zinc-500/50"}`}>
                <img 
                  src={gameState.players[2]?.avatar} 
                  alt="avatar" 
                  className={`h-11 w-11 rounded-full object-cover ${gameState.players[2]?.isFolded ? "grayscale" : ""}`}
                />
                <span className="absolute bottom-0 right-0 bg-zinc-400 text-neutral-950 text-[7px] font-black uppercase px-1 rounded-full">
                  S
                </span>
              </div>
              <span className="text-[10px] font-bold text-neutral-300 mt-1">{gameState.players[2]?.name || "Amit"}</span>
              <span className="text-[9px] text-emerald-400 font-bold mt-0.5">{gameState.players[2]?.isFolded ? "Folded" : `Cash: ₹${gameState.players[2]?.balance || 0}`}</span>
              <span className="text-[10px] font-semibold text-amber-500 uppercase mt-1 font-mono tracking-wider">
                {gameState.players[2]?.id === gameState.players[gameState.activePlayerIdx]?.id && gameState.roundPhase === "betting" ? "Thinking..." : gameState.players[2]?.lastAction}
              </span>
            </div>

            {/* Bot Thinking Alert badge */}
            {botThinking && (
              <div className="absolute -bottom-8 px-4 py-1.5 rounded-full bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 flex items-center gap-1.5 z-20">
                <Clock size={12} className="animate-spin text-amber-400" />
                <span>Opponent thinking...</span>
              </div>
            )}
          </div>
        </div>

        {/* Live game logs panel (Overlay to the side or bottom) */}
        <div className="absolute bottom-28 left-6 w-52 bg-neutral-950/80 border border-neutral-900 rounded-xl p-3 h-24 overflow-y-auto hidden md:block">
          <span className="block text-[8px] uppercase tracking-wider text-neutral-500 font-bold mb-1.5 uppercase">Lounge Activity Log</span>
          <div className="space-y-1 text-[9px] font-mono text-zinc-400 leading-tight">
            {logs.map((log, idx) => (
              <div key={idx} className="border-l border-red-500/30 pl-1.5">{log}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Your Player Section at the Bottom */}
      <div className="px-6 space-y-4">
        
        {/* Your cards and hand evaluation message */}
        <div className="flex flex-col items-center justify-center space-y-2">
          {/* Visual Cards array */}
          <div className="flex items-center gap-2">
            {gameState.players[0]?.cards.map((card, idx) => {
              const displayVal = card.rank;
              const suitSym = getSuitSymbol(card.suit);
              const colorClass = getSuitColorClass(card.suit);

              return (
                <div 
                  key={idx}
                  className={`relative w-20 h-28 rounded-xl border-2 flex flex-col justify-between p-2.5 transition-all duration-300 ${
                    gameState.players[0].isFolded 
                      ? "bg-neutral-900/50 border-neutral-800 opacity-40 scale-95" 
                      : cardsSeen 
                        ? "bg-neutral-950 border-amber-500 shadow-[0_0_15px_rgba(251,191,36,0.2)]" 
                        : "bg-gradient-to-br from-red-800 to-red-950 border-yellow-500/30 shadow-[0_4px_10px_rgba(0,0,0,0.5)]"
                  }`}
                >
                  {cardsSeen && !gameState.players[0].isFolded ? (
                    <>
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-sm tracking-tighter leading-none">{displayVal}</span>
                        <span className={`text-base leading-none ${colorClass}`}>{suitSym}</span>
                      </div>
                      
                      {/* Central Giant Symbol pattern */}
                      <div className={`text-3xl font-black text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 ${colorClass}`}>
                        {suitSym}
                      </div>

                      <div className="flex justify-between items-end rotate-180">
                        <span className="font-bold text-sm tracking-tighter leading-none">{displayVal}</span>
                        <span className={`text-base leading-none ${colorClass}`}>{suitSym}</span>
                      </div>
                    </>
                  ) : (
                    /* Rear geometric card backing pattern */
                    <div className="absolute inset-1.5 border border-amber-500/10 rounded-lg bg-red-950/20 flex flex-col items-center justify-center">
                      <div className="h-6 w-6 rounded-full border border-yellow-500/20 flex items-center justify-center text-[10px] text-amber-500 font-serif font-black">
                        ♠
                      </div>
                      <span className="text-[8px] font-mono tracking-widest text-yellow-500/30 uppercase mt-1">ROYAL</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Cards Seen Evaluated Name */}
          {cardsSeen && !gameState.players[0]?.isFolded && (
            <span className="px-3 py-1 bg-red-950/60 border border-red-500/20 rounded-full text-[10px] font-extrabold uppercase tracking-wide text-red-300">
              Your hand: {evaluateHand(gameState.players[0].cards).label}
            </span>
          )}
        </div>

        {/* User Interaction Controls */}
        <div className="bg-neutral-950/80 rounded-2xl border border-neutral-850 p-4 max-w-lg mx-auto space-y-4">
          <div className="flex items-center justify-between text-xs border-b border-white/5 pb-2.5">
            <span className="text-neutral-400">Current boot stake: <strong className="text-white font-mono">₹{gameState.currentBet}</strong></span>
            <span className="text-neutral-400">Next Chaal required: <strong className="text-emerald-400 font-mono">₹{gameState.players[0]?.isBlind ? gameState.currentBet : gameState.currentBet * 2}</strong></span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {/* Show / Watch / Seen trigger button */}
            {!cardsSeen && !gameState.players[0]?.isFolded ? (
              <button
                type="button"
                onClick={handleUserWatchCards}
                className="col-span-2 py-3 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 to-amber-500 text-neutral-950 border border-yellow-300/30 shadow-[0_0_12px_rgba(251,191,36,0.3)] cursor-pointer"
              >
                👀 See Your Cards
              </button>
            ) : (
              <button
                type="button"
                disabled={countActivePlayers() > 2 || gameState.players[0]?.isFolded}
                onClick={triggerShowdown}
                className="col-span-2 py-3 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-yellow-500 text-neutral-950 border border-amber-300/20 shadow-md hover:brightness-110 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              >
                 Showdown
              </button>
            )}

            <button
              type="button"
              disabled={gameState.players[0]?.isFolded}
              onClick={handleUserPack}
              className="py-3 rounded-xl text-xs font-black uppercase tracking-wider bg-neutral-900 border border-neutral-850 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              Pack (Fold)
            </button>

            <button
              type="button"
              disabled={gameState.players[0]?.isFolded}
              onClick={() => handleUserChaal(1)}
              className="py-3 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-red-600 to-red-800 text-white border border-red-500/20 shadow-[0_0_15px_rgba(185,28,28,0.4)] hover:brightness-110 cursor-pointer"
            >
              Chaal Bet
            </button>
          </div>

          {/* Double bet multi option */}
          <div className="flex justify-between items-center bg-neutral-950 p-2.5 rounded-xl border border-neutral-900">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">High Stakes Adjuster</span>
            <div className="flex gap-1">
              <button
                type="button"
                disabled={gameState.players[0]?.isFolded}
                onClick={() => handleUserChaal(2)}
                className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs font-bold text-neutral-300 hover:text-white"
              >
                2x Stake
              </button>
              <button
                type="button"
                disabled={gameState.players[0]?.isFolded}
                onClick={() => handleUserChaal(4)}
                className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs font-bold text-neutral-400 hover:text-white"
              >
                4x Raise
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

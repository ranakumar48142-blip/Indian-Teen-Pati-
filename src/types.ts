export type Suit = "spades" | "hearts" | "diamonds" | "clubs";
export type Rank = "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K" | "A";

export interface Card {
  suit: Suit;
  rank: Rank;
}

export type HandType =
  | "Trio" // Three of a kind (Trail)
  | "Pure Sequence" // Straight flush
  | "Sequence" // Straight / Run
  | "Flush" // Color
  | "Pair" // Double
  | "High Card";

export interface HandEvaluation {
  type: HandType;
  strength: number; // Value representing actual rank details to break ties
  label: string;
}

export interface Player {
  id: string;
  name: string;
  avatar: string;
  balance: number;
  isBot: boolean;
  cards: Card[];
  isFolded: boolean;
  isBlind: boolean;
  lastAction: string;
  vipTier: "Royal" | "Platinum" | "Gold" | "Silver" | "None";
}

export type RoundPhase = "dealing" | "betting" | "showdown" | "ended";

export interface GameState {
  players: Player[];
  dealerIdx: number;
  activePlayerIdx: number;
  pot: number;
  currentBet: number; // Boot/Min bet to stay in (Chaal base)
  roundPhase: RoundPhase;
  winnerIds: string[];
  winningReason: string;
  deckCount: number;
}

export interface LobbyTable {
  id: string;
  name: string;
  bootValue: number;
  chalLimit: number;
  potLimit: number;
  activePlayersCount: number;
  maxPlayers: number;
  badge?: string;
  speed: "Classic" | "Turbo" | "High Stakes";
}

export interface Transaction {
  id: string;
  type: "deposit" | "withdrawal";
  amount: number;
  method: string;
  status: "completed" | "pending" | "failed";
  date: string;
  transactionId: string;
}

export interface VIPTierInfo {
  tier: "Silver" | "Gold" | "Platinum" | "Royal" | "Emperor";
  requiredPoints: number;
  currentPoints: number;
  color: string;
  glowColor: string;
  cashbackPercent: number;
  maxWithdrawalLimit: number;
  perks: string[];
}

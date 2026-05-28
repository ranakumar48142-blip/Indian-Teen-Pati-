import { Card, Suit, Rank, HandEvaluation, HandType } from "../types";

const RANKS_ORDER: Rank[] = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

export function createDeck(): Card[] {
  const suits: Suit[] = ["spades", "hearts", "diamonds", "clubs"];
  const deck: Card[] = [];
  for (const suit of suits) {
    for (const rank of RANKS_ORDER) {
      deck.push({ suit, rank });
    }
  }
  return deck;
}

export function shuffleDeck(deck: Card[]): Card[] {
  const newDeck = [...deck];
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  return newDeck;
}

function getRankValue(rank: Rank): number {
  return RANKS_ORDER.indexOf(rank);
}

export function evaluateHand(cards: Card[]): HandEvaluation {
  if (cards.length !== 3) {
    return { type: "High Card", strength: 0, label: "No Hand" };
  }

  // Sort by rank strength descending
  const sorted = [...cards].sort((a, b) => getRankValue(b.rank) - getRankValue(a.rank));
  const v0 = getRankValue(sorted[0].rank);
  const v1 = getRankValue(sorted[1].rank);
  const v2 = getRankValue(sorted[2].rank);

  const isFlush = cards[0].suit === cards[1].suit && cards[1].suit === cards[2].suit;

  // Trio check
  const isTrio = v0 === v1 && v1 === v2;

  // Sequence check
  // Teen Patti sequences: A-K-Q is highest, followed by A-2-3 (which is special),
  // then K-Q-J down to 4-3-2. Let's make an ordinal score.
  let isSequence = false;
  let seqStrength = 0;

  // Check normal consecutive
  if (v0 - v1 === 1 && v1 - v2 === 1) {
    isSequence = true;
    seqStrength = v0; // highest card rank value
  } 
  // Handle A-2-3 sequence (Aces=12, 3=1, 2=0) which is second highest sequence in some regions or lowest, let's treat A,3,2 as special
  else if (sorted[0].rank === "A" && sorted[1].rank === "3" && sorted[2].rank === "2") {
    isSequence = true;
    // Strength is lower than A-K-Q but higher than K-Q-J. Let's assign A-2-3 a value representing this.
    seqStrength = 11.5; 
  }

  // Pair check
  const isPair = v0 === v1 || v1 === v2 || v0 === v2;
  let pairRank = 0;
  let kickerRank = 0;

  if (v0 === v1) {
    pairRank = v0;
    kickerRank = v2;
  } else if (v1 === v2) {
    pairRank = v1;
    kickerRank = v0;
  } else if (v0 === v2) {
    pairRank = v0;
    kickerRank = v1;
  }

  // Calculate distinct strength values to break identical ties
  if (isTrio) {
    // Highest Trio: AAA (Strength: 1000 + rank value), AAA = 1012, 222 = 1000
    const str = 100000 + v0;
    return { type: "Trio", strength: str, label: `Trio (Trail) of ${sorted[0].rank}'s` };
  }

  if (isFlush && isSequence) {
    const str = 80000 + seqStrength;
    return { type: "Pure Sequence", strength: str, label: `Pure Sequence to ${isSequence && sorted[0].rank === "A" && sorted[1].rank === "3" ? "3" : sorted[0].rank}` };
  }

  if (isSequence) {
    const str = 60000 + seqStrength;
    return { type: "Sequence", strength: str, label: `Sequence to ${isSequence && sorted[0].rank === "A" && sorted[1].rank === "3" ? "3" : sorted[0].rank}` };
  }

  if (isFlush) {
    // Flush is broken by highest card, then second, then third
    const str = 40000 + v0 * 256 + v1 * 16 + v2;
    return { type: "Flush", strength: str, label: `Color (Flush) - ${sorted[0].rank} High` };
  }

  if (isPair) {
    // Pair strength is determined by pair rank, then kicker rank
    const str = 20000 + pairRank * 16 + kickerRank;
    const rankLabel = RANKS_ORDER[pairRank];
    return { type: "Pair", strength: str, label: `Pair of ${rankLabel}'s` };
  }

  // High card is broken by individual cards from highest down to lowest
  const str = v0 * 256 + v1 * 16 + v2;
  return { type: "High Card", strength: str, label: `High Card ${sorted[0].rank}` };
}

// Format currency as Rupees in Indian locale format (e.g., ₹1,50,000.00)
export function formatRupees(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9).toUpperCase();
}

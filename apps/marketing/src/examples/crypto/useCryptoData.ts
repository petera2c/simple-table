import { useMemo } from "react";
import type { Row } from "@simple-table/react";

export interface CryptoCoin extends Row {
  id: string;
  rank: number;
  name: string;
  symbol: string;
  price: number;
  change1h: number;
  change24h: number;
  change7d: number;
  change30d: number;
  marketCap: number;
  volume24h: number;
  circulatingSupply: number;
  maxSupply: number | null;
  supplyPercent: number;
  ath: number;
  athChangePercent: number;
  category: string;
  priceHistory: number[];
}

/** Deterministic PRNG so the demo renders identically on every load/SSR pass. */
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const KNOWN_COINS: Array<{ name: string; symbol: string; category: string }> = [
  { name: "Bitcoin", symbol: "BTC", category: "Currency" },
  { name: "Ethereum", symbol: "ETH", category: "Smart Contract" },
  { name: "Tether", symbol: "USDT", category: "Stablecoin" },
  { name: "BNB", symbol: "BNB", category: "Exchange" },
  { name: "Solana", symbol: "SOL", category: "Smart Contract" },
  { name: "XRP", symbol: "XRP", category: "Payments" },
  { name: "USD Coin", symbol: "USDC", category: "Stablecoin" },
  { name: "Cardano", symbol: "ADA", category: "Smart Contract" },
  { name: "Dogecoin", symbol: "DOGE", category: "Meme" },
  { name: "Avalanche", symbol: "AVAX", category: "Smart Contract" },
  { name: "Polkadot", symbol: "DOT", category: "Interoperability" },
  { name: "Chainlink", symbol: "LINK", category: "Oracle" },
  { name: "Polygon", symbol: "MATIC", category: "Layer 2" },
  { name: "Toncoin", symbol: "TON", category: "Smart Contract" },
  { name: "Shiba Inu", symbol: "SHIB", category: "Meme" },
  { name: "Litecoin", symbol: "LTC", category: "Currency" },
  { name: "Bitcoin Cash", symbol: "BCH", category: "Currency" },
  { name: "Uniswap", symbol: "UNI", category: "DeFi" },
  { name: "Stellar", symbol: "XLM", category: "Payments" },
  { name: "Cosmos", symbol: "ATOM", category: "Interoperability" },
  { name: "Monero", symbol: "XMR", category: "Privacy" },
  { name: "Ethereum Classic", symbol: "ETC", category: "Smart Contract" },
  { name: "Aptos", symbol: "APT", category: "Smart Contract" },
  { name: "Filecoin", symbol: "FIL", category: "Storage" },
  { name: "Arbitrum", symbol: "ARB", category: "Layer 2" },
  { name: "VeChain", symbol: "VET", category: "Supply Chain" },
  { name: "Optimism", symbol: "OP", category: "Layer 2" },
  { name: "Maker", symbol: "MKR", category: "DeFi" },
  { name: "Aave", symbol: "AAVE", category: "DeFi" },
  { name: "The Graph", symbol: "GRT", category: "Indexing" },
  { name: "Algorand", symbol: "ALGO", category: "Smart Contract" },
  { name: "Injective", symbol: "INJ", category: "DeFi" },
  { name: "Render", symbol: "RNDR", category: "AI & Compute" },
  { name: "Fantom", symbol: "FTM", category: "Smart Contract" },
  { name: "Sei", symbol: "SEI", category: "Smart Contract" },
  { name: "Sui", symbol: "SUI", category: "Smart Contract" },
  { name: "Immutable", symbol: "IMX", category: "Gaming" },
  { name: "Hedera", symbol: "HBAR", category: "Enterprise" },
  { name: "Theta", symbol: "THETA", category: "Media" },
  { name: "Tezos", symbol: "XTZ", category: "Smart Contract" },
];

const CATEGORIES = [
  "Smart Contract",
  "DeFi",
  "Meme",
  "Layer 2",
  "Gaming",
  "AI & Compute",
  "Privacy",
  "Payments",
  "Storage",
];

const SYMBOL_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function buildPriceHistory(rand: () => number, endPrice: number, points = 30): number[] {
  const history: number[] = [];
  // Walk backwards from the current price so the last point matches `price`.
  let value = endPrice;
  for (let i = 0; i < points; i++) {
    history.unshift(Math.max(value, endPrice * 0.0001));
    const drift = (rand() - 0.5) * 0.08;
    value = value / (1 + drift);
  }
  return history.map((v) => Math.round(v * 1e6) / 1e6);
}

export function generateCryptoData(count = 1000): CryptoCoin[] {
  const rand = mulberry32(0xc0ffee);
  const coins: CryptoCoin[] = [];

  for (let i = 0; i < count; i++) {
    const known = KNOWN_COINS[i];
    const name = known ? known.name : `${randomSymbol(rand)} Protocol`;
    const symbol = known ? known.symbol : randomSymbol(rand);
    const category = known ? known.category : CATEGORIES[Math.floor(rand() * CATEGORIES.length)]!;

    // Price spans many orders of magnitude (rank 1 ~ tens of thousands, tail ~ fractions of a cent).
    const magnitude = Math.pow(10, 4.5 - (i / count) * 8);
    const price = magnitude * (0.5 + rand());

    const change1h = (rand() - 0.5) * 4;
    const change24h = (rand() - 0.48) * 18;
    const change7d = (rand() - 0.45) * 40;
    const change30d = (rand() - 0.42) * 80;

    const circulatingSupply = Math.floor((1e6 + rand() * 5e10) / (1 + i / 50));
    const hasMax = rand() > 0.35;
    const maxSupply = hasMax
      ? Math.floor(circulatingSupply * (1 + rand() * 1.5))
      : null;
    const supplyPercent = maxSupply ? (circulatingSupply / maxSupply) * 100 : 100;

    const marketCap = price * circulatingSupply;
    const volume24h = marketCap * (0.01 + rand() * 0.35);
    const athChangePercent = -(rand() * 85);
    const ath = price / (1 + athChangePercent / 100);

    coins.push({
      id: `${symbol}-${i}`,
      rank: i + 1,
      name,
      symbol,
      price: Math.round(price * 1e6) / 1e6,
      change1h: Math.round(change1h * 100) / 100,
      change24h: Math.round(change24h * 100) / 100,
      change7d: Math.round(change7d * 100) / 100,
      change30d: Math.round(change30d * 100) / 100,
      marketCap: Math.round(marketCap),
      volume24h: Math.round(volume24h),
      circulatingSupply,
      maxSupply,
      supplyPercent: Math.round(supplyPercent * 10) / 10,
      ath: Math.round(ath * 1e6) / 1e6,
      athChangePercent: Math.round(athChangePercent * 10) / 10,
      category,
      priceHistory: buildPriceHistory(rand, price),
    });
  }

  // Sort by market cap and re-rank so the table reads like a real market table.
  coins.sort((a, b) => b.marketCap - a.marketCap);
  coins.forEach((coin, idx) => {
    coin.rank = idx + 1;
  });

  return coins;
}

function randomSymbol(rand: () => number): string {
  const len = 3 + Math.floor(rand() * 2);
  let symbol = "";
  for (let i = 0; i < len; i++) {
    symbol += SYMBOL_CHARS[Math.floor(rand() * SYMBOL_CHARS.length)];
  }
  return symbol;
}

export function useCryptoData(count = 1000) {
  const data = useMemo(() => generateCryptoData(count), [count]);
  return { data, isLoading: false };
}

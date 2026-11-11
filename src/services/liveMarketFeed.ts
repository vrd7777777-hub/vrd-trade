export interface LiveQuote {
  symbol: string;
  name?: string;
  price: number;
  change: number;
  changePercent: number;
  prevClose: number;
  dayHigh: number;
  dayLow: number;
  volume: number;
  currency: string;
  lastUpdatedTime: string;
  isLive: boolean;
  source: string;
}

export interface LiveIndicesData {
  nifty50: {
    price: number;
    change: number;
    changePercent: number;
    high: number;
    low: number;
    prevClose: number;
    isLive: boolean;
  };
  bankNifty: {
    price: number;
    change: number;
    changePercent: number;
    high: number;
    low: number;
    prevClose: number;
    isLive: boolean;
  };
  indiaVix: {
    price: number;
    change: number;
    changePercent: number;
    isLive: boolean;
  };
  brentCrude: {
    price: number;
    change: number;
    isLive: boolean;
  };
  usdInr: {
    price: number;
    change: number;
    isLive: boolean;
  };
  lastSyncedAt: string;
}

// In-memory quote cache with timestamp
const quoteCache = new Map<string, { quote: LiveQuote; timestamp: number }>();
const CACHE_TTL_MS = 3500; // 3.5 seconds

const US_STOCKS = new Set(["NVDA", "AAPL", "MSFT", "TSLA", "GOOGL", "GOOG", "AMZN", "META", "AMD", "INTC", "SPY", "QQQ"]);

export function toYahooSymbol(symbol: string): string {
  const clean = symbol.trim().toUpperCase();
  if (clean === "NIFTY" || clean === "NIFTY50" || clean === "^NSEI") return "^NSEI";
  if (clean === "BANKNIFTY" || clean === "^NSEBANK") return "^NSEBANK";
  if (clean === "VIX" || clean === "INDIAVIX" || clean === "^INDIAVIX") return "^INDIAVIX";
  if (clean === "USDINR" || clean === "USD/INR" || clean === "INR=X") return "INR=X";
  if (clean === "BRENT" || clean === "BZ=F") return "BZ=F";
  if (clean === "SENSEX" || clean === "^BSESN") return "^BSESN";

  if (clean.includes(".") || clean.startsWith("^") || clean.includes("=")) {
    return clean;
  }
  if (US_STOCKS.has(clean)) {
    return clean;
  }
  // Default Indian NSE equities
  return `${clean}.NS`;
}

export async function fetchLiveQuoteFromInternet(rawSymbol: string): Promise<LiveQuote | null> {
  const yahooSymbol = toYahooSymbol(rawSymbol);
  const now = Date.now();

  const cached = quoteCache.get(yahooSymbol);
  if (cached && now - cached.timestamp < CACHE_TTL_MS) {
    return cached.quote;
  }

  try {
    const res = await fetch(`/api/yahoo/v8/finance/chart/${encodeURIComponent(yahooSymbol)}?interval=1d&range=1d`, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();
    const result = data?.chart?.result?.[0];
    const meta = result?.meta;

    if (!meta || typeof meta.regularMarketPrice !== "number") {
      throw new Error("Invalid quote payload");
    }

    const price = Number(meta.regularMarketPrice.toFixed(2));
    const prevClose = typeof meta.chartPreviousClose === "number" ? Number(meta.chartPreviousClose.toFixed(2)) : price;
    const change = Number((price - prevClose).toFixed(2));
    const changePercent = prevClose > 0 ? Number(((change / prevClose) * 100).toFixed(2)) : 0;
    const dayHigh = typeof meta.regularMarketDayHigh === "number" ? Number(meta.regularMarketDayHigh.toFixed(2)) : price;
    const dayLow = typeof meta.regularMarketDayLow === "number" ? Number(meta.regularMarketDayLow.toFixed(2)) : price;
    const volume = typeof meta.regularMarketVolume === "number" ? meta.regularMarketVolume : 0;
    const currency = meta.currency || "INR";

    const liveQuote: LiveQuote = {
      symbol: rawSymbol.toUpperCase(),
      price,
      change,
      changePercent,
      prevClose,
      dayHigh,
      dayLow,
      volume,
      currency,
      lastUpdatedTime: new Date().toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour12: false }),
      isLive: true,
      source: "NSE/Internet Live Stream",
    };

    quoteCache.set(yahooSymbol, { quote: liveQuote, timestamp: now });
    return liveQuote;
  } catch (err) {
    // If cache has a previous value, return it
    if (cached) {
      return cached.quote;
    }
    return null;
  }
}

export async function fetchLiveIndices(): Promise<LiveIndicesData> {
  const [niftyRes, bankNiftyRes, vixRes, usdInrRes, brentRes] = await Promise.allSettled([
    fetchLiveQuoteFromInternet("^NSEI"),
    fetchLiveQuoteFromInternet("^NSEBANK"),
    fetchLiveQuoteFromInternet("^INDIAVIX"),
    fetchLiveQuoteFromInternet("INR=X"),
    fetchLiveQuoteFromInternet("BZ=F"),
  ]);

  const nifty = niftyRes.status === "fulfilled" && niftyRes.value ? niftyRes.value : null;
  const bankNifty = bankNiftyRes.status === "fulfilled" && bankNiftyRes.value ? bankNiftyRes.value : null;
  const vix = vixRes.status === "fulfilled" && vixRes.value ? vixRes.value : null;
  const usdInr = usdInrRes.status === "fulfilled" && usdInrRes.value ? usdInrRes.value : null;
  const brent = brentRes.status === "fulfilled" && brentRes.value ? brentRes.value : null;

  return {
    nifty50: {
      price: nifty ? nifty.price : 25362.25,
      change: nifty ? nifty.change : +118.4,
      changePercent: nifty ? nifty.changePercent : +0.47,
      high: nifty ? nifty.dayHigh : 25424.35,
      low: nifty ? nifty.dayLow : 25263.8,
      prevClose: nifty ? nifty.prevClose : 25243.85,
      isLive: !!nifty,
    },
    bankNifty: {
      price: bankNifty ? bankNifty.price : 60786.4,
      change: bankNifty ? bankNifty.change : +345.2,
      changePercent: bankNifty ? bankNifty.changePercent : +0.57,
      high: bankNifty ? bankNifty.dayHigh : 60920.0,
      low: bankNifty ? bankNifty.dayLow : 60410.0,
      prevClose: bankNifty ? bankNifty.prevClose : 60441.2,
      isLive: !!bankNifty,
    },
    indiaVix: {
      price: vix ? vix.price : 17.53,
      change: vix ? vix.change : -0.32,
      changePercent: vix ? vix.changePercent : -1.79,
      isLive: !!vix,
    },
    brentCrude: {
      price: brent ? brent.price : 74.2,
      change: brent ? brent.change : +0.45,
      isLive: !!brent,
    },
    usdInr: {
      price: usdInr ? usdInr.price : 83.62,
      change: usdInr ? usdInr.change : -0.04,
      isLive: !!usdInr,
    },
    lastSyncedAt: new Date().toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour12: false }) + " IST",
  };
}

export async function fetchBatchQuotes(symbols: string[]): Promise<Record<string, LiveQuote>> {
  const results: Record<string, LiveQuote> = {};
  const chunks: string[][] = [];
  const chunkSize = 5;

  for (let i = 0; i < symbols.length; i += chunkSize) {
    chunks.push(symbols.slice(i, i + chunkSize));
  }

  for (const chunk of chunks) {
    const promises = chunk.map(async (sym) => {
      const q = await fetchLiveQuoteFromInternet(sym);
      if (q) {
        results[sym.toUpperCase()] = q;
      }
    });
    await Promise.allSettled(promises);
  }

  return results;
}

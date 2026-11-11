export type StockAction = "BUY" | "HOLD" | "SELL";

export type HoldingHorizon = "SWING" | "POSITIONAL" | "MEDIUM_TERM" | "LONG_TERM";

export type VolatilityRegime = "LOW_VOL_SQUEEZE" | "STEADY_TREND" | "HIGH_BETA_EXPANSION" | "ELEVATED_RISK";

// Market Mojo 4-Pillar Classifications
export type MojoQuality = "EXCELLENT" | "GOOD" | "AVERAGE" | "BELOW_AVERAGE";
export type MojoValuation = "VERY_ATTRACTIVE" | "ATTRACTIVE" | "FAIR" | "EXPENSIVE" | "VERY_EXPENSIVE";
export type MojoFinancialTrend = "OUTSTANDING" | "POSITIVE" | "FLAT" | "NEGATIVE" | "VERY_NEGATIVE";
export type MojoTechnicalTrend = "BULLISH" | "MILDLY_BULLISH" | "SIDEWAYS" | "MILDLY_BEARISH" | "BEARISH";

export interface CustomNote {
  metric: string;
  value: string;
  sentiment: "BULLISH" | "BEARISH";
  date: string;
}

export interface HistoricalDataPoint {
  date: string;
  price: number;
  ema50: number;
  sma200: number;
  upperBand: number;
  lowerBand: number;
  volume: number;
}

export interface HoldingPeriodOption {
  days: number;
  label: string;
  expectedReturn: number;
  winProbability: number;
  sharpe: number;
  optimal: boolean;
  volatilityRisk: "Low" | "Moderate" | "Elevated";
}

export interface BalanceSheetData {
  netWorth: number; // in ₹ Cr
  totalDebt: number; // in ₹ Cr
  totalAssets: number; // in ₹ Cr
  cashAndEquivalents: number; // in ₹ Cr
  workingCapital: number; // in ₹ Cr
  debtToEquity: number;
  interestCoverage: number;
  contingentLiabilities: number; // in ₹ Cr
}

export interface CashFlowData {
  operatingCashFlow: number; // CFO in ₹ Cr
  capex: number; // Capital expenditure in ₹ Cr
  freeCashFlow: number; // FCF in ₹ Cr
  investingCashFlow: number; // in ₹ Cr
  financingCashFlow: number; // in ₹ Cr
  netCashFlow: number; // in ₹ Cr
  cfoToEbitda: number; // %
}

export interface ProfitAndLossData {
  quarterlyRevenue: number; // in ₹ Cr
  revenueGrowthYoY: number; // %
  ebitda: number; // in ₹ Cr
  opmPercent: number; // Operating Profit Margin %
  netProfitPAT: number; // in ₹ Cr
  patGrowthYoY: number; // %
  patMargin: number; // %
  eps: number; // in ₹
}

export interface ShareholdingData {
  promoter: number; // %
  promoterPledged: number; // %
  fii: number; // %
  fiiChangeQoQ: string;
  dii: number; // %
  diiChangeQoQ: string;
  publicRetail: number; // %
}

export interface PolicyAndGovImpact {
  budgetImpact: string;
  pliScheme: string;
  repoRateSensitivity: string;
  regulatoryRisk: "LOW" | "MODERATE" | "HIGH";
  governmentCatalyst: string;
}

export interface Stock {
  id: string;
  symbol: string;
  name: string;
  sector: string;
  cmp: number;
  change: number;
  action: StockAction;
  conviction: number; // 0 - 100
  target: number;
  target2: number;
  stoploss: number;
  trailingStopATR: number;

  // Market Mojo 4-Pillar Algorithmic Framework
  mojoScore: number;
  mojoRating: "STRONG BUY" | "BUY" | "HOLD" | "SELL" | "STRONG SELL";
  quality: MojoQuality;
  qualitySummary: string;
  valuation: MojoValuation;
  valuationSummary: string;
  financialTrend: MojoFinancialTrend;
  financialTrendSummary: string;
  technicalTrend: MojoTechnicalTrend;
  technicalTrendSummary: string;

  // Hold-On Period Analysis
  optimalHoldingDays: number;
  holdingWindowLabel: string;
  holdingHorizon: HoldingHorizon;
  holdingTypeTitle: string;
  optimalExitDate: string;
  expectedHoldingReturn: number;
  riskAdjustedSharpe: number;
  holdingRationales: string[];

  // Historical Volatility Analysis
  hv30: number;
  hv90: number;
  hvRankPercentile: number;
  atr: number;
  atrPercent: number;
  beta: number;
  volatilityRegime: VolatilityRegime;
  volatilityRegimeDescription: string;

  // Long-Term Trend Analysis
  sma200: number;
  sma200Distance: number;
  ema50: number;
  ema50Slope: "BULLISH_ACCELERATING" | "BULLISH_STEADY" | "NEUTRAL" | "BEARISH";
  adx: number;
  hurstExponent: number;
  trendScore: number;
  trendPhase: string;

  // Comprehensive Financials & Balance Sheet
  balanceSheet: BalanceSheetData;
  cashFlow: CashFlowData;
  profitAndLoss: ProfitAndLossData;
  shareholding: ShareholdingData;
  policyImpact: PolicyAndGovImpact;

  // Valuation Multiples
  pe: number;
  historical5YrPE: number;
  peDiscountPercent: number;
  industryPE: number;
  pb: number;
  evToEbitda: number;
  peg: number;
  dividendYield: number;
  roce: number;
  roe: number;

  rsi: number;
  promoterHolding: string;
  debtToEquity: number;
  fiiHolding: string;

  catalysts: string[];
  customNotes: CustomNote[];
  backtestWinRate: number;

  historicalPrices: HistoricalDataPoint[];
  holdingPeriodSimulation: HoldingPeriodOption[];
}

export interface MacroIndicator {
  metric: string;
  value: string;
  status: string;
  impact: string;
  direction: "up" | "down" | "neutral";
  policyCategory: "MONETARY" | "FISCAL" | "COMMODITY" | "GLOBAL";
}

export interface NewsItem {
  id: number;
  time: string;
  source: string;
  title: string;
  impact: "POSITIVE" | "CAUTION" | "NEGATIVE";
  affected: string[];
  summary: string;
  category: "GOVERNMENT" | "EARNINGS" | "GLOBAL_MACRO" | "RBI_REPO";
}

export interface ReframeLog {
  time: string;
  prompt: string;
  impactSummary?: string;
}

export interface MarketRegimeStatus {
  marketPhase: string;
  niftyLevel: number;
  niftyAbove200DMA: boolean;
  vixLevel: number;
  vixRegime: string;
  repoRate: string;
  repoStance: string;
  budgetOutlay: string;
  fiiDiiNetToday: string;
  brentCrude: string;
  globalSentiment: string;
}

// ==========================================
// ETF SPECIFICATIONS
// ==========================================
export interface ETFItem {
  id: string;
  symbol: string;
  name: string;
  benchmark: string;
  category: "INDEX" | "SECTORAL" | "COMMODITY" | "GLOBAL" | "DEBT";
  cmp: number;
  change: number;
  aumCr: number; // AUM in ₹ Cr
  expenseRatio: number; // %
  trackingError: number; // %
  action: "ACCUMULATE" | "SWING BUY" | "HOLD";
  optimalHoldDays: number;
  expectedHoldingReturn: number;
  volatility30D: number;
  dividendYield: number;
  brokerBacking: {
    motilalOswal: string;
    zerodhaKite: string;
    adityaBirla: string;
  };
  monteCarlo10k: MonteCarloResult;
}

// ==========================================
// INTRADAY TRADING SPECIFICATIONS
// ==========================================
export type IntradayStrategy = "15M_ORB" | "VWAP_MEAN_REVERSION" | "CPR_NARROW_BREAKOUT" | "SUPERTREND_SQUEEZE";

export interface IntradayTrade {
  id: string;
  symbol: string;
  name: string;
  strategy: IntradayStrategy;
  strategyTitle: string;
  direction: "LONG" | "SHORT";
  entryTrigger: number;
  cmp: number;
  target1: number;
  target2: number;
  stoploss: number;
  riskReward: string;
  timeframe: string; // e.g. "5m / 15m"
  vwapLevel: number;
  cprPivot: number;
  orbHigh: number;
  orbLow: number;
  volumeSurgeRatio: number; // e.g. 2.4x avg volume
  squareOffTime: string; // "15:15 IST"
  status: "ACTIVE_TRIGGER" | "WAITING_TRIGGER" | "TARGET_1_HIT";
  brokerConsensus: {
    zerodhaOI: string;
    motilalTarget: string;
    adityaBirlaView: string;
  };
  monteCarlo10k: MonteCarloResult;
}

// ==========================================
// FUTURES & OPTIONS (F&O) SPECIFICATIONS
// ==========================================
export type FnOStrategy =
  | "BULL_CALL_SPREAD"
  | "NAKED_CALL_MOMENTUM"
  | "BEAR_PUT_SPREAD"
  | "SHORT_STRANGLE"
  | "IRON_CONDOR"
  | "FUTURES_LONG";

export interface FnOTrade {
  id: string;
  underlying: "NIFTY" | "BANKNIFTY" | "FINNIFTY" | "RELIANCE" | "TRENT" | "HDFCBANK" | "INFY";
  contractName: string; // e.g. "NIFTY 28-NOV 25900 CE"
  expiryDate: string; // e.g. "28 Nov 2026"
  instrumentType: "OPTIDX" | "OPTSTK" | "FUTIDX" | "FUTSTK";
  strategy: FnOStrategy;
  strategyLabel: string;
  bias: "BULLISH" | "BEARISH" | "DELTA_NEUTRAL";

  // 1. WHAT TO BUY
  whatToBuy: {
    primaryLeg: string; // e.g. "Buy 25900 Call Option"
    hedgeLeg?: string; // e.g. "Sell 26200 Call Option (Bull Call Spread Hedge)"
    strike: number;
    optionType: "CE" | "PE" | "FUT";
    rationale: string;
  };

  // 2. WHEN TO BUY
  whenToBuy: {
    entryPriceMin: number;
    entryPriceMax: number;
    triggerCondition: string; // e.g. "Enter between ₹140 - ₹152 when 5M candle closes above VWAP with rising PCR"
    optimalTimingWindow: string; // e.g. "09:45 AM - 11:15 AM IST or 01:30 PM post-European Open"
  };

  // 3. HOW MUCH TO BUY
  howMuchToBuy: {
    lotSize: number;
    recommendedLots: number;
    totalQuantity: number;
    capitalRequired: number; // ₹ per lot or total
    marginRequirement: number; // ₹ margin
    brokerRiskCapPercent: number; // 2% max portfolio risk
  };

  // 4. HOW LONG TO HOLD
  howLongToHold: {
    horizonType: "INTRADAY_MOMENTUM" | "WEEKLY_EXPIRY_RUN" | "MONTHLY_POSITIONAL";
    recommendedDuration: string; // e.g. "2 - 4 Trading Days"
    timeDecayThetaExitRule: string; // e.g. "Exit if premium drops 35% or upon reaching 48 hours to expiry"
    optimalExitMilestone: string; // e.g. "Target 1 (₹230) or Expiry Day 14:30 IST"
  };

  // Pricing & Milestones
  currentPremium: number;
  target1Premium: number;
  target2Premium: number;
  stopLossPremium: number;
  potentialProfitPerLot: number; // ₹
  maxRiskPerLot: number; // ₹

  // Derivatives Greeks & Open Interest
  greeks: {
    delta: number;
    gamma: number;
    theta: number; // ₹ per day decay
    vega: number;
    iv: number; // %
    ivPercentile: number; // 0 - 100%
  };

  openInterest: {
    pcr: number; // Put-Call Ratio
    maxPain: number; // Strike
    oiBuildUp: "Long Buildup" | "Short Covering" | "Short Buildup" | "Long Unwinding";
    netOIChangeShares: number;
    highestCallOIStrike: number;
    highestPutOIStrike: number;
  };

  // Multi-Broker Backing & Consensus
  brokerBacking: {
    zerodhaSensibull: {
      view: string;
      confidence: number;
      oiClue: string;
    };
    motilalOswal: {
      rating: string;
      target: string;
      rolloverPct: number;
      quantDeskNote: string;
    };
    adityaBirlaMoney: {
      callType: string;
      riskGrade: "Low" | "Medium" | "High";
      marginRule: string;
    };
  };

  // 10,000x Monte Carlo Backtest Verification
  monteCarlo10k: MonteCarloResult;
}

export interface MonteCarloResult {
  iterations: number; // 10,000
  simulatedWinRate: number; // %
  profitFactor: number;
  maxDrawdown: number; // %
  valueAtRisk95: number; // %
  valueAtRisk99: number; // %
  expectancyRatio: number;
  distributionBuckets: {
    rangeLabel: string;
    frequency: number;
    isProfit: boolean;
  }[];
}

// ==========================================
// BROKER INTEGRATION & FAILURE MODE RISK DOCTOR
// ==========================================

export interface PortfolioHolding {
  id: string;
  symbol: string;
  name: string;
  sector: string;
  qty: number;
  avgBuyPrice: number;
  cmp: number;
  currentValue: number;
  investedValue: number;
  pnlRupees: number;
  pnlPercent: number;
  portfolioWeight: number; // %
  hasStopLoss: boolean;
  activeStopLossPrice?: number;
  beta: number;
  mojoScore: number;
  debtToEquity: number;
  fcfPositive: boolean;
  isAbove200DMA: boolean;
  daysHeld: number;
}

export type FailureSeverity = "CRITICAL" | "HIGH" | "MODERATE";

export interface PortfolioFailureMode {
  id: string;
  category: "CONCENTRATION" | "AVERAGING_LOSERS" | "ASYMMETRIC_RR" | "DERIVATIVES_OVERLEVERAGE" | "FUNDAMENTAL_DETERIORATION" | "MISSING_STOPLOSS";
  title: string;
  severity: FailureSeverity;
  affectedSymbols: string[];
  capitalAtRiskRupees: number;
  failureReason: string;
  mathematicalProof: string;
  probabilityOfWipeoutOrDrag: number; // %
  suggestedImprovement: string;
  actionButtonLabel: string;
  projectedAlphaGain: string;
  isResolved?: boolean;
}

export interface BrokerAccount {
  id: string;
  brokerId: "zerodha" | "upstox" | "angelone" | "groww" | "icicidirect" | "motilal" | "dhan";
  brokerName: string;
  accountClientId: string;
  isConnected: boolean;
  totalPortfolioValue: number;
  totalInvested: number;
  totalPnl: number;
  totalPnlPercent: number;
  dayPnl: number;
  cashBalance: number;
  healthScore: number; // 0 - 100
  failureModesCount: number;
  holdings: PortfolioHolding[];
  detectedFailureModes: PortfolioFailureMode[];
  lastSyncedAt: string;
}

// ==========================================
// 10 TO 15+ YEAR GENERATIONAL WEALTH RESEARCH
// ==========================================

export interface LongTermStockResearch {
  id: string;
  symbol: string;
  name: string;
  sector: string;
  cmp: number;
  marketCapTier: "MEGA_CAP" | "LARGE_CAP" | "HIGH_MOAT_MIDCAP";
  
  // Moat & Dominance (10-15 Years Durability)
  moatScore: number; // 0 - 100
  moatType: "PRICING_POWER" | "SCALE_MONOPOLY" | "NETWORK_EFFECTS" | "DISTRIBUTION_FORTRESS" | "SOVEREIGN_INFRASTRUCTURE";
  moatSummary: string;
  
  // Historical Track Record
  tenYrHistoricalCagr: number; // %
  decadeAverageRoe: number; // %
  decadeAverageRoce: number; // %
  consecutiveProfitableYears: number;
  
  // 10 to 15-Year Forward Projection
  tenYrTargetPrice: number;
  fifteenYrTargetPrice: number;
  fifteenYrProjectedCagr: number; // %
  dividendReinvestmentWealthMultiplier: number; // e.g. 8.2x in 15 yrs
  
  // Structural Metatrends
  megaTrendAlignment: string;
  generationalTheses: string[];
  existentialBankruptcyRisk: "< 0.1% (Near Zero)" | "< 0.5% (Extremely Low)";
  coffeeCanCertified: boolean;
  sipMonthlyIdealAmount: number;
}

// ==========================================
// USER REAL-WORLD TRADING ACCOUNTS & PORTFOLIO
// (Zerodha, Elevate, INDmoney & Custom)
// ==========================================

export type SupportedBrokerId = "zerodha" | "elevate" | "indmoney" | "custom";

export interface BrokerAccountDetail {
  id: string;
  brokerId: SupportedBrokerId;
  brokerName: string;
  accountClientId: string; // Real-world ID e.g. "VR7777", "ELV-98214", "IND-408129"
  accountHolderName: string;
  apiKey?: string;
  apiSecret?: string;
  totpPin?: string;
  accessToken?: string;
  isConnected: boolean;
  connectionStatus: "CONNECTED" | "NEEDS_AUTH" | "DISCONNECTED" | "SYNCING";
  lastSyncedAt: string;
  cashBalance: number;
  investedValue: number;
  currentValue: number;
  unrealizedPnl: number;
  unrealizedPnlPercent: number;
  accountType: string;
  accentColor: string;
  notes?: string;
}

export interface UserPortfolioItem {
  id: string;
  symbol: string;
  name: string;
  brokerId: SupportedBrokerId;
  sector: string;
  quantity: number;
  avgPrice: number;
  cmp: number;
  currentValue: number;
  investedValue: number;
  pnl: number;
  pnlPercent: number;
  stopLoss?: number;
  target?: number;
  daysHeld: number;
  mojoScore: number;
  suggestionAction: "ACCUMULATE" | "HOLD_TRAIL_SL" | "BOOK_PROFIT" | "TIGHTEN_SL" | "EXIT_RISK";
  suggestionReason: string;
  optimalHoldDaysLeft: number;
  confidenceScore: number;
  notes?: string;
}

export interface BrokerSuggestionSummary {
  brokerId: SupportedBrokerId;
  brokerName: string;
  keyActionAdvice: string;
  allocationHealth: "OPTIMAL" | "OVERWEIGHT" | "NEEDS_REBALANCING" | "HIGH_RISK";
  strengths: string[];
  risks: string[];
  recommendedStrategy: string;
}


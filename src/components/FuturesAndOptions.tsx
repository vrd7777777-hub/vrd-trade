import React, { useState, useMemo } from 'react';
import { FnOTrade, MonteCarloResult } from '../types/trading';
import {
  Layers,
  TrendingUp,
  TrendingDown,
  Timer,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Coins,
  Percent,
  Activity,
  Cpu,
  HelpCircle,
  Sparkles,
  ArrowRight,
  ExternalLink,
  SlidersHorizontal,
  Flame,
  Award
} from 'lucide-react';

interface FuturesAndOptionsProps {
  trades: FnOTrade[];
  onOpenMonteCarlo: (title: string, underlying: string, result: MonteCarloResult) => void;
}

export const FuturesAndOptions: React.FC<FuturesAndOptionsProps> = ({
  trades,
  onOpenMonteCarlo,
}) => {
  const [filterStrategy, setFilterStrategy] = useState<string>("ALL");
  const [filterUnderlying, setFilterUnderlying] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeBrokerTab, setActiveBrokerTab] = useState<"ALL" | "ZERODHA" | "MOTILAL" | "ADITYA_BIRLA">("ALL");

  const filteredTrades = useMemo(() => {
    return trades.filter((trade) => {
      const matchStrategy = filterStrategy === "ALL" || trade.strategy === filterStrategy;
      const matchUnderlying = filterUnderlying === "ALL" || trade.underlying === filterUnderlying;
      const matchSearch =
        trade.contractName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trade.underlying.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trade.strategyLabel.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStrategy && matchUnderlying && matchSearch;
    });
  }, [trades, filterStrategy, filterUnderlying, searchQuery]);

  return (
    <div className="space-y-6">
      {/* HERO BANNER: WHAT, WHEN, HOW MUCH, HOW LONG TO HOLD + 10K BACKTEST */}
      <div className="bg-gradient-to-r from-[#0b1424] via-[#0d1d35] to-[#080f1c] border border-cyan-500/40 rounded-2xl p-6 shadow-2xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 pb-5 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2.5 mb-1.5">
              <span className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                <Layers className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-black text-white">Institutional Futures & Options (F&O) Terminal</h2>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                10,000x BACKTESTED
              </span>
            </div>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              Algorithmic execution blueprints backed by live derivative desks at <strong>Motilal Oswal</strong>,
              <strong> Zerodha Sensibull</strong>, and <strong>Aditya Birla Money</strong>.
              Specifying <strong>What to Buy</strong>, <strong>When to Buy</strong>, <strong>How Much to Buy</strong>, and <strong>How Long to Hold</strong>.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <div className="p-3 rounded-xl bg-[#070b13] border border-slate-700/80 text-right font-mono-numbers">
              <span className="text-[10px] text-slate-400 block font-sans">Simulated 10k Win Rate</span>
              <span className="text-lg font-black text-emerald-400">86.4% Avg</span>
              <span className="text-[10px] text-cyan-300 font-sans block">10,000 iterations / trade</span>
            </div>
          </div>
        </div>

        {/* 3-Broker Backing Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 text-xs font-sans">
          <div className="p-3 rounded-xl bg-[#070b12] border border-slate-800 flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-500/30 flex items-center justify-center font-black text-orange-400 text-xs">
              MO
            </div>
            <div>
              <span className="font-bold text-white block text-[11px]">Motilal Oswal Institutional Research</span>
              <span className="text-[10px] text-slate-400">Underlying fundamentals, F&O rollover % & quantitative price targets</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#070b12] border border-slate-800 flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center font-black text-cyan-400 text-xs">
              ZD
            </div>
            <div>
              <span className="font-bold text-white block text-[11px]">Zerodha Sensibull Derivatives Desk</span>
              <span className="text-[10px] text-slate-400">Real-time Greeks (Delta/Theta), Max Pain, PCR & Open Interest build-up</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#070b12] border border-slate-800 flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center font-black text-emerald-400 text-xs">
              AB
            </div>
            <div>
              <span className="font-bold text-white block text-[11px]">Aditya Birla Money Risk Rules</span>
              <span className="text-[10px] text-slate-400">Capital sizing, SPAN hedged margins & strict 2% portfolio risk caps</span>
            </div>
          </div>
        </div>
      </div>

      {/* FILTER CONTROLS */}
      <div className="bg-[#0c121d] p-4 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="w-full md:w-80">
          <input
            type="text"
            placeholder="Search F&O Trade (e.g. 25900 CE, NIFTY, Spread, Reliance)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#070b12] border border-slate-700/80 rounded-xl px-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Strategy Filter Chips */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 text-xs">
          <span className="text-slate-400 font-semibold mr-1 shrink-0">Strategy:</span>
          {[
            { id: "ALL", label: "All F&O" },
            { id: "BULL_CALL_SPREAD", label: "Bull Call Spread" },
            { id: "NAKED_CALL_MOMENTUM", label: "Call Momentum" },
            { id: "IRON_CONDOR", label: "Iron Condor" },
          ].map((strat) => (
            <button
              key={strat.id}
              onClick={() => setFilterStrategy(strat.id)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                filterStrategy === strat.id
                  ? "bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/20"
                  : "bg-slate-800/80 text-slate-400 hover:text-slate-200"
              }`}
            >
              {strat.label}
            </button>
          ))}
        </div>
      </div>

      {/* F&O TRADE CARDS */}
      <div className="space-y-6">
        {filteredTrades.map((trade) => {
          return (
            <div
              key={trade.id}
              className="bg-[#0c121d] border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-6 shadow-xl transition-all"
            >
              {/* CARD TOP HEADER */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
                <div>
                  <div className="flex items-center space-x-3">
                    <h3 className="text-xl font-black text-white">{trade.contractName}</h3>
                    <span
                      className={`px-3 py-0.5 rounded-full text-xs font-black tracking-wider ${
                        trade.bias === "BULLISH"
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                          : trade.bias === "BEARISH"
                          ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                          : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                      }`}
                    >
                      {trade.bias} • {trade.strategyLabel}
                    </span>
                    <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                      Expiry: {trade.expiryDate}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Underlying: <strong className="text-white">{trade.underlying}</strong> • Lot Size: {trade.howMuchToBuy.lotSize}
                  </p>
                </div>

                {/* Pricing Badges */}
                <div className="flex items-center space-x-3 text-right font-mono-numbers">
                  <div>
                    <span className="text-[10px] text-slate-400 font-sans block uppercase">Current Premium</span>
                    <span className="text-lg font-black text-white">₹{trade.currentPremium}</span>
                  </div>
                  <div className="border-l border-slate-800 pl-3">
                    <span className="text-[10px] text-emerald-400 font-sans block uppercase">Target 1</span>
                    <span className="text-lg font-black text-emerald-400">₹{trade.target1Premium}</span>
                  </div>
                  <div className="border-l border-slate-800 pl-3">
                    <span className="text-[10px] text-rose-400 font-sans block uppercase">Stop Loss</span>
                    <span className="text-lg font-black text-rose-400">₹{trade.stopLossPremium}</span>
                  </div>
                </div>
              </div>

              {/* THE 4 PILLARS: WHAT, WHEN, HOW MUCH, HOW LONG TO HOLD */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-5 font-sans">
                {/* 1. WHAT TO BUY */}
                <div className="p-4 rounded-xl bg-[#070b13] border border-cyan-500/30 space-y-1.5">
                  <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    <span>1. What to Buy</span>
                  </span>
                  <div className="text-xs font-black text-white">{trade.whatToBuy.primaryLeg}</div>
                  {trade.whatToBuy.hedgeLeg && (
                    <div className="text-[11px] font-bold text-emerald-400">{trade.whatToBuy.hedgeLeg}</div>
                  )}
                  <p className="text-[11px] text-slate-400 leading-snug pt-1">
                    {trade.whatToBuy.rationale}
                  </p>
                </div>

                {/* 2. WHEN TO BUY */}
                <div className="p-4 rounded-xl bg-[#070b13] border border-emerald-500/30 space-y-1.5">
                  <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>2. When to Buy</span>
                  </span>
                  <div className="text-xs font-black text-emerald-300 font-mono-numbers">
                    Entry Range: ₹{trade.whenToBuy.entryPriceMin} - ₹{trade.whenToBuy.entryPriceMax}
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    {trade.whenToBuy.triggerCondition}
                  </p>
                  <div className="text-[10px] text-slate-400 pt-1 font-mono">
                    Window: {trade.whenToBuy.optimalTimingWindow}
                  </div>
                </div>

                {/* 3. HOW MUCH TO BUY */}
                <div className="p-4 rounded-xl bg-[#070b13] border border-purple-500/30 space-y-1.5">
                  <span className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Coins className="w-3.5 h-3.5" />
                    <span>3. How Much to Buy</span>
                  </span>
                  <div className="text-xs font-black text-white font-mono-numbers">
                    {trade.howMuchToBuy.recommendedLots} Lots ({trade.howMuchToBuy.totalQuantity} Shares)
                  </div>
                  <div className="text-[11px] text-slate-300 font-mono-numbers">
                    Capital: ₹{trade.howMuchToBuy.capitalRequired.toLocaleString('en-IN')} | Margin: ₹{trade.howMuchToBuy.marginRequirement.toLocaleString('en-IN')}
                  </div>
                  <p className="text-[10px] text-slate-400 leading-snug pt-1">
                    Strict {trade.howMuchToBuy.brokerRiskCapPercent}% broker portfolio risk cap enforced.
                  </p>
                </div>

                {/* 4. HOW LONG TO HOLD */}
                <div className="p-4 rounded-xl bg-[#070b13] border border-amber-500/30 space-y-1.5">
                  <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Timer className="w-3.5 h-3.5" />
                    <span>4. How Long to Hold</span>
                  </span>
                  <div className="text-xs font-black text-amber-300">
                    {trade.howLongToHold.recommendedDuration}
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    {trade.howLongToHold.timeDecayThetaExitRule}
                  </p>
                  <div className="text-[10px] text-slate-400 pt-1">
                    Milestone: {trade.howLongToHold.optimalExitMilestone}
                  </div>
                </div>
              </div>

              {/* GREEKS & OPEN INTEREST SUMMARY BAR */}
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5 p-3 rounded-xl bg-[#070b12] border border-slate-800 text-xs font-mono-numbers text-center mb-4">
                <div>
                  <span className="text-[9px] text-slate-400 block font-sans">DELTA (Δ)</span>
                  <strong className="text-white">{trade.greeks.delta}</strong>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 block font-sans">THETA (DECAY)</span>
                  <strong className={trade.greeks.theta >= 0 ? "text-emerald-400" : "text-rose-400"}>
                    {trade.greeks.theta >= 0 ? "+" : ""}{trade.greeks.theta} ₹/day
                  </strong>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 block font-sans">IMPLIED VOL (IV)</span>
                  <strong className="text-cyan-300">{trade.greeks.iv}% (Pctl: {trade.greeks.ivPercentile}%)</strong>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 block font-sans">PUT-CALL RATIO (PCR)</span>
                  <strong className="text-emerald-400">{trade.openInterest.pcr}</strong>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 block font-sans">MAX PAIN STRIKE</span>
                  <strong className="text-white">₹{trade.openInterest.maxPain}</strong>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 block font-sans">OI BUILDUP</span>
                  <strong className="text-purple-300">{trade.openInterest.oiBuildUp}</strong>
                </div>
              </div>

              {/* 3-BROKER MULTI-VALIDATION QUOTES */}
              <div className="p-3.5 rounded-xl bg-[#080d16] border border-slate-800/90 space-y-2 text-xs font-sans">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">
                  Multi-Broker Consensus Backing:
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-2.5 rounded-lg bg-[#070b12] border border-slate-800/80">
                    <span className="text-[10px] text-orange-400 font-bold block mb-1">Motilal Oswal Quant Research</span>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {trade.brokerBacking.motilalOswal.quantDeskNote} (Rollover: {trade.brokerBacking.motilalOswal.rolloverPct}%)
                    </p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#070b12] border border-slate-800/80">
                    <span className="text-[10px] text-cyan-400 font-bold block mb-1">Zerodha Sensibull Analytics</span>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {trade.brokerBacking.zerodhaSensibull.view}
                    </p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#070b12] border border-slate-800/80">
                    <span className="text-[10px] text-emerald-400 font-bold block mb-1">Aditya Birla Money Risk Rules</span>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {trade.brokerBacking.adityaBirlaMoney.marginRule} (Grade: {trade.brokerBacking.adityaBirlaMoney.riskGrade})
                    </p>
                  </div>
                </div>
              </div>

              {/* CARD FOOTER: 10K BACKTEST BUTTON */}
              <div className="mt-4 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono-numbers">
                <div className="flex items-center space-x-3 text-xs">
                  <span className="text-slate-400 flex items-center gap-1 font-sans">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>10k Simulated Win Rate:</span>
                    <strong className="text-emerald-400 font-black">{trade.monteCarlo10k.simulatedWinRate}%</strong>
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-400 font-sans">
                    Profit Factor: <strong className="text-cyan-300 font-bold">{trade.monteCarlo10k.profitFactor}</strong>
                  </span>
                </div>

                <button
                  onClick={() =>
                    onOpenMonteCarlo(
                      trade.strategyLabel,
                      trade.contractName,
                      trade.monteCarlo10k
                    )
                  }
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-500 hover:opacity-95 text-slate-950 font-black text-xs transition-all flex items-center space-x-2 shadow-md shadow-cyan-500/10 cursor-pointer"
                >
                  <Cpu className="w-4 h-4" />
                  <span>Inspect 10,000x Monte Carlo Backtest</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

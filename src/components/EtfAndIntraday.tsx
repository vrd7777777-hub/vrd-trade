import React, { useState } from 'react';
import { ETFItem, IntradayTrade, MonteCarloResult } from '../types/trading';
import {
  Layers,
  TrendingUp,
  TrendingDown,
  Timer,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Coins,
  Percent,
  Activity,
  Flame,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Zap
} from 'lucide-react';

interface EtfAndIntradayProps {
  etfs: ETFItem[];
  intradayTrades: IntradayTrade[];
  onOpenMonteCarlo: (title: string, underlying: string, result: MonteCarloResult) => void;
}

export const EtfAndIntraday: React.FC<EtfAndIntradayProps> = ({
  etfs,
  intradayTrades,
  onOpenMonteCarlo,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"etfs" | "intraday">("etfs");
  const [etfCategory, setEtfCategory] = useState<string>("ALL");
  const [intradayStrategyFilter, setIntradayStrategyFilter] = useState<string>("ALL");

  const filteredEtfs = etfs.filter(
    (e) => etfCategory === "ALL" || e.category === etfCategory
  );

  const filteredIntraday = intradayTrades.filter(
    (t) => intradayStrategyFilter === "ALL" || t.strategy === intradayStrategyFilter
  );

  return (
    <div className="space-y-6">
      {/* TOP SUB-TAB SWITCHER */}
      <div className="bg-[#0c121d] border border-slate-800 p-2 rounded-2xl flex items-center justify-between gap-3 shadow-xl">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveSubTab("etfs")}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              activeSubTab === "etfs"
                ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black shadow-md shadow-emerald-500/20"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Coins className="w-4 h-4" />
            <span>All Indian ETFs (NiftyBeES, BankBeES, Gold, CPSE)</span>
          </button>

          <button
            onClick={() => setActiveSubTab("intraday")}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              activeSubTab === "intraday"
                ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-black shadow-md shadow-cyan-500/20"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Intraday Trading Strategies (ORB, VWAP, CPR, Supertrend)</span>
          </button>
        </div>

        <div className="hidden md:flex items-center space-x-2 text-xs text-slate-400 font-mono pr-3">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>10k Monte Carlo Validated</span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SUB-TAB 1: INDIAN ETFS UNIVERSE */}
      {/* ======================================================== */}
      {activeSubTab === "etfs" && (
        <div className="space-y-5">
          {/* ETF Filter Bar */}
          <div className="bg-[#0c121d] p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2 overflow-x-auto">
              <span className="text-slate-400 font-semibold mr-1">Category:</span>
              {["ALL", "INDEX", "SECTORAL", "COMMODITY", "GLOBAL"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setEtfCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    etfCategory === cat
                      ? "bg-emerald-500 text-slate-950 font-black"
                      : "bg-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <span className="text-[11px] text-slate-400 font-mono">
              Lowest tracking error & expense ratio screen
            </span>
          </div>

          {/* ETF Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredEtfs.map((etf) => (
              <div
                key={etf.id}
                className="bg-[#0c121d] border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-5 shadow-xl flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-black text-white">{etf.symbol}</h3>
                        <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 font-bold">
                          {etf.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{etf.name}</p>
                      <span className="text-[10px] text-slate-500 block mt-0.5">Benchmark: {etf.benchmark}</span>
                    </div>

                    <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                      {etf.action}
                    </span>
                  </div>

                  {/* Price & Return Bar */}
                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between font-mono-numbers">
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 font-sans block">NAV / CMP</span>
                      <span className="text-xl font-black text-white">₹{etf.cmp}</span>
                      <span className="text-xs font-bold text-emerald-400 block">+{etf.change}%</span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] uppercase text-slate-400 font-sans block">Optimal Hold Duration</span>
                      <span className="text-sm font-bold text-cyan-300">{etf.optimalHoldDays} Trading Days</span>
                      <span className="text-xs font-bold text-emerald-400 block">+{etf.expectedHoldingReturn}% Target Return</span>
                    </div>
                  </div>

                  {/* Expense Ratio, AUM, Tracking Error */}
                  <div className="grid grid-cols-3 gap-2 mt-4 p-2.5 rounded-xl bg-[#070b12] border border-slate-800 text-center font-mono-numbers text-[10px]">
                    <div>
                      <span className="text-[9px] text-slate-400 block font-sans">EXPENSE RATIO</span>
                      <strong className="text-white">{etf.expenseRatio}%</strong>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block font-sans">TRACKING ERR</span>
                      <strong className="text-emerald-400">{etf.trackingError}%</strong>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block font-sans">AUM (₹ CR)</span>
                      <strong className="text-cyan-300">₹{(etf.aumCr / 1000).toFixed(1)}k Cr</strong>
                    </div>
                  </div>

                  {/* Broker Backing Quotes */}
                  <div className="mt-4 space-y-1.5 text-xs font-sans">
                    <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">
                      Motilal Oswal & Zerodha Consensus:
                    </span>
                    <p className="text-[11px] text-slate-300 leading-snug bg-[#070b12] p-2.5 rounded-lg border border-slate-800/80">
                      {etf.brokerBacking.motilalOswal}
                    </p>
                  </div>
                </div>

                {/* Card Footer: 10k Monte Carlo Verification */}
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="font-mono-numbers text-slate-300">
                    10k Win Rate: <strong className="text-emerald-400 font-bold">{etf.monteCarlo10k.simulatedWinRate}%</strong>
                  </span>

                  <button
                    onClick={() =>
                      onOpenMonteCarlo(
                        `${etf.symbol} Systematic Allocation`,
                        etf.benchmark,
                        etf.monteCarlo10k
                      )
                    }
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-200 text-[11px] font-bold transition-all flex items-center space-x-1 cursor-pointer"
                  >
                    <Cpu className="w-3.5 h-3.5" />
                    <span>10k Backtest</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-TAB 2: INTRADAY TRADING STRATEGIES */}
      {/* ======================================================== */}
      {activeSubTab === "intraday" && (
        <div className="space-y-5">
          {/* Strategy Filter Bar & 15:15 IST Warning */}
          <div className="bg-[#0c121d] p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2 overflow-x-auto">
              <span className="text-slate-400 font-semibold mr-1">Intraday Strategy:</span>
              {[
                { id: "ALL", label: "All Strategies" },
                { id: "15M_ORB", label: "15-Min ORB" },
                { id: "VWAP_MEAN_REVERSION", label: "VWAP Breakout" },
                { id: "CPR_NARROW_BREAKOUT", label: "Narrow CPR" },
                { id: "SUPERTREND_SQUEEZE", label: "Supertrend Squeeze" },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setIntradayStrategyFilter(s.id)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    intradayStrategyFilter === s.id
                      ? "bg-cyan-500 text-slate-950 font-black"
                      : "bg-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-2 text-rose-400 font-mono font-bold bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-500/20">
              <Clock className="w-4 h-4 text-rose-400 animate-pulse" />
              <span>Auto Square-Off at 15:15 IST</span>
            </div>
          </div>

          {/* Intraday Trades Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredIntraday.map((trade) => (
              <div
                key={trade.id}
                className="bg-[#0c121d] border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-6 shadow-xl space-y-4 transition-all"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2.5">
                      <h3 className="text-xl font-black text-white">{trade.symbol}</h3>
                      <span className="px-2.5 py-0.5 rounded text-xs font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                        {trade.direction}
                      </span>
                      <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded">
                        {trade.strategyTitle}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{trade.name} • {trade.timeframe}</p>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded text-[11px] font-bold font-mono ${
                      trade.status === "ACTIVE_TRIGGER"
                        ? "bg-emerald-500 text-slate-950 font-black"
                        : "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                    }`}
                  >
                    {trade.status.replace(/_/g, ' ')}
                  </span>
                </div>

                {/* Entry, Target 1, Target 2, Stop Loss */}
                <div className="grid grid-cols-4 gap-2.5 p-3 rounded-xl bg-[#070b12] border border-slate-800 text-center font-mono-numbers">
                  <div>
                    <span className="text-[9px] text-slate-400 block font-sans">ENTRY TRIGGER</span>
                    <strong className="text-white text-sm">₹{trade.entryTrigger}</strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-emerald-400 block font-sans">TARGET 1</span>
                    <strong className="text-emerald-400 text-sm">₹{trade.target1}</strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-emerald-400 block font-sans">TARGET 2</span>
                    <strong className="text-emerald-300 text-sm">₹{trade.target2}</strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-rose-400 block font-sans">STOP LOSS</span>
                    <strong className="text-rose-400 text-sm">₹{trade.stoploss}</strong>
                  </div>
                </div>

                {/* Technical Anchors (VWAP, CPR, ORB High/Low) */}
                <div className="grid grid-cols-4 gap-2 text-[11px] font-mono-numbers text-slate-300 pt-1">
                  <div>VWAP: <strong className="text-slate-100">₹{trade.vwapLevel}</strong></div>
                  <div>CPR Pivot: <strong className="text-slate-100">₹{trade.cprPivot}</strong></div>
                  <div>ORB High: <strong className="text-slate-100">₹{trade.orbHigh}</strong></div>
                  <div>Risk:Reward: <strong className="text-cyan-400">{trade.riskReward}</strong></div>
                </div>

                {/* Multi-Broker Quotes */}
                <div className="p-3 rounded-xl bg-[#080d16] border border-slate-800 text-xs font-sans text-slate-300 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Zerodha & Motilal Consensus:
                  </span>
                  <p className="text-[11px] leading-relaxed">
                    {trade.brokerConsensus.motilalTarget} {trade.brokerConsensus.zerodhaOI}
                  </p>
                </div>

                {/* Footer with 10k Backtest */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono-numbers">
                  <span className="text-slate-400 font-sans">
                    10k Simulated Win Rate: <strong className="text-emerald-400 font-bold">{trade.monteCarlo10k.simulatedWinRate}%</strong>
                  </span>

                  <button
                    onClick={() =>
                      onOpenMonteCarlo(
                        `${trade.symbol} (${trade.strategyTitle})`,
                        "Intraday Equities / Index",
                        trade.monteCarlo10k
                      )
                    }
                    className="px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 font-bold text-xs flex items-center space-x-1 cursor-pointer transition-colors"
                  >
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Inspect 10k Runs</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

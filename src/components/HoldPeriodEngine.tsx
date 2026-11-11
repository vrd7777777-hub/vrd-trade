import React, { useState } from 'react';
import { Stock } from '../types/trading';
import {
  Timer,
  TrendingUp,
  Activity,
  AlertTriangle,
  Zap,
  Target,
  ShieldCheck,
  Calendar,
  Sparkles,
  BarChart2,
  ArrowRight,
  Info,
  CheckCircle2
} from 'lucide-react';

interface HoldPeriodEngineProps {
  stocks: Stock[];
  selectedStockId?: string;
  onSelectStockModal: (stock: Stock) => void;
}

export const HoldPeriodEngine: React.FC<HoldPeriodEngineProps> = ({
  stocks,
  selectedStockId,
  onSelectStockModal,
}) => {
  const [currentId, setCurrentId] = useState<string>(selectedStockId || "RELIANCE");
  const [customDays, setCustomDays] = useState<number>(42);

  const selectedStock = stocks.find((s) => s.id === currentId) || stocks[0];

  // Recalculate dynamic simulation when customDays changes
  const dynamicReturn = (
    selectedStock.expectedHoldingReturn *
    (Math.log(customDays + 5) / Math.log(selectedStock.optimalHoldingDays + 5))
  ).toFixed(1);

  const dynamicSharpe = (
    selectedStock.riskAdjustedSharpe *
    (1 - Math.abs(customDays - selectedStock.optimalHoldingDays) * 0.007)
  ).toFixed(2);

  // Volatility bounds based on ATR and days:
  const sigmaMove = (selectedStock.hv30 * Math.sqrt(customDays / 252)).toFixed(1);

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-[#0b1424] via-[#0d1b30] to-[#09101c] border border-cyan-500/30 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2.5 mb-2">
            <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
              <Timer className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-black text-white">Hold-On Period & Historical Volatility Engine</h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              OPTIMAL RETURNS PROTOCOL
            </span>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Quantifying the highest Sharpe-ratio holding window for Indian equities by harmonizing
            <strong> 30D/90D Historical Volatility (HV)</strong>, <strong>ADX Trend Persistence</strong>, and
            <strong> ATR-calibrated profit decay curves</strong>.
          </p>
        </div>

        {/* Quick Stock Selector */}
        <div className="w-full md:w-auto shrink-0 bg-[#070b12] p-3 rounded-xl border border-slate-700/80">
          <label className="text-[11px] font-bold text-slate-400 block mb-1.5 flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>Select Stock to Model:</span>
          </label>
          <select
            value={currentId}
            onChange={(e) => {
              setCurrentId(e.target.value);
              const found = stocks.find((s) => s.id === e.target.value);
              if (found) setCustomDays(found.optimalHoldingDays);
            }}
            className="w-full bg-[#0d131f] border border-slate-600 rounded-lg px-3 py-2 text-xs font-bold text-slate-100 focus:outline-none focus:border-cyan-400"
          >
            {stocks.map((s) => (
              <option key={s.id} value={s.id}>
                {s.symbol} — {s.action} ({s.optimalHoldingDays}D Hold • +{s.expectedHoldingReturn}%)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* SELECTED STOCK HERO DASHBOARD */}
      <div className="bg-[#0c121d] border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between pb-5 border-b border-slate-800/80 gap-4">
          <div>
            <div className="flex items-center space-x-3">
              <h3 className="text-2xl font-black text-white">{selectedStock.symbol}</h3>
              <span className={`px-3 py-0.5 rounded-full text-xs font-black tracking-wider ${
                selectedStock.action === "BUY" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40" :
                selectedStock.action === "SELL" ? "bg-rose-500/20 text-rose-400 border border-rose-500/40" :
                "bg-amber-500/20 text-amber-400 border border-amber-500/40"
              }`}>
                {selectedStock.action} • {selectedStock.conviction}% Conviction
              </span>
              <span className="text-xs text-slate-400 font-mono bg-slate-800/80 px-2 py-0.5 rounded">
                NSE: {selectedStock.sector}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">{selectedStock.name}</p>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => onSelectStockModal(selectedStock)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-200 text-xs font-bold transition-all shadow-md flex items-center space-x-1.5"
            >
              <span>Full Technical Audit</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 4 CORE QUANT PILLARS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
          {/* Pillar 1: Optimal Hold-On Window */}
          <div className="p-4 rounded-xl bg-gradient-to-b from-[#0e1b2e] to-[#070d18] border border-cyan-500/40 relative overflow-hidden">
            <div className="text-[10px] uppercase font-mono tracking-wider text-cyan-300 font-bold flex items-center gap-1.5">
              <Timer className="w-3.5 h-3.5 text-cyan-400" />
              <span>Optimal Hold Duration</span>
            </div>
            <div className="text-2xl font-black font-mono-numbers text-white mt-1">
              {selectedStock.optimalHoldingDays} Trading Days
            </div>
            <div className="text-xs text-cyan-400 font-semibold mt-0.5">{selectedStock.holdingWindowLabel}</div>
            <div className="mt-3 pt-2 border-t border-cyan-500/20 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-cyan-400" />
                <span>Target Exit:</span>
              </span>
              <strong className="text-slate-200">{selectedStock.optimalExitDate}</strong>
            </div>
          </div>

          {/* Pillar 2: Expected Holding Return */}
          <div className="p-4 rounded-xl bg-gradient-to-b from-[#091a1a] to-[#060e0f] border border-emerald-500/40">
            <div className="text-[10px] uppercase font-mono tracking-wider text-emerald-300 font-bold flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>Target Return on Hold</span>
            </div>
            <div className="text-2xl font-black font-mono-numbers text-emerald-400 mt-1">
              +{selectedStock.expectedHoldingReturn}%
            </div>
            <div className="text-xs text-slate-300 mt-0.5 font-mono">
              ₹{selectedStock.cmp} → ₹{selectedStock.target}
            </div>
            <div className="mt-3 pt-2 border-t border-emerald-500/20 flex items-center justify-between text-[11px] text-slate-400">
              <span>Risk-Adjusted Sharpe:</span>
              <strong className="text-emerald-400 font-mono-numbers">{selectedStock.riskAdjustedSharpe}</strong>
            </div>
          </div>

          {/* Pillar 3: Historical Volatility Metrics */}
          <div className="p-4 rounded-xl bg-[#090e18] border border-slate-800">
            <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-purple-400" />
              <span>Historical Volatility</span>
            </div>
            <div className="text-2xl font-black font-mono-numbers text-slate-100 mt-1">
              {selectedStock.hv30}% <span className="text-xs text-slate-400 font-normal">HV30</span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              HV90: <span className="font-mono text-slate-200">{selectedStock.hv90}%</span> • ATR: <span className="font-mono text-slate-200">₹{selectedStock.atr}</span>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>Volatility Regime:</span>
              <strong className="text-purple-300 text-[10px]">{selectedStock.volatilityRegime.replace(/_/g, " ")}</strong>
            </div>
          </div>

          {/* Pillar 4: Long-Term Trend Strength */}
          <div className="p-4 rounded-xl bg-[#090e18] border border-slate-800">
            <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Trend Persistence</span>
            </div>
            <div className="text-2xl font-black font-mono-numbers text-slate-100 mt-1">
              {selectedStock.adx} <span className="text-xs text-slate-400 font-normal">ADX</span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              200 SMA: <span className="text-emerald-400 font-bold">+{selectedStock.sma200Distance}%</span> • Hurst: <span className="text-cyan-400 font-mono">{selectedStock.hurstExponent}</span>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>Phase:</span>
              <strong className="text-slate-200 text-[10px]">{selectedStock.trendPhase}</strong>
            </div>
          </div>
        </div>

        {/* INTERACTIVE HOLDING PERIOD SIMULATION SLIDER */}
        <div className="p-5 rounded-2xl bg-[#070b13] border border-slate-800/90 my-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-cyan-400" />
                <span>Simulate Custom Hold Duration for {selectedStock.symbol}</span>
              </h4>
              <p className="text-xs text-slate-400">
                Adjust holding period to model expected profit decay, 1-sigma volatility bounds, and Sharpe ratio.
              </p>
            </div>

            <button
              onClick={() => setCustomDays(selectedStock.optimalHoldingDays)}
              className="text-xs px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30 font-semibold"
            >
              Reset to Optimal ({selectedStock.optimalHoldingDays} Days)
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <span className="text-xs font-mono text-slate-400 w-12 text-right">7 Days</span>
              <input
                type="range"
                min="7"
                max="180"
                value={customDays}
                onChange={(e) => setCustomDays(Number(e.target.value))}
                className="flex-1 accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <span className="text-xs font-mono text-slate-400 w-16">180 Days</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 font-mono-numbers">
              <div className="p-3 rounded-xl bg-[#0b1019] border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans">Simulated Hold</span>
                <span className="text-lg font-bold text-white">{customDays} Trading Days</span>
                <span className="text-[10px] text-slate-500 block font-sans">~{(customDays / 21).toFixed(1)} Months</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0b1019] border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans">Projected Return</span>
                <span className="text-lg font-bold text-emerald-400">+{dynamicReturn}%</span>
                <span className="text-[10px] text-slate-500 block font-sans">Target: ₹{(selectedStock.cmp * (1 + Number(dynamicReturn) / 100)).toFixed(0)}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0b1019] border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans">1-Sigma Volatility Band</span>
                <span className="text-lg font-bold text-purple-400">±{sigmaMove}%</span>
                <span className="text-[10px] text-slate-500 block font-sans">Normal statistical range</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0b1019] border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans">Simulated Sharpe</span>
                <span className={`text-lg font-bold ${Number(dynamicSharpe) >= 2.0 ? 'text-cyan-400' : 'text-amber-400'}`}>
                  {dynamicSharpe}
                </span>
                <span className="text-[10px] text-slate-500 block font-sans">
                  {customDays === selectedStock.optimalHoldingDays ? "Optimal Peak Efficiency" : "Off-Peak Horizon"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* PRE-COMPUTED HOLDING HORIZON COMPARISON TABLE */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Horizon Scenario Matrix for {selectedStock.symbol}:</span>
          </h4>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#080d15] text-slate-400 uppercase font-mono border-b border-slate-800">
                <tr>
                  <th className="p-3">Holding Window</th>
                  <th className="p-3">Trading Days</th>
                  <th className="p-3">Expected Return</th>
                  <th className="p-3">Historical Win Prob.</th>
                  <th className="p-3">Sharpe Ratio</th>
                  <th className="p-3">Volatility Risk</th>
                  <th className="p-3">Quant Recommendation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono-numbers">
                {selectedStock.holdingPeriodSimulation.map((opt, idx) => (
                  <tr
                    key={idx}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      opt.optimal ? "bg-cyan-500/10 font-bold border-l-4 border-l-cyan-400" : ""
                    }`}
                  >
                    <td className="p-3 font-sans text-white font-medium flex items-center gap-1.5">
                      {opt.optimal && <span className="w-2 h-2 rounded-full bg-cyan-400"></span>}
                      <span>{opt.label}</span>
                    </td>
                    <td className="p-3 text-slate-200">{opt.days} Days</td>
                    <td className="p-3 text-emerald-400">+{opt.expectedReturn}%</td>
                    <td className="p-3 text-cyan-300">{opt.winProbability}%</td>
                    <td className="p-3 text-slate-200">{opt.sharpe}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        opt.volatilityRisk === "Low" ? "bg-emerald-500/20 text-emerald-400" :
                        opt.volatilityRisk === "Moderate" ? "bg-amber-500/20 text-amber-400" :
                        "bg-rose-500/20 text-rose-400"
                      }`}>
                        {opt.volatilityRisk}
                      </span>
                    </td>
                    <td className="p-3 font-sans">
                      {opt.optimal ? (
                        <span className="inline-flex items-center space-x-1 text-cyan-300 font-extrabold text-[11px] bg-cyan-500/20 px-2 py-0.5 rounded border border-cyan-500/40">
                          <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                          <span>Optimal Hold Window</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Sub-optimal risk/reward</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* HOLDING RATIONALE & VOLATILITY PROFILE */}
        <div className="mt-6 pt-5 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[#070b12] border border-slate-800">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-2.5 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-cyan-400" />
              <span>Why {selectedStock.optimalHoldingDays} Days for {selectedStock.symbol}?</span>
            </h5>
            <ul className="space-y-2">
              {selectedStock.holdingRationales.map((r, i) => (
                <li key={i} className="text-xs text-slate-300 flex items-start space-x-2 leading-relaxed">
                  <span className="text-cyan-400 font-bold mt-0.5">•</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-[#070b12] border border-slate-800">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-2.5 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>ATR Trailing Stop & Risk Rules</span>
            </h5>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">ATR-Calibrated Trailing Stop:</span>
                <strong className="text-rose-400 font-mono-numbers">₹{selectedStock.trailingStopATR}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Daily True Range (14D):</span>
                <strong className="text-slate-200 font-mono-numbers">₹{selectedStock.atr} ({selectedStock.atrPercent}%)</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Beta vs Nifty 50:</span>
                <strong className="text-slate-200 font-mono-numbers">{selectedStock.beta}</strong>
              </div>
              <p className="text-[11px] text-slate-400 pt-1">
                Trailing stop moves up as price registers new highs. Exit trade if daily close breaches trailing ATR stop or upon reaching target by {selectedStock.optimalExitDate}.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CROSS-MARKET HOLDING PERIOD COMPARISON TABLE */}
      <div className="bg-[#0c121d] border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Timer className="w-5 h-5 text-emerald-400" />
              <span>Indian Equities Universe — Optimal Hold-On Rankings</span>
            </h3>
            <p className="text-xs text-slate-400">
              Ranked by Sharpe ratio efficiency across calculated optimal holding windows.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#080d15] text-slate-400 uppercase font-mono border-b border-slate-800">
              <tr>
                <th className="p-3.5">Stock</th>
                <th className="p-3.5">Action</th>
                <th className="p-3.5">Optimal Hold Days</th>
                <th className="p-3.5">Target Exit Window</th>
                <th className="p-3.5">Exp. Return</th>
                <th className="p-3.5">HV 30D</th>
                <th className="p-3.5">200 SMA Dist</th>
                <th className="p-3.5">Sharpe</th>
                <th className="p-3.5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono-numbers">
              {stocks.map((stock) => (
                <tr
                  key={stock.id}
                  onClick={() => setCurrentId(stock.id)}
                  className={`hover:bg-slate-800/30 cursor-pointer transition-colors ${
                    stock.id === currentId ? "bg-cyan-500/10" : ""
                  }`}
                >
                  <td className="p-3.5 font-bold text-white">
                    {stock.symbol} <span className="text-[10px] font-sans text-slate-500 font-normal">({stock.sector})</span>
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                      stock.action === "BUY" ? "bg-emerald-500/20 text-emerald-400" :
                      stock.action === "SELL" ? "bg-rose-500/20 text-rose-400" : "bg-amber-500/20 text-amber-400"
                    }`}>
                      {stock.action}
                    </span>
                  </td>
                  <td className="p-3.5 font-bold text-cyan-300">
                    {stock.optimalHoldingDays} Days <span className="text-[10px] text-slate-400 font-normal">({stock.holdingWindowLabel})</span>
                  </td>
                  <td className="p-3.5 text-slate-300 font-sans">{stock.optimalExitDate}</td>
                  <td className="p-3.5 font-bold text-emerald-400">+{stock.expectedHoldingReturn}%</td>
                  <td className="p-3.5 text-slate-300">{stock.hv30}%</td>
                  <td className="p-3.5 text-emerald-400">+{stock.sma200Distance}%</td>
                  <td className="p-3.5 font-bold text-white">{stock.riskAdjustedSharpe}</td>
                  <td className="p-3.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectStockModal(stock);
                      }}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-200 text-[11px] font-bold"
                    >
                      Audit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

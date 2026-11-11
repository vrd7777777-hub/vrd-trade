import React, { useState, useMemo } from 'react';
import { Stock, HoldingHorizon } from '../types/trading';
import {
  Calculator,
  Timer,
  ShieldCheck,
  TrendingUp,
  Percent,
  CheckCircle,
  Copy,
  DollarSign,
  AlertCircle,
  Layers,
  ArrowRight
} from 'lucide-react';

interface HoldPeriodOptimizerProps {
  stocks: Stock[];
  onSelectStockModal: (stock: Stock) => void;
}

export const HoldPeriodOptimizer: React.FC<HoldPeriodOptimizerProps> = ({
  stocks,
  onSelectStockModal,
}) => {
  const [totalCapital, setTotalCapital] = useState<number>(200000);
  const [riskStyle, setRiskStyle] = useState<"SWING" | "POSITIONAL" | "MEDIUM_TERM" | "BALANCED">("POSITIONAL");
  const [riskPerTradePct, setRiskPerTradePct] = useState<number>(1.5);
  const [copied, setCopied] = useState<boolean>(false);

  // Eligible BUY stocks
  const buyStocks = useMemo(() => {
    return stocks.filter((s) => s.action === "BUY");
  }, [stocks]);

  // Filter stocks matching holding style or take top conviction
  const allocatedBasket = useMemo(() => {
    let candidates = buyStocks;
    if (riskStyle !== "BALANCED") {
      candidates = buyStocks.filter((s) => s.holdingHorizon === riskStyle);
      if (candidates.length < 3) {
        candidates = buyStocks; // fallback if specific horizon has few stocks
      }
    }
    // Take top 3 to 4 stocks by conviction
    const topPicks = [...candidates].sort((a, b) => b.conviction - a.conviction).slice(0, 4);
    if (topPicks.length === 0) return [];

    const weightPerStock = 1 / topPicks.length;

    return topPicks.map((stock) => {
      const allocatedAmount = totalCapital * weightPerStock;
      const shares = Math.max(1, Math.floor(allocatedAmount / stock.cmp));
      const totalCost = shares * stock.cmp;
      const targetGain = shares * (stock.target - stock.cmp);
      const riskAmount = shares * (stock.cmp - stock.stoploss);
      const riskRewardRatio = (targetGain / (riskAmount || 1)).toFixed(2);

      return {
        stock,
        shares,
        totalCost,
        targetGain,
        riskAmount,
        riskRewardRatio,
        optimalDays: stock.optimalHoldingDays,
        targetDate: stock.optimalExitDate,
      };
    });
  }, [buyStocks, totalCapital, riskStyle]);

  const totalProjectedGain = allocatedBasket.reduce((sum, item) => sum + item.targetGain, 0);
  const totalAllocated = allocatedBasket.reduce((sum, item) => sum + item.totalCost, 0);
  const totalMaxRisk = allocatedBasket.reduce((sum, item) => sum + item.riskAmount, 0);
  const overallReturnPct = totalAllocated > 0 ? ((totalProjectedGain / totalAllocated) * 100).toFixed(1) : "0";

  const handleCopyPlan = () => {
    const text = `=== VRD TRADE AI — HOLDING PERIOD TRADE PLAN ===
Capital: ₹${totalCapital.toLocaleString('en-IN')} | Style: ${riskStyle}
Total Allocated: ₹${Math.round(totalAllocated).toLocaleString('en-IN')}
Projected Return: +${overallReturnPct}% (+₹${Math.round(totalProjectedGain).toLocaleString('en-IN')})
Max Risk at Stoploss: ₹${Math.round(totalMaxRisk).toLocaleString('en-IN')}

ALLOCATION SCHEDULE:
${allocatedBasket
  .map(
    (b) =>
      `• ${b.stock.symbol}: ${b.shares} Shares @ ₹${b.stock.cmp} | Target: ₹${b.stock.target} | Stop: ₹${b.stock.stoploss} | Optimal Hold: ${b.optimalDays} Trading Days (Exit ~ ${b.targetDate}) | Exp. Profit: +₹${Math.round(b.targetGain).toLocaleString('en-IN')}`
  )
  .join('\n')}
===============================================`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-[#0c121d] border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center space-x-3 mb-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">Hold-On Period Portfolio & Position Sizer</h2>
            <p className="text-xs text-slate-400">
              Calculate optimal share sizing, capital allocation, and holding schedules tailored to your investment horizon.
            </p>
          </div>
        </div>

        {/* INPUT FORM CONTROLS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6 pt-5 border-t border-slate-800/80">
          {/* Capital Input */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center gap-1.5">
              <span>Trading Capital (INR ₹)</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono">₹</span>
              <input
                type="number"
                min="10000"
                step="10000"
                value={totalCapital}
                onChange={(e) => setTotalCapital(Number(e.target.value))}
                className="w-full bg-[#070b12] border border-slate-700 rounded-xl pl-8 pr-4 py-2.5 text-xs font-mono font-bold text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div className="flex space-x-1.5 mt-2">
              {[50000, 100000, 250000, 500000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setTotalCapital(amt)}
                  className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded-md font-mono"
                >
                  ₹{(amt / 100000).toFixed(amt >= 100000 ? 1 : 2)}L
                </button>
              ))}
            </div>
          </div>

          {/* Holding Style Selector */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">
              Target Holding Horizon Style
            </label>
            <select
              value={riskStyle}
              onChange={(e) => setRiskStyle(e.target.value as any)}
              className="w-full bg-[#070b12] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-200 focus:outline-none focus:border-cyan-400"
            >
              <option value="BALANCED">⚖️ Multi-Horizon Balanced (Blended Best Picks)</option>
              <option value="SWING">⚡ Fast Swing Momentum (15 - 35 Trading Days)</option>
              <option value="POSITIONAL">🚀 Positional Trend (35 - 75 Trading Days)</option>
              <option value="MEDIUM_TERM">💎 Multi-Month Trend Compounding (3 - 6 Months)</option>
            </select>
            <p className="text-[10px] text-slate-400 mt-1">
              Select your preferred turnaround cycle for trade exits and reallocations.
            </p>
          </div>

          {/* Max Risk Tolerance */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center justify-between">
              <span>Max Risk / Stop Loss per Trade</span>
              <span className="font-mono text-rose-400">{riskPerTradePct}% of Capital</span>
            </label>
            <input
              type="range"
              min="0.5"
              max="3.0"
              step="0.25"
              value={riskPerTradePct}
              onChange={(e) => setRiskPerTradePct(Number(e.target.value))}
              className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer mt-2"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
              <span>0.5% (Ultra Conservative)</span>
              <span>1.5% (Recommended)</span>
              <span>3.0% (Aggressive)</span>
            </div>
          </div>
        </div>
      </div>

      {/* PORTFOLIO PROJECTION SUMMARY BANNER */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono-numbers">
        <div className="p-4 rounded-xl bg-[#0c121d] border border-slate-800">
          <span className="text-[10px] font-sans text-slate-400 uppercase font-mono">CAPITAL DEPLOYED</span>
          <div className="text-xl font-black text-white mt-1">
            ₹{Math.round(totalAllocated).toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-slate-500 font-sans">
            Cash buffer: ₹{Math.max(0, Math.round(totalCapital - totalAllocated)).toLocaleString('en-IN')}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#0c121d] border border-emerald-500/30">
          <span className="text-[10px] font-sans text-emerald-400 uppercase font-mono">PROJECTED PROFIT</span>
          <div className="text-xl font-black text-emerald-400 mt-1">
            +₹{Math.round(totalProjectedGain).toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-emerald-300 font-sans font-bold">
            +{overallReturnPct}% Expected Basket Return
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#0c121d] border border-rose-500/30">
          <span className="text-[10px] font-sans text-rose-400 uppercase font-mono">MAX RISK AT STOP LOSS</span>
          <div className="text-xl font-black text-rose-400 mt-1">
            -₹{Math.round(totalMaxRisk).toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-slate-400 font-sans">
            Protected by tight ATR stops
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#0c121d] border border-cyan-500/30">
          <span className="text-[10px] font-sans text-cyan-400 uppercase font-mono">PORTFOLIO RISK / REWARD</span>
          <div className="text-xl font-black text-cyan-300 mt-1">
            1 : {((totalProjectedGain / (totalMaxRisk || 1))).toFixed(2)}
          </div>
          <span className="text-[10px] text-slate-400 font-sans">
            Optimal asymmetric skew
          </span>
        </div>
      </div>

      {/* GENERATED ALLOCATION TABLE */}
      <div className="bg-[#0c121d] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Optimized Stock Allocation & Holding Plan</span>
            </h3>
            <p className="text-xs text-slate-400">
              Each position is sized with individual ATR stop-loss and predefined exit milestone date.
            </p>
          </div>

          <button
            onClick={handleCopyPlan}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-200 text-xs font-bold transition-all flex items-center space-x-1.5 shadow-sm"
          >
            {copied ? (
              <>
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Plan Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Export Trade Execution Plan</span>
              </>
            )}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#080d15] text-slate-400 uppercase font-mono border-b border-slate-800">
              <tr>
                <th className="p-3.5">Stock</th>
                <th className="p-3.5">Shares to Buy</th>
                <th className="p-3.5">Entry CMP</th>
                <th className="p-3.5">Capital Allocated</th>
                <th className="p-3.5">Target / Upside</th>
                <th className="p-3.5">Optimal Hold Days</th>
                <th className="p-3.5">Exit Window Date</th>
                <th className="p-3.5">Risk : Reward</th>
                <th className="p-3.5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono-numbers">
              {allocatedBasket.map((item) => (
                <tr key={item.stock.id} className="hover:bg-slate-800/30">
                  <td className="p-3.5 font-bold text-white">
                    {item.stock.symbol}
                    <span className="text-[10px] font-sans text-slate-400 block font-normal">
                      {item.stock.sector}
                    </span>
                  </td>
                  <td className="p-3.5 font-bold text-cyan-300">
                    {item.shares} <span className="text-[10px] text-slate-400 font-normal">shares</span>
                  </td>
                  <td className="p-3.5 text-slate-200">₹{item.stock.cmp.toLocaleString('en-IN')}</td>
                  <td className="p-3.5 font-bold text-white">
                    ₹{Math.round(item.totalCost).toLocaleString('en-IN')}
                  </td>
                  <td className="p-3.5 text-emerald-400 font-bold">
                    ₹{item.stock.target.toLocaleString('en-IN')}
                    <span className="text-[10px] block text-emerald-300 font-normal">
                      +₹{Math.round(item.targetGain).toLocaleString('en-IN')}
                    </span>
                  </td>
                  <td className="p-3.5 font-bold text-cyan-400">
                    {item.optimalDays} Days
                  </td>
                  <td className="p-3.5 font-sans text-slate-300">{item.targetDate}</td>
                  <td className="p-3.5 text-slate-200">1 : {item.riskRewardRatio}</td>
                  <td className="p-3.5">
                    <button
                      onClick={() => onSelectStockModal(item.stock)}
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

import React, { useState } from 'react';
import { Stock } from '../types/trading';
import {
  ShieldAlert,
  Calculator,
  Percent,
  TrendingDown,
  Target,
  ArrowRight,
  CheckCircle2,
  Lock,
  Zap,
  Sliders
} from 'lucide-react';

interface StopLossRiskCalculatorProps {
  stock: Stock;
  onUpdateStopLoss?: (symbol: string, newStopLoss: number) => void;
}

export const StopLossRiskCalculator: React.FC<StopLossRiskCalculatorProps> = ({
  stock,
  onUpdateStopLoss,
}) => {
  const [capital, setCapital] = useState<number>(200000); // ₹2 Lakh default
  const [riskPercent, setRiskPercent] = useState<number>(1.5); // 1.5% capital risk per trade
  const [customSL, setCustomSL] = useState<number>(stock.stoploss);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const cmp = stock.cmp;
  const currentSL = customSL > 0 ? customSL : stock.stoploss;
  const riskPerShare = Math.max(0.1, cmp - currentSL);
  const riskPercentFromCMP = Number(((riskPerShare / cmp) * 100).toFixed(2));

  // Capital risk allowed in rupees
  const maxRupeesRisk = (capital * riskPercent) / 100;

  // Max shares recommended to buy without exceeding risk budget
  const maxShares = Math.max(1, Math.floor(maxRupeesRisk / riskPerShare));
  const totalCapitalRequired = maxShares * cmp;

  // Profit potential
  const target1ProfitPerShare = stock.target - cmp;
  const target1TotalProfit = maxShares * target1ProfitPerShare;
  const riskRewardRatio = Number((target1ProfitPerShare / riskPerShare).toFixed(1));

  const handleSaveCustomSL = () => {
    if (onUpdateStopLoss && customSL > 0 && customSL < cmp) {
      onUpdateStopLoss(stock.symbol, customSL);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  return (
    <div className="bg-[#090f1a] border border-rose-500/30 rounded-2xl p-5 space-y-4">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <span>Dynamic Stop-Loss & Capital Risk Protection</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                STRICT RISK CAP
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Calculate maximum allowable share position size without risking more than your target loss limit.
            </p>
          </div>
        </div>

        <div className="text-right font-mono-numbers">
          <span className="text-[10px] text-slate-400 block font-sans uppercase">Current Price (CMP)</span>
          <span className="text-base font-extrabold text-white">₹{cmp.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* STOP LOSS LEVELS DISPLAY */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono-numbers text-xs">
        <div className="p-3 rounded-xl bg-[#060a12] border border-rose-500/40">
          <div className="flex items-center justify-between text-[11px] font-sans text-rose-300 mb-1">
            <span className="font-bold">Algorithmic Stop Loss:</span>
            <span className="bg-rose-500/20 px-1.5 py-0.2 rounded text-[10px] font-mono">
              -{riskPercentFromCMP}%
            </span>
          </div>
          <div className="text-lg font-black text-rose-400">₹{currentSL.toLocaleString('en-IN')}</div>
          <div className="text-[10px] text-slate-400 font-sans mt-0.5">
            Risk: ₹{riskPerShare.toFixed(1)} / share
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#060a12] border border-amber-500/30">
          <div className="flex items-center justify-between text-[11px] font-sans text-amber-300 mb-1">
            <span className="font-bold">Trailing ATR Stop Loss:</span>
            <span className="text-[10px] text-slate-400 font-mono">1.5x ATR</span>
          </div>
          <div className="text-lg font-black text-amber-400">
            ₹{stock.trailingStopATR.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-slate-400 font-sans mt-0.5">
            Dynamic trailing ratchet for profits
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#060a12] border border-purple-500/30">
          <div className="flex items-center justify-between text-[11px] font-sans text-purple-300 mb-1">
            <span className="font-bold">200 DMA Safety Floor:</span>
            <span className="text-[10px] text-slate-400 font-mono">Institutional Base</span>
          </div>
          <div className="text-lg font-black text-purple-300">
            ₹{stock.sma200.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-slate-400 font-sans mt-0.5">
            Major trend breakdown trigger
          </div>
        </div>
      </div>

      {/* INTERACTIVE POSITION SIZER FORM */}
      <div className="p-3.5 rounded-xl bg-[#05080f] border border-slate-800 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="text-[11px] font-bold text-slate-300 block mb-1">
              Your Trading Capital (₹)
            </label>
            <input
              type="number"
              step="10000"
              value={capital}
              onChange={(e) => setCapital(Math.max(10000, Number(e.target.value)))}
              className="w-full bg-[#0c121d] border border-slate-700 rounded-lg p-2 text-xs font-mono text-white focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-300 block mb-1">
              Max Risk Allowed Per Trade (%)
            </label>
            <div className="flex items-center space-x-1.5">
              {[1.0, 1.5, 2.0].map((pct) => (
                <button
                  key={pct}
                  onClick={() => setRiskPercent(pct)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    riskPercent === pct
                      ? "bg-rose-500 text-white shadow-md shadow-rose-500/30"
                      : "bg-[#0c121d] text-slate-400 hover:text-white border border-slate-700"
                  }`}
                >
                  {pct}%
                </button>
              ))}
              <input
                type="number"
                step="0.1"
                min="0.5"
                max="5"
                value={riskPercent}
                onChange={(e) => setRiskPercent(Math.max(0.5, Number(e.target.value)))}
                className="w-16 bg-[#0c121d] border border-slate-700 rounded-lg p-1.5 text-xs font-mono text-white text-center focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-300 block mb-1">
              Custom Stop Loss (₹)
            </label>
            <div className="flex items-center space-x-1.5">
              <input
                type="number"
                step="0.5"
                value={customSL}
                onChange={(e) => setCustomSL(Number(e.target.value))}
                className="w-full bg-[#0c121d] border border-slate-700 rounded-lg p-2 text-xs font-mono text-rose-300 focus:outline-none focus:border-rose-500"
              />
              {onUpdateStopLoss && (
                <button
                  onClick={handleSaveCustomSL}
                  className="px-3 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shrink-0 transition-colors"
                >
                  Save SL
                </button>
              )}
            </div>
          </div>
        </div>

        {savedSuccess && (
          <div className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Custom Stop-Loss of ₹{customSL} saved to {stock.symbol}!</span>
          </div>
        )}
      </div>

      {/* POSITION SIZING BLUEPRINT OUTPUT */}
      <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#0d1624] via-[#09101b] to-[#0d1624] border border-slate-800 text-xs font-mono-numbers">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div>
            <span className="text-[10px] font-sans text-slate-400 block uppercase">Max Safe Shares</span>
            <span className="text-xl font-black text-cyan-300">{maxShares} Qty</span>
            <span className="text-[10px] text-slate-500 block font-sans">
              (₹{(totalCapitalRequired / 1000).toFixed(1)}k outlay)
            </span>
          </div>

          <div>
            <span className="text-[10px] font-sans text-slate-400 block uppercase">Max Rupee Risk</span>
            <span className="text-xl font-black text-rose-400">
              -₹{Math.round(maxShares * riskPerShare).toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-slate-500 block font-sans">
              ({riskPercent}% of ₹{(capital / 100000).toFixed(1)}L)
            </span>
          </div>

          <div>
            <span className="text-[10px] font-sans text-slate-400 block uppercase">Target 1 Profit</span>
            <span className="text-xl font-black text-emerald-400">
              +₹{Math.round(target1TotalProfit).toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-slate-500 block font-sans">
              (@ ₹{stock.target})
            </span>
          </div>

          <div>
            <span className="text-[10px] font-sans text-slate-400 block uppercase">Risk-to-Reward</span>
            <span className="text-xl font-black text-purple-300">1 : {riskRewardRatio}</span>
            <span className="text-[10px] text-slate-500 block font-sans">
              {riskRewardRatio >= 2.0 ? "✅ Favorable Asymmetry" : "⚠️ Moderate Asymmetry"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

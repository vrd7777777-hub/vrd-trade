import React, { useState } from 'react';
import { Stock } from '../types/trading';
import {
  X,
  Timer,
  TrendingUp,
  Activity,
  CheckCircle2,
  ShieldCheck,
  Calendar,
  Layers,
  Sparkles,
  Info,
  FileSpreadsheet,
  Building2,
  Coins,
  Percent,
  Landmark
} from 'lucide-react';
import { MarketMojoScorecard } from './MarketMojoScorecard';
import { StopLossRiskCalculator } from './StopLossRiskCalculator';

interface StockModalProps {
  stock: Stock | null;
  onClose: () => void;
  onOpenHoldEngine: (stock: Stock) => void;
  onOpenFinancials?: (stock: Stock) => void;
  onUpdateStopLoss?: (symbol: string, newStopLoss: number) => void;
}

export const StockModal: React.FC<StockModalProps> = ({
  stock,
  onClose,
  onOpenHoldEngine,
  onOpenFinancials,
  onUpdateStopLoss,
}) => {
  const [showEMA, setShowEMA] = useState(true);
  const [showSMA, setShowSMA] = useState(true);
  const [showBands, setShowBands] = useState(true);

  if (!stock) return null;

  // Render SVG Chart for Historical Prices & Volatility Bands
  const history = stock.historicalPrices || [];
  const prices = history.map((h) => h.price);
  const minPrice = Math.min(...prices, stock.stoploss) * 0.96;
  const maxPrice = Math.max(...prices, stock.target) * 1.04;
  const range = maxPrice - minPrice || 1;

  const svgWidth = 600;
  const svgHeight = 220;
  const padding = { top: 20, right: 30, bottom: 30, left: 50 };
  const chartWidth = svgWidth - padding.left - padding.right;
  const chartHeight = svgHeight - padding.top - padding.bottom;

  const getY = (val: number) => {
    return padding.top + chartHeight - ((val - minPrice) / range) * chartHeight;
  };

  const getX = (index: number) => {
    return padding.left + (index / (history.length - 1 || 1)) * chartWidth;
  };

  const pricePath = history
    .map((h, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(h.price)}`)
    .join(' ');

  const emaPath = history
    .map((h, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(h.ema50)}`)
    .join(' ');

  const smaPath = history
    .map((h, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(h.sma200)}`)
    .join(' ');

  const bandAreaPath =
    history
      .map((h, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(h.upperBand)}`)
      .join(' ') +
    ' ' +
    [...history]
      .reverse()
      .map((h, i) => `L ${getX(history.length - 1 - i)} ${getY(h.lowerBand)}`)
      .join(' ') +
    ' Z';

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-[#0c121d] border border-slate-700 max-w-4xl w-full rounded-2xl p-6 shadow-2xl relative my-6 max-h-[92vh] overflow-y-auto space-y-5">
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pr-10 gap-3 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2.5">
              <h2 className="text-2xl font-black text-white">{stock.symbol}</h2>
              <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded">
                NSE: {stock.sector}
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-0.5">{stock.name}</p>
          </div>

          <div className="flex items-center space-x-3">
            <span
              className={`px-4 py-1.5 rounded-full text-xs font-black tracking-wider ${
                stock.action === "BUY"
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                  : stock.action === "SELL"
                  ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                  : "bg-amber-500/20 text-amber-400 border border-amber-500/40"
              }`}
            >
              {stock.action} • {stock.conviction}% Conviction
            </span>
          </div>
        </div>

        {/* MARKET MOJO 4-PILLAR SCORECARD BANNER */}
        <MarketMojoScorecard stock={stock} />

        {/* INTERACTIVE PRICE & VOLATILITY CHART */}
        <div className="p-4 rounded-xl bg-[#070b12] border border-slate-800/90">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-white">Price, Volatility Bands & Hold Zone</span>
              <span className="text-[10px] text-slate-400 font-mono">(Last 60 Trading Days)</span>
            </div>

            <div className="flex items-center space-x-2 text-[11px]">
              <button
                onClick={() => setShowBands(!showBands)}
                className={`px-2 py-0.5 rounded font-mono transition-all ${
                  showBands ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" : "bg-slate-800 text-slate-500"
                }`}
              >
                Vol Bands
              </button>
              <button
                onClick={() => setShowEMA(!showEMA)}
                className={`px-2 py-0.5 rounded font-mono transition-all ${
                  showEMA ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" : "bg-slate-800 text-slate-500"
                }`}
              >
                50 EMA
              </button>
              <button
                onClick={() => setShowSMA(!showSMA)}
                className={`px-2 py-0.5 rounded font-mono transition-all ${
                  showSMA ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" : "bg-slate-800 text-slate-500"
                }`}
              >
                200 SMA
              </button>
            </div>
          </div>

          {/* SVG Canvas */}
          <div className="w-full overflow-x-auto">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-48 select-none">
              <defs>
                <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.02" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
                const y = padding.top + chartHeight * pct;
                const priceLevel = Math.round(maxPrice - pct * range);
                return (
                  <g key={idx}>
                    <line
                      x1={padding.left}
                      y1={y}
                      x2={svgWidth - padding.right}
                      y2={y}
                      stroke="#1e293b"
                      strokeDasharray="3 3"
                    />
                    <text x={padding.left - 6} y={y + 3} fill="#64748b" fontSize="9" textAnchor="end" fontFamily="JetBrains Mono">
                      ₹{priceLevel}
                    </text>
                  </g>
                );
              })}

              {/* Target Line */}
              <line
                x1={padding.left}
                y1={getY(stock.target)}
                x2={svgWidth - padding.right}
                y2={getY(stock.target)}
                stroke="#10b981"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <text x={svgWidth - padding.right - 5} y={getY(stock.target) - 4} fill="#10b981" fontSize="9" textAnchor="end" fontFamily="JetBrains Mono" fontWeight="bold">
                Target ₹{stock.target}
              </text>

              {/* Stop Loss Line */}
              <line
                x1={padding.left}
                y1={getY(stock.stoploss)}
                x2={svgWidth - padding.right}
                y2={getY(stock.stoploss)}
                stroke="#f43f5e"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <text x={svgWidth - padding.right - 5} y={getY(stock.stoploss) + 11} fill="#f43f5e" fontSize="9" textAnchor="end" fontFamily="JetBrains Mono" fontWeight="bold">
                Stop ₹{stock.stoploss}
              </text>

              {/* Volatility Bands Area */}
              {showBands && (
                <path d={bandAreaPath} fill="url(#volGrad)" stroke="#06b6d4" strokeWidth="0.8" strokeOpacity="0.4" />
              )}

              {/* 200 SMA */}
              {showSMA && (
                <path d={smaPath} fill="none" stroke="#a855f7" strokeWidth="1.5" strokeOpacity="0.8" />
              )}

              {/* 50 EMA */}
              {showEMA && (
                <path d={emaPath} fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeOpacity="0.9" />
              )}

              {/* Price Line */}
              <path d={pricePath} fill="none" stroke="#38bdf8" strokeWidth="2.5" />

              {/* Current Price Point */}
              <circle
                cx={getX(history.length - 1)}
                cy={getY(stock.cmp)}
                r="4.5"
                fill="#38bdf8"
                className="animate-ping"
              />
              <circle
                cx={getX(history.length - 1)}
                cy={getY(stock.cmp)}
                r="3.5"
                fill="#0284c7"
              />
            </svg>
          </div>
        </div>

        {/* OPTIMAL HOLD-ON PERIOD DETAIL BAR */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-[#091524] to-[#07101b] border border-cyan-500/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-1">
              <Timer className="w-4 h-4 text-cyan-400" />
              <span>Optimal Hold-On Horizon: {stock.optimalHoldingDays} Trading Days</span>
            </div>
            <p className="text-xs text-slate-300">
              Holding Window: <strong className="text-white">{stock.holdingWindowLabel}</strong> • Target Exit Window: <strong className="text-cyan-300">{stock.optimalExitDate}</strong>
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-right font-mono-numbers">
              <span className="text-[10px] text-slate-400 block font-sans">Target Return</span>
              <span className="text-base font-black text-emerald-400">+{stock.expectedHoldingReturn}%</span>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenHoldEngine(stock);
              }}
              className="px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-colors"
            >
              Simulate Volatility Curve
            </button>
          </div>
        </div>

        {/* STOP-LOSS & RISK MANAGEMENT CALCULATOR */}
        <StopLossRiskCalculator stock={stock} onUpdateStopLoss={onUpdateStopLoss} />

        {/* FUNDAMENTAL BALANCE SHEET & CASH INFLOW SNAPSHOT */}
        <div className="p-4 rounded-xl bg-[#070b12] border border-slate-800 font-mono-numbers">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-sans flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span>Audited Balance Sheet & Cash Inflow Snapshot</span>
            </h4>
            {onOpenFinancials && (
              <button
                onClick={() => {
                  onClose();
                  onOpenFinancials(stock);
                }}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-sans font-bold flex items-center gap-1"
              >
                <span>Full Statements</span>
                <FileSpreadsheet className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-2.5 rounded-lg bg-[#090f19] border border-slate-800">
              <span className="text-slate-500 block text-[10px] font-sans">Net Worth</span>
              <strong className="text-slate-100">₹{stock.balanceSheet.netWorth.toLocaleString('en-IN')} Cr</strong>
            </div>
            <div className="p-2.5 rounded-lg bg-[#090f19] border border-slate-800">
              <span className="text-slate-500 block text-[10px] font-sans">Total Debt</span>
              <strong className="text-slate-200">₹{stock.balanceSheet.totalDebt.toLocaleString('en-IN')} Cr</strong>
            </div>
            <div className="p-2.5 rounded-lg bg-[#090f19] border border-slate-800">
              <span className="text-slate-500 block text-[10px] font-sans">Operating Cash Flow</span>
              <strong className="text-emerald-400">₹{stock.cashFlow.operatingCashFlow.toLocaleString('en-IN')} Cr</strong>
            </div>
            <div className="p-2.5 rounded-lg bg-[#090f19] border border-slate-800">
              <span className="text-slate-500 block text-[10px] font-sans">Free Cash Flow (FCF)</span>
              <strong className="text-cyan-300">₹{stock.cashFlow.freeCashFlow.toLocaleString('en-IN')} Cr</strong>
            </div>
          </div>
        </div>

        {/* VALUATION & P/E RATIOS BREAKDOWN */}
        <div className="p-4 rounded-xl bg-[#070b12] border border-slate-800 font-mono-numbers">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 font-sans flex items-center gap-1.5">
            <Percent className="w-4 h-4 text-cyan-400" />
            <span>Valuation & Multiples vs Historical Averages</span>
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            <div>
              <span className="text-slate-500 block text-[10px] font-sans">P/E Ratio</span>
              <strong className="text-slate-200">{stock.pe}x</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] font-sans">5-Yr Avg P/E</span>
              <strong className="text-slate-200">{stock.historical5YrPE}x</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] font-sans">P/E Discount</span>
              <strong className={stock.peDiscountPercent > 0 ? "text-emerald-400" : "text-amber-400"}>
                {stock.peDiscountPercent > 0 ? `+${stock.peDiscountPercent}% disc` : `${stock.peDiscountPercent}% prem`}
              </strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] font-sans">Price / Book</span>
              <strong className="text-slate-200">{stock.pb}x</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] font-sans">ROCE %</span>
              <strong className="text-emerald-400">{stock.roce}%</strong>
            </div>
          </div>
        </div>

        {/* GOVERNMENT & BUDGET ANNOUNCEMENT IMPACT */}
        <div className="p-4 rounded-xl bg-[#09111c] border border-cyan-500/30 text-xs font-sans">
          <div className="flex items-center space-x-2 text-cyan-300 font-bold mb-1">
            <Landmark className="w-4 h-4 text-cyan-400" />
            <span>Union Budget & Policy Impact:</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            {stock.policyImpact.budgetImpact} {stock.policyImpact.pliScheme}
          </p>
        </div>

        {/* COMPREHENSIVE CATALYSTS */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2 flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Exhaustive AI Signal Rationales:</span>
          </h4>
          <div className="space-y-2">
            {stock.catalysts.map((cat, i) => (
              <div
                key={i}
                className="p-2.5 rounded-lg bg-[#070b12] border border-slate-800/80 text-xs text-slate-300 flex items-start space-x-2"
              >
                <span className="text-cyan-400 font-bold">#{i + 1}</span>
                <span>{cat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold"
          >
            Close Terminal View
          </button>
        </div>
      </div>
    </div>
  );
};

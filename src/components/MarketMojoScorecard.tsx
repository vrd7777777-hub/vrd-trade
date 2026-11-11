import React from 'react';
import { Stock, MojoQuality, MojoValuation, MojoFinancialTrend, MojoTechnicalTrend } from '../types/trading';
import { ShieldCheck, Award, TrendingUp, Activity, BarChart2, CheckCircle2, AlertTriangle } from 'lucide-react';

interface MarketMojoScorecardProps {
  stock: Stock;
  compact?: boolean;
}

export const MarketMojoScorecard: React.FC<MarketMojoScorecardProps> = ({ stock, compact = false }) => {
  const getQualityBadge = (quality: MojoQuality) => {
    switch (quality) {
      case "EXCELLENT":
        return { label: "Excellent", bg: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40" };
      case "GOOD":
        return { label: "Good", bg: "bg-teal-500/20 text-teal-400 border-teal-500/40" };
      case "AVERAGE":
        return { label: "Average", bg: "bg-amber-500/20 text-amber-400 border-amber-500/40" };
      default:
        return { label: "Below Average", bg: "bg-rose-500/20 text-rose-400 border-rose-500/40" };
    }
  };

  const getValuationBadge = (val: MojoValuation) => {
    switch (val) {
      case "VERY_ATTRACTIVE":
        return { label: "Very Attractive", bg: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40" };
      case "ATTRACTIVE":
        return { label: "Attractive", bg: "bg-teal-500/20 text-teal-400 border-teal-500/40" };
      case "FAIR":
        return { label: "Fair", bg: "bg-cyan-500/20 text-cyan-400 border-cyan-500/40" };
      case "EXPENSIVE":
        return { label: "Expensive", bg: "bg-amber-500/20 text-amber-400 border-amber-500/40" };
      default:
        return { label: "Very Expensive", bg: "bg-rose-500/20 text-rose-400 border-rose-500/40" };
    }
  };

  const getFinancialTrendBadge = (trend: MojoFinancialTrend) => {
    switch (trend) {
      case "OUTSTANDING":
        return { label: "Outstanding", bg: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40" };
      case "POSITIVE":
        return { label: "Positive", bg: "bg-teal-500/20 text-teal-400 border-teal-500/40" };
      case "FLAT":
        return { label: "Flat", bg: "bg-amber-500/20 text-amber-400 border-amber-500/40" };
      case "NEGATIVE":
        return { label: "Negative", bg: "bg-rose-500/20 text-rose-400 border-rose-500/40" };
      default:
        return { label: "Very Negative", bg: "bg-red-600/20 text-red-400 border-red-500/40" };
    }
  };

  const getTechnicalTrendBadge = (tech: MojoTechnicalTrend) => {
    switch (tech) {
      case "BULLISH":
        return { label: "Bullish", bg: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40" };
      case "MILDLY_BULLISH":
        return { label: "Mildly Bullish", bg: "bg-teal-500/20 text-teal-400 border-teal-500/40" };
      case "SIDEWAYS":
        return { label: "Sideways", bg: "bg-amber-500/20 text-amber-400 border-amber-500/40" };
      case "MILDLY_BEARISH":
        return { label: "Mildly Bearish", bg: "bg-rose-500/20 text-rose-400 border-rose-500/40" };
      default:
        return { label: "Bearish", bg: "bg-red-600/20 text-red-400 border-red-500/40" };
    }
  };

  const qBadge = getQualityBadge(stock.quality);
  const vBadge = getValuationBadge(stock.valuation);
  const fBadge = getFinancialTrendBadge(stock.financialTrend);
  const tBadge = getTechnicalTrendBadge(stock.technicalTrend);

  if (compact) {
    return (
      <div className="flex items-center justify-between p-2 rounded-xl bg-[#090f19] border border-slate-800/90 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-mono font-black text-emerald-400 text-xs">
            {stock.mojoScore}
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-mono">MOJO SCORE</span>
            <span className="text-xs font-bold text-white">{stock.mojoRating}</span>
          </div>
        </div>

        {/* 4 Mini Badges */}
        <div className="grid grid-cols-4 gap-1 text-[9px] font-mono font-bold text-center">
          <div className={`px-1.5 py-0.5 rounded border ${qBadge.bg}`}>
            <span className="block text-[8px] text-slate-400 font-sans">QUAL</span>
            <span>{qBadge.label.split(' ')[0]}</span>
          </div>
          <div className={`px-1.5 py-0.5 rounded border ${vBadge.bg}`}>
            <span className="block text-[8px] text-slate-400 font-sans">VAL</span>
            <span>{vBadge.label.split(' ')[0]}</span>
          </div>
          <div className={`px-1.5 py-0.5 rounded border ${fBadge.bg}`}>
            <span className="block text-[8px] text-slate-400 font-sans">FIN</span>
            <span>{fBadge.label.split(' ')[0]}</span>
          </div>
          <div className={`px-1.5 py-0.5 rounded border ${tBadge.bg}`}>
            <span className="block text-[8px] text-slate-400 font-sans">TECH</span>
            <span>{tBadge.label.split(' ')[0]}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-xl bg-gradient-to-r from-[#09111e] via-[#070e1a] to-[#09111e] border border-cyan-500/30">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-slate-800 gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center text-slate-950 font-black font-mono text-xl shadow-lg shadow-emerald-500/20">
            {stock.mojoScore}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-black text-white uppercase tracking-wider">Market Mojo Rating:</span>
              <span className="text-xs font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-mono">
                {stock.mojoRating}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Score: <strong>{stock.mojoScore}/100</strong> • Multi-factor fundamental & technical composite
            </p>
          </div>
        </div>

        <div className="text-[11px] text-cyan-300 font-mono bg-cyan-500/10 px-3 py-1 rounded-lg border border-cyan-500/20">
          NSE: 4-Pillar Algorithmic Audit
        </div>
      </div>

      {/* 4 Pillars Details */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3.5">
        {/* Quality */}
        <div className="p-2.5 rounded-lg bg-[#070b12] border border-slate-800">
          <span className="text-[10px] text-slate-400 font-mono uppercase block mb-1">1. Quality</span>
          <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold border ${qBadge.bg}`}>
            {qBadge.label}
          </span>
          <p className="text-[10px] text-slate-400 mt-1.5 leading-snug line-clamp-2">
            {stock.qualitySummary}
          </p>
        </div>

        {/* Valuation */}
        <div className="p-2.5 rounded-lg bg-[#070b12] border border-slate-800">
          <span className="text-[10px] text-slate-400 font-mono uppercase block mb-1">2. Valuation</span>
          <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold border ${vBadge.bg}`}>
            {vBadge.label}
          </span>
          <p className="text-[10px] text-slate-400 mt-1.5 leading-snug line-clamp-2">
            {stock.valuationSummary}
          </p>
        </div>

        {/* Financial Trend */}
        <div className="p-2.5 rounded-lg bg-[#070b12] border border-slate-800">
          <span className="text-[10px] text-slate-400 font-mono uppercase block mb-1">3. Financial Trend</span>
          <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold border ${fBadge.bg}`}>
            {fBadge.label}
          </span>
          <p className="text-[10px] text-slate-400 mt-1.5 leading-snug line-clamp-2">
            {stock.financialTrendSummary}
          </p>
        </div>

        {/* Technical Trend */}
        <div className="p-2.5 rounded-lg bg-[#070b12] border border-slate-800">
          <span className="text-[10px] text-slate-400 font-mono uppercase block mb-1">4. Technical Trend</span>
          <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold border ${tBadge.bg}`}>
            {tBadge.label}
          </span>
          <p className="text-[10px] text-slate-400 mt-1.5 leading-snug line-clamp-2">
            {stock.technicalTrendSummary}
          </p>
        </div>
      </div>
    </div>
  );
};

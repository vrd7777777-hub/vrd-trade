import React, { useState } from 'react';
import { Stock } from '../types/trading';
import { Database, Cpu, History, CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react';

interface FundamentalInjectorProps {
  stocks: Stock[];
  onAddFundamental: (symbol: string, metric: string, value: string, sentiment: "BULLISH" | "BEARISH") => void;
}

export const FundamentalInjector: React.FC<FundamentalInjectorProps> = ({
  stocks,
  onAddFundamental,
}) => {
  const [targetSymbol, setTargetSymbol] = useState<string>("RELIANCE");
  const [metricName, setMetricName] = useState<string>("");
  const [metricValue, setMetricValue] = useState<string>("");
  const [sentiment, setSentiment] = useState<"BULLISH" | "BEARISH">("BULLISH");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!metricName.trim() || !metricValue.trim()) return;
    onAddFundamental(targetSymbol, metricName, metricValue, sentiment);
    setMetricName("");
    setMetricValue("");
  };

  const allInjectedNotes = stocks.flatMap((s) =>
    s.customNotes.map((n) => ({ ...n, symbol: s.symbol }))
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* INJECTOR FORM */}
      <div className="bg-[#0c121d] border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2.5 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Live Fundamental & Event Injector</h2>
            <p className="text-xs text-slate-400">
              Have fresh quarterly earnings, block deal data, or order wins? Inject them directly to recalculate AI signals, targets, and optimal holding periods.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Target Stock */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Target Indian Stock
              </label>
              <select
                value={targetSymbol}
                onChange={(e) => setTargetSymbol(e.target.value)}
                className="w-full bg-[#070b12] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-200 focus:outline-none focus:border-cyan-400"
              >
                {stocks.map((s) => (
                  <option key={s.id} value={s.symbol}>
                    {s.symbol} — {s.name} ({s.sector})
                  </option>
                ))}
              </select>
            </div>

            {/* Metric Impact */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Metric Sentiment Impact
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSentiment("BULLISH")}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center space-x-1.5 ${
                    sentiment === "BULLISH"
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-md shadow-emerald-500/10"
                      : "bg-[#070b12] text-slate-400 border-slate-700"
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Bullish Catalyst</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSentiment("BEARISH")}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center space-x-1.5 ${
                    sentiment === "BEARISH"
                      ? "bg-rose-500/20 text-rose-400 border-rose-500/50 shadow-md shadow-rose-500/10"
                      : "bg-[#070b12] text-slate-400 border-slate-700"
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Bearish Headwind</span>
                </button>
              </div>
            </div>
          </div>

          {/* Metric Name */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Fundamental Event / Indicator Name
            </label>
            <input
              type="text"
              placeholder="e.g. Q3 PAT Net Profit Jump, Order Book Win from Defense Ministry, Promoter Pledge Cut"
              value={metricName}
              onChange={(e) => setMetricName(e.target.value)}
              className="w-full bg-[#070b12] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Metric Value Details */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Quantitative Value or Contextual Detail
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Consolidated Net Profit +32% YoY to ₹3,400 Cr; EBITDA margins expanded by 210 bps; debt reduction of ₹1,500 Cr."
              value={metricValue}
              onChange={(e) => setMetricValue(e.target.value)}
              className="w-full bg-[#070b12] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 via-teal-500 to-emerald-500 hover:opacity-95 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center space-x-2"
          >
            <Cpu className="w-4 h-4" />
            <span>Inject Metric & Recompute VRD AI Signal</span>
          </button>
        </form>
      </div>

      {/* RECENTLY INJECTED SIGNALS LOG */}
      <div className="bg-[#0c121d] border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center space-x-2">
          <History className="w-4 h-4 text-emerald-400" />
          <span>Recently Injected Proprietary Signals</span>
        </h3>

        <div className="space-y-3">
          {allInjectedNotes.length === 0 ? (
            <p className="text-xs text-slate-500 italic py-6 text-center">
              No custom user fundamentals injected yet. Add one above to recalibrate predictions!
            </p>
          ) : (
            allInjectedNotes.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-[#070b12] border border-slate-800 flex items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-xs text-white">{item.symbol}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        item.sentiment === "BULLISH"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-rose-500/20 text-rose-400"
                      }`}
                    >
                      {item.sentiment}
                    </span>
                    <span className="text-[10px] text-slate-500">{item.date}</span>
                  </div>
                  <p className="text-xs text-slate-300 font-semibold mt-1">{item.metric}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{item.value}</p>
                </div>
                <span className="text-[11px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2.5 py-1 rounded-lg shrink-0">
                  Applied
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { Stock, StockAction, HoldingHorizon, VolatilityRegime } from '../types/trading';
import {
  Search,
  Timer,
  TrendingUp,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  Flame,
  ArrowUpRight,
  ArrowDownRight,
  SlidersHorizontal,
  Compass,
  CheckCircle2,
  Calendar,
  FileSpreadsheet,
  PlusCircle,
  Zap
} from 'lucide-react';
import { MarketMojoScorecard } from './MarketMojoScorecard';

interface StockRadarProps {
  stocks: Stock[];
  onSelectStock: (stock: Stock) => void;
  onOpenHoldEngineForStock: (stock: Stock) => void;
  onOpenFinancialsForStock: (stock: Stock) => void;
  onAddDynamicStock?: (symbol: string) => void;
}

export const StockRadar: React.FC<StockRadarProps> = ({
  stocks,
  onSelectStock,
  onOpenHoldEngineForStock,
  onOpenFinancialsForStock,
  onAddDynamicStock,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterAction, setFilterAction] = useState<StockAction | "ALL">("ALL");
  const [filterHorizon, setFilterHorizon] = useState<HoldingHorizon | "ALL">("ALL");
  const [filterRegime, setFilterRegime] = useState<VolatilityRegime | "ALL">("ALL");
  const [filterMojoRating, setFilterMojoRating] = useState<string>("ALL");
  const [selectedSector, setSelectedSector] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"conviction" | "mojoScore" | "return" | "holdingDays" | "volatility">("mojoScore");

  const sectorsList = [
    "ALL",
    "Banking",
    "Energy",
    "Retail",
    "Defense",
    "Automotive",
    "Power",
    "Technology",
    "Metals",
    "Infrastructure",
  ];

  const filteredStocks = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return stocks
      .filter((stock) => {
        const matchesAction = filterAction === "ALL" || stock.action === filterAction;
        const matchesHorizon = filterHorizon === "ALL" || stock.holdingHorizon === filterHorizon;
        const matchesRegime = filterRegime === "ALL" || stock.volatilityRegime === filterRegime;
        const matchesMojo = filterMojoRating === "ALL" || stock.mojoRating === filterMojoRating;
        const matchesSector =
          selectedSector === "ALL" ||
          stock.sector.toLowerCase().includes(selectedSector.toLowerCase());

        const matchesSearch =
          q === "" ||
          stock.symbol.toLowerCase().includes(q) ||
          stock.name.toLowerCase().includes(q) ||
          stock.sector.toLowerCase().includes(q) ||
          stock.catalysts.some((c) => c.toLowerCase().includes(q));

        return matchesAction && matchesHorizon && matchesRegime && matchesMojo && matchesSector && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "mojoScore") return b.mojoScore - a.mojoScore;
        if (sortBy === "conviction") return b.conviction - a.conviction;
        if (sortBy === "return") return b.expectedHoldingReturn - a.expectedHoldingReturn;
        if (sortBy === "holdingDays") return a.optimalHoldingDays - b.optimalHoldingDays;
        if (sortBy === "volatility") return a.hv30 - b.hv30;
        return 0;
      });
  }, [stocks, filterAction, filterHorizon, filterRegime, filterMojoRating, selectedSector, searchQuery, sortBy]);

  return (
    <div className="space-y-6">
      {/* FILTER & DISCOVERY BAR */}
      <div className="bg-[#0c121d] p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full lg:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search ANY NSE Stock (e.g. RELIANCE, TATA, Auto, Banking)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#070b12] border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Action Filter */}
          <div className="flex items-center space-x-2 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0">
            <span className="text-xs text-slate-400 font-semibold whitespace-nowrap">Signal:</span>
            {(["ALL", "BUY", "HOLD", "SELL"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterAction(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filterAction === status
                    ? status === "BUY"
                      ? "bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20"
                      : status === "SELL"
                      ? "bg-rose-500 text-white font-black shadow-lg shadow-rose-500/20"
                      : status === "HOLD"
                      ? "bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20"
                      : "bg-slate-200 text-slate-900 font-black"
                    : "bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/50"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center space-x-2 w-full lg:w-auto justify-end">
            <span className="text-xs text-slate-400 font-semibold whitespace-nowrap">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#070b12] border border-slate-700/80 text-xs text-slate-300 rounded-xl px-3 py-1.5 focus:outline-none focus:border-emerald-500 font-medium"
            >
              <option value="mojoScore">Highest Market Mojo Score</option>
              <option value="conviction">Highest AI Conviction</option>
              <option value="return">Highest Expected Return %</option>
              <option value="holdingDays">Shortest Hold Duration</option>
              <option value="volatility">Lowest Volatility (Safe)</option>
            </select>
          </div>
        </div>

        {/* Dynamic Analyze Any Stock Action Bar */}
        {searchQuery.trim().length > 0 && onAddDynamicStock && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs">
            <div className="flex items-center space-x-2 text-cyan-300">
              <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Looking for <strong>"{searchQuery.trim().toUpperCase()}"</strong> on NSE?</span>
            </div>
            <button
              onClick={() => {
                onAddDynamicStock(searchQuery.trim().toUpperCase());
                setSearchQuery("");
              }}
              className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Instant Quant Analyze & Add "{searchQuery.trim().toUpperCase()}" to Watchlist</span>
            </button>
          </div>
        )}

        {/* Sector Filter Chips */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-slate-400 font-semibold text-[11px] whitespace-nowrap mr-1">Sector:</span>
          {sectorsList.map((sec) => (
            <button
              key={sec}
              onClick={() => setSelectedSector(sec)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all ${
                selectedSector === sec
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold"
                  : "bg-[#070b12] text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              {sec}
            </button>
          ))}
        </div>

        {/* Secondary Filter Chips: Market Mojo Rating, Holding Horizon & Volatility Regime */}
        <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-slate-400 flex items-center gap-1 font-semibold mr-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Mojo Rating:</span>
            </span>
            {["ALL", "STRONG BUY", "BUY", "HOLD", "STRONG SELL"].map((mr) => (
              <button
                key={mr}
                onClick={() => setFilterMojoRating(mr)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  filterMojoRating === mr
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    : "bg-slate-800/50 text-slate-400 hover:text-slate-200"
                }`}
              >
                {mr}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-slate-400 flex items-center gap-1 font-semibold mr-1">
              <Timer className="w-3.5 h-3.5 text-cyan-400" />
              <span>Hold Horizon:</span>
            </span>
            {[
              { id: "ALL", label: "All Horizons" },
              { id: "SWING", label: "Swing (15-35D)" },
              { id: "POSITIONAL", label: "Positional (35-75D)" },
              { id: "MEDIUM_TERM", label: "Medium (3-6M)" },
            ].map((hz) => (
              <button
                key={hz.id}
                onClick={() => setFilterHorizon(hz.id as any)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                  filterHorizon === hz.id
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                    : "bg-slate-800/50 text-slate-400 hover:text-slate-200"
                }`}
              >
                {hz.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* STOCKS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredStocks.map((stock) => {
          const actionColors = {
            BUY: {
              border: "border-emerald-500/30",
              badge: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40",
              text: "text-emerald-400",
              glow: "hover:border-emerald-500/60 shadow-emerald-500/5",
            },
            HOLD: {
              border: "border-amber-500/30",
              badge: "bg-amber-500/20 text-amber-400 border border-amber-500/40",
              text: "text-amber-400",
              glow: "hover:border-amber-500/60 shadow-amber-500/5",
            },
            SELL: {
              border: "border-rose-500/30",
              badge: "bg-rose-500/20 text-rose-400 border border-rose-500/40",
              text: "text-rose-400",
              glow: "hover:border-rose-500/60 shadow-rose-500/5",
            },
          }[stock.action];

          const upsidePercent = (((stock.target - stock.cmp) / stock.cmp) * 100).toFixed(1);

          return (
            <div
              key={stock.id}
              className={`bg-[#0d131f] border ${actionColors.border} ${actionColors.glow} rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 shadow-xl group`}
            >
              <div>
                {/* CARD HEADER */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-xl font-black text-white tracking-wide">{stock.symbol}</h3>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-800/90 px-2 py-0.5 rounded border border-slate-700/60">
                        NSE
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 truncate max-w-[200px] mt-0.5">{stock.name}</p>
                    <span className="text-[11px] text-cyan-400 font-medium inline-block mt-0.5">{stock.sector}</span>
                  </div>

                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-black tracking-wider ${actionColors.badge}`}>
                      {stock.action}
                    </span>
                    <div className="text-[11px] font-mono mt-1 text-slate-400">
                      Conviction: <span className="font-bold text-slate-200">{stock.conviction}%</span>
                    </div>
                  </div>
                </div>

                {/* MARKET MOJO 4-PILLAR MINI SCORECARD */}
                <div className="mt-3.5">
                  <MarketMojoScorecard stock={stock} compact={true} />
                </div>

                {/* OPTIMAL HOLD-ON PERIOD BANNER */}
                <div className="mt-3.5 p-3 rounded-xl bg-gradient-to-r from-[#09101c] via-[#0d182b] to-[#09101c] border border-cyan-500/30">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold text-cyan-300 flex items-center space-x-1.5">
                      <Timer className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Optimal Hold-On Period:</span>
                    </span>
                    <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      +{stock.expectedHoldingReturn}% Exp. Return
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between text-xs">
                    <div className="font-extrabold text-white flex items-center gap-1.5">
                      <span className="text-sm font-mono-numbers text-cyan-400">{stock.optimalHoldingDays} Days</span>
                      <span className="text-slate-400 text-[11px]">({stock.holdingWindowLabel})</span>
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      <span>Exit ~ {stock.optimalExitDate}</span>
                    </div>
                  </div>
                </div>

                {/* 3-COLUMN PRICE, STRICT STOP LOSS & TARGET SECTION */}
                <div className="mt-3.5 pt-3 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center font-mono-numbers">
                  {/* CMP */}
                  <div className="text-left">
                    <div className="text-[9px] uppercase tracking-wider text-slate-400 font-sans">CMP (INR)</div>
                    <div className="text-base sm:text-lg font-black text-white">₹{stock.cmp.toLocaleString('en-IN')}</div>
                    <div className={`text-[11px] font-semibold flex items-center gap-0.5 ${stock.change >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                      {stock.change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      <span>{stock.change >= 0 ? "+" : ""}{stock.change}%</span>
                    </div>
                  </div>

                  {/* STRICT STOP LOSS */}
                  <div className="bg-rose-950/30 border border-rose-500/30 rounded-xl p-1.5 flex flex-col justify-center">
                    <div className="text-[9px] uppercase tracking-wider text-rose-300 font-sans font-bold flex items-center justify-center gap-1">
                      <ShieldAlert className="w-2.5 h-2.5" />
                      <span>Stop Loss</span>
                    </div>
                    <div className="text-xs sm:text-sm font-black text-rose-400">₹{stock.stoploss.toLocaleString('en-IN')}</div>
                    <div className="text-[10px] text-rose-300/80">
                      -{((stock.cmp - stock.stoploss) / stock.cmp * 100).toFixed(1)}%
                    </div>
                  </div>

                  {/* TARGET 1 & UPSIDE */}
                  <div className="text-right">
                    <div className="text-[9px] uppercase tracking-wider text-slate-400 font-sans">AI Target 1</div>
                    <div className="text-xs sm:text-sm font-extrabold text-slate-100">₹{stock.target.toLocaleString('en-IN')}</div>
                    <div className={`text-[11px] font-semibold ${Number(upsidePercent) >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                      {Number(upsidePercent) >= 0 ? `+${upsidePercent}%` : `${upsidePercent}%`}
                    </div>
                  </div>
                </div>

                {/* FUNDAMENTAL METRIC PILL (ROCE, P/E DISCOUNT, CASH FLOW) */}
                <div className="grid grid-cols-3 gap-2 mt-3 p-2 rounded-xl bg-[#080d16] border border-slate-800/80 text-center font-mono-numbers text-[10px]">
                  <div>
                    <span className="text-[9px] text-slate-400 block font-sans">ROCE %</span>
                    <span className="font-bold text-emerald-400">{stock.roce}%</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block font-sans">P/E vs 5-YR</span>
                    <span className={`font-bold ${stock.peDiscountPercent > 0 ? "text-emerald-400" : "text-amber-400"}`}>
                      {stock.peDiscountPercent > 0 ? `${stock.peDiscountPercent}% disc` : `${Math.abs(stock.peDiscountPercent)}% prem`}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block font-sans">FREE CASH</span>
                    <span className="font-bold text-cyan-300">₹{(stock.cashFlow.freeCashFlow / 1000).toFixed(1)}k Cr</span>
                  </div>
                </div>

                {/* REASONS & CATALYSTS PREVIEW */}
                <div className="mt-3.5">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5 mb-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Algorithmic Rationale & Catalysts:</span>
                  </h4>
                  <ul className="space-y-1">
                    {stock.catalysts.slice(0, 2).map((reason, idx) => (
                      <li key={idx} className="text-xs text-slate-300 flex items-start space-x-1.5 leading-relaxed">
                        <span className="text-emerald-400 font-bold mt-0.5">•</span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* FOOTER ACTIONS */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-1.5">
                <button
                  onClick={() => onOpenFinancialsForStock(stock)}
                  className="px-2.5 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition-all flex items-center space-x-1"
                  title="View balance sheet, cash flows, and P&L statements"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Financials</span>
                </button>

                <button
                  onClick={() => onOpenHoldEngineForStock(stock)}
                  className="px-2.5 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/30 text-cyan-300 text-xs font-semibold transition-all flex items-center space-x-1"
                  title="Simulate volatility decay and optimal holding curve"
                >
                  <Timer className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Hold Simulator</span>
                </button>

                <button
                  onClick={() => onSelectStock(stock)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-200 text-xs font-bold transition-all flex items-center space-x-1 shadow-sm"
                >
                  <span>Audit</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredStocks.length === 0 && (
        <div className="p-12 text-center bg-[#0c121d] border border-slate-800 rounded-2xl">
          <p className="text-slate-400 text-sm">No stocks matching the selected criteria.</p>
          <button
            onClick={() => {
              setFilterAction("ALL");
              setFilterHorizon("ALL");
              setFilterRegime("ALL");
              setFilterMojoRating("ALL");
              setSearchQuery("");
            }}
            className="mt-3 px-4 py-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-xl text-xs font-bold"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
};

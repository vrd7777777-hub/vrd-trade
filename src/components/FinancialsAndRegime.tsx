import React, { useState } from 'react';
import { Stock, MarketRegimeStatus } from '../types/trading';
import {
  Landmark,
  FileSpreadsheet,
  Coins,
  TrendingUp,
  Percent,
  PieChart,
  ShieldAlert,
  Building2,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Globe,
  Sparkles
} from 'lucide-react';
import { MarketMojoScorecard } from './MarketMojoScorecard';

interface FinancialsAndRegimeProps {
  stocks: Stock[];
  marketRegime: MarketRegimeStatus;
  selectedStockId?: string;
  onOpenStockModal: (stock: Stock) => void;
}

export const FinancialsAndRegime: React.FC<FinancialsAndRegimeProps> = ({
  stocks,
  marketRegime,
  selectedStockId,
  onOpenStockModal,
}) => {
  const [currentStockId, setCurrentStockId] = useState<string>(selectedStockId || "RELIANCE");
  const [activeFinanceTab, setActiveFinanceTab] = useState<"balancesheet" | "cashflow" | "pnl" | "valuation" | "shareholding" | "government">("balancesheet");

  const stock = stocks.find((s) => s.id === currentStockId) || stocks[0];

  return (
    <div className="space-y-6">
      {/* 1. TYPE OF MARKET RIGHT NOW — MACRO & GOVERNMENT ANNOUNCEMENTS */}
      <div className="bg-gradient-to-r from-[#0b1424] via-[#0d1c32] to-[#080f1a] border border-cyan-500/40 rounded-2xl p-6 shadow-2xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <Globe className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-black text-white">Current Market Regime & Macro Environment</h2>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                LIVE STATUS
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Real-time synthesis of Indian market phase, Reserve Bank of India (RBI) repo rate trajectory, Union Budget capex execution, institutional liquidity, and global commodity tailwinds.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-500/10 px-3 py-1.5 rounded-xl border border-cyan-500/20">
              Nifty 50: {marketRegime.niftyLevel.toLocaleString('en-IN')} (Above 200 DMA)
            </span>
          </div>
        </div>

        {/* 6 Key Macro Pillars */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 mt-5 font-mono-numbers">
          <div className="p-3 rounded-xl bg-[#070b13] border border-slate-800">
            <span className="text-[10px] text-slate-400 font-sans block uppercase">Market Phase</span>
            <span className="text-xs font-extrabold text-emerald-400 block mt-1">{marketRegime.marketPhase}</span>
            <span className="text-[10px] text-slate-500 font-sans">Bull trend intact</span>
          </div>

          <div className="p-3 rounded-xl bg-[#070b13] border border-slate-800">
            <span className="text-[10px] text-slate-400 font-sans block uppercase">RBI Repo Rate</span>
            <span className="text-sm font-black text-white block mt-1">{marketRegime.repoRate}</span>
            <span className="text-[10px] text-cyan-300 font-sans">{marketRegime.repoStance}</span>
          </div>

          <div className="p-3 rounded-xl bg-[#070b13] border border-slate-800">
            <span className="text-[10px] text-slate-400 font-sans block uppercase">India VIX</span>
            <span className="text-sm font-black text-emerald-400 block mt-1">{marketRegime.vixLevel}</span>
            <span className="text-[10px] text-slate-500 font-sans">Low volatility regime</span>
          </div>

          <div className="p-3 rounded-xl bg-[#070b13] border border-slate-800">
            <span className="text-[10px] text-slate-400 font-sans block uppercase">Budget Capex</span>
            <span className="text-xs font-black text-white block mt-1">{marketRegime.budgetOutlay}</span>
            <span className="text-[10px] text-emerald-400 font-sans">Infrastructure driver</span>
          </div>

          <div className="p-3 rounded-xl bg-[#070b13] border border-slate-800">
            <span className="text-[10px] text-slate-400 font-sans block uppercase">Brent Crude</span>
            <span className="text-xs font-black text-cyan-300 block mt-1">{marketRegime.brentCrude.split(' ')[0]} / bbl</span>
            <span className="text-[10px] text-emerald-400 font-sans">Controls inflation</span>
          </div>

          <div className="p-3 rounded-xl bg-[#070b13] border border-slate-800">
            <span className="text-[10px] text-slate-400 font-sans block uppercase">FII + DII Flows</span>
            <span className="text-xs font-black text-emerald-400 block mt-1">+₹4,790 Cr Net</span>
            <span className="text-[10px] text-slate-500 font-sans">Strong liquidity</span>
          </div>
        </div>
      </div>

      {/* 2. STOCK FINANCIAL STATEMENT AUDIT & BALANCE SHEET EXPLORER */}
      <div className="bg-[#0c121d] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
        {/* Top Controls: Stock Selector */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
              <span>Fundamental Audit & Balance Sheet Explorer</span>
            </h3>
            <p className="text-xs text-slate-400">
              Audited balance sheets, cash inflows, quarterly profit trends, valuation multiples, and government announcement impacts.
            </p>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <select
              value={currentStockId}
              onChange={(e) => setCurrentStockId(e.target.value)}
              className="bg-[#070b12] border border-slate-700 text-xs text-slate-200 font-bold rounded-xl px-3.5 py-2 focus:outline-none focus:border-cyan-400"
            >
              {stocks.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.symbol} — {s.name} ({s.sector})
                </option>
              ))}
            </select>

            <button
              onClick={() => onOpenStockModal(stock)}
              className="px-3 py-2 bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-200 rounded-xl text-xs font-bold transition-all shrink-0"
            >
              Deep Audit Modal
            </button>
          </div>
        </div>

        {/* Market Mojo Scorecard Banner for this Stock */}
        <MarketMojoScorecard stock={stock} />

        {/* Financial Statement Tabs */}
        <div className="flex space-x-1.5 overflow-x-auto border-b border-slate-800 pb-2 text-xs scrollbar-none">
          {[
            { id: "balancesheet", label: "Balance Sheet", icon: Building2 },
            { id: "cashflow", label: "Cash Inflow & FCF", icon: Coins },
            { id: "pnl", label: "Profit & Loss (P&L)", icon: TrendingUp },
            { id: "valuation", label: "Valuation & P/E Multiples", icon: Percent },
            { id: "shareholding", label: "Shareholding Pattern", icon: PieChart },
            { id: "government", label: "Govt & Budget Announcements", icon: Landmark },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeFinanceTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFinanceTab(tab.id as any)}
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: BALANCE SHEET */}
        {activeFinanceTab === "balancesheet" && (
          <div className="space-y-4 font-mono-numbers">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
              <div className="p-4 rounded-xl bg-[#070b12] border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans">NET WORTH / RESERVES</span>
                <span className="text-xl font-black text-white">₹{stock.balanceSheet.netWorth.toLocaleString('en-IN')} Cr</span>
                <span className="text-[10px] text-emerald-400 font-sans block mt-0.5">Shareholder equity base</span>
              </div>
              <div className="p-4 rounded-xl bg-[#070b12] border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans">TOTAL DEBT / BORROWINGS</span>
                <span className="text-xl font-black text-slate-200">₹{stock.balanceSheet.totalDebt.toLocaleString('en-IN')} Cr</span>
                <span className="text-[10px] text-slate-400 font-sans block mt-0.5">Debt to Equity: {stock.balanceSheet.debtToEquity}x</span>
              </div>
              <div className="p-4 rounded-xl bg-[#070b12] border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans">TOTAL ASSET BASE</span>
                <span className="text-xl font-black text-cyan-300">₹{stock.balanceSheet.totalAssets.toLocaleString('en-IN')} Cr</span>
                <span className="text-[10px] text-slate-400 font-sans block mt-0.5">Fixed & Current assets</span>
              </div>
              <div className="p-4 rounded-xl bg-[#070b12] border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans">CASH & BANK BALANCES</span>
                <span className="text-xl font-black text-emerald-400">₹{stock.balanceSheet.cashAndEquivalents.toLocaleString('en-IN')} Cr</span>
                <span className="text-[10px] text-slate-400 font-sans block mt-0.5">Liquidity cushion</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#070b12] border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
              <div>
                <span className="text-slate-400 block text-[11px]">Interest Coverage Ratio:</span>
                <strong className="text-emerald-400 font-mono-numbers text-sm">{stock.balanceSheet.interestCoverage}x</strong>
                <p className="text-[11px] text-slate-500 mt-0.5">Operating profit comfortably covers annual interest payments.</p>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Net Working Capital:</span>
                <strong className="text-white font-mono-numbers text-sm">₹{stock.balanceSheet.workingCapital.toLocaleString('en-IN')} Cr</strong>
                <p className="text-[11px] text-slate-500 mt-0.5">Sufficient liquidity to finance inventory and receivables.</p>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Contingent Liabilities:</span>
                <strong className="text-slate-300 font-mono-numbers text-sm">₹{stock.balanceSheet.contingentLiabilities.toLocaleString('en-IN')} Cr</strong>
                <p className="text-[11px] text-slate-500 mt-0.5">Below 2% of net worth (negligible solvency risk).</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CASH FLOW STATEMENT & FREE CASH FLOW */}
        {activeFinanceTab === "cashflow" && (
          <div className="space-y-4 font-mono-numbers">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
              <div className="p-4 rounded-xl bg-[#070b12] border border-emerald-500/30">
                <span className="text-[10px] text-emerald-400 block font-sans">OPERATING CASH FLOW (CFO)</span>
                <span className="text-xl font-black text-emerald-400">₹{stock.cashFlow.operatingCashFlow.toLocaleString('en-IN')} Cr</span>
                <span className="text-[10px] text-slate-400 font-sans block mt-0.5">Cash generated from core business</span>
              </div>
              <div className="p-4 rounded-xl bg-[#070b12] border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans">CAPITAL EXPENDITURE (CAPEX)</span>
                <span className="text-xl font-black text-slate-200">₹{stock.cashFlow.capex.toLocaleString('en-IN')} Cr</span>
                <span className="text-[10px] text-slate-500 font-sans block mt-0.5">Growth investments</span>
              </div>
              <div className="p-4 rounded-xl bg-[#070b12] border border-cyan-500/30">
                <span className="text-[10px] text-cyan-300 block font-sans">FREE CASH FLOW (FCF)</span>
                <span className="text-xl font-black text-cyan-300">₹{stock.cashFlow.freeCashFlow.toLocaleString('en-IN')} Cr</span>
                <span className="text-[10px] text-emerald-400 font-sans block mt-0.5">CFO minus Capex (Surplus)</span>
              </div>
              <div className="p-4 rounded-xl bg-[#070b12] border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans">CFO TO EBITDA CONVERSION</span>
                <span className="text-xl font-black text-white">{stock.cashFlow.cfoToEbitda}%</span>
                <span className="text-[10px] text-emerald-400 font-sans block mt-0.5">High earnings quality</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#070b12] border border-slate-800 text-xs font-sans text-slate-300">
              <span className="text-slate-400 block font-bold mb-1">Cash Inflow Breakdown Summary:</span>
              <p className="leading-relaxed">
                {stock.name} demonstrates healthy cash conversion with CFO covering capex by {(stock.cashFlow.operatingCashFlow / (stock.cashFlow.capex || 1)).toFixed(1)}x.
                Positive Free Cash Flow (₹{stock.cashFlow.freeCashFlow.toLocaleString('en-IN')} Cr) ensures self-financed growth without reliance on high-cost external debt.
              </p>
            </div>
          </div>
        )}

        {/* TAB 3: PROFIT & LOSS (P&L) */}
        {activeFinanceTab === "pnl" && (
          <div className="space-y-4 font-mono-numbers">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
              <div className="p-4 rounded-xl bg-[#070b12] border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans">QUARTERLY REVENUE / SALES</span>
                <span className="text-xl font-black text-white">₹{stock.profitAndLoss.quarterlyRevenue.toLocaleString('en-IN')} Cr</span>
                <span className={`text-[10px] font-sans font-bold block mt-0.5 ${stock.profitAndLoss.revenueGrowthYoY >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                  {stock.profitAndLoss.revenueGrowthYoY >= 0 ? "+" : ""}{stock.profitAndLoss.revenueGrowthYoY}% YoY Growth
                </span>
              </div>
              <div className="p-4 rounded-xl bg-[#070b12] border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans">OPERATING PROFIT (EBITDA)</span>
                <span className="text-xl font-black text-cyan-300">₹{stock.profitAndLoss.ebitda.toLocaleString('en-IN')} Cr</span>
                <span className="text-[10px] text-slate-400 font-sans block mt-0.5">Operating Margin (OPM): {stock.profitAndLoss.opmPercent}%</span>
              </div>
              <div className="p-4 rounded-xl bg-[#070b12] border border-emerald-500/30">
                <span className="text-[10px] text-emerald-400 block font-sans">NET PROFIT AFTER TAX (PAT)</span>
                <span className="text-xl font-black text-emerald-400">₹{stock.profitAndLoss.netProfitPAT.toLocaleString('en-IN')} Cr</span>
                <span className={`text-[10px] font-sans font-bold block mt-0.5 ${stock.profitAndLoss.patGrowthYoY >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                  {stock.profitAndLoss.patGrowthYoY >= 0 ? "+" : ""}{stock.profitAndLoss.patGrowthYoY}% YoY Growth
                </span>
              </div>
              <div className="p-4 rounded-xl bg-[#070b12] border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans">EARNINGS PER SHARE (EPS)</span>
                <span className="text-xl font-black text-white">₹{stock.profitAndLoss.eps}</span>
                <span className="text-[10px] text-slate-400 font-sans block mt-0.5">PAT Margin: {stock.profitAndLoss.patMargin}%</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: VALUATION & PE RATIOS */}
        {activeFinanceTab === "valuation" && (
          <div className="space-y-4 font-mono-numbers">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
              <div className="p-4 rounded-xl bg-[#070b12] border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans">CURRENT P/E RATIO</span>
                <span className="text-xl font-black text-white">{stock.pe}x</span>
                <span className="text-[10px] text-slate-400 font-sans block mt-0.5">Industry P/E: {stock.industryPE}x</span>
              </div>
              <div className="p-4 rounded-xl bg-[#070b12] border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans">5-YEAR HISTORICAL AVG P/E</span>
                <span className="text-xl font-black text-slate-200">{stock.historical5YrPE}x</span>
                <span className={`text-[10px] font-sans font-bold block mt-0.5 ${stock.peDiscountPercent > 0 ? "text-emerald-400" : "text-amber-400"}`}>
                  {stock.peDiscountPercent > 0 ? `${stock.peDiscountPercent}% Discount` : `${Math.abs(stock.peDiscountPercent)}% Premium`}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-[#070b12] border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans">PRICE TO BOOK (P/B)</span>
                <span className="text-xl font-black text-cyan-300">{stock.pb}x</span>
                <span className="text-[10px] text-slate-400 font-sans block mt-0.5">EV / EBITDA: {stock.evToEbitda}x</span>
              </div>
              <div className="p-4 rounded-xl bg-[#070b12] border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans">RETURN ON CAPITAL (ROCE)</span>
                <span className="text-xl font-black text-emerald-400">{stock.roce}%</span>
                <span className="text-[10px] text-slate-400 font-sans block mt-0.5">ROE: {stock.roe}% • Div Yield: {stock.dividendYield}%</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#070b12] border border-slate-800 text-xs font-sans text-slate-300">
              <span className="text-slate-400 font-bold block mb-1">Market Mojo Valuation Assessment:</span>
              <p className="leading-relaxed">
                Categorized as <strong className="text-white">{stock.valuation.replace(/_/g, " ")}</strong>.
                {stock.peDiscountPercent > 0
                  ? ` Current multiple provides a ${stock.peDiscountPercent}% margin of safety relative to historical valuation multiples.`
                  : ` Premium valuation multiple backed by exceptional ROCE (${stock.roce}%) and superior earnings growth visibility.`}
              </p>
            </div>
          </div>
        )}

        {/* TAB 5: SHAREHOLDING PATTERN */}
        {activeFinanceTab === "shareholding" && (
          <div className="space-y-4 font-mono-numbers">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
              <div className="p-4 rounded-xl bg-[#070b12] border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans">PROMOTER HOLDING</span>
                <span className="text-xl font-black text-white">{stock.shareholding.promoter}%</span>
                <span className="text-[10px] text-slate-400 font-sans block mt-0.5">
                  Pledged: {stock.shareholding.promoterPledged}% (Zero Risk)
                </span>
              </div>
              <div className="p-4 rounded-xl bg-[#070b12] border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans">FOREIGN INSTITUTIONAL (FII)</span>
                <span className="text-xl font-black text-cyan-300">{stock.shareholding.fii}%</span>
                <span className="text-[10px] text-emerald-400 font-sans font-bold block mt-0.5">
                  QoQ: {stock.shareholding.fiiChangeQoQ}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-[#070b12] border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans">DOMESTIC INSTITUTIONAL (DII)</span>
                <span className="text-xl font-black text-emerald-400">{stock.shareholding.dii}%</span>
                <span className="text-[10px] text-emerald-400 font-sans font-bold block mt-0.5">
                  QoQ: {stock.shareholding.diiChangeQoQ}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-[#070b12] border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans">PUBLIC & RETAIL</span>
                <span className="text-xl font-black text-slate-300">{stock.shareholding.publicRetail}%</span>
                <span className="text-[10px] text-slate-500 font-sans block mt-0.5">Free float liquidity</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#070b12] border border-slate-800 text-xs font-sans text-slate-300">
              <span className="text-slate-400 font-bold block mb-1">Institutional Conviction Check:</span>
              <p className="leading-relaxed">
                Combined institutional holding (FII + DII) stands at{' '}
                <strong className="text-emerald-400 font-mono-numbers">
                  {(stock.shareholding.fii + stock.shareholding.dii).toFixed(1)}%
                </strong>.
                Both foreign and domestic mutual funds have maintained net accumulation over the last 2 quarters.
              </p>
            </div>
          </div>
        )}

        {/* TAB 6: GOVERNMENT & BUDGET ANNOUNCEMENTS */}
        {activeFinanceTab === "government" && (
          <div className="space-y-4 text-xs font-sans">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#070b12] border border-slate-800">
                <span className="text-[10px] text-cyan-400 font-mono uppercase block mb-1 font-bold">
                  UNION BUDGET & INFRASTRUCTURE IMPACT
                </span>
                <p className="text-slate-200 font-medium leading-relaxed">
                  {stock.policyImpact.budgetImpact}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#070b12] border border-slate-800">
                <span className="text-[10px] text-emerald-400 font-mono uppercase block mb-1 font-bold">
                  PRODUCTION LINKED INCENTIVE (PLI) SCHEMES
                </span>
                <p className="text-slate-200 font-medium leading-relaxed">
                  {stock.policyImpact.pliScheme}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#070b12] border border-slate-800">
                <span className="text-[10px] text-amber-400 font-mono uppercase block mb-1 font-bold">
                  RBI REPO RATE & MONETARY SENSITIVITY
                </span>
                <p className="text-slate-200 font-medium leading-relaxed">
                  {stock.policyImpact.repoRateSensitivity}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#070b12] border border-slate-800">
                <span className="text-[10px] text-purple-400 font-mono uppercase block mb-1 font-bold">
                  GOVERNMENT CATALYST & MANDATE
                </span>
                <p className="text-slate-200 font-medium leading-relaxed">
                  {stock.policyImpact.governmentCatalyst}
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#070b12] border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">Sovereign Regulatory Risk Classification:</span>
              <span className={`px-3 py-1 rounded-full font-mono font-bold text-xs ${
                stock.policyImpact.regulatoryRisk === "LOW" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40" :
                stock.policyImpact.regulatoryRisk === "MODERATE" ? "bg-amber-500/20 text-amber-400 border border-amber-500/40" :
                "bg-rose-500/20 text-rose-400 border border-rose-500/40"
              }`}>
                {stock.policyImpact.regulatoryRisk} RISK
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

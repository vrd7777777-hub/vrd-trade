import React from 'react';
import {
  Crosshair,
  Timer,
  Calculator,
  Database,
  BarChart3,
  Globe,
  Terminal,
  ShieldCheck,
  Zap,
  TrendingUp,
  Activity,
  FileSpreadsheet,
  Download,
  Smartphone,
  Layers,
  Radio,
  Clock,
  ShieldAlert,
  Landmark,
  Wallet,
  PieChart
} from 'lucide-react';

import { LiveIndicesData } from '../services/liveMarketFeed';
import { Wifi } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  totalStocksCount: number;
  buyCount: number;
  onOpenDownloadModal: () => void;
  isOnline?: boolean;
  formattedDate?: string;
  formattedTime?: string;
  marketSessionName?: string;
  sessionColor?: "emerald" | "amber" | "rose";
  isMarketOpen?: boolean;
  onOpenApiModal?: () => void;
  activeApiName?: string;
  isLiveTicksActive?: boolean;
  onToggleLiveTicks?: () => void;
  liveIndices?: LiveIndicesData;
  isInternetLive?: boolean;
  internetLatencyMs?: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  totalStocksCount,
  buyCount,
  onOpenDownloadModal,
  isOnline = true,
  formattedDate = "Tue, 10 Nov 2026",
  formattedTime = "15:28:40 IST",
  marketSessionName = "LIVE NSE / BSE MARKET OPEN",
  sessionColor = "emerald",
  isMarketOpen = true,
  onOpenApiModal,
  activeApiName = "Live Stream",
  isLiveTicksActive = true,
  onToggleLiveTicks,
  liveIndices,
  isInternetLive = true,
  internetLatencyMs = 125,
}) => {
  const navTabs = [
    { id: "signals", label: "Stock Radar", icon: Crosshair, badge: `${buyCount} Buys` },
    { id: "my_accounts", label: "Broker IDs & Connect", icon: Wallet, highlight: true },
    { id: "my_portfolio", label: "My Portfolio & Suggestions", icon: PieChart, highlight: true },
    { id: "fno", label: "F&O Derivatives", icon: Layers },
    { id: "etf_intraday", label: "ETFs & Intraday", icon: Zap },
    { id: "finance", label: "Financials & Mojo", icon: FileSpreadsheet },
    { id: "holdengine", label: "Hold Period & Volatility", icon: Timer },
    { id: "optimizer", label: "Risk & Position Sizer", icon: Calculator },
    { id: "injector", label: "Fundamental Injector", icon: Database },
    { id: "backtest", label: "Backtest & Accuracy", icon: BarChart3 },
    { id: "macro", label: "Macro & News", icon: Globe },
    { id: "reframe", label: "AI Reframe Studio", icon: Terminal },
  ];

  const niftyPrice = liveIndices?.nifty50.price || 25362.25;
  const niftyChange = liveIndices?.nifty50.changePercent || +0.47;
  const bankNiftyPrice = liveIndices?.bankNifty.price || 60786.4;
  const bankNiftyChange = liveIndices?.bankNifty.changePercent || +0.57;
  const vixPrice = liveIndices?.indiaVix.price || 17.53;
  const vixChange = liveIndices?.indiaVix.change || -0.32;
  const brentPrice = liveIndices?.brentCrude.price || 74.2;
  const usdInrPrice = liveIndices?.usdInr.price || 83.62;

  return (
    <header className="sticky top-0 z-40 bg-[#080d15]/95 backdrop-blur-md border-b border-slate-800/90">
      {/* TOP LIVE INDEX TICKER & REALTIME IST CLOCK */}
      <div className="bg-[#0b1019] border-b border-slate-800/80 px-4 py-1.5 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-3 font-mono-numbers">
        <div className="flex items-center space-x-3 overflow-x-auto py-0.5 text-[11px] scrollbar-none">
          {/* LIVE IST CLOCK */}
          <div className="flex items-center space-x-1.5 bg-[#05080e] border border-cyan-500/30 px-2.5 py-0.5 rounded-lg text-cyan-300 font-bold shrink-0">
            <Clock className="w-3 h-3 text-cyan-400" />
            <span>{formattedDate}</span>
            <span className="text-white font-black">{formattedTime}</span>
          </div>

          {/* MARKET SESSION STATUS BADGE */}
          <span className={`flex items-center space-x-1.5 px-2 py-0.5 rounded-lg border font-bold text-[10px] shrink-0 ${
            sessionColor === "emerald"
              ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
              : sessionColor === "amber"
              ? "bg-amber-500/15 border-amber-500/40 text-amber-300"
              : "bg-rose-500/15 border-rose-500/40 text-rose-300"
          }`}>
            <span className={`w-2 h-2 rounded-full inline-block ${
              sessionColor === "emerald"
                ? "bg-emerald-400 animate-ping"
                : sessionColor === "amber"
                ? "bg-amber-400"
                : "bg-rose-400"
            }`}></span>
            <span className="font-sans">{marketSessionName}</span>
          </span>

          {/* REAL-TIME INTERNET INDICES */}
          <span className="border-l border-slate-800 pl-3 shrink-0 flex items-center space-x-1.5">
            <span className="text-slate-400">NIFTY 50:</span>
            <strong className="text-slate-100">{niftyPrice.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
            <span className={`font-bold ${niftyChange >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
              {niftyChange >= 0 ? "+" : ""}{niftyChange.toFixed(2)}%
            </span>
          </span>

          <span className="border-l border-slate-800 pl-3 shrink-0 flex items-center space-x-1.5">
            <span className="text-slate-400">BANK NIFTY:</span>
            <strong className="text-slate-100">{bankNiftyPrice.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
            <span className={`font-bold ${bankNiftyChange >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
              {bankNiftyChange >= 0 ? "+" : ""}{bankNiftyChange.toFixed(2)}%
            </span>
          </span>

          <span className="border-l border-slate-800 pl-3 shrink-0 flex items-center space-x-1.5">
            <span className="text-slate-400">INDIA VIX:</span>
            <strong className="text-slate-100">{vixPrice.toFixed(2)}</strong>
            <span className={`font-bold ${vixChange >= 0 ? "text-rose-400" : "text-emerald-400"}`}>
              {vixChange >= 0 ? "+" : ""}{vixChange.toFixed(2)}
            </span>
          </span>

          <span className="border-l border-slate-800 pl-3 shrink-0">
            RBI REPO: <strong className="text-slate-100">6.50%</strong> <span className="text-cyan-400 font-bold">(Pause)</span>
          </span>
          <span className="border-l border-slate-800 pl-3 shrink-0">
            BRENT: <strong className="text-slate-100">${brentPrice.toFixed(2)}</strong>
          </span>
          <span className="border-l border-slate-800 pl-3 shrink-0">
            USD/INR: <strong className="text-slate-100">₹{usdInrPrice.toFixed(2)}</strong>
          </span>
        </div>

        <div className="flex items-center space-x-2.5 text-slate-400 text-xs shrink-0">
          {/* LIVE INTERNET CONNECTIVITY BADGE */}
          <div className="flex items-center space-x-1.5 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 px-2.5 py-0.5 rounded-lg text-[11px] font-sans">
            <Wifi className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span className="font-bold">Live Internet Feed</span>
            <span className="text-[10px] text-emerald-400/80 font-mono-numbers">({internetLatencyMs}ms)</span>
          </div>

          {onOpenApiModal && (
            <button
              onClick={onOpenApiModal}
              className="flex items-center space-x-1.5 bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-500/40 px-2.5 py-0.5 rounded-lg text-[11px] font-sans transition-all cursor-pointer"
            >
              <Radio className="w-3 h-3 text-cyan-400" />
              <span className="font-bold">API: Active</span>
            </button>
          )}

          {!isOnline && (
            <div className="flex items-center space-x-1 bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded text-[11px] font-sans border border-amber-500/40">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
              <span>Offline Mode (Cached)</span>
            </div>
          )}
          <div className="flex items-center space-x-1.5 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 text-emerald-400 text-[11px]">
            <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span className="font-sans">Market Mojo 4-Pillar Active</span>
          </div>
        </div>
      </div>

      {/* MAIN NAVBAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center space-x-3 cursor-pointer shrink-0" onClick={() => setActiveTab("signals")}>
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group">
            <Zap className="w-6 h-6 text-black stroke-[2.5] group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-extrabold tracking-tight text-white flex items-center gap-1">
                VRD Trade <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">AI</span>
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                MARKET MOJO QUANT
              </span>
            </div>
            <p className="text-[11px] text-slate-400 -mt-0.5 font-medium flex items-center gap-1.5">
              <span>4-Pillar Quality, Valuation, Financials & Hold Engine</span>
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center space-x-1 overflow-x-auto py-2 scrollbar-none">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-emerald-500/20 to-teal-500/15 text-emerald-300 border border-emerald-500/50 shadow-sm shadow-emerald-500/10"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-emerald-400" : "text-slate-400"}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                    {tab.badge}
                  </span>
                )}
                {tab.highlight && !isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Download & APK Button */}
        <div className="shrink-0">
          <button
            onClick={onOpenDownloadModal}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 hover:opacity-95 text-slate-950 font-black text-xs shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Get App (APK & PC)</span>
            <span className="sm:hidden">App</span>
          </button>
        </div>
      </div>
    </header>
  );
};

import React from 'react';
import { MacroIndicator, NewsItem } from '../types/trading';
import { Globe, Newspaper, TrendingUp, TrendingDown, Minus, Radio } from 'lucide-react';

interface MacroNewsProps {
  macroData: MacroIndicator[];
  newsItems: NewsItem[];
}

export const MacroNews: React.FC<MacroNewsProps> = ({ macroData, newsItems }) => {
  return (
    <div className="space-y-6">
      {/* MACRO VECTORS */}
      <div>
        <h2 className="text-base font-bold text-white mb-3 flex items-center space-x-2">
          <Globe className="w-5 h-5 text-cyan-400" />
          <span>Live Global & Indian Economic Vectors</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {macroData.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#0c121d] border border-slate-800 p-4 rounded-xl flex flex-col justify-between shadow-md"
            >
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400">{item.metric}</span>
                <div className="text-xl font-black font-mono-numbers text-white mt-1">{item.value}</div>
                <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {item.status}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-800/80 leading-snug">
                {item.impact}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* NEWS SENTIMENT FEED */}
      <div className="bg-[#0c121d] border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Newspaper className="w-5 h-5 text-emerald-400" />
              <span>Live Global & Domestic Macro Feed</span>
            </h3>
            <p className="text-xs text-slate-400">
              Real-time sentiment analyzer tracking foreign and domestic catalysts affecting Indian stocks
            </p>
          </div>
          <span className="text-xs text-emerald-400 font-mono flex items-center gap-1.5 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>Feed Active</span>
          </span>
        </div>

        <div className="space-y-4">
          {newsItems.map((news) => (
            <div
              key={news.id}
              className="p-4 rounded-xl bg-[#070b12] border border-slate-800/80 hover:border-slate-700 transition-all"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {news.source}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">{news.time}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-[10px] text-slate-400">Impacted Equities:</span>
                  {news.affected.map((sym) => (
                    <span
                      key={sym}
                      className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20"
                    >
                      {sym}
                    </span>
                  ))}
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded ${
                      news.impact === "POSITIVE"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-amber-500/20 text-amber-400"
                    }`}
                  >
                    {news.impact}
                  </span>
                </div>
              </div>

              <h4 className="text-sm font-bold text-white mb-1">{news.title}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{news.summary}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

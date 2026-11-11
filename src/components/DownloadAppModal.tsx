import React, { useState } from 'react';
import {
  X,
  Smartphone,
  Laptop,
  Download,
  CheckCircle2,
  Share2,
  WifiOff,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ExternalLink,
  QrCode
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface DownloadAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadAppModal: React.FC<DownloadAppModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<"android" | "laptop">("android");
  const [installSuccess, setInstallSuccess] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://ais-dev-poxf6wbsq4conuhec6vxb6-672236177824.asia-east1.run.app';

  const handleInstallClick = async () => {
    if (isInstallable) {
      const res = await install();
      if (res) {
        setInstallSuccess(true);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-[#0c121d] border border-cyan-500/40 max-w-2xl w-full rounded-2xl p-6 shadow-2xl relative my-6">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20">
            <Download className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">Download & Install VRD Trade AI</h2>
            <p className="text-xs text-slate-400">
              Install locally on your Laptop (Windows/Mac/Linux) or Android Mobile (Standalone APK / WebAPK).
            </p>
          </div>
        </div>

        {/* Device Switcher Tabs */}
        <div className="flex border-b border-slate-800 mb-5">
          <button
            onClick={() => setActiveTab("android")}
            className={`flex items-center space-x-2 py-2.5 px-4 text-xs font-bold transition-all border-b-2 ${
              activeTab === "android"
                ? "border-emerald-400 text-emerald-400 bg-emerald-500/10"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Mobile (Android APK & iOS)</span>
          </button>
          <button
            onClick={() => setActiveTab("laptop")}
            className={`flex items-center space-x-2 py-2.5 px-4 text-xs font-bold transition-all border-b-2 ${
              activeTab === "laptop"
                ? "border-cyan-400 text-cyan-400 bg-cyan-500/10"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Laptop className="w-4 h-4" />
            <span>Laptop & PC (Desktop PWA)</span>
          </button>
        </div>

        {/* ANDROID TAB */}
        {activeTab === "android" && (
          <div className="space-y-4">
            {/* Instant 1-Click Install Button */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-[#07131b] to-[#070b12] border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold tracking-wider">
                  DIRECT ANDROID APK INSTALLATION
                </span>
                <h4 className="text-sm font-black text-white mt-0.5">Install WebAPK Native Mobile App</h4>
                <p className="text-xs text-slate-300 mt-1">
                  Packages the full quant terminal into an Android home screen app with zero browser url bar and full offline caching.
                </p>
              </div>

              {isInstalled ? (
                <div className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold flex items-center space-x-1.5 shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Already Installed!</span>
                </div>
              ) : isInstallable ? (
                <button
                  onClick={handleInstallClick}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-emerald-500/20 flex items-center space-x-2 shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>Install Android App</span>
                </button>
              ) : (
                <div className="text-right shrink-0">
                  <span className="text-[11px] font-bold text-cyan-300 bg-cyan-500/10 px-3 py-1.5 rounded-lg border border-cyan-500/30 inline-block">
                    Chrome Menu → Add to Home screen
                  </span>
                </div>
              )}
            </div>

            {/* Step-by-Step Android Instructions */}
            <div className="p-4 rounded-xl bg-[#070b12] border border-slate-800 space-y-2.5 text-xs text-slate-300">
              <h5 className="font-bold text-white uppercase text-[11px] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>How to Install on Android Mobile:</span>
              </h5>
              <ol className="space-y-2 list-decimal list-inside pl-1 text-slate-300">
                <li>Open this URL in <strong>Google Chrome</strong> or <strong>Brave</strong> on your Android phone.</li>
                <li>Tap the <strong>three dots menu (⋮)</strong> in the top-right corner.</li>
                <li>Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</li>
                <li>Android will generate a native <strong>WebAPK</strong> icon in your app drawer that opens standalone!</li>
              </ol>
            </div>

            {/* Standalone .APK Packaging Guide via PWABuilder */}
            <div className="p-4 rounded-xl bg-[#09101b] border border-cyan-500/30 text-xs">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h5 className="font-bold text-cyan-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                    <span>Need a Raw Standalone .APK File for Sideloading / Play Store?</span>
                  </h5>
                  <p className="text-slate-400 mt-1 leading-relaxed">
                    This PWA is fully compliant with Google's Trusted Web Activity (TWA) standard. You can generate a signed <code>.apk</code> or <code>.aab</code> package in 60 seconds with PWABuilder:
                  </p>
                </div>
                <a
                  href={`https://www.pwabuilder.com?url=${encodeURIComponent(currentUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1 shrink-0 transition-colors"
                >
                  <span>Open PWABuilder</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* iOS Safari Guide */}
            <div className="p-3.5 rounded-xl bg-[#070b12] border border-slate-800 text-xs text-slate-400">
              <span className="font-bold text-slate-200 block mb-1">Apple iPhone / iPad Users:</span>
              <span>Tap the <strong>Share button</strong> in Safari toolbar, scroll down and tap <strong>"Add to Home Screen"</strong>.</span>
            </div>
          </div>
        )}

        {/* LAPTOP / PC TAB */}
        {activeTab === "laptop" && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 via-[#07131b] to-[#070b12] border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-wider">
                  DESKTOP PWA APPLICATION
                </span>
                <h4 className="text-sm font-black text-white mt-0.5">Install on Laptop (Windows / Mac / Linux)</h4>
                <p className="text-xs text-slate-300 mt-1">
                  Runs in an isolated high-performance desktop window with custom icon in your Dock or Taskbar.
                </p>
              </div>

              {isInstalled ? (
                <div className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold flex items-center space-x-1.5 shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Desktop App Installed</span>
                </div>
              ) : isInstallable ? (
                <button
                  onClick={handleInstallClick}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-cyan-500/20 flex items-center space-x-2 shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>Install Desktop App</span>
                </button>
              ) : (
                <div className="text-right shrink-0">
                  <span className="text-[11px] font-bold text-cyan-300 bg-cyan-500/10 px-3 py-1.5 rounded-lg border border-cyan-500/30 inline-block">
                    Click ⊕ in Chrome Address Bar
                  </span>
                </div>
              )}
            </div>

            {/* Laptop Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#070b12] border border-slate-800">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold mb-1">
                  <WifiOff className="w-4 h-4" />
                  <span>Full Offline Mode</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  All quant formulas, historical volatility algorithms, and backtest scorecards run client-side offline.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-[#070b12] border border-slate-800">
                <div className="flex items-center space-x-2 text-cyan-400 font-bold mb-1">
                  <Laptop className="w-4 h-4" />
                  <span>Zero Memory Overhead</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Instant launch from taskbar without bulky multi-gigabyte Electron runtimes.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Service Worker Precached & PWA Ready</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

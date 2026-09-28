import React from 'react';
import { ShieldAlert, Layers, Terminal, Sparkles, Clock, Compass } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenCopilot: () => void;
  onOpenArchitecture: () => void;
  shortfallRiskLevel: 'Low' | 'Medium' | 'High';
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenCopilot,
  onOpenArchitecture,
  shortfallRiskLevel
}) => {
  return (
    <header className="h-16 px-5 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md flex items-center justify-between sticky top-0 z-30 shrink-0">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-bold text-base shadow-sm">
          Mn
        </div>
        <div className="flex flex-col">
          <span className="text-base font-semibold tracking-tight text-white flex items-center gap-2">
            MOIL GeoMine AI
            <span className="text-xs font-mono font-normal text-amber-400/90 px-1.5 py-0.5 rounded bg-amber-950/60 border border-amber-800/50">
              DSS v2.4
            </span>
          </span>
          <span className="text-[11px] text-slate-400">
            Manganese Ore India Ltd · Central Belt
          </span>
        </div>
      </div>

      {/* Zone 2: Navigation Links (Clean text with hover indicators) */}
      <nav className="hidden xl:flex items-center gap-6 text-sm font-medium text-slate-400">
        <button
          onClick={() => onSelectTab('overview')}
          className={`hover:text-white transition-colors cursor-pointer ${
            activeTab === 'overview' ? 'text-amber-400 font-semibold' : ''
          }`}
        >
          Executive Overview
        </button>
        <button
          onClick={() => onSelectTab('reserves')}
          className={`hover:text-white transition-colors cursor-pointer ${
            activeTab === 'reserves' ? 'text-amber-400 font-semibold' : ''
          }`}
        >
          Reserve Intelligence
        </button>
        <button
          onClick={() => onSelectTab('production')}
          className={`hover:text-white transition-colors cursor-pointer ${
            activeTab === 'production' ? 'text-amber-400 font-semibold' : ''
          }`}
        >
          Production Forecast
        </button>
        <button
          onClick={() => onSelectTab('digital-mine')}
          className={`hover:text-white transition-colors cursor-pointer ${
            activeTab === 'digital-mine' ? 'text-amber-400 font-semibold' : ''
          }`}
        >
          3D Digital Mine
        </button>
        <button
          onClick={() => onSelectTab('what-if')}
          className={`hover:text-white transition-colors cursor-pointer ${
            activeTab === 'what-if' ? 'text-amber-400 font-semibold' : ''
          }`}
        >
          What-if Simulator
        </button>
      </nav>

      {/* Zone 3: Primary Actions */}
      <div className="flex items-center gap-3">
        {/* Early Warning Risk Pill */}
        <div
          onClick={() => onSelectTab('risks')}
          className={`px-3 py-1.5 rounded text-xs font-medium flex items-center gap-2 cursor-pointer transition-colors border ${
            shortfallRiskLevel === 'High'
              ? 'bg-rose-950/60 border-rose-800/80 text-rose-300 hover:bg-rose-900/60'
              : shortfallRiskLevel === 'Medium'
              ? 'bg-amber-950/60 border-amber-800/80 text-amber-300 hover:bg-amber-900/60'
              : 'bg-emerald-950/60 border-emerald-800/80 text-emerald-300 hover:bg-emerald-900/60'
          }`}
          title="Click to view Shortfall Risk Center & Root Causes"
        >
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          <span className="font-semibold">{shortfallRiskLevel} Shortfall Risk</span>
          <span className="text-slate-400 hidden sm:inline">(-137.6k MT)</span>
        </div>

        {/* Backend Specs & FastAPI Blueprint */}
        <button
          onClick={onOpenArchitecture}
          className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          title="View Python FastAPI, PostgreSQL & ML Pipeline Architecture"
        >
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden md:inline">Python / ML Pipeline</span>
        </button>

        {/* AI Mining Copilot Button */}
        <button
          onClick={onOpenCopilot}
          className="px-3 py-1.5 text-xs font-semibold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded transition-all shadow-sm flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-slate-950" />
          <span>AI Copilot</span>
        </button>
      </div>
    </header>
  );
};

import React from 'react';
import {
  LayoutDashboard,
  Compass,
  TrendingUp,
  AlertTriangle,
  Cpu,
  Satellite,
  Box,
  SlidersHorizontal,
  Bot,
  Info,
  Database
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  shortfallRiskLevel: 'Low' | 'Medium' | 'High';
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  shortfallRiskLevel
}) => {
  const menuItems = [
    {
      id: 'overview',
      label: 'Overview & KPIs',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'reserves',
      label: 'Reserve Intelligence',
      icon: Compass,
      badge: '8 Zones'
    },
    {
      id: 'production',
      label: 'Production Forecast',
      icon: TrendingUp,
      badge: null
    },
    {
      id: 'risks',
      label: 'Shortfall Risk & XAI',
      icon: AlertTriangle,
      badge: shortfallRiskLevel,
      badgeColor: shortfallRiskLevel === 'High' ? 'text-rose-400 bg-rose-950/60 border-rose-800' : 'text-amber-400 bg-amber-950/60'
    },
    {
      id: 'equipment',
      label: 'Equipment Monitoring',
      icon: Cpu,
      badge: '1 Alert'
    },
    {
      id: 'satellite-weather',
      label: 'Satellite & Weather',
      icon: Satellite,
      badge: 'Sentinel-2'
    },
    {
      id: 'digital-mine',
      label: '3D Digital Mine',
      icon: Box,
      badge: 'Three.js'
    },
    {
      id: 'what-if',
      label: 'What-if Simulator',
      icon: SlidersHorizontal,
      badge: 'Live'
    },
    {
      id: 'copilot',
      label: 'AI Mining Copilot',
      icon: Bot,
      badge: 'Gemini'
    }
  ];

  return (
    <aside className="w-64 border-r border-slate-800/80 bg-slate-950/80 flex flex-col justify-between shrink-0 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
      <div className="p-3 space-y-1">
        <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Decision Support System
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                isActive
                  ? 'bg-amber-500/10 text-amber-300 border-l-2 border-amber-500 pl-[10px]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono border border-slate-700/60 ${
                    item.badgeColor || 'bg-slate-900 text-slate-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Dataset & Regulatory Compliance notice */}
      <div className="p-3 m-3 rounded bg-slate-900/80 border border-slate-800 text-[11px] space-y-2">
        <div className="flex items-center gap-1.5 text-amber-400 font-medium">
          <Info className="w-3.5 h-3.5 shrink-0" />
          <span>Synthetic Demo Dataset</span>
        </div>
        <p className="text-slate-400 leading-relaxed">
          Operational models for MOIL Balaghat & Dongri Buzurg. Designed for real ERP & SCADA integration via PostgreSQL/PostGIS.
        </p>
        <div className="pt-1 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <span>GSI / MOIL Belt</span>
          <span className="text-emerald-400">● Connected</span>
        </div>
      </div>
    </aside>
  );
};

import React from 'react';
import {
  TrendingUp,
  AlertTriangle,
  Compass,
  Cpu,
  Layers,
  CloudRain,
  ArrowUpRight,
  ArrowDownRight,
  ShieldAlert,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Droplets,
  Thermometer,
  Eye
} from 'lucide-react';
import { MineZone, ProductionRecord, Equipment, ShortfallFactor } from '../types/mine';

interface OverviewDashboardProps {
  zones: MineZone[];
  production: ProductionRecord[];
  equipment: Equipment[];
  riskFactors: ShortfallFactor[];
  onNavigate: (tab: string) => void;
  onOpenCopilotWithQuery: (q: string) => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  zones,
  production,
  equipment,
  riskFactors,
  onNavigate,
  onOpenCopilotWithQuery
}) => {
  const currentMonthData = production.find(p => p.month.includes('Curr')) || production[11];
  const criticalEquipment = equipment.find(e => e.status === 'Critical Breakdown');

  return (
    <div className="space-y-6">
      {/* Page Title & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Mining Operations Decision Support System
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manganese Ore India Limited (MOIL Ltd) · Central India Belt (Balaghat, Dongri Buzurg, Tirodi, Chikla)
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Data Cycle:</span>
          <span className="font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded">
            Live Telemetry & Sentinel-2 Pass (T-2h)
          </span>
        </div>
      </div>

      {/* Early Warning Banner */}
      <div className="p-4 rounded-lg bg-gradient-to-r from-rose-950/80 via-slate-900 to-slate-900 border border-rose-800/60 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-md bg-rose-900/60 border border-rose-700/80 flex items-center justify-center shrink-0 text-rose-300">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                  Early Warning System · High Shortfall Risk
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  Probability: 78.4% · 34 Days to Q4 Close
                </span>
              </div>
              <h2 className="text-base font-semibold text-white mt-0.5">
                Projected Shortfall of 137,600 MT (-7.86%) vs Annual Target (1,750,000 MT)
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-4xl leading-relaxed">
                Primary shortfall driven by <strong>Excavator EX-02 breakdown</strong> at Dongri Buzurg (-58.2k MT) and 
                <strong> unseasonal bench inundation</strong> from 68.4mm rainfall (-37.3k MT). Immediate rebalancing required.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigate('what-if')}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-600 rounded transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <span>Simulate Mitigation</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onOpenCopilotWithQuery('What is the fastest way to overcome the 137,600 MT production shortfall?')}
              className="px-3.5 py-2 text-xs font-medium text-amber-300 bg-amber-950/60 hover:bg-amber-900/60 border border-amber-800/80 rounded transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Ask AI Copilot</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* KPI 1: Potential Reserve */}
        <div className="p-3.5 rounded-lg bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-medium">Potential Reserve</span>
            <Compass className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tracking-tight">
            48.6 <span className="text-sm font-normal text-slate-400">MT</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-800/80">
            <span>Proven: <strong className="text-slate-200 font-mono">31.2 MT</strong></span>
            <span className="text-cyan-400 cursor-pointer hover:underline" onClick={() => onNavigate('reserves')}>
              8 Zones →
            </span>
          </div>
        </div>

        {/* KPI 2: FY Target */}
        <div className="p-3.5 rounded-lg bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-medium">Annual Target</span>
            <Layers className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tracking-tight">
            1.750 <span className="text-sm font-normal text-slate-400">MT</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-800/80">
            <span>MoM Target: <strong className="text-slate-200 font-mono">165k MT</strong></span>
            <span className="text-slate-400">FY 2025-26</span>
          </div>
        </div>

        {/* KPI 3: Predicted Production */}
        <div className="p-3.5 rounded-lg bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-medium">AI Forecast</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-300 tracking-tight">
            1.612 <span className="text-sm font-normal text-slate-400">MT</span>
          </div>
          <div className="mt-2 text-[11px] text-rose-400 flex items-center justify-between pt-2 border-t border-slate-800/80">
            <span className="flex items-center gap-0.5">
              <ArrowDownRight className="w-3.5 h-3.5" />
              -137.6k MT Gap
            </span>
            <span className="font-mono text-slate-400">92.1% Target</span>
          </div>
        </div>

        {/* KPI 4: Shortfall Risk */}
        <div className="p-3.5 rounded-lg bg-rose-950/20 border border-rose-900/50 hover:border-rose-700/60 transition-colors">
          <div className="flex items-center justify-between text-xs text-rose-300 mb-1">
            <span className="font-medium">Shortfall Risk</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-rose-400 tracking-tight">
            High <span className="text-xs font-normal text-slate-400">78.4% Prob</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-rose-900/40">
            <span>Primary: <strong className="text-rose-300">EX-02 Down</strong></span>
            <span className="text-rose-400 cursor-pointer hover:underline" onClick={() => onNavigate('risks')}>
              Root Cause →
            </span>
          </div>
        </div>

        {/* KPI 5: Equipment Availability */}
        <div className="p-3.5 rounded-lg bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-medium">Fleet Availability</span>
            <Cpu className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400 tracking-tight">
            83.4%
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-800/80">
            <span>Target: <strong className="text-slate-200 font-mono">92.0%</strong></span>
            <span className="text-rose-400 font-medium">1 Critical</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Production Trends & Zone Intelligence Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Production Trend & Seasonal Monsoon Chart (7 cols) */}
        <div className="lg:col-span-7 p-4 rounded-lg bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">
                Monthly Production Performance vs AI Forecast
              </h3>
              <p className="text-xs text-slate-400">
                Tracking FY target, actual extracted tonnage, and AI projected trajectory with monsoon dip
              </p>
            </div>
            <button
              onClick={() => onNavigate('production')}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 cursor-pointer"
            >
              Full Forecast Analysis →
            </button>
          </div>

          {/* Bar Chart Representation with Tabular figures */}
          <div className="h-64 flex flex-col justify-between pt-4">
            <div className="grid grid-cols-12 gap-1.5 h-48 items-end border-b border-slate-800 pb-2">
              {production.slice(0, 12).map((item, idx) => {
                const targetHeight = (item.targetProductionMT / 180000) * 100;
                const actualHeight = item.actualProductionMT ? (item.actualProductionMT / 180000) * 100 : 0;
                const isShortfall = item.actualProductionMT && item.actualProductionMT < item.targetProductionMT;
                return (
                  <div key={idx} className="flex flex-col items-center h-full justify-end group relative">
                    {/* Tooltip */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full mb-2 z-20 pointer-events-none bg-slate-950 border border-slate-700 text-[11px] p-2 rounded shadow-lg whitespace-nowrap">
                      <div className="font-semibold text-white">{item.month}</div>
                      <div className="text-slate-300">Target: {item.targetProductionMT.toLocaleString()} MT</div>
                      {item.actualProductionMT && (
                        <div className={isShortfall ? 'text-rose-400' : 'text-emerald-400'}>
                          Actual: {item.actualProductionMT.toLocaleString()} MT
                        </div>
                      )}
                      <div className="text-amber-400">Rainfall: {item.rainfallMM} mm</div>
                    </div>

                    <div className="w-full flex items-end justify-center gap-0.5 h-full">
                      {/* Target bar outline */}
                      <div
                        style={{ height: `${targetHeight}%` }}
                        className="w-1.5 bg-slate-700/60 rounded-t-sm"
                        title={`Target: ${item.targetProductionMT} MT`}
                      />
                      {/* Actual bar */}
                      {item.actualProductionMT && (
                        <div
                          style={{ height: `${actualHeight}%` }}
                          className={`w-3.5 rounded-t-sm transition-all ${
                            isShortfall
                              ? 'bg-rose-500/80 group-hover:bg-rose-400'
                              : 'bg-emerald-500/80 group-hover:bg-emerald-400'
                          }`}
                        />
                      )}
                    </div>
                    <span className="text-[9px] font-mono text-slate-400 mt-1 truncate w-full text-center">
                      {item.month.split(' ')[0]}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-slate-700/80 rounded-sm" />
                  <span>Target Plan</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-emerald-500/80 rounded-sm" />
                  <span>On/Above Target</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-rose-500/80 rounded-sm" />
                  <span>Shortfall Deficit</span>
                </div>
              </div>
              <span className="text-[11px] text-amber-400 font-mono">
                July–Aug Monsoonal Dip (-34.6k MT)
              </span>
            </div>
          </div>
        </div>

        {/* Operational Mine Map & Zone Quick Status (5 cols) */}
        <div className="lg:col-span-5 p-4 rounded-lg bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">
                Active Mines & Reserve Horizons
              </h3>
              <p className="text-xs text-slate-400">
                Geological Sausar Group · Potential status & operational status
              </p>
            </div>
            <button
              onClick={() => onNavigate('digital-mine')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 cursor-pointer"
            >
              Open 3D Mine →
            </button>
          </div>

          <div className="space-y-2 max-h-[270px] overflow-y-auto pr-1">
            {zones.slice(0, 5).map((zone) => (
              <div
                key={zone.id}
                onClick={() => onNavigate('reserves')}
                className="p-2.5 rounded bg-slate-950/60 border border-slate-800/80 hover:border-amber-500/50 transition-colors flex items-center justify-between cursor-pointer group"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-200 group-hover:text-amber-300 transition-colors">
                      {zone.name}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                        zone.potential === 'High'
                          ? 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60'
                          : zone.potential === 'Medium'
                          ? 'text-amber-400 bg-amber-950/60 border-amber-800/60'
                          : 'text-slate-400 bg-slate-900 border-slate-800'
                      }`}
                    >
                      {zone.potential} Potential
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-3">
                    <span>Grade: <strong className="text-slate-300 font-mono">{zone.averageGradeMnPercent}% Mn</strong></span>
                    <span>·</span>
                    <span>Reserve: <strong className="text-slate-300 font-mono">{zone.estimatedReserveMT} MT</strong></span>
                    <span>·</span>
                    <span>Depth: <strong className="text-slate-300 font-mono">{zone.depthMeters}m</strong></span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-cyan-400 block">
                    SWIR {zone.spectralIndexSWIR}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Rank #{zone.explorationPriorityRank}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-2.5 rounded bg-slate-950/40 border border-slate-800/60 flex items-center justify-between text-xs">
            <span className="text-slate-400">Exploration Priority Recommendation:</span>
            <span className="text-amber-400 font-medium">Balaghat NE Strike (Rank #1)</span>
          </div>
        </div>
      </div>

      {/* Row 3: Root Cause Waterfall + Priority Action Ticker + Environmental Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Card 1: Shortfall Root Cause (SHAP Waterfall Summary) */}
        <div className="p-4 rounded-lg bg-slate-900/70 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              Shortfall Attribution (SHAP XAI)
            </h3>
            <span className="text-[11px] font-mono text-slate-400">Model: XGBoost-v2</span>
          </div>

          <div className="space-y-2.5">
            {riskFactors.slice(0, 3).map((factor) => (
              <div key={factor.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 truncate max-w-[200px]" title={factor.factor}>
                    {factor.factor}
                  </span>
                  <span className="font-mono text-rose-400 font-medium">
                    {factor.impactPercentage}% ({factor.impactTonnageMT.toLocaleString()} MT)
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${Math.abs(factor.impactPercentage)}%` }}
                    className="h-full bg-rose-500 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-slate-400 pt-1 leading-relaxed border-t border-slate-800/80">
            Primary shovel downtime contributes 42.3% of total loss. Restoring EX-02 or deploying backup backhoe recovers 36,000 MT immediately.
          </p>
        </div>

        {/* Card 2: AI Recommended Actions */}
        <div className="p-4 rounded-lg bg-slate-900/70 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              AI Corrective Action Playbook
            </h3>
            <span className="text-[11px] text-emerald-400 font-mono">+104k MT Recovery</span>
          </div>

          <div className="space-y-2">
            <div className="p-2.5 rounded bg-slate-950/60 border border-amber-900/40 text-xs space-y-1">
              <div className="flex items-center justify-between font-semibold text-amber-300">
                <span>1. Deploy Shovel EX-04 to Bench 4</span>
                <span className="font-mono text-emerald-400">+36,000 MT</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Compensates for broken EX-02 shovel. Expedites spare hydraulic seal kit from Nagpur.
              </p>
            </div>

            <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800 text-xs space-y-1">
              <div className="flex items-center justify-between font-semibold text-slate-200">
                <span>2. Dual High-Head Dewatering (DP-02 & DP-05)</span>
                <span className="font-mono text-emerald-400">+28,500 MT</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Pumps 14,000 m³ waterlogged mud from Balaghat Sump to reopen the south haul ramp.
              </p>
            </div>

            <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800 text-xs space-y-1">
              <div className="flex items-center justify-between font-semibold text-slate-200">
                <span>3. Non-Electric Detonator Blasting Cycle</span>
                <span className="font-mono text-emerald-400">+18,000 MT</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Restricts peak particle velocity to 4.2 mm/s, expediting safety clearance.
              </p>
            </div>
          </div>
        </div>

        {/* Card 3: Satellite Earth Observation Telemetry */}
        <div className="p-4 rounded-lg bg-slate-900/70 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-cyan-400" />
              Space & Environmental Feeds
            </h3>
            <span className="text-[11px] font-mono text-cyan-400">Sentinel-2A / Landsat 9</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded bg-slate-950/60 border border-slate-800/80">
              <div className="text-slate-400 text-[11px]">72h Precipitation</div>
              <div className="text-base font-bold font-mono text-amber-300 mt-0.5">68.4 mm</div>
              <div className="text-[10px] text-rose-400">Sump saturation alert</div>
            </div>

            <div className="p-2 rounded bg-slate-950/60 border border-slate-800/80">
              <div className="text-slate-400 text-[11px]">Soil Moisture (NDWI)</div>
              <div className="text-base font-bold font-mono text-rose-400 mt-0.5">0.64 index</div>
              <div className="text-[10px] text-rose-400">&gt; 0.55 slip threshold</div>
            </div>

            <div className="p-2 rounded bg-slate-950/60 border border-slate-800/80">
              <div className="text-slate-400 text-[11px]">SWIR Mn Index</div>
              <div className="text-base font-bold font-mono text-emerald-400 mt-0.5">1.48 ratio</div>
              <div className="text-[10px] text-slate-400">High Mn absorption</div>
            </div>

            <div className="p-2 rounded bg-slate-950/60 border border-slate-800/80">
              <div className="text-slate-400 text-[11px]">Pit Surface Temp</div>
              <div className="text-base font-bold font-mono text-slate-200 mt-0.5">34.6 °C</div>
              <div className="text-[10px] text-emerald-400">Thermal nominal</div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Next Satellite Overpass:</span>
            <span className="font-mono text-cyan-300">Sentinel-2B at 14:22 IST</span>
          </div>
        </div>
      </div>
    </div>
  );
};

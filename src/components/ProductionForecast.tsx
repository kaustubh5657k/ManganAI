import React, { useState } from 'react';
import {
  TrendingUp,
  Calendar,
  Layers,
  ArrowDownRight,
  ArrowUpRight,
  CloudRain,
  Cpu,
  Sparkles,
  Download,
  AlertTriangle
} from 'lucide-react';
import { ProductionRecord } from '../types/mine';

interface ProductionForecastProps {
  productionData: ProductionRecord[];
  onOpenCopilotWithQuery: (q: string) => void;
  onNavigateToSimulator: () => void;
}

export const ProductionForecast: React.FC<ProductionForecastProps> = ({
  productionData,
  onOpenCopilotWithQuery,
  onNavigateToSimulator
}) => {
  const [selectedSiteFilter, setSelectedSiteFilter] = useState<'All' | 'Balaghat' | 'Dongri Buzurg' | 'Tirodi'>('All');
  const [viewMode, setViewMode] = useState<'all' | 'historical' | 'future'>('all');

  const filteredData = productionData.filter((item) => {
    if (viewMode === 'historical') return !item.month.includes('Pred');
    if (viewMode === 'future') return item.month.includes('Curr') || item.month.includes('Pred');
    return true;
  });

  const totalTarget = productionData.reduce((acc, p) => acc + p.targetProductionMT, 0);
  const totalForecast = productionData.reduce((acc, p) => acc + p.forecastProductionMT, 0);
  const totalShortfall = totalForecast - totalTarget;

  return (
    <div className="space-y-6">
      {/* Title & Filter Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-400" />
            Production Forecasting & Variance Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            18-Month historical extraction baseline and ML time-series projections (LSTM & XGBoost with weather covariates)
          </p>
        </div>

        {/* View Mode & Filter Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded p-1 text-xs">
            <span className="text-slate-400 px-2 text-[11px]">Timeline:</span>
            {[
              { id: 'all', label: 'All 16 Months' },
              { id: 'historical', label: 'Historical Only' },
              { id: 'future', label: 'AI Forecast' }
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => setViewMode(mode.id as any)}
                className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                  viewMode === mode.id
                    ? 'bg-amber-500 text-slate-950 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>

          <button
            onClick={onNavigateToSimulator}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span>Stress-Test Simulator →</span>
          </button>
        </div>
      </div>

      {/* High-level Forecast Metric Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-slate-900/80 border border-slate-800">
          <div className="text-xs text-slate-400">Total Program Target</div>
          <div className="text-2xl font-bold font-mono text-white mt-1">
            {(totalTarget / 1000000).toFixed(2)} <span className="text-sm font-normal text-slate-400">MT</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Nominal Monthly Run-rate: <strong className="text-slate-300 font-mono">152,000 MT</strong>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-slate-900/80 border border-slate-800">
          <div className="text-xs text-slate-400">AI Projected Total</div>
          <div className="text-2xl font-bold font-mono text-amber-300 mt-1">
            {(totalForecast / 1000000).toFixed(2)} <span className="text-sm font-normal text-slate-400">MT</span>
          </div>
          <div className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span>Cumulative Shortfall: {Math.abs(totalShortfall).toLocaleString()} MT</span>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-slate-900/80 border border-slate-800">
          <div className="text-xs text-slate-400">P10 Optimistic Upper Band</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
            {(productionData.reduce((acc, p) => acc + p.p10OptimisticMT, 0) / 1000000).toFixed(2)} <span className="text-sm font-normal text-slate-400">MT</span>
          </div>
          <div className="text-[11px] text-emerald-400 mt-1">
            Condition: EX-02 repaired &lt;36h + zero rain delays
          </div>
        </div>

        <div className="p-4 rounded-lg bg-slate-900/80 border border-slate-800">
          <div className="text-xs text-slate-400">P90 Pessimistic Lower Band</div>
          <div className="text-2xl font-bold font-mono text-rose-400 mt-1">
            {(productionData.reduce((acc, p) => acc + p.p90PessimisticMT, 0) / 1000000).toFixed(2)} <span className="text-sm font-normal text-slate-400">MT</span>
          </div>
          <div className="text-[11px] text-rose-400 mt-1">
            Condition: Prolonged monsoon + haul road closure
          </div>
        </div>
      </div>

      {/* Main Interactive Time-Series Visualizer */}
      <div className="p-5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold text-white">
              Actual Extraction vs AI Forecast & Confidence Intervals
            </h2>
            <p className="text-xs text-slate-400">
              Shaded bands represent 80% confidence interval (P10 to P90). Observe heavy seasonal monsoon deficit in Jul-Aug.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-emerald-500" />
              <span className="text-slate-300">Actual Production</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-amber-400" />
              <span className="text-slate-300">AI ML Forecast</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-slate-500 border-dashed" />
              <span className="text-slate-300">MOIL Target</span>
            </div>
          </div>
        </div>

        {/* Visual Chart Container */}
        <div className="h-72 w-full pt-6 flex flex-col justify-end">
          <div className="grid grid-cols-16 gap-1 h-56 items-end border-b border-slate-800 pb-2">
            {filteredData.map((item, idx) => {
              const maxScale = 180000;
              const targetPct = (item.targetProductionMT / maxScale) * 100;
              const forecastPct = (item.forecastProductionMT / maxScale) * 100;
              const actualPct = item.actualProductionMT ? (item.actualProductionMT / maxScale) * 100 : null;
              const p10Pct = (item.p10OptimisticMT / maxScale) * 100;
              const p90Pct = (item.p90PessimisticMT / maxScale) * 100;
              const isFuture = item.month.includes('Pred');
              const isCurrent = item.month.includes('Curr');

              return (
                <div key={idx} className="flex flex-col items-center justify-end h-full relative group">
                  {/* Tooltip */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full mb-2 z-20 pointer-events-none bg-slate-950 border border-slate-700 p-2.5 rounded shadow-xl text-[11px] whitespace-nowrap min-w-[170px]">
                    <div className="font-bold text-white mb-1">{item.month}</div>
                    <div className="text-slate-300">Target: {item.targetProductionMT.toLocaleString()} MT</div>
                    {item.actualProductionMT ? (
                      <div className="text-emerald-400 font-semibold">
                        Actual: {item.actualProductionMT.toLocaleString()} MT
                      </div>
                    ) : (
                      <div className="text-amber-400 font-semibold">
                        AI Forecast: {item.forecastProductionMT.toLocaleString()} MT
                      </div>
                    )}
                    <div className="text-slate-400 text-[10px] mt-1 border-t border-slate-800 pt-1">
                      P10: {item.p10OptimisticMT.toLocaleString()} · P90: {item.p90PessimisticMT.toLocaleString()}
                    </div>
                    <div className="text-cyan-400 text-[10px]">
                      Rain: {item.rainfallMM} mm · Uptime: {item.equipmentUptimePercent}%
                    </div>
                  </div>

                  {/* Shaded P10-P90 Confidence Band Box */}
                  <div
                    style={{
                      bottom: `${p90Pct}%`,
                      height: `${p10Pct - p90Pct}%`
                    }}
                    className={`absolute w-full rounded-sm pointer-events-none ${
                      isFuture ? 'bg-amber-500/15 border-y border-amber-500/30' : 'bg-slate-700/20'
                    }`}
                  />

                  {/* Target Marker Dash */}
                  <div
                    style={{ bottom: `${targetPct}%` }}
                    className="absolute w-full h-[2px] bg-slate-400/80 z-10"
                    title={`Target: ${item.targetProductionMT} MT`}
                  />

                  {/* Main Bar (Actual or Forecast) */}
                  <div className="w-full flex items-end justify-center z-10">
                    {actualPct !== null ? (
                      <div
                        style={{ height: `${actualPct}%` }}
                        className={`w-3 rounded-t-sm transition-all ${
                          item.shortfallGapMT < 0 ? 'bg-rose-500/80' : 'bg-emerald-500/80'
                        } group-hover:brightness-125`}
                      />
                    ) : (
                      <div
                        style={{ height: `${forecastPct}%` }}
                        className="w-3 rounded-t-sm bg-gradient-to-t from-amber-600/80 to-amber-400/80 border-t border-amber-300 group-hover:brightness-125"
                      />
                    )}
                  </div>

                  <span className={`text-[9px] font-mono mt-1.5 truncate text-center w-full ${
                    isCurrent ? 'text-amber-400 font-bold' : isFuture ? 'text-cyan-400' : 'text-slate-400'
                  }`}>
                    {item.month.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
            <span className="flex items-center gap-1.5">
              <CloudRain className="w-3.5 h-3.5 text-cyan-400" />
              Monsoon Season (Jul–Aug): Average precipitation 400mm+ causing open pit sump inundation
            </span>
            <span className="font-mono text-slate-400">
              Target Reference: 165k MT/mo
            </span>
          </div>
        </div>
      </div>

      {/* Detailed Monthly Production Audit Table */}
      <div className="p-4 rounded-lg bg-slate-900/80 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">
              Monthly Operational Logs & Covariate Drivers
            </h3>
            <p className="text-xs text-slate-400">
              Includes equipment uptime percentage and satellite rainfall records
            </p>
          </div>
          <button
            onClick={() => onOpenCopilotWithQuery('Explain the mathematical formula and features used in MOIL production forecasting.')}
            className="text-amber-400 hover:text-amber-300 text-xs font-medium flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Forecasting Model Details</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 font-mono">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Period</th>
                <th className="py-2.5 px-3 text-right">Target (MT)</th>
                <th className="py-2.5 px-3 text-right">Actual (MT)</th>
                <th className="py-2.5 px-3 text-right">Forecast (MT)</th>
                <th className="py-2.5 px-3 text-right">Shortfall (MT)</th>
                <th className="py-2.5 px-3 text-right">Fleet Uptime</th>
                <th className="py-2.5 px-3 text-right">Precipitation</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredData.map((item, idx) => {
                const isShortfall = item.shortfallGapMT < 0;
                return (
                  <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-2 px-3 font-semibold text-slate-200">{item.month}</td>
                    <td className="py-2 px-3 text-right text-slate-400">{item.targetProductionMT.toLocaleString()}</td>
                    <td className="py-2 px-3 text-right text-slate-100 font-bold">
                      {item.actualProductionMT ? item.actualProductionMT.toLocaleString() : '—'}
                    </td>
                    <td className="py-2 px-3 text-right text-amber-300 font-bold">
                      {item.forecastProductionMT.toLocaleString()}
                    </td>
                    <td className={`py-2 px-3 text-right font-bold ${isShortfall ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {item.shortfallGapMT > 0 ? `+${item.shortfallGapMT.toLocaleString()}` : item.shortfallGapMT.toLocaleString()}
                    </td>
                    <td className="py-2 px-3 text-right text-slate-300">{item.equipmentUptimePercent}%</td>
                    <td className="py-2 px-3 text-right text-cyan-400">{item.rainfallMM} mm</td>
                    <td className="py-2 px-3 font-sans">
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded border ${
                          item.month.includes('Pred')
                            ? 'text-cyan-400 bg-cyan-950/60 border-cyan-800/60'
                            : isShortfall
                            ? 'text-rose-400 bg-rose-950/60 border-rose-800/60'
                            : 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60'
                        }`}
                      >
                        {item.month.includes('Pred') ? 'Forecasted' : isShortfall ? 'Deficit' : 'Achieved'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

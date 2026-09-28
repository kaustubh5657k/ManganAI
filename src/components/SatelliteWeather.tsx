import React, { useState } from 'react';
import {
  Satellite,
  CloudRain,
  Droplets,
  Thermometer,
  Layers,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  Compass,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { SatelliteWeatherMetric } from '../types/mine';

interface SatelliteWeatherProps {
  metrics: SatelliteWeatherMetric[];
  onOpenCopilotWithQuery: (q: string) => void;
  onNavigateToSimulator: () => void;
}

export const SatelliteWeather: React.FC<SatelliteWeatherProps> = ({
  metrics,
  onOpenCopilotWithQuery,
  onNavigateToSimulator
}) => {
  const [selectedSensor, setSelectedSensor] = useState<'All' | 'Sentinel-2' | 'Landsat 9' | 'GPM IMERG'>('All');

  const filteredMetrics = metrics.filter((m) => {
    if (selectedSensor === 'All') return true;
    return m.sensorSource.includes(selectedSensor);
  });

  return (
    <div className="space-y-6">
      {/* Title & Satellite Constellation Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Satellite className="w-5 h-5 text-cyan-400" />
            Satellite Earth Observation & Space Technology Intelligence
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Multispectral remote sensing, precipitation radar, thermal infrared, and synthetic aperture radar (SAR) soil moisture
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Constellation:</span>
          <span className="font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-800 px-2 py-0.5 rounded">
            ESA Sentinel-2 · NASA Landsat-9 · ISRO RISAT
          </span>
        </div>
      </div>

      {/* Satellite Imagery & Zone Risk Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Remote Sensing Image & Overpass Frame (7 cols) */}
        <div className="lg:col-span-7 rounded-lg overflow-hidden border border-slate-800 bg-slate-950 relative group">
          <img
            src="/src/assets/images/moil_manganese_mine_aerial_1790609076658.jpg"
            alt="Satellite Remote Sensing Survey over MOIL Manganese Open Cast Bench Operations"
            className="w-full h-72 object-cover brightness-90 group-hover:brightness-100 transition-all duration-300"
            referrerPolicy="no-referrer"
          />
          {/* Subtle gradient scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none" />

          {/* Spatial Overlays & Badges */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className="px-2 py-1 rounded bg-slate-950/80 border border-slate-700/80 text-[11px] font-mono text-cyan-300 backdrop-blur-sm">
              Sensor: Sentinel-2 MSI Multi-Spectral
            </span>
            <span className="px-2 py-1 rounded bg-slate-950/80 border border-slate-700/80 text-[11px] font-mono text-slate-300 backdrop-blur-sm">
              Res: 10m Ground Sample Dist.
            </span>
          </div>

          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
            <div className="space-y-0.5">
              <span className="text-[11px] uppercase tracking-wider text-cyan-400 font-bold block">
                Target Zone: Dongri Buzurg Pit 3 & Balaghat South
              </span>
              <p className="text-xs text-slate-200">
                SWIR Band 11/12 ratio confirms high-grade manganese dioxide enriched strata with minor overburden ponding.
              </p>
            </div>
            <button
              onClick={() => onOpenCopilotWithQuery('Explain the satellite spectral signature of manganese ore deposits in MOIL mines.')}
              className="px-3 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors cursor-pointer shrink-0 shadow-sm"
            >
              Analyze Bands
            </button>
          </div>
        </div>

        {/* Space-to-Mining Risk Correlation Panel (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              Mining Risk Space Correlation
            </h3>
            <span className="text-[11px] font-mono text-emerald-400">Grounded</span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded bg-rose-950/30 border border-rose-900/50 space-y-1">
              <div className="flex items-center justify-between font-semibold text-rose-300">
                <span>1. Haul Road Slickness (Dongri Buzurg Pit 3)</span>
                <span className="font-mono text-rose-400">HIGH RISK</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                68.4mm rainfall + NDWI 0.64 saturated soil index exceeds 0.55 safety threshold. Dumper cycle speeds reduced by 35%.
              </p>
            </div>

            <div className="p-3 rounded bg-amber-950/30 border border-amber-900/50 space-y-1">
              <div className="flex items-center justify-between font-semibold text-amber-300">
                <span>2. Open Pit Sump Water Inflow (Balaghat Bench 2)</span>
                <span className="font-mono text-amber-400">MODERATE</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                SAR radar backscatter shows 14,000 m³ ponding near toe ore lode. Dual 150HP pumps required for 48 hours.
              </p>
            </div>

            <div className="p-3 rounded bg-emerald-950/30 border border-emerald-900/50 space-y-1">
              <div className="flex items-center justify-between font-semibold text-emerald-300">
                <span>3. Mineral Spectral Absorption (Balaghat NE Extension)</span>
                <span className="font-mono text-emerald-400">OPPORTUNITY</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Strong SWIR 2.20µm diagnostic dip (ratio 1.48) aligns with known Braunite-Pyrolusite reef strike. Recommended for exploratory drilling.
              </p>
            </div>
          </div>

          <button
            onClick={onNavigateToSimulator}
            className="w-full py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>Simulate Weather Shift in What-If Engine →</span>
          </button>
        </div>
      </div>

      {/* Earth Observation Sensor Metrics Grid */}
      <div className="p-5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">
              Space Remote Sensing Telemetry Metrics
            </h3>
            <p className="text-xs text-slate-400">
              Correlated with MOIL pit slope stability, rainfall waterlogging, and exploration prospective zones
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-400">Refreshed: T-2h 14m</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMetrics.map((metric, idx) => (
            <div
              key={idx}
              className="p-4 rounded-lg bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-colors space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400 truncate max-w-[200px]" title={metric.parameter}>
                  {metric.parameter}
                </span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                    metric.status === 'Nominal'
                      ? 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60'
                      : metric.status === 'Warning'
                      ? 'text-amber-400 bg-amber-950/60 border-amber-800/60'
                      : 'text-rose-400 bg-rose-950/60 border-rose-800/60'
                  }`}
                >
                  {metric.status}
                </span>
              </div>

              <div className="text-2xl font-bold font-mono text-white">
                {metric.value} <span className="text-sm font-normal text-slate-400">{metric.unit}</span>
              </div>

              <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/80 space-y-1">
                <div>
                  <span className="text-slate-400">Sensor:</span>{' '}
                  <strong className="text-slate-300 font-mono">{metric.sensorSource}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Baseline:</span>{' '}
                  <strong className="text-slate-300 font-mono">{metric.historicalBaseline}</strong>
                </div>
                <p className="text-slate-300 text-[11px] mt-1 italic">
                  {metric.miningImpact}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

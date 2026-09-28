import React, { useState } from 'react';
import {
  Compass,
  Layers,
  Satellite,
  Info,
  ExternalLink,
  Search,
  Filter,
  AlertCircle,
  Sparkles,
  MapPin,
  TrendingUp,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { MineZone, RiskLevel } from '../types/mine';

interface ReserveIntelligenceProps {
  zones: MineZone[];
  onOpenCopilotWithQuery: (q: string) => void;
}

export const ReserveIntelligence: React.FC<ReserveIntelligenceProps> = ({
  zones,
  onOpenCopilotWithQuery
}) => {
  const [selectedSite, setSelectedSite] = useState<string>('All');
  const [selectedPotential, setSelectedPotential] = useState<string>('All');
  const [selectedZone, setSelectedZone] = useState<MineZone | null>(zones[0]);
  const [activeLayer, setActiveLayer] = useState<'all' | 'swir' | 'magnetics' | 'reserves'>('all');

  const filteredZones = zones.filter((zone) => {
    const siteMatch = selectedSite === 'All' || zone.mineSite === selectedSite;
    const potentialMatch = selectedPotential === 'All' || zone.potential === selectedPotential;
    return siteMatch && potentialMatch;
  });

  const totalFilteredReserves = filteredZones.reduce((acc, z) => acc + z.estimatedReserveMT, 0).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Title & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-400" />
            Reserve Intelligence & Exploration Priority
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Geological remote sensing, spectral band absorption, and aeromagnetic anomaly correlation across the Sausar Group
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded p-1 text-xs">
            <span className="text-slate-400 px-2 text-[11px]">Mine Site:</span>
            {['All', 'Balaghat', 'Dongri Buzurg', 'Tirodi', 'Chikla'].map((site) => (
              <button
                key={site}
                onClick={() => setSelectedSite(site)}
                className={`px-2 py-1 rounded text-xs transition-colors cursor-pointer ${
                  selectedSite === site
                    ? 'bg-amber-500 text-slate-950 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {site}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded p-1 text-xs">
            <span className="text-slate-400 px-2 text-[11px]">Potential:</span>
            {['All', 'High', 'Medium', 'Low'].map((pot) => (
              <button
                key={pot}
                onClick={() => setSelectedPotential(pot)}
                className={`px-2 py-1 rounded text-xs transition-colors cursor-pointer ${
                  selectedPotential === pot
                    ? 'bg-amber-500 text-slate-950 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {pot}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mandatory Statutory & AI Disclaimer Banner */}
      <div className="p-3.5 rounded-lg bg-amber-950/40 border border-amber-800/60 flex items-start gap-3 text-xs text-amber-200/90 leading-relaxed">
        <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-amber-300">
            AI-Assisted Exploration Prospecting Disclaimer:
          </span>{' '}
          Reserve potential estimates shown below are derived from multi-sensor space technology (Sentinel-2 SWIR mineral indices, Landsat 9 thermal calibration), ground geophysics (Bouguer gravity, aeromagnetic gradients), and structural lithology interpolation. These constitute prospective exploration hypotheses and do <strong>not</strong> substitute for statutory UNFC/CRIRSCO drill core assay reserves.
        </div>
      </div>

      {/* Interactive Map & Detail Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Interactive Geospatial Belt Map (7 cols) */}
        <div className="lg:col-span-7 p-4 rounded-lg bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-400" />
                Geospatial Manganese Belt Exploration Map
              </h2>
              <span className="text-xs text-slate-400">
                Central India Manganese Province (Maharashtra & Madhya Pradesh)
              </span>
            </div>

            {/* Layer Toggles */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded border border-slate-800 text-[11px]">
              <button
                onClick={() => setActiveLayer('all')}
                className={`px-2 py-0.5 rounded cursor-pointer ${
                  activeLayer === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400'
                }`}
              >
                Composite
              </button>
              <button
                onClick={() => setActiveLayer('swir')}
                className={`px-2 py-0.5 rounded cursor-pointer ${
                  activeLayer === 'swir' ? 'bg-cyan-900/80 text-cyan-300' : 'text-slate-400'
                }`}
              >
                SWIR 2.2µm
              </button>
              <button
                onClick={() => setActiveLayer('magnetics')}
                className={`px-2 py-0.5 rounded cursor-pointer ${
                  activeLayer === 'magnetics' ? 'bg-purple-900/80 text-purple-300' : 'text-slate-400'
                }`}
              >
                Aeromagnetics
              </button>
            </div>
          </div>

          {/* Stylized Geological Coordinate Map Visualizer */}
          <div className="relative w-full h-80 rounded-md bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center p-4">
            {/* Grid overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

            {/* Geological Formation Contour Lines (SVG) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-25">
              <path
                d="M 20 180 Q 150 120, 280 160 T 560 130 T 800 200"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
              <path
                d="M 40 240 Q 200 190, 360 220 T 640 180 T 850 250"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="1.5"
              />
              <path
                d="M 60 90 Q 220 50, 420 90 T 720 70"
                fill="none"
                stroke="#a855f7"
                strokeWidth="1.5"
              />
            </svg>

            {/* Spatial Markers for each MineZone */}
            <div className="absolute inset-0 p-6 flex flex-wrap items-center justify-around">
              {filteredZones.map((zone, idx) => {
                const isSelected = selectedZone?.id === zone.id;
                // Color by potential
                const dotColor =
                  zone.potential === 'High'
                    ? 'bg-emerald-500 border-emerald-300 text-emerald-400'
                    : zone.potential === 'Medium'
                    ? 'bg-amber-500 border-amber-300 text-amber-400'
                    : 'bg-slate-500 border-slate-300 text-slate-400';

                // Normalized relative position
                const topPct = 25 + (idx * 16) % 65;
                const leftPct = 15 + (idx * 21) % 75;

                return (
                  <button
                    key={zone.id}
                    onClick={() => setSelectedZone(zone)}
                    style={{ position: 'absolute', top: `${topPct}%`, left: `${leftPct}%` }}
                    className={`group transition-transform transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 ${
                      isSelected ? 'scale-125 z-20' : 'hover:scale-110'
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shadow-lg transition-all ${
                          zone.potential === 'High'
                            ? 'bg-emerald-500 border-white ring-2 ring-emerald-500/40 animate-pulse'
                            : zone.potential === 'Medium'
                            ? 'bg-amber-500 border-white ring-2 ring-amber-500/40'
                            : 'bg-slate-500 border-slate-300'
                        }`}
                      >
                        <span className="text-[9px] font-bold text-slate-950 font-mono">
                          {zone.explorationPriorityRank}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-medium px-1.5 py-0.5 rounded mt-1 whitespace-nowrap border shadow-sm ${
                          isSelected
                            ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold'
                            : 'bg-slate-900/90 text-slate-300 border-slate-800'
                        }`}
                      >
                        {zone.name.split(' ')[0]} ({zone.potential})
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Map Legend */}
            <div className="absolute bottom-3 left-3 bg-slate-950/90 border border-slate-800 p-2 rounded text-[10px] space-y-1 z-20 backdrop-blur-sm">
              <div className="font-semibold text-slate-300 mb-1">Reserve Potential:</div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-slate-300">High Potential (&gt;43% Mn, SWIR &gt;1.35)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="text-slate-300">Medium Potential (38-42% Mn)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
                <span className="text-slate-300">Low Potential / Greenfield (&lt;38% Mn)</span>
              </div>
            </div>

            <div className="absolute top-3 right-3 text-[10px] font-mono text-slate-400 bg-slate-950/80 px-2 py-1 rounded border border-slate-800">
              CRS: WGS 84 / UTM Zone 44N
            </div>
          </div>

          {/* Map Footer Summary */}
          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <span>
              Showing <strong className="text-slate-200">{filteredZones.length}</strong> Prospective Blocks · Total Estimated Reserve:{' '}
              <strong className="text-amber-300 font-mono">{totalFilteredReserves} MT</strong>
            </span>
            <button
              onClick={() => onOpenCopilotWithQuery('Explain how Sentinel-2 SWIR mineral bands detect pyrolusite manganese ore in Balaghat.')}
              className="text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Spectral Explanation</span>
            </button>
          </div>
        </div>

        {/* Right: Selected Zone Detailed Dossier (5 cols) */}
        <div className="lg:col-span-5 p-4 rounded-lg bg-slate-900/80 border border-slate-800 space-y-4">
          {selectedZone ? (
            <>
              <div className="flex items-start justify-between pb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${
                        selectedZone.potential === 'High'
                          ? 'text-emerald-400 bg-emerald-950/60 border-emerald-800'
                          : selectedZone.potential === 'Medium'
                          ? 'text-amber-400 bg-amber-950/60 border-amber-800'
                          : 'text-slate-400 bg-slate-900 border-slate-800'
                      }`}
                    >
                      {selectedZone.potential} Potential · Priority #{selectedZone.explorationPriorityRank}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {selectedZone.currentStatus}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1">
                    {selectedZone.name}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Site: {selectedZone.mineSite} · Elev: {selectedZone.location.elevationM}m AMSL
                  </p>
                </div>
              </div>

              {/* Quantitative Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800">
                  <div className="text-[11px] text-slate-400">Estimated Reserve</div>
                  <div className="text-lg font-bold font-mono text-amber-300">
                    {selectedZone.estimatedReserveMT} <span className="text-xs font-normal text-slate-400">MT</span>
                  </div>
                </div>

                <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800">
                  <div className="text-[11px] text-slate-400">Average Ore Grade</div>
                  <div className="text-lg font-bold font-mono text-emerald-400">
                    {selectedZone.averageGradeMnPercent}% <span className="text-xs font-normal text-slate-400">Mn</span>
                  </div>
                </div>

                <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800">
                  <div className="text-[11px] text-slate-400">Horizon Depth</div>
                  <div className="text-lg font-bold font-mono text-slate-200">
                    {selectedZone.depthMeters} <span className="text-xs font-normal text-slate-400">meters</span>
                  </div>
                </div>

                <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800">
                  <div className="text-[11px] text-slate-400">AI Confidence Score</div>
                  <div className="text-lg font-bold font-mono text-cyan-400">
                    {selectedZone.confidenceScorePercent}%
                  </div>
                </div>
              </div>

              {/* Geoscientific & Space Telemetry */}
              <div className="space-y-2 text-xs">
                <div className="p-2 rounded bg-slate-950/40 border border-slate-800/80">
                  <span className="text-slate-400 block text-[11px]">Geological Stratigraphy:</span>
                  <span className="font-medium text-slate-200">{selectedZone.formation}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[11px]">
                  <div className="p-1.5 rounded bg-slate-950/40 border border-slate-800/80">
                    <span className="text-slate-400 block text-[10px]">SWIR B11/12</span>
                    <span className="font-mono font-semibold text-cyan-300">{selectedZone.spectralIndexSWIR}</span>
                  </div>
                  <div className="p-1.5 rounded bg-slate-950/40 border border-slate-800/80">
                    <span className="text-slate-400 block text-[10px]">Magnetic Anomaly</span>
                    <span className="font-mono font-semibold text-purple-300">+{selectedZone.magneticAnomalyNT} nT</span>
                  </div>
                  <div className="p-1.5 rounded bg-slate-950/40 border border-slate-800/80">
                    <span className="text-slate-400 block text-[10px]">Gravity Gradient</span>
                    <span className="font-mono font-semibold text-emerald-300">+{selectedZone.gravityAnomalyMGal} mGal</span>
                  </div>
                </div>

                <p className="text-slate-300 text-xs leading-relaxed pt-1">
                  {selectedZone.description}
                </p>
              </div>

              {/* Next Step Recommendation */}
              <div className="p-3 rounded bg-amber-950/30 border border-amber-900/50 text-xs space-y-1">
                <div className="font-semibold text-amber-300 flex items-center justify-between">
                  <span>Recommended Exploration Program:</span>
                  <span className="font-mono text-slate-300">{selectedZone.drillingRequiredM}m Core Drilling</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Accessibility Score: {selectedZone.accessibilityScore}/10 · Target mineral pyrolusite/braunite in footwall contact.
                </p>
              </div>

              <button
                onClick={() => onOpenCopilotWithQuery(`What are the geological and drill parameters for ${selectedZone.name}?`)}
                className="w-full py-2 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-slate-900" />
                <span>Ask AI Copilot About This Block</span>
              </button>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500 text-xs">
              Select a prospective manganese zone from the map to inspect geoscientific telemetry.
            </div>
          )}
        </div>
      </div>

      {/* Exploration Priority Ranking Table */}
      <div className="p-4 rounded-lg bg-slate-900/80 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">
              Exploration Priority Matrix & Core Drilling Budget
            </h3>
            <p className="text-xs text-slate-400">
              Ranked by geological confidence, manganese grade, road accessibility, and estimated tonnage
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-400">Total Program: 11,850m Drilling</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Priority</th>
                <th className="py-2.5 px-3">Zone / Deposit</th>
                <th className="py-2.5 px-3">Mine Site</th>
                <th className="py-2.5 px-3">Potential</th>
                <th className="py-2.5 px-3 text-right">Est. Reserve (MT)</th>
                <th className="py-2.5 px-3 text-right">Grade (% Mn)</th>
                <th className="py-2.5 px-3 text-right">Depth (m)</th>
                <th className="py-2.5 px-3 text-right">SWIR 2.2µm</th>
                <th className="py-2.5 px-3 text-right">Drilling Req.</th>
                <th className="py-2.5 px-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {zones.map((zone) => (
                <tr
                  key={zone.id}
                  onClick={() => setSelectedZone(zone)}
                  className={`hover:bg-slate-800/40 cursor-pointer transition-colors ${
                    selectedZone?.id === zone.id ? 'bg-amber-500/10' : ''
                  }`}
                >
                  <td className="py-2 px-3 font-bold text-amber-400">#{zone.explorationPriorityRank}</td>
                  <td className="py-2 px-3 font-sans font-medium text-slate-200">{zone.name}</td>
                  <td className="py-2 px-3 font-sans text-slate-400">{zone.mineSite}</td>
                  <td className="py-2 px-3">
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded border ${
                        zone.potential === 'High'
                          ? 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60'
                          : zone.potential === 'Medium'
                          ? 'text-amber-400 bg-amber-950/60 border-amber-800/60'
                          : 'text-slate-400 bg-slate-900 border-slate-800'
                      }`}
                    >
                      {zone.potential}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-right text-slate-100 font-bold">{zone.estimatedReserveMT}</td>
                  <td className="py-2 px-3 text-right text-emerald-400">{zone.averageGradeMnPercent}%</td>
                  <td className="py-2 px-3 text-right text-slate-300">{zone.depthMeters}m</td>
                  <td className="py-2 px-3 text-right text-cyan-400">{zone.spectralIndexSWIR}</td>
                  <td className="py-2 px-3 text-right text-slate-400">{zone.drillingRequiredM}m</td>
                  <td className="py-2 px-3 font-sans">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedZone(zone);
                      }}
                      className="text-amber-400 hover:text-amber-300 text-xs font-medium cursor-pointer"
                    >
                      Inspect →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

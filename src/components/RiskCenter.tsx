import React, { useState } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  Cpu,
  CloudRain,
  Flame,
  Layers,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  TrendingDown,
  Wrench
} from 'lucide-react';
import { ShortfallFactor } from '../types/mine';

interface RiskCenterProps {
  factors: ShortfallFactor[];
  onOpenCopilotWithQuery: (q: string) => void;
  onNavigateToSimulator: () => void;
}

export const RiskCenter: React.FC<RiskCenterProps> = ({
  factors,
  onOpenCopilotWithQuery,
  onNavigateToSimulator
}) => {
  const [selectedFactor, setSelectedFactor] = useState<ShortfallFactor | null>(factors[0]);

  const totalShortfallMT = factors.reduce((acc, f) => acc + f.impactTonnageMT, 0);
  const totalRecoveryMT = factors.reduce((acc, f) => acc + f.recoveryPotentialMT, 0);

  return (
    <div className="space-y-6">
      {/* Title & Risk Status Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
            Shortfall Risk Center & Explainable AI (XAI)
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time multi-factor attribution model explaining the root drivers behind production variance
          </p>
        </div>

        <button
          onClick={onNavigateToSimulator}
          className="px-3.5 py-2 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-600 rounded transition-colors cursor-pointer flex items-center gap-1.5 self-start md:self-auto"
        >
          <span>Run What-If Mitigation Test →</span>
        </button>
      </div>

      {/* Hero: Risk Status & Probability Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-4 p-5 rounded-lg bg-gradient-to-b from-rose-950/80 to-slate-900 border border-rose-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
              Current Risk Assessment
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
          </div>

          <div>
            <div className="text-3xl font-black font-mono text-rose-300">
              HIGH RISK
            </div>
            <p className="text-xs text-slate-300 mt-1">
              78.4% Shortfall Probability for Current Quarter
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-rose-900/60 text-xs">
            <div className="flex items-center justify-between text-slate-300">
              <span>Projected Deficit:</span>
              <strong className="font-mono text-rose-400 font-bold">-137,600 MT</strong>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>Target Annual Gap:</span>
              <strong className="font-mono text-rose-400 font-bold">-7.86%</strong>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>Potential AI Recovery:</span>
              <strong className="font-mono text-emerald-400 font-bold">+{totalRecoveryMT.toLocaleString()} MT</strong>
            </div>
          </div>

          <button
            onClick={() => onOpenCopilotWithQuery('Provide an executive briefing on the root causes of the High Shortfall Risk.')}
            className="w-full py-2 text-xs font-semibold text-rose-200 bg-rose-900/60 hover:bg-rose-900 border border-rose-700 rounded transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-300" />
            <span>Generate Executive Briefing</span>
          </button>
        </div>

        {/* Explainable AI SHAP Attribution Breakdown (8 cols) */}
        <div className="lg:col-span-8 p-5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                Explainable AI (XAI): SHAP Feature Attribution Waterfall
              </h2>
              <span className="text-xs text-slate-400">
                Shows exact mathematical percentage contribution of each operational factor to the tonnage deficit
              </span>
            </div>
            <span className="text-[11px] font-mono text-cyan-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
              Base Value: 165k MT/mo
            </span>
          </div>

          {/* Factor Attribution Bars */}
          <div className="space-y-3">
            {factors.map((factor) => {
              const isSelected = selectedFactor?.id === factor.id;
              const absPct = Math.abs(factor.impactPercentage);

              return (
                <div
                  key={factor.id}
                  onClick={() => setSelectedFactor(factor)}
                  className={`p-3 rounded-md transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-slate-950 border-amber-500/80 shadow-md ring-1 ring-amber-500/40'
                      : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded uppercase font-semibold ${
                          factor.category === 'Equipment'
                            ? 'bg-rose-950/80 text-rose-300 border border-rose-800'
                            : factor.category === 'Weather'
                            ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800'
                            : factor.category === 'Operational'
                            ? 'bg-amber-950/80 text-amber-300 border border-amber-800'
                            : 'bg-purple-950/80 text-purple-300 border border-purple-800'
                        }`}
                      >
                        {factor.category}
                      </span>
                      <span className="font-semibold text-slate-200">{factor.factor}</span>
                    </div>

                    <div className="flex items-center gap-3 font-mono">
                      <span className="text-rose-400 font-bold">{factor.impactPercentage}%</span>
                      <span className="text-slate-400">(-{factor.impactTonnageMT.toLocaleString()} MT)</span>
                    </div>
                  </div>

                  {/* Relative bar */}
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden flex">
                    <div
                      style={{ width: `${(absPct / 45) * 100}%` }}
                      className="h-full bg-gradient-to-r from-rose-600 to-rose-400 rounded-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <span>Click any factor above to inspect detailed geological and mechanical root cause analysis below.</span>
            <span className="font-mono text-slate-300">Sum of drivers: -100.0% (-137,600 MT)</span>
          </div>
        </div>
      </div>

      {/* Selected Factor Deep-Dive & Corrective Action */}
      {selectedFactor && (
        <div className="p-5 rounded-lg bg-slate-900/80 border border-amber-500/40 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400">
                <Wrench className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  Root Cause Explanation: {selectedFactor.factor}
                </h3>
                <span className="text-xs text-slate-400">
                  Category: {selectedFactor.category} · Attribution Weight: {selectedFactor.impactPercentage}%
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Recovery Potential:</span>
              <span className="text-sm font-bold font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
                +{selectedFactor.recoveryPotentialMT.toLocaleString()} MT
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded bg-slate-950/60 border border-slate-800 space-y-1.5">
              <span className="font-semibold text-slate-300 block">Mechanical & Operational Analysis:</span>
              <p className="text-slate-400 leading-relaxed">
                {selectedFactor.explanation}
              </p>
            </div>

            <div className="p-3 rounded bg-emerald-950/20 border border-emerald-900/50 space-y-1.5">
              <span className="font-semibold text-emerald-400 block flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Recommended Corrective Action:
              </span>
              <p className="text-emerald-200/90 leading-relaxed">
                {selectedFactor.mitigationAction}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => onOpenCopilotWithQuery(`How can we implement the mitigation for ${selectedFactor.factor}?`)}
              className="px-3.5 py-1.5 text-xs font-medium text-amber-300 bg-amber-950/60 hover:bg-amber-900 border border-amber-800/80 rounded transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask AI Copilot Execution Details</span>
            </button>
            <button
              onClick={onNavigateToSimulator}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors cursor-pointer"
            >
              Test in What-if Simulator →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

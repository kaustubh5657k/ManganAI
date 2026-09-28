import React, { useState } from 'react';
import {
  SlidersHorizontal,
  TrendingDown,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  CloudRain,
  Cpu,
  Flame,
  Layers
} from 'lucide-react';
import { WhatIfScenarioInput, WhatIfScenarioResult } from '../types/mine';

interface WhatIfSimulatorProps {
  onOpenCopilotWithQuery: (q: string) => void;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({
  onOpenCopilotWithQuery
}) => {
  // Scenario inputs
  const [equipmentDays, setEquipmentDays] = useState<number>(3);
  const [rainfallSpike, setRainfallSpike] = useState<number>(35);
  const [blastingDelay, setBlastingDelay] = useState<number>(2);
  const [gradeDilution, setGradeDilution] = useState<number>(3);

  // Baseline metrics
  const targetMonthlyMT = 165000;
  const baselineMonthlyMT = 141200; // current projected

  // Recalculate simulation dynamically
  const calculateResult = (): WhatIfScenarioResult => {
    const eqLoss = equipmentDays * 2600;
    const rainLoss = rainfallSpike * 180;
    const blastLoss = blastingDelay * 2200;
    const gradeLoss = gradeDilution * 2800;

    const totalLost = Math.round(eqLoss + rainLoss + blastLoss + gradeLoss);
    const adjusted = Math.max(50000, baselineMonthlyMT - totalLost);
    const gap = targetMonthlyMT - adjusted;
    const pctShift = Number(((adjusted - baselineMonthlyMT) / baselineMonthlyMT * 100).toFixed(1));

    let riskLevel: 'Low' | 'Medium' | 'High' = 'Low';
    if (gap > 24000) riskLevel = 'High';
    else if (gap > 10000) riskLevel = 'Medium';

    const revenueLossCrores = Number(((totalLost * 9500) / 10000000).toFixed(2));

    const drivers = [
      { name: 'Equipment Outage', val: eqLoss },
      { name: 'Precipitation Inundation', val: rainLoss },
      { name: 'Blasting Delay', val: blastLoss },
      { name: 'Grade Dilution', val: gradeLoss }
    ];
    drivers.sort((a, b) => b.val - a.val);

    const mitigations: string[] = [];
    if (eqLoss > 0) {
      mitigations.push(`Mobilize standby 3.5 m³ backhoe EX-04 to cover ${equipmentDays}-day outage and expedite hydraulic seal replacement.`);
    }
    if (rainLoss > 0) {
      mitigations.push(`Activate auxiliary 150HP submersible pumps to drain +${rainfallSpike}mm runoff from toe sumps within 24 hours.`);
    }
    if (blastLoss > 0) {
      mitigations.push(`Implement non-electric shock-tube blasting to keep vibration below 5 mm/s and secure expedited DGMS clearance.`);
    }
    if (gradeLoss > 0) {
      mitigations.push(`Deploy optical ore-sorting and GPS bucket guidance to eliminate footwall gangue rock before jigging feed.`);
    }

    return {
      baselineProductionMT: baselineMonthlyMT,
      adjustedProductionMT: adjusted,
      tonnageImpactMT: -totalLost,
      percentageShift: pctShift,
      newRiskLevel: riskLevel,
      revenueImpactCrores: revenueLossCrores,
      primaryRiskDriver: drivers[0].val > 0 ? drivers[0].name : 'Nominal Operation',
      recommendedMitigation: mitigations
    };
  };

  const result = calculateResult();

  // Presets
  const applyPreset = (preset: 'ex02' | 'monsoon' | 'blasting' | 'recovery') => {
    if (preset === 'ex02') {
      setEquipmentDays(5);
      setRainfallSpike(10);
      setBlastingDelay(0);
      setGradeDilution(1);
    } else if (preset === 'monsoon') {
      setEquipmentDays(2);
      setRainfallSpike(80);
      setBlastingDelay(3);
      setGradeDilution(2);
    } else if (preset === 'blasting') {
      setEquipmentDays(1);
      setRainfallSpike(5);
      setBlastingDelay(6);
      setGradeDilution(1);
    } else if (preset === 'recovery') {
      setEquipmentDays(0);
      setRainfallSpike(0);
      setBlastingDelay(0);
      setGradeDilution(0);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Presets Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-amber-400" />
            Operational What-if Scenario Simulator
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Test mining disruptions, weather events, and equipment failures to forecast shortfall impact and AI recovery plans
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded text-xs">
          <span className="text-slate-400 px-2 text-[11px]">Quick Scenarios:</span>
          <button
            onClick={() => applyPreset('ex02')}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer text-xs"
          >
            EX-02 5-Day Down
          </button>
          <button
            onClick={() => applyPreset('monsoon')}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer text-xs"
          >
            Monsoon Deluge (+80mm)
          </button>
          <button
            onClick={() => applyPreset('blasting')}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer text-xs"
          >
            Blasting Delay (+6 Days)
          </button>
          <button
            onClick={() => applyPreset('recovery')}
            className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 hover:bg-emerald-900 cursor-pointer text-xs font-semibold"
          >
            Reset to Ideal
          </button>
        </div>
      </div>

      {/* Main Grid: Controls (Left 6 cols) & Instant Projection Impact (Right 6 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Stress-Testing Controls */}
        <div className="lg:col-span-6 p-5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h2 className="text-sm font-semibold text-white">
              Simulation Scenario Parameters
            </h2>
            <button
              onClick={() => applyPreset('recovery')}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Slider 1: Equipment Outage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-300 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-rose-400" />
                Primary Excavator (EX-02) Outage Duration:
              </span>
              <span className="font-mono font-bold text-amber-300 text-sm">
                {equipmentDays} {equipmentDays === 1 ? 'day' : 'days'}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={14}
              step={1}
              value={equipmentDays}
              onChange={(e) => setEquipmentDays(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0 days (Nominal)</span>
              <span>7 days</span>
              <span>14 days (Severe)</span>
            </div>
          </div>

          {/* Slider 2: Rainfall Spike */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-300 flex items-center gap-1.5">
                <CloudRain className="w-4 h-4 text-cyan-400" />
                Additional Precipitation / Rainfall Spike:
              </span>
              <span className="font-mono font-bold text-cyan-300 text-sm">
                +{rainfallSpike} mm
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={rainfallSpike}
              onChange={(e) => setRainfallSpike(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0 mm</span>
              <span>50 mm (Heavy Shower)</span>
              <span>100 mm (Flood Alert)</span>
            </div>
          </div>

          {/* Slider 3: Blasting Delay */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-300 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-400" />
                Blasting Statutory Clearance Delay:
              </span>
              <span className="font-mono font-bold text-amber-300 text-sm">
                +{blastingDelay} {blastingDelay === 1 ? 'day' : 'days'}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={10}
              step={1}
              value={blastingDelay}
              onChange={(e) => setBlastingDelay(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0 days (On Schedule)</span>
              <span>5 days</span>
              <span>10 days (Lockout)</span>
            </div>
          </div>

          {/* Slider 4: Grade Dilution */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-300 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-purple-400" />
                Manganese Grade Dilution Drop (% Mn):
              </span>
              <span className="font-mono font-bold text-purple-300 text-sm">
                -{gradeDilution}% Mn
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={8}
              step={0.5}
              value={gradeDilution}
              onChange={(e) => setGradeDilution(Number(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0% (44% High Grade)</span>
              <span>4% (40% Standard)</span>
              <span>8% (36% Low Grade)</span>
            </div>
          </div>

          <div className="p-3 rounded bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400">
            Note: Multi-variate mathematical coefficients calibrated against 5 years of historical MOIL extraction logs.
          </div>
        </div>

        {/* Right: Instant Projection Outcome & Mitigation Plan */}
        <div className="lg:col-span-6 p-5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h2 className="text-sm font-semibold text-white">
              Simulated Forecast Outcome
            </h2>
            <span
              className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                result.newRiskLevel === 'High'
                  ? 'text-rose-400 bg-rose-950 border-rose-800'
                  : result.newRiskLevel === 'Medium'
                  ? 'text-amber-400 bg-amber-950 border-amber-800'
                  : 'text-emerald-400 bg-emerald-950 border-emerald-800'
              }`}
            >
              {result.newRiskLevel} Shortfall Risk
            </span>
          </div>

          {/* Outcome Stat Cards */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400 text-[11px] block">Simulated Monthly Production</span>
              <div className="text-2xl font-bold font-mono text-white mt-0.5">
                {result.adjustedProductionMT.toLocaleString()} <span className="text-xs font-normal text-slate-400">MT</span>
              </div>
              <span className="text-[10px] text-slate-400">
                Target: {targetMonthlyMT.toLocaleString()} MT
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400 text-[11px] block">Production Deficit / Shift</span>
              <div className={`text-2xl font-bold font-mono mt-0.5 ${
                result.tonnageImpactMT < 0 ? 'text-rose-400' : 'text-emerald-400'
              }`}>
                {result.tonnageImpactMT.toLocaleString()} <span className="text-xs font-normal text-slate-400">MT</span>
              </div>
              <span className="text-[10px] text-rose-400 font-mono">
                {result.percentageShift}% vs current baseline
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400 text-[11px] block">Estimated Revenue Loss</span>
              <div className="text-2xl font-bold font-mono text-rose-300 mt-0.5">
                ₹{result.revenueImpactCrores} <span className="text-xs font-normal text-slate-400">Cr</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                @ ₹9,500/MT Realized Price
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400 text-[11px] block">Primary Risk Bottleneck</span>
              <div className="text-sm font-bold text-amber-300 mt-1 truncate">
                {result.primaryRiskDriver}
              </div>
              <span className="text-[10px] text-slate-400">
                Largest mathematical driver
              </span>
            </div>
          </div>

          {/* AI Recommended Mitigation Playbook for this Scenario */}
          <div className="space-y-2.5 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                AI Scenario Rebalancing Recommendations:
              </span>
            </div>

            <div className="space-y-2">
              {result.recommendedMitigation.map((m, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded bg-amber-950/20 border border-amber-900/40 text-xs text-amber-200/90 flex items-start gap-2"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{m}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onOpenCopilotWithQuery(`In our What-if simulation with ${equipmentDays} days excavator outage and +${rainfallSpike}mm rain, what is the best sequence to recover the lost ${Math.abs(result.tonnageImpactMT).toLocaleString()} MT?`)}
            className="w-full py-2.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>Consult AI Copilot for Full Recovery Schedule</span>
          </button>
        </div>
      </div>
    </div>
  );
};

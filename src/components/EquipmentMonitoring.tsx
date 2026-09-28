import React, { useState } from 'react';
import {
  Cpu,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Gauge,
  Flame,
  Wrench,
  Activity,
  Fuel,
  Filter,
  Sparkles
} from 'lucide-react';
import { Equipment } from '../types/mine';

interface EquipmentMonitoringProps {
  equipmentList: Equipment[];
  onOpenCopilotWithQuery: (q: string) => void;
  onNavigateToSimulator: () => void;
}

export const EquipmentMonitoring: React.FC<EquipmentMonitoringProps> = ({
  equipmentList,
  onOpenCopilotWithQuery,
  onNavigateToSimulator
}) => {
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(
    equipmentList.find(e => e.status === 'Critical Breakdown') || equipmentList[0]
  );

  const filteredEquipment = equipmentList.filter((eq) => {
    const typeMatch = typeFilter === 'All' || eq.type === typeFilter;
    const statusMatch = statusFilter === 'All' || eq.status === statusFilter;
    return typeMatch && statusMatch;
  });

  const operationalCount = equipmentList.filter(e => e.status === 'Operational').length;
  const warningCount = equipmentList.filter(e => e.status === 'Warning').length;
  const criticalCount = equipmentList.filter(e => e.status === 'Critical Breakdown').length;

  return (
    <div className="space-y-6">
      {/* Title & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-amber-400" />
            Heavy Equipment Fleet & Health Monitoring
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            SCADA telematics, IoT vibration sensors, thermal logs, and predictive maintenance schedules
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded p-1 text-xs">
            <span className="text-slate-400 px-2 text-[11px]">Type:</span>
            {['All', 'Excavator', 'Dumper', 'Drill Rig', 'Dewatering Pump'].map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-2 py-0.5 rounded text-xs transition-colors cursor-pointer ${
                  typeFilter === t
                    ? 'bg-amber-500 text-slate-950 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded p-1 text-xs">
            <span className="text-slate-400 px-2 text-[11px]">Status:</span>
            {['All', 'Operational', 'Warning', 'Critical Breakdown'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-2 py-0.5 rounded text-xs transition-colors cursor-pointer ${
                  statusFilter === s
                    ? 'bg-amber-500 text-slate-950 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Fleet KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-slate-900/80 border border-slate-800">
          <div className="text-xs text-slate-400">Total Fleet Monitored</div>
          <div className="text-2xl font-bold font-mono text-white mt-1">
            {equipmentList.length} <span className="text-sm font-normal text-slate-400">Machines</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Excavators, Haulers, Drills, Pumps
          </div>
        </div>

        <div className="p-4 rounded-lg bg-emerald-950/20 border border-emerald-900/50">
          <div className="text-xs text-emerald-400">Nominal Operational</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
            {operationalCount} <span className="text-sm font-normal text-slate-400">Online</span>
          </div>
          <div className="text-[11px] text-emerald-300/80 mt-1">
            Normal telemetry & vibration parameters
          </div>
        </div>

        <div className="p-4 rounded-lg bg-amber-950/20 border border-amber-900/50">
          <div className="text-xs text-amber-400">Maintenance Warnings</div>
          <div className="text-2xl font-bold font-mono text-amber-300 mt-1">
            {warningCount} <span className="text-sm font-normal text-slate-400">Units</span>
          </div>
          <div className="text-[11px] text-amber-300/80 mt-1">
            DP-02 high oil temp, DW-01 impeller wear
          </div>
        </div>

        <div className="p-4 rounded-lg bg-rose-950/30 border border-rose-900/60">
          <div className="text-xs text-rose-400">Critical Breakdown</div>
          <div className="text-2xl font-bold font-mono text-rose-400 mt-1">
            {criticalCount} <span className="text-sm font-normal text-slate-400">Machine</span>
          </div>
          <div className="text-[11px] text-rose-300/80 mt-1 flex items-center justify-between">
            <span>EX-02 Shovel (Seal Burst)</span>
            <button
              onClick={onNavigateToSimulator}
              className="text-rose-400 underline font-medium cursor-pointer"
            >
              Simulate →
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Fleet Table + Selected Machine Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Table List (7 cols) */}
        <div className="lg:col-span-7 p-4 rounded-lg bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">
              Heavy Earth Moving Machinery (HEMM) Telemetry
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Availability: 83.4% (Target: 92%)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 font-mono">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Code</th>
                  <th className="py-2.5 px-3">Equipment</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Health</th>
                  <th className="py-2.5 px-3 text-right">Downtime</th>
                  <th className="py-2.5 px-3 text-right">Vibe (mm/s)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredEquipment.map((eq) => {
                  const isSelected = selectedEquipment?.id === eq.id;
                  return (
                    <tr
                      key={eq.id}
                      onClick={() => setSelectedEquipment(eq)}
                      className={`hover:bg-slate-800/40 cursor-pointer transition-colors ${
                        isSelected ? 'bg-amber-500/10' : ''
                      }`}
                    >
                      <td className="py-2 px-3 font-bold text-amber-400">{eq.code}</td>
                      <td className="py-2 px-3 font-sans font-medium text-slate-200">
                        {eq.name.split('(')[0]}
                      </td>
                      <td className="py-2 px-3 font-sans">
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded border ${
                            eq.status === 'Operational'
                              ? 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60'
                              : eq.status === 'Warning'
                              ? 'text-amber-400 bg-amber-950/60 border-amber-800/60'
                              : 'text-rose-400 bg-rose-950/60 border-rose-800/60 font-bold animate-pulse'
                          }`}
                        >
                          {eq.status}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-right font-bold text-slate-200">
                        {eq.healthScorePercent}%
                      </td>
                      <td className="py-2 px-3 text-right text-rose-400">
                        {eq.downtimeHoursThisMonth}h
                      </td>
                      <td className="py-2 px-3 text-right text-cyan-400">
                        {eq.vibrationMmS}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Machine Telemetry Dossier (5 cols) */}
        <div className="lg:col-span-5 p-4 rounded-lg bg-slate-900/80 border border-slate-800 space-y-4">
          {selectedEquipment ? (
            <>
              <div className="flex items-start justify-between pb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/60 border border-amber-800 px-2 py-0.5 rounded">
                      {selectedEquipment.code}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded border ${
                        selectedEquipment.status === 'Operational'
                          ? 'text-emerald-400 bg-emerald-950 border-emerald-800'
                          : selectedEquipment.status === 'Warning'
                          ? 'text-amber-400 bg-amber-950 border-amber-800'
                          : 'text-rose-400 bg-rose-950 border-rose-800 font-bold'
                      }`}
                    >
                      {selectedEquipment.status}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white mt-1">
                    {selectedEquipment.name}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Assigned: {selectedEquipment.assignedZone}
                  </p>
                </div>
              </div>

              {/* Critical Alert Banner if down */}
              {selectedEquipment.criticalIssue && (
                <div className="p-3 rounded bg-rose-950/40 border border-rose-800/80 text-xs space-y-1">
                  <div className="font-semibold text-rose-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                    <span>Telemetry Alert:</span>
                  </div>
                  <p className="text-rose-200/90 leading-relaxed text-[11px]">
                    {selectedEquipment.criticalIssue}
                  </p>
                </div>
              )}

              {/* Telemetry Sensor Gauges */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-400 text-[11px] block">Health Score</span>
                  <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">
                    {selectedEquipment.healthScorePercent}%
                  </div>
                </div>

                <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-400 text-[11px] block">Bearing Temperature</span>
                  <div className={`text-xl font-bold font-mono mt-0.5 ${
                    selectedEquipment.temperatureC > 95 ? 'text-rose-400' : 'text-slate-200'
                  }`}>
                    {selectedEquipment.temperatureC} °C
                  </div>
                </div>

                <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-400 text-[11px] block">Vibration Velocity</span>
                  <div className={`text-xl font-bold font-mono mt-0.5 ${
                    selectedEquipment.vibrationMmS > 4.5 ? 'text-rose-400' : 'text-cyan-400'
                  }`}>
                    {selectedEquipment.vibrationMmS} mm/s
                  </div>
                </div>

                <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-400 text-[11px] block">Fuel Burn Rate</span>
                  <div className="text-xl font-bold font-mono text-amber-300 mt-0.5">
                    {selectedEquipment.fuelEfficiencyLitersPerHr} L/hr
                  </div>
                </div>
              </div>

              {/* Operational Stats */}
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Total Cumulative Operating Hours:</span>
                  <strong className="font-mono">{selectedEquipment.operatingHoursTotal.toLocaleString()} hrs</strong>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Current Month Downtime:</span>
                  <strong className="font-mono text-rose-400">{selectedEquipment.downtimeHoursThisMonth} hrs</strong>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Mean Time Between Failures (MTBF):</span>
                  <strong className="font-mono text-slate-200">{selectedEquipment.mtbfHours} hrs</strong>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Next Scheduled Preventative Service:</span>
                  <strong className="font-mono text-cyan-300">{selectedEquipment.nextScheduledService}</strong>
                </div>
              </div>

              <button
                onClick={() => onOpenCopilotWithQuery(`What is the production impact and repair timeline for ${selectedEquipment.code}?`)}
                className="w-full py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ask AI Copilot for Diagnostics</span>
              </button>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500 text-xs">
              Select an equipment unit from the left table to inspect live telematics.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

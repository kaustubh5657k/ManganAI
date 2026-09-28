import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { OverviewDashboard } from './components/OverviewDashboard';
import { ReserveIntelligence } from './components/ReserveIntelligence';
import { ProductionForecast } from './components/ProductionForecast';
import { RiskCenter } from './components/RiskCenter';
import { EquipmentMonitoring } from './components/EquipmentMonitoring';
import { SatelliteWeather } from './components/SatelliteWeather';
import { DigitalMine3D } from './components/DigitalMine3D';
import { WhatIfSimulator } from './components/WhatIfSimulator';
import { AICopilot } from './components/AICopilot';
import { SystemArchitectureModal } from './components/SystemArchitectureModal';

import {
  MOIL_MINE_ZONES,
  MONTHLY_PRODUCTION_DATA,
  SHORTFALL_RISK_FACTORS,
  EQUIPMENT_FLEET,
  SATELLITE_WEATHER_METRICS,
  SYSTEM_KPIS
} from './data/mockMineData';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [copilotInitialQuery, setCopilotInitialQuery] = useState<string>('');
  const [isArchitectureModalOpen, setIsArchitectureModalOpen] = useState<boolean>(false);

  // Application operational data state
  const [zones, setZones] = useState(MOIL_MINE_ZONES);
  const [production, setProduction] = useState(MONTHLY_PRODUCTION_DATA);
  const [equipment, setEquipment] = useState(EQUIPMENT_FLEET);
  const [riskFactors, setRiskFactors] = useState(SHORTFALL_RISK_FACTORS);
  const [satelliteMetrics, setSatelliteMetrics] = useState(SATELLITE_WEATHER_METRICS);

  // Attempt to load fresh data from server API endpoints if available
  useEffect(() => {
    fetch('/api/reserves')
      .then(res => res.ok ? res.json() : null)
      .then(json => {
        if (json?.data) setZones(json.data);
      })
      .catch(() => {});

    fetch('/api/production/forecast')
      .then(res => res.ok ? res.json() : null)
      .then(json => {
        if (json?.data) setProduction(json.data);
      })
      .catch(() => {});

    fetch('/api/equipment')
      .then(res => res.ok ? res.json() : null)
      .then(json => {
        if (json?.data) setEquipment(json.data);
      })
      .catch(() => {});

    fetch('/api/risks')
      .then(res => res.ok ? res.json() : null)
      .then(json => {
        if (json?.factors) setRiskFactors(json.factors);
      })
      .catch(() => {});

    fetch('/api/satellite-weather')
      .then(res => res.ok ? res.json() : null)
      .then(json => {
        if (json?.metrics) setSatelliteMetrics(json.metrics);
      })
      .catch(() => {});
  }, []);

  const handleOpenCopilotWithQuery = (query: string) => {
    setCopilotInitialQuery(query);
    setActiveTab('copilot');
  };

  return (
    <div className="min-h-screen bg-[#090d14] text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Bar Contract (3 Zones, Single Line Controls) */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenCopilot={() => setActiveTab('copilot')}
        onOpenArchitecture={() => setIsArchitectureModalOpen(true)}
        shortfallRiskLevel={SYSTEM_KPIS.shortfallRiskLevel}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          shortfallRiskLevel={SYSTEM_KPIS.shortfallRiskLevel}
        />

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
          {activeTab === 'overview' && (
            <OverviewDashboard
              zones={zones}
              production={production}
              equipment={equipment}
              riskFactors={riskFactors}
              onNavigate={setActiveTab}
              onOpenCopilotWithQuery={handleOpenCopilotWithQuery}
            />
          )}

          {activeTab === 'reserves' && (
            <ReserveIntelligence
              zones={zones}
              onOpenCopilotWithQuery={handleOpenCopilotWithQuery}
            />
          )}

          {activeTab === 'production' && (
            <ProductionForecast
              productionData={production}
              onOpenCopilotWithQuery={handleOpenCopilotWithQuery}
              onNavigateToSimulator={() => setActiveTab('what-if')}
            />
          )}

          {activeTab === 'risks' && (
            <RiskCenter
              factors={riskFactors}
              onOpenCopilotWithQuery={handleOpenCopilotWithQuery}
              onNavigateToSimulator={() => setActiveTab('what-if')}
            />
          )}

          {activeTab === 'equipment' && (
            <EquipmentMonitoring
              equipmentList={equipment}
              onOpenCopilotWithQuery={handleOpenCopilotWithQuery}
              onNavigateToSimulator={() => setActiveTab('what-if')}
            />
          )}

          {activeTab === 'satellite-weather' && (
            <SatelliteWeather
              metrics={satelliteMetrics}
              onOpenCopilotWithQuery={handleOpenCopilotWithQuery}
              onNavigateToSimulator={() => setActiveTab('what-if')}
            />
          )}

          {activeTab === 'digital-mine' && (
            <DigitalMine3D
              equipmentList={equipment}
              onOpenCopilotWithQuery={handleOpenCopilotWithQuery}
            />
          )}

          {activeTab === 'what-if' && (
            <WhatIfSimulator
              onOpenCopilotWithQuery={handleOpenCopilotWithQuery}
            />
          )}

          {activeTab === 'copilot' && (
            <AICopilot
              initialQuery={copilotInitialQuery}
              onClearInitialQuery={() => setCopilotInitialQuery('')}
            />
          )}
        </main>
      </div>

      {/* Python FastAPI & PostgreSQL Architecture Blueprint Modal */}
      <SystemArchitectureModal
        isOpen={isArchitectureModalOpen}
        onClose={() => setIsArchitectureModalOpen(false)}
      />
    </div>
  );
}

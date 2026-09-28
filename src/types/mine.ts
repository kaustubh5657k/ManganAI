export type RiskLevel = 'Low' | 'Medium' | 'High';

export interface MineZone {
  id: string;
  name: string;
  mineSite: 'Balaghat' | 'Dongri Buzurg' | 'Tirodi' | 'Chikla' | 'Ukwa' | 'Gumgaon';
  location: {
    lat: number;
    lng: number;
    elevationM: number;
  };
  potential: RiskLevel;
  estimatedReserveMT: number;
  averageGradeMnPercent: number; // e.g., 43.5%
  depthMeters: number;
  formation: string; // e.g. "Mansar Formation (Gondite Series)"
  spectralIndexSWIR: number; // Sentinel-2 band 11/12 ratio
  magneticAnomalyNT: number; // nanoTesla
  gravityAnomalyMGal: number; // mGal
  confidenceScorePercent: number;
  explorationPriorityRank: number;
  accessibilityScore: number; // 1-10
  drillingRequiredM: number;
  currentStatus: 'Active Extraction' | 'Advanced Prospecting' | 'Greenfield Target' | 'Environmental Review';
  description: string;
}

export interface ProductionRecord {
  month: string;
  actualProductionMT?: number;
  targetProductionMT: number;
  forecastProductionMT: number;
  p10OptimisticMT: number;
  p90PessimisticMT: number;
  shortfallGapMT: number;
  rainfallMM: number;
  equipmentUptimePercent: number;
}

export interface ShortfallFactor {
  id: string;
  factor: string;
  category: 'Equipment' | 'Weather' | 'Operational' | 'Geological';
  impactPercentage: number; // e.g. -42.3
  impactTonnageMT: number;
  explanation: string;
  mitigationAction: string;
  recoveryPotentialMT: number;
}

export interface Equipment {
  id: string;
  code: string;
  name: string;
  type: 'Excavator' | 'Dumper' | 'Drill Rig' | 'Dewatering Pump' | 'Crusher';
  assignedZone: string;
  status: 'Operational' | 'Warning' | 'Critical Breakdown' | 'Under Maintenance';
  healthScorePercent: number;
  operatingHoursTotal: number;
  downtimeHoursThisMonth: number;
  fuelEfficiencyLitersPerHr: number;
  vibrationMmS: number; // threshold 4.5 mm/s
  temperatureC: number;
  mtbfHours: number;
  nextScheduledService: string;
  criticalIssue?: string;
}

export interface SatelliteWeatherMetric {
  parameter: string;
  value: string | number;
  unit: string;
  status: 'Nominal' | 'Warning' | 'Critical';
  sensorSource: string; // Sentinel-2, Landsat-9, GPM IMERG, INSAT-3D
  historicalBaseline: string;
  miningImpact: string;
}

export interface WhatIfScenarioInput {
  equipmentUnavailableDays: number;
  selectedEquipmentId: string;
  rainfallSpikeMM: number;
  blastingDelayDays: number;
  gradeDilutionDropPercent: number;
}

export interface WhatIfScenarioResult {
  baselineProductionMT: number;
  adjustedProductionMT: number;
  tonnageImpactMT: number;
  percentageShift: number;
  newRiskLevel: RiskLevel;
  revenueImpactCrores: number;
  primaryRiskDriver: string;
  recommendedMitigation: string[];
}

export interface CopilotMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  citations?: string[];
  suggestedFollowUps?: string[];
}

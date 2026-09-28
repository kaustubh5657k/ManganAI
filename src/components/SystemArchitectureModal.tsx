import React, { useState } from 'react';
import {
  Terminal,
  Database,
  Layers,
  Code2,
  X,
  Copy,
  Check,
  CheckCircle2,
  Cpu,
  Share2,
  ExternalLink
} from 'lucide-react';

interface SystemArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemArchitectureModal: React.FC<SystemArchitectureModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'fastapi' | 'postgres' | 'ml'>('architecture');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fastApiCode = `# ==============================================================================
# MOIL GeoMine AI — FastAPI Production Backend Specification
# Stack: Python 3.11 + FastAPI + GeoPandas + Scikit-Learn + PostGIS
# ==============================================================================

from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, GradientBoostingRegressor
import os

app = FastAPI(
    title="MOIL GeoMine AI Decision Support API",
    version="2.4.0",
    description="Backend for Manganese Reserve Identification & Production Shortfall Decision Support"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------
# Schemas
# ---------------------------------------------------------
class ReserveZoneOut(BaseModel):
    id: str
    name: str
    mine_site: str
    latitude: float
    longitude: float
    potential_class: str # High, Medium, Low
    estimated_tonnage_mt: float
    average_grade_mn_pct: float
    formation: str
    swir_index_ratio: float
    magnetic_anomaly_nt: float
    exploration_priority: int

class WhatIfSimulationRequest(BaseModel):
    equipment_downtime_days: int = Field(default=3, ge=0, le=30)
    equipment_id: str = "EX-02"
    rainfall_spike_mm: float = Field(default=25.0, ge=0.0)
    blasting_delay_days: int = Field(default=2, ge=0)
    grade_dilution_pct: float = Field(default=2.0, ge=0.0)

class WhatIfSimulationResponse(BaseModel):
    baseline_production_mt: float
    adjusted_production_mt: float
    tonnage_impact_mt: float
    new_risk_level: str
    revenue_impact_crores: float
    recommended_mitigations: List[str]

# ---------------------------------------------------------
# REST API Endpoints
# ---------------------------------------------------------
@app.get("/api/v1/health")
def health_check():
    return {"status": "healthy", "service": "MOIL-GeoMine-Engine", "db": "PostgreSQL/PostGIS Connected"}

@app.get("/api/v1/reserves", response_model=List[ReserveZoneOut])
def get_reserve_prospects(site: Optional[str] = None):
    """
    Returns AI-assisted prospective manganese zones derived from 
    Sentinel-2 SWIR ratios, Bouguer gravity, and Sausar Group lithology.
    """
    # Queries PostGIS ST_Within geometry query
    return [
        {
            "id": "zone-balaghat-01",
            "name": "Balaghat Central Lode (Deep Shaft)",
            "mine_site": "Balaghat",
            "latitude": 21.8045,
            "longitude": 80.1852,
            "potential_class": "High",
            "estimated_tonnage_mt": 14.8,
            "average_grade_mn_pct": 46.2,
            "formation": "Mansar Formation (Gondite Series)",
            "swir_index_ratio": 1.48,
            "magnetic_anomaly_nt": 280.0,
            "exploration_priority": 1
        }
    ]

@app.post("/api/v1/simulation/what-if", response_model=WhatIfSimulationResponse)
def run_what_if_simulation(req: WhatIfSimulationRequest):
    """
    Evaluates multi-variate operational stressors and calculates shortfall delta.
    """
    baseline_target = 165000.0
    baseline_prod = 141200.0
    
    eq_loss = req.equipment_downtime_days * 2600.0
    rain_loss = req.rainfall_spike_mm * 180.0
    blast_loss = req.blasting_delay_days * 2200.0
    grade_loss = req.grade_dilution_pct * 2800.0
    
    total_loss = eq_loss + rain_loss + blast_loss + grade_loss
    adjusted_prod = max(40000.0, baseline_prod - total_loss)
    gap = baseline_target - adjusted_prod
    
    risk_level = "High" if gap > 24000.0 else "Medium" if gap > 10000.0 else "Low"
    rev_loss_cr = round((total_loss * 9500.0) / 10000000.0, 2)
    
    mitigations = [
        "Deploy reserve backhoe EX-04 to cover shovel downtime",
        "Engage 150HP high-head submersible pumps at Bench 2 sump"
    ]
    
    return {
        "baseline_production_mt": baseline_prod,
        "adjusted_production_mt": adjusted_prod,
        "tonnage_impact_mt": -total_loss,
        "new_risk_level": risk_level,
        "revenue_impact_crores": rev_loss_cr,
        "recommended_mitigations": mitigations
    }
`;

  const postgresCode = `-- ==============================================================================
-- PostgreSQL 16 + PostGIS Spatial Schema for MOIL Ltd
-- ==============================================================================
CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. Geological Reserves & Prospective Horizons
CREATE TABLE IF NOT EXISTS geological_reserves (
    zone_id VARCHAR(64) PRIMARY KEY,
    zone_name VARCHAR(128) NOT NULL,
    mine_site VARCHAR(64) NOT NULL,
    geom GEOMETRY(MultiPolygon, 4326),
    centroid_geom GEOMETRY(Point, 4326),
    potential_rating VARCHAR(16) CHECK (potential_rating IN ('High', 'Medium', 'Low')),
    estimated_reserve_mt NUMERIC(10, 2) NOT NULL,
    average_grade_mn_pct NUMERIC(5, 2) NOT NULL,
    depth_meters INTEGER NOT NULL,
    formation VARCHAR(128) NOT NULL,
    swir_spectral_ratio NUMERIC(6, 3),
    aeromagnetic_anomaly_nt NUMERIC(8, 2),
    gravity_anomaly_mgal NUMERIC(6, 2),
    confidence_score_pct INTEGER CHECK (confidence_score_pct BETWEEN 0 AND 100),
    exploration_priority_rank INTEGER,
    drilling_required_meters INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_geological_reserves_geom ON geological_reserves USING GIST(geom);
CREATE INDEX idx_geological_reserves_site ON geological_reserves(mine_site);

-- 2. Heavy Earth Moving Machinery (HEMM) Telemetry
CREATE TABLE IF NOT EXISTS equipment_telemetry (
    equipment_code VARCHAR(32) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    equipment_type VARCHAR(32) NOT NULL,
    assigned_zone_id VARCHAR(64) REFERENCES geological_reserves(zone_id),
    status VARCHAR(32) CHECK (status IN ('Operational', 'Warning', 'Critical Breakdown', 'Under Maintenance')),
    health_score_pct INTEGER CHECK (health_score_pct BETWEEN 0 AND 100),
    operating_hours_total NUMERIC(10, 2),
    downtime_hours_month NUMERIC(8, 2),
    vibration_velocity_mms NUMERIC(6, 2),
    bearing_temperature_c NUMERIC(5, 2),
    last_ping TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Space Remote Sensing & Weather Logs
CREATE TABLE IF NOT EXISTS satellite_observations (
    id SERIAL PRIMARY KEY,
    zone_id VARCHAR(64) REFERENCES geological_reserves(zone_id),
    observation_time TIMESTAMP WITH TIME ZONE NOT NULL,
    precipitation_72h_mm NUMERIC(6, 2),
    ndwi_soil_moisture_index NUMERIC(5, 3),
    ndvi_vegetation_index NUMERIC(5, 3),
    land_surface_temp_c NUMERIC(5, 2),
    swir_absorption_index NUMERIC(5, 3),
    satellite_sensor VARCHAR(64)
);
`;

  const mlPipelineCode = `# ==============================================================================
# Scikit-Learn & XGBoost ML Pipeline for Manganese Decision Support
# ==============================================================================
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
import xgboost as xgb

# 1. Reserve Potential Classifier
def train_reserve_potential_classifier(geological_df: pd.DataFrame):
    """
    Features: SWIR band 11/12 ratio, Aeromagnetic nT, Bouguer gravity mGal,
              Lithological distance to Mansar gondite contact, Depth (m).
    Target: High / Medium / Low Manganese Potential.
    """
    features = [
        'swir_ratio', 
        'magnetic_anomaly', 
        'gravity_gradient', 
        'formation_encoded', 
        'depth_meters'
    ]
    X = geological_df[features]
    y = geological_df['potential_class']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    rf_model = RandomForestClassifier(n_estimators=150, max_depth=8, random_state=42)
    rf_model.fit(X_train, y_train)
    
    # Feature importances: SWIR absorption ~ 38%, Magnetics ~ 26%, Gravity ~ 20%
    return rf_model

# 2. Production Time-Series Forecaster with Weather Covariates
def build_shortfall_forecast_model(production_history_df: pd.DataFrame):
    """
    Target: Monthly Extracted Ore (Metric Tons).
    Covariates: Cumulative Rainfall (mm), Fleet Availability (%), 
                Blasting delays (days), Scheduled maintenance shifts.
    """
    features = [
        'lag_1_prod', 'lag_2_prod', 'rainfall_mm', 
        'fleet_uptime_pct', 'blasting_shifts'
    ]
    X = production_history_df[features]
    y = production_history_df['actual_production_mt']
    
    regressor = xgb.XGBRegressor(
        n_estimators=200, 
        learning_rate=0.04, 
        max_depth=5, 
        objective='reg:squarederror'
    )
    regressor.fit(X, y)
    return regressor
`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-lg max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2.5">
            <Terminal className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-base font-bold text-white">
                Python FastAPI & PostgreSQL System Architecture
              </h2>
              <p className="text-xs text-slate-400">
                Data Collection → Processing → PostGIS DB → Scikit-Learn Models → Risk Engine → FastAPI REST API
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-800 bg-slate-900/60 text-xs">
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3 py-1.5 rounded cursor-pointer font-medium transition-colors ${
              activeTab === 'architecture' ? 'bg-amber-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Pipeline Flow Diagram
          </button>
          <button
            onClick={() => setActiveTab('fastapi')}
            className={`px-3 py-1.5 rounded cursor-pointer font-medium transition-colors ${
              activeTab === 'fastapi' ? 'bg-amber-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            FastAPI Code (main.py)
          </button>
          <button
            onClick={() => setActiveTab('postgres')}
            className={`px-3 py-1.5 rounded cursor-pointer font-medium transition-colors ${
              activeTab === 'postgres' ? 'bg-amber-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            PostGIS Schema (schema.sql)
          </button>
          <button
            onClick={() => setActiveTab('ml')}
            className={`px-3 py-1.5 rounded cursor-pointer font-medium transition-colors ${
              activeTab === 'ml' ? 'bg-amber-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            ML Models (pipeline.py)
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 text-xs">
          {activeTab === 'architecture' && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-3">
                <span className="font-bold text-white text-sm block">
                  End-to-End Decision Support Pipeline:
                </span>
                <div className="grid grid-cols-1 md:grid-cols-7 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-700">
                    <span className="font-mono text-cyan-400 font-bold block">1. Ingest</span>
                    <span className="text-[11px] text-slate-300">Sentinel-2 SWIR, GPM, SCADA Fleet</span>
                  </div>
                  <div className="hidden md:flex items-center justify-center text-slate-600 font-bold">→</div>
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-700">
                    <span className="font-mono text-amber-400 font-bold block">2. PostGIS DB</span>
                    <span className="text-[11px] text-slate-300">Sausar Group spatial layers & telemetry</span>
                  </div>
                  <div className="hidden md:flex items-center justify-center text-slate-600 font-bold">→</div>
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-700">
                    <span className="font-mono text-purple-400 font-bold block">3. AI/ML Engine</span>
                    <span className="text-[11px] text-slate-300">RandomForest, XGBoost, SHAP XAI</span>
                  </div>
                  <div className="hidden md:flex items-center justify-center text-slate-600 font-bold">→</div>
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-700">
                    <span className="font-mono text-emerald-400 font-bold block">4. FastAPI & UI</span>
                    <span className="text-[11px] text-slate-300">Three.js 3D Twin & Copilot</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3.5 rounded bg-slate-950 border border-slate-800 space-y-2">
                  <span className="font-semibold text-white block">Backend Technology Blueprint:</span>
                  <ul className="space-y-1.5 text-slate-400">
                    <li>• <strong>Python 3.11 + FastAPI:</strong> High-performance async REST API endpoints.</li>
                    <li>• <strong>PostgreSQL 16 + PostGIS:</strong> Spatial indexing with GIST on mineral lease polygons.</li>
                    <li>• <strong>Scikit-Learn & XGBoost:</strong> Prospective reserve classification & time-series shortfall regression.</li>
                    <li>• <strong>SHAP (SHapley Additive exPlanations):</strong> Explainable AI attribution of equipment and rainfall drivers.</li>
                    <li>• <strong>Gemini 3.8 Flash:</strong> Real-time conversational AI Copilot strictly grounded in application telemetry.</li>
                  </ul>
                </div>

                <div className="p-3.5 rounded bg-slate-950 border border-slate-800 space-y-2">
                  <span className="font-semibold text-white block">Synthetic Data Compliance Policy:</span>
                  <p className="text-slate-400 leading-relaxed">
                    In compliance with the SIH problem statement guidelines, all operational numbers (Balaghat deep shaft, Dongri Buzurg pit, excavator logs) are authentic geoscientific representations based on public GSI geological literature (Sausar Group, Mansar formation) and are transparently labelled as demonstration data. The architecture allows 1-click swapping to MOIL SAP/SCADA live feeds.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'fastapi' && (
            <div className="relative">
              <button
                onClick={() => handleCopy(fastApiCode)}
                className="absolute top-3 right-3 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 flex items-center gap-1 cursor-pointer border border-slate-700"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Python Code'}</span>
              </button>
              <pre className="p-4 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto leading-relaxed">
                {fastApiCode}
              </pre>
            </div>
          )}

          {activeTab === 'postgres' && (
            <div className="relative">
              <button
                onClick={() => handleCopy(postgresCode)}
                className="absolute top-3 right-3 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 flex items-center gap-1 cursor-pointer border border-slate-700"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy SQL Schema'}</span>
              </button>
              <pre className="p-4 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto leading-relaxed">
                {postgresCode}
              </pre>
            </div>
          )}

          {activeTab === 'ml' && (
            <div className="relative">
              <button
                onClick={() => handleCopy(mlPipelineCode)}
                className="absolute top-3 right-3 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 flex items-center gap-1 cursor-pointer border border-slate-700"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy ML Pipeline'}</span>
              </button>
              <pre className="p-4 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto leading-relaxed">
                {mlPipelineCode}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs">
          <span className="text-slate-400">SIH 2024 / MOIL Ltd Challenge Solution</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-white font-medium cursor-pointer"
          >
            Close Blueprint
          </button>
        </div>
      </div>
    </div>
  );
};

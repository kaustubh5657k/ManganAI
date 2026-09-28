import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import {
  MOIL_MINE_ZONES,
  MONTHLY_PRODUCTION_DATA,
  SHORTFALL_RISK_FACTORS,
  EQUIPMENT_FLEET,
  SATELLITE_WEATHER_METRICS,
  SYSTEM_KPIS
} from './src/data/mockMineData';
import { WhatIfScenarioInput, WhatIfScenarioResult } from './src/types/mine';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // API Endpoints for MOIL Mining Decision Support System
  
  // 1. Overall KPIs & Early Warning
  app.get('/api/kpis', (req: Request, res: Response) => {
    res.json({
      status: 'success',
      data: SYSTEM_KPIS,
      earlyWarning: {
        level: SYSTEM_KPIS.shortfallRiskLevel,
        probability: SYSTEM_KPIS.shortfallProbabilityPercent,
        projectedShortfallMT: SYSTEM_KPIS.predictedShortfallMT,
        daysToQuarterEnd: SYSTEM_KPIS.daysToTargetQuarterClose,
        alertTitle: 'Critical Production Shortfall Projected',
        summary: 'Predicted gap of -137,600 MT (-7.86%) against annual production target of 1,750,000 MT due to EX-02 breakdown and bench waterlogging.',
        immediateActionRequired: true
      }
    });
  });

  // 2. Reserve Intelligence & Exploration Priority
  app.get('/api/reserves', (req: Request, res: Response) => {
    const { mineSite, potential } = req.query;
    let filtered = [...MOIL_MINE_ZONES];
    if (mineSite && mineSite !== 'All') {
      filtered = filtered.filter(z => z.mineSite === mineSite);
    }
    if (potential && potential !== 'All') {
      filtered = filtered.filter(z => z.potential === potential);
    }
    res.json({
      status: 'success',
      count: filtered.length,
      data: filtered,
      disclaimer: 'Note: AI-assisted exploration estimates derived from multi-spectral remote sensing, Bouguer gravity gradient, and aeromagnetic anomaly correlation. UNFC standard diamond core drilling is mandatory for statutory reserve certification.'
    });
  });

  // 3. Production Forecast
  app.get('/api/production/forecast', (req: Request, res: Response) => {
    res.json({
      status: 'success',
      data: MONTHLY_PRODUCTION_DATA,
      fiscalYearTarget: SYSTEM_KPIS.fyTargetProductionMT,
      projectedAnnual: SYSTEM_KPIS.projectedAnnualProductionMT,
      confidenceBands: {
        p10Optimistic: 1690000,
        p50Expected: 1612400,
        p90Pessimistic: 1515000
      }
    });
  });

  // 4. Shortfall Risk & Explainable AI factors
  app.get('/api/risks', (req: Request, res: Response) => {
    res.json({
      status: 'success',
      currentRiskLevel: SYSTEM_KPIS.shortfallRiskLevel,
      probability: SYSTEM_KPIS.shortfallProbabilityPercent,
      projectedShortfallMT: SYSTEM_KPIS.predictedShortfallMT,
      factors: SHORTFALL_RISK_FACTORS,
      explainableSummary: 'RandomForest and XGBoost attribution models determine that 42.3% of the projected shortfall stems from primary excavator downtime (EX-02 seal burst), followed by 27.1% from monsoon bench waterlogging at Balaghat and Dongri Buzurg.'
    });
  });

  // 5. Equipment Fleet Monitoring
  app.get('/api/equipment', (req: Request, res: Response) => {
    res.json({
      status: 'success',
      totalUnits: EQUIPMENT_FLEET.length,
      operationalUnits: EQUIPMENT_FLEET.filter(e => e.status === 'Operational').length,
      warningUnits: EQUIPMENT_FLEET.filter(e => e.status === 'Warning').length,
      criticalUnits: EQUIPMENT_FLEET.filter(e => e.status === 'Critical Breakdown').length,
      fleetAvailabilityPercent: SYSTEM_KPIS.equipmentAvailabilityPercent,
      data: EQUIPMENT_FLEET
    });
  });

  // 6. Satellite & Weather Intelligence
  app.get('/api/satellite-weather', (req: Request, res: Response) => {
    res.json({
      status: 'success',
      lastPassTimestamp: new Date().toISOString(),
      satellites: ['ESA Sentinel-2A/B', 'NASA/USGS Landsat 9', 'ISRO RISAT-1B SAR', 'INSAT-3DR'],
      metrics: SATELLITE_WEATHER_METRICS,
      geoCorrelations: [
        {
          zone: 'Dongri Buzurg Pit 3',
          risk: 'High Haul Road Slicking',
          trigger: 'NDWI 0.64 + 68mm rain exceeding infiltration rate',
          suggestedAction: 'Deploy grader MG-01 with aggregate road ballast'
        },
        {
          zone: 'Balaghat NE Strike',
          risk: 'High Exploration Prospective',
          trigger: 'SWIR 2.20µm absorption ratio 1.48 with 280 nT magnetic anomaly',
          suggestedAction: 'Schedule 3 deep diamond core boreholes (400m)'
        }
      ]
    });
  });

  // 7. What-If Scenario Simulator
  app.post('/api/what-if', (req: Request, res: Response) => {
    const input: WhatIfScenarioInput = req.body;
    const baselineMonthlyTarget = 165000;
    const baselineProduction = 141200; // current projected March production

    // Mathematical simulation engine
    // Equipment impact: ~2,400 MT lost per day of excavator outage
    const eqImpact = (input.equipmentUnavailableDays || 0) * 2600;
    // Weather impact: 150 MT lost per mm of rainfall above normal (normal is 15mm)
    const rainImpact = Math.max(0, (input.rainfallSpikeMM || 0)) * 180;
    // Blasting delay: 2,100 MT delayed per day of blasting permit hold
    const blastImpact = (input.blastingDelayDays || 0) * 2200;
    // Grade dilution impact: 1% drop in Mn grade requires 2.2% more ROM ore processing = ~2,800 MT yield loss
    const gradeImpact = (input.gradeDilutionDropPercent || 0) * 2800;

    const totalLostMT = Math.round(eqImpact + rainImpact + blastImpact + gradeImpact);
    const adjustedProductionMT = Math.max(50000, baselineProduction - totalLostMT);
    const shortfallMT = baselineMonthlyTarget - adjustedProductionMT;
    const percentageShift = Number(((adjustedProductionMT - baselineProduction) / baselineProduction * 100).toFixed(1));

    let newRiskLevel: 'Low' | 'Medium' | 'High' = 'Low';
    if (shortfallMT > 22000) {
      newRiskLevel = 'High';
    } else if (shortfallMT > 8000) {
      newRiskLevel = 'Medium';
    }

    // Revenue impact: MOIL average realized price ~ ₹9,500 per MT of high-grade manganese ore
    const revenueImpactCrores = Number(((totalLostMT * 9500) / 10000000).toFixed(2));

    // Determine primary driver
    const impacts = [
      { name: 'Equipment Downtime', val: eqImpact },
      { name: 'Rainfall Inundation', val: rainImpact },
      { name: 'Blasting Clearance Delay', val: blastImpact },
      { name: 'Grade Dilution', val: gradeImpact }
    ];
    impacts.sort((a, b) => b.val - a.val);
    const primaryDriver = impacts[0].val > 0 ? impacts[0].name : 'Baseline Steady Operations';

    const mitigationList: string[] = [];
    if (eqImpact > 0) {
      mitigationList.push(`Mobilize auxiliary 3.5 m³ backhoe EX-04 and initiate 24/7 dual mechanic shifts on ${input.selectedEquipmentId || 'EX-02'}.`);
    }
    if (rainImpact > 0) {
      mitigationList.push('Commission auxiliary 150HP diesel dewatering pumps to clear bench toe sumps within 18 hours.');
    }
    if (blastImpact > 0) {
      mitigationList.push('Adopt non-electric (NONEL) detonator sequencing to maintain vibration velocity below 5 mm/s for accelerated DGMS approval.');
    }
    if (gradeImpact > 0) {
      mitigationList.push('Engage optical mineral sorting plant and selective bucket mining to reduce silica contamination in feed.');
    }
    if (mitigationList.length === 0) {
      mitigationList.push('Maintain regular preventative maintenance and optimize haul cycle dispatching.');
    }

    const result: WhatIfScenarioResult = {
      baselineProductionMT: baselineProduction,
      adjustedProductionMT,
      tonnageImpactMT: -totalLostMT,
      percentageShift,
      newRiskLevel,
      revenueImpactCrores,
      primaryRiskDriver: primaryDriver,
      recommendedMitigation: mitigationList
    };

    res.json({
      status: 'success',
      input,
      result
    });
  });

  // 8. AI Mining Copilot powered by Gemini API (or domain fallback)
  app.post('/api/copilot', async (req: Request, res: Response) => {
    const { question, conversationHistory } = req.body;
    if (!question) {
      res.status(400).json({ error: 'Question is required' });
      return;
    }

    // Prepare ground truth context from the current MOIL dataset
    const contextPrompt = `
You are the "MOIL GeoMine AI Copilot", an expert mining engineer and geoscientist supporting Manganese Ore India Limited (MOIL Ltd).
Your job is to answer queries STRICTLY based on the provided operational, satellite, and geological telemetry data.

CURRENT MOIL DATA SNAPSHOT:
- Potential Reserves: 48.6 MT total (Balaghat Central Lode: 14.8 MT @ 46.2% Mn; Balaghat NE Extension: 8.6 MT @ 43.8% Mn; Dongri Buzurg Pit: 7.2 MT @ 44.5% Mn; Chikla Deep: 5.3 MT @ 44.0% Mn; Tirodi: 4.1 MT @ 41.0% Mn).
- Geological Formation: Sausar Group (Mansar Formation gondite and braunite strata, Sitasaongi quartz schist).
- Satellite Observations: Sentinel-2 SWIR band 11/12 ratio (1.48 at Balaghat NE indicates pyrolusite-braunite absorption); Soil moisture NDWI: 0.64 (warning: exceeds 0.55 slope stability threshold); 72h Rainfall: 68.4 mm (causing haul road slickness).
- Annual Target: 1,750,000 MT. Projected Annual Production: 1,612,400 MT. Projected Shortfall: -137,600 MT (-7.86%, HIGH RISK).
- Equipment Health: Fleet availability at 83.4% (target 92%). Primary Excavator EX-02 (5.5 m³) has a CRITICAL BREAKDOWN (hydraulic cylinder seal burst, 86 hours downtime). Dewatering pump DW-01 impeller worn (-22% flow).
- Shortfall Root Causes: 42.3% equipment breakdown, 27.1% weather waterlogging, 16.4% blasting delays, 8.2% grade dilution, 6.0% haul road congestion.

User Question: "${question}"

Provide a concise, direct, professional response with quantitative figures, clear root causes, and actionable mining recommendations. Do not make up facts outside this mining domain context. Use bullet points where appropriate.
    `;

    try {
      if (process.env.GEMINI_API_KEY) {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const geminiResponse = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: contextPrompt,
        });

        res.json({
          status: 'success',
          answer: geminiResponse.text,
          model: 'gemini-3.8-flash',
          citations: ['MOIL Telemetry DB', 'Sentinel-2 MSI Level-2A', 'SCADA Fleet Logger']
        });
        return;
      }
    } catch (err) {
      console.warn('Gemini API call failed or unconfigured, utilizing domain inference fallback:', err);
    }

    // Deterministic Domain Inference Engine Fallback
    const qLower = question.toLowerCase();
    let fallbackAnswer = '';
    let citations = ['MOIL Geological Survey', 'SCADA Fleet Logs'];

    if (qLower.includes('shortfall') || qLower.includes('production') || qLower.includes('cause')) {
      fallbackAnswer = `**Root Cause Analysis for Projected Production Shortfall (-137,600 MT / -7.86%):**\n\n` +
        `1. **Critical Equipment Outage (42.3% of shortfall / 58,200 MT):** Primary shovel **EX-02** suffered a hydraulic pump seal rupture at Dongri Buzurg Pit 3, causing 86 hours of downtime.\n` +
        `2. **Unseasonal Inundation (27.1% / 37,300 MT):** GPM satellite recorded 68.4mm rainfall in 72 hours, elevating NDWI soil moisture to 0.64 (above 0.55 threshold) and flooding the toe bench.\n` +
        `3. **Blasting Clearance Delays (16.4% / 22,500 MT):** DGMS vibration reviews delayed northern boundary blasting permits by 4 shifts.\n\n` +
        `**Recommended Mitigation:** Mobilize reserve shovel EX-04 to Bench 4, run high-head pumps DP-02 & DP-05 continuously, and shift to electronic delay detonators to expedite blasting clearance.`;
      citations.push('Shortfall Risk Engine v2.1', 'Fleet Telemetry SCADA');
    } else if (qLower.includes('zone 3') || qLower.includes('pit 3') || qLower.includes('dongri')) {
      fallbackAnswer = `**Dongri Buzurg Pit 3 Status & Risk Profile:**\n\n` +
        `- **Risk Level:** **HIGH RISK**\n` +
        `- **Key Bottlenecks:** Primary excavator **EX-02 (5.5 m³)** is non-operational due to hydraulic seal burst. In addition, localized runoff has pooled in the lower toe, reducing dumper turnaround times by 40%.\n` +
        `- **Ore Potential:** 7.2 MT @ 44.5% Mn. High dioxide purity ideal for electrolytic manganese dioxide (EMD).\n` +
        `- **Corrective Action:** Dispatch backup backhoe EX-04 immediately and activate mobile dewatering pump DW-02 to reopen haul ramp B.`;
      citations.push('Dongri Buzurg Mine Log', 'Sentinel-2 NDWI Moisture Map');
    } else if (qLower.includes('ex-02') || qLower.includes('excavator') || qLower.includes('equipment')) {
      fallbackAnswer = `**Excavator EX-02 Diagnostic & Impact:**\n\n` +
        `- **Machine:** Tata Hitachi EX1200 (5.5 m³ bucket capacity), assigned to Dongri Buzurg Pit 3.\n` +
        `- **Failure Mode:** Hydraulic cylinder seal failure and pump cavitation with operating temperature exceeding 104°C.\n` +
        `- **Production Impact:** Losing approximately **2,600 MT of ore per idle day** (~₹24.7 Lakhs daily revenue impact).\n` +
        `- **Action Plan:** Emergency replacement seal assembly dispatched from Nagpur depot. Expected recovery within 36 hours. Auxiliary excavator EX-03 reallocated to maintain feed.`;
      citations.push('HEMM Telemetry Controller', 'SAP PM Work Orders');
    } else if (qLower.includes('reserve') || qLower.includes('explore') || qLower.includes('satellite') || qLower.includes('potential')) {
      fallbackAnswer = `**AI-Assisted Manganese Reserve Intelligence:**\n\n` +
        `- **Highest Priority Target:** **Balaghat North-East Extension** (Estimated 8.6 MT @ 43.8% Mn).\n` +
        `- **Satellite Evidence:** Sentinel-2 SWIR band ratio 11/12 shows a distinct diagnostic absorption peak of 1.48 at 2.20 µm, correlated with a +280 nT aeromagnetic anomaly.\n` +
        `- **Total Prospect Base:** 48.6 MT across 8 key blocks in the Sausar Group Mansar Formation.\n` +
        `- **Action:** Recommended 2,400 meters of diamond core drilling along the NE strike to upgrade inferred reserves to UNFC Code 111 category.`;
      citations.push('Sentinel-2 SWIR Spectral Classifier', 'GSI Aeromagnetic Atlas');
    } else {
      fallbackAnswer = `**MOIL GeoMine Intelligence Summary:**\n\n` +
        `Current operational fleet availability is **83.4%** against a 92% benchmark. Annual production is forecasted at **1,612,400 MT** against the 1,750,000 MT target.\n\n` +
        `Key focus areas for immediate decision support:\n` +
        `1. Repair excavator **EX-02** to recover ~36,000 MT this month.\n` +
        `2. Drain waterlogged benches in Balaghat Open Bench 2 to normalize haul truck cycle times.\n` +
        `3. Fast-track diamond core drilling at the high-confidence **Balaghat NE Prospective Extension** (8.6 MT estimated reserve).`;
    }

    res.json({
      status: 'success',
      answer: fallbackAnswer,
      model: 'rule-and-geostatistical-engine',
      citations
    });
  });

  // Mount Vite in development mode or serve static files in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MOIL GeoMine Decision Support Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  Box,
  Eye,
  Layers,
  RotateCcw,
  Sparkles,
  Info,
  Maximize2,
  AlertTriangle,
  Compass,
  Cpu,
  Droplets
} from 'lucide-react';
import { Equipment } from '../types/mine';

interface DigitalMine3DProps {
  equipmentList: Equipment[];
  onOpenCopilotWithQuery: (q: string) => void;
}

interface SelectedBenchInfo {
  name: string;
  depthM: number;
  gradeMn: number;
  reserveTons: number;
  status: 'Active Excavation' | 'Waterlogged' | 'Stripping Overburden' | 'Drilling & Blasting';
  activeEquipment: string[];
  risk: 'Low' | 'Medium' | 'High';
  hazardNotes: string;
}

export const DigitalMine3D: React.FC<DigitalMine3DProps> = ({
  equipmentList,
  onOpenCopilotWithQuery
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedItem, setSelectedItem] = useState<SelectedBenchInfo | null>({
    name: 'Bench 4 (Primary Manganese Lode)',
    depthM: 140,
    gradeMn: 44.5,
    reserveTons: 185000,
    status: 'Active Excavation',
    activeEquipment: ['Tata Hitachi EX-02 (DOWN)', 'BEML Dumper DP-01'],
    risk: 'High',
    hazardNotes: 'Primary shovel EX-02 hydraulic failure. Ore extraction halted on southern face.'
  });

  const [showOreBody, setShowOreBody] = useState<boolean>(true);
  const [showEquipment, setShowEquipment] = useState<boolean>(true);
  const [showWaterHazard, setShowWaterHazard] = useState<boolean>(true);
  const [showRiskRings, setShowRiskRings] = useState<boolean>(true);
  const [isRotating, setIsRotating] = useState<boolean>(true);

  // References to three objects for runtime toggles
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const oreGroupRef = useRef<THREE.Group | null>(null);
  const equipmentGroupRef = useRef<THREE.Group | null>(null);
  const hazardGroupRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene & Background matching dark industrial theme
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x090d14);
    scene.fog = new THREE.FogExp2(0x090d14, 0.007);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    cameraRef.current = camera;
    camera.position.set(45, 35, 55);
    camera.lookAt(0, -4, 0);

    // 3. Renderer with antialias
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    rendererRef.current = renderer;
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 4. Studio Three-Point Lighting
    // Key Light (warm directional sunlight)
    const keyLight = new THREE.DirectionalLight(0xfff4e6, 1.6);
    keyLight.position.set(40, 60, 30);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    // Fill Light (cool sky ambient)
    const fillLight = new THREE.HemisphereLight(0x38bdf8, 0x0f172a, 0.8);
    scene.add(fillLight);

    // Rim Light (sharp contour edge highlight)
    const rimLight = new THREE.DirectionalLight(0xf59e0b, 0.7);
    rimLight.position.set(-40, 20, -30);
    scene.add(rimLight);

    // 5. Construct Terraced Open-Cast Mine Benches
    const mineGroup = new THREE.Group();
    scene.add(mineGroup);

    // Ground Surrounding Terrain Rim
    const rimGeo = new THREE.RingGeometry(28, 48, 36);
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.9,
      metalness: 0.1,
      side: THREE.DoubleSide
    });
    const rimMesh = new THREE.Mesh(rimGeo, rimMat);
    rimMesh.rotation.x = -Math.PI / 2;
    rimMesh.position.y = 0;
    rimMesh.receiveShadow = true;
    mineGroup.add(rimMesh);

    // Terraced Benches (Bench 1 at y=0 down to Bench 6 at y=-15)
    const benchesData = [
      { radiusTop: 28, radiusBottom: 24, height: 2.5, y: -1.25, color: 0x334155, name: 'Bench 1 (Overburden Stripping)' },
      { radiusTop: 24, radiusBottom: 20, height: 2.5, y: -3.75, color: 0x273549, name: 'Bench 2 (Weathered Schist)' },
      { radiusTop: 20, radiusBottom: 16, height: 2.5, y: -6.25, color: 0x1f2937, name: 'Bench 3 (Transition Zone)' },
      { radiusTop: 16, radiusBottom: 12, height: 3.0, y: -9.0, color: 0x111827, name: 'Bench 4 (Primary Manganese Lode)' },
      { radiusTop: 12, radiusBottom: 8, height: 3.0, y: -12.0, color: 0x0d121c, name: 'Bench 5 (Deep Pyrolusite Bed)' },
      { radiusTop: 8, radiusBottom: 4, height: 2.5, y: -14.75, color: 0x080c14, name: 'Pit Sump & Sump Basin' }
    ];

    benchesData.forEach((b, idx) => {
      const benchGeo = new THREE.CylinderGeometry(
        b.radiusTop,
        b.radiusBottom,
        b.height,
        36,
        1,
        true
      );
      const benchMat = new THREE.MeshStandardMaterial({
        color: b.color,
        roughness: 0.85,
        metalness: 0.2,
        side: THREE.DoubleSide
      });
      const benchMesh = new THREE.Mesh(benchGeo, benchMat);
      benchMesh.position.y = b.y;
      benchMesh.receiveShadow = true;
      benchMesh.castShadow = true;
      benchMesh.userData = { isBench: true, index: idx + 1, name: b.name };
      mineGroup.add(benchMesh);

      // Horizontal step floor for each bench
      const floorGeo = new THREE.RingGeometry(b.radiusBottom, b.radiusTop, 36);
      const floorMat = new THREE.MeshStandardMaterial({
        color: b.color,
        roughness: 0.9,
        metalness: 0.15,
        side: THREE.DoubleSide
      });
      const floorMesh = new THREE.Mesh(floorGeo, floorMat);
      floorMesh.rotation.x = -Math.PI / 2;
      floorMesh.position.y = b.y - b.height / 2;
      floorMesh.receiveShadow = true;
      mineGroup.add(floorMesh);
    });

    // Pit Bottom Sump Floor
    const pitFloorGeo = new THREE.CircleGeometry(4, 32);
    const pitFloorMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.95
    });
    const pitFloorMesh = new THREE.Mesh(pitFloorGeo, pitFloorMat);
    pitFloorMesh.rotation.x = -Math.PI / 2;
    pitFloorMesh.position.y = -16.0;
    pitFloorMesh.receiveShadow = true;
    mineGroup.add(pitFloorMesh);

    // 6. High-Grade Manganese Ore Vein Body (Dark sub-metallic layer)
    const oreGroup = new THREE.Group();
    oreGroupRef.current = oreGroup;
    scene.add(oreGroup);

    const oreGeo = new THREE.TorusGeometry(14, 1.8, 16, 36, Math.PI * 1.3);
    const oreMat = new THREE.MeshStandardMaterial({
      color: 0x1e1e24, // Lustrous dark pyrolusite manganese black
      roughness: 0.35,
      metalness: 0.85,
      emissive: 0x221a36,
      emissiveIntensity: 0.3
    });
    const oreMesh = new THREE.Mesh(oreGeo, oreMat);
    oreMesh.rotation.x = Math.PI / 2.3;
    oreMesh.rotation.z = 0.4;
    oreMesh.position.set(-1, -9.5, 0);
    oreMesh.castShadow = true;
    oreGroup.add(oreMesh);

    // Underground Shaft Entry & Adit Tunnel Marker
    const shaftGeo = new THREE.BoxGeometry(3, 3, 6);
    const shaftMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.5 });
    const shaftMesh = new THREE.Mesh(shaftGeo, shaftMat);
    shaftMesh.position.set(24, 0.5, -8);
    mineGroup.add(shaftMesh);

    // 7. Equipment 3D Models / Markers
    const equipmentGroup = new THREE.Group();
    equipmentGroupRef.current = equipmentGroup;
    scene.add(equipmentGroup);

    // Helper: Excavator Model
    const createExcavator = (x: number, y: number, z: number, isCritical: boolean) => {
      const exGrp = new THREE.Group();
      // Body
      const bodyGeo = new THREE.BoxGeometry(2.4, 1.4, 1.8);
      const bodyMat = new THREE.MeshStandardMaterial({
        color: isCritical ? 0xef4444 : 0xf59e0b, // red if down, amber if operating
        roughness: 0.4,
        metalness: 0.6
      });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      body.castShadow = true;
      exGrp.add(body);

      // Boom arm
      const boomGeo = new THREE.CylinderGeometry(0.2, 0.3, 3.2);
      const boomMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 });
      const boom = new THREE.Mesh(boomGeo, boomMat);
      boom.position.set(1.4, 1.2, 0);
      boom.rotation.z = -Math.PI / 3.5;
      exGrp.add(boom);

      // Tracks
      const trackGeo = new THREE.BoxGeometry(2.8, 0.5, 2.2);
      const trackMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.9 });
      const track = new THREE.Mesh(trackGeo, trackMat);
      track.position.y = -0.7;
      exGrp.add(track);

      exGrp.position.set(x, y, z);
      return exGrp;
    };

    // Shovel EX-02 (Dongri Buzurg Pit 3, Bench 4 - Critical Breakdown)
    const ex02 = createExcavator(10, -8.3, 5, true);
    equipmentGroup.add(ex02);

    // Shovel EX-01 (Bench 2 - Running)
    const ex01 = createExcavator(-14, -3.1, -10, false);
    equipmentGroup.add(ex01);

    // Helper: Haul Dumper Truck
    const createDumper = (x: number, y: number, z: number, rotY: number) => {
      const dGrp = new THREE.Group();
      const cabGeo = new THREE.BoxGeometry(1.2, 1.0, 1.4);
      const cabMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8 });
      const cab = new THREE.Mesh(cabGeo, cabMat);
      cab.position.set(-0.8, 0.3, 0);
      dGrp.add(cab);

      const bedGeo = new THREE.BoxGeometry(2.2, 1.2, 1.6);
      const bedMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.6 });
      const bed = new THREE.Mesh(bedGeo, bedMat);
      bed.position.set(0.6, 0.5, 0);
      bed.castShadow = true;
      dGrp.add(bed);

      dGrp.position.set(x, y, z);
      dGrp.rotation.y = rotY;
      return dGrp;
    };

    const dumper1 = createDumper(15, -5.5, -4, 0.8);
    const dumper2 = createDumper(-6, -11.2, 7, -1.2);
    equipmentGroup.add(dumper1);
    equipmentGroup.add(dumper2);

    // 8. Water Inundation Hazard Pool (Translucent blue water at Pit Sump)
    const hazardGroup = new THREE.Group();
    hazardGroupRef.current = hazardGroup;
    scene.add(hazardGroup);

    const waterGeo = new THREE.CircleGeometry(5.2, 32);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      transparent: true,
      opacity: 0.65,
      roughness: 0.1,
      metalness: 0.3
    });
    const waterMesh = new THREE.Mesh(waterGeo, waterMat);
    waterMesh.rotation.x = -Math.PI / 2;
    waterMesh.position.set(0, -15.2, 0);
    hazardGroup.add(waterMesh);

    // 9. Risk Rings (Pulse circles indicating warning zones)
    const riskRingGeo = new THREE.RingGeometry(10.5, 11.5, 36);
    const riskRingMat = new THREE.MeshBasicMaterial({
      color: 0xef4444,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7
    });
    const riskRing = new THREE.Mesh(riskRingGeo, riskRingMat);
    riskRing.rotation.x = -Math.PI / 2;
    riskRing.position.y = -8.8;
    hazardGroup.add(riskRing);

    // 10. Animation Loop & Orbit interaction
    let animationFrameId: number;
    let angle = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (isRotating) {
        angle += 0.0025;
        camera.position.x = Math.sin(angle) * 58;
        camera.position.z = Math.cos(angle) * 58;
        camera.lookAt(0, -6, 0);
      }

      // Gentle pulsing of hazard ring
      if (riskRing) {
        riskRing.scale.setScalar(1 + Math.sin(Date.now() * 0.004) * 0.04);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isRotating]);

  // Update layer visibilities on state change
  useEffect(() => {
    if (oreGroupRef.current) oreGroupRef.current.visible = showOreBody;
    if (equipmentGroupRef.current) equipmentGroupRef.current.visible = showEquipment;
    if (hazardGroupRef.current) {
      hazardGroupRef.current.visible = showWaterHazard || showRiskRings;
    }
  }, [showOreBody, showEquipment, showWaterHazard, showRiskRings]);

  // Camera presets
  const setCameraPreset = (preset: 'overview' | 'topDown' | 'bench4' | 'sump') => {
    setIsRotating(false);
    if (!cameraRef.current) return;
    const cam = cameraRef.current;
    if (preset === 'overview') {
      cam.position.set(45, 35, 55);
      cam.lookAt(0, -5, 0);
    } else if (preset === 'topDown') {
      cam.position.set(0, 75, 1);
      cam.lookAt(0, -8, 0);
    } else if (preset === 'bench4') {
      cam.position.set(22, 5, 20);
      cam.lookAt(0, -9, 0);
      setSelectedItem({
        name: 'Bench 4 (Primary Manganese Lode)',
        depthM: 140,
        gradeMn: 44.5,
        reserveTons: 185000,
        status: 'Active Excavation',
        activeEquipment: ['Tata Hitachi EX-02 (DOWN)', 'BEML Dumper DP-01'],
        risk: 'High',
        hazardNotes: 'Primary shovel EX-02 hydraulic failure. Ore extraction halted on southern face.'
      });
    } else if (preset === 'sump') {
      cam.position.set(12, -8, 14);
      cam.lookAt(0, -15, 0);
      setSelectedItem({
        name: 'Pit Sump (Waterlogging Basin)',
        depthM: 210,
        gradeMn: 38.0,
        reserveTons: 65000,
        status: 'Waterlogged',
        activeEquipment: ['Flygt 150HP Dewatering Pump DW-01'],
        risk: 'High',
        hazardNotes: '14,000 m³ slurry water accumulation from 68.4mm rainfall. Sump pump operating at 78% capacity.'
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Box className="w-5 h-5 text-amber-400" />
            3D Digital Mine & Spatial Twin
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Interactive Three.js volumetric visualization of MOIL Dongri Buzurg Open Cast Pit & Balaghat Underground Entry
          </p>
        </div>

        {/* Camera Views */}
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded text-xs">
          <span className="text-slate-400 px-2 text-[11px]">Camera:</span>
          <button
            onClick={() => setCameraPreset('overview')}
            className="px-2 py-0.5 rounded text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            Aerial 45°
          </button>
          <button
            onClick={() => setCameraPreset('topDown')}
            className="px-2 py-0.5 rounded text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            Top-Down
          </button>
          <button
            onClick={() => setCameraPreset('bench4')}
            className="px-2 py-0.5 rounded text-amber-300 hover:bg-slate-800 cursor-pointer font-semibold"
          >
            Bench 4 (Lode)
          </button>
          <button
            onClick={() => setCameraPreset('sump')}
            className="px-2 py-0.5 rounded text-cyan-300 hover:bg-slate-800 cursor-pointer"
          >
            Pit Sump
          </button>
          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`px-2 py-0.5 rounded text-[11px] font-mono cursor-pointer border ${
              isRotating
                ? 'bg-amber-500/20 text-amber-300 border-amber-600'
                : 'text-slate-400 border-slate-700'
            }`}
          >
            {isRotating ? 'Auto-Orbit ON' : 'Paused'}
          </button>
        </div>
      </div>

      {/* Main 3D Viewport with HUD Layering */}
      <div className="relative w-full h-[520px] rounded-lg border border-slate-800 overflow-hidden bg-slate-950">
        {/* Three.js Canvas container */}
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* HUD Overlay - Top Left: Layer Toggles */}
        <div className="absolute top-3 left-3 bg-slate-950/85 border border-slate-800 p-2.5 rounded-md backdrop-blur-md z-10 space-y-1.5 text-xs">
          <div className="font-semibold text-slate-300 text-[11px] mb-1 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>Digital Twin Layers:</span>
          </div>

          <label className="flex items-center gap-2 text-slate-300 cursor-pointer hover:text-white">
            <input
              type="checkbox"
              checked={showOreBody}
              onChange={(e) => setShowOreBody(e.target.checked)}
              className="accent-amber-500 rounded"
            />
            <span>Manganese Ore Body (Dark Pyrolusite)</span>
          </label>

          <label className="flex items-center gap-2 text-slate-300 cursor-pointer hover:text-white">
            <input
              type="checkbox"
              checked={showEquipment}
              onChange={(e) => setShowEquipment(e.target.checked)}
              className="accent-amber-500 rounded"
            />
            <span>HEMM Fleet Markers (EX-01, EX-02)</span>
          </label>

          <label className="flex items-center gap-2 text-slate-300 cursor-pointer hover:text-white">
            <input
              type="checkbox"
              checked={showWaterHazard}
              onChange={(e) => setShowWaterHazard(e.target.checked)}
              className="accent-cyan-500 rounded"
            />
            <span>Sump Inundation Hazard</span>
          </label>

          <label className="flex items-center gap-2 text-slate-300 cursor-pointer hover:text-white">
            <input
              type="checkbox"
              checked={showRiskRings}
              onChange={(e) => setShowRiskRings(e.target.checked)}
              className="accent-rose-500 rounded"
            />
            <span>Critical Shortfall Alert Ring</span>
          </label>
        </div>

        {/* HUD Overlay - Top Right: Quick Bench Selector */}
        <div className="absolute top-3 right-3 bg-slate-950/85 border border-slate-800 p-2.5 rounded-md backdrop-blur-md z-10 text-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">
            Volumetric Bench Inspection:
          </span>
          <div className="flex flex-col gap-1">
            {[
              { name: 'Bench 2 (Stripping)', depthM: 60, gradeMn: 28.5, reserveTons: 40000, risk: 'Low', status: 'Stripping Overburden', activeEquipment: ['Excavator EX-01'], hazardNotes: 'Routine waste rock stripping.' },
              { name: 'Bench 4 (Primary Manganese Lode)', depthM: 140, gradeMn: 44.5, reserveTons: 185000, risk: 'High', status: 'Active Excavation', activeEquipment: ['Tata Hitachi EX-02 (DOWN)', 'BEML Dumper DP-01'], hazardNotes: 'Primary shovel EX-02 broken down (-58.2k MT shortfall impact).' },
              { name: 'Bench 5 (Deep Pyrolusite Bed)', depthM: 180, gradeMn: 46.2, reserveTons: 220000, risk: 'Medium', status: 'Drilling & Blasting', activeEquipment: ['Sandvik Drill DR-01'], hazardNotes: 'Blasting clearance pending DGMS review.' },
              { name: 'Pit Sump Floor', depthM: 210, gradeMn: 38.0, reserveTons: 65000, risk: 'High', status: 'Waterlogged', activeEquipment: ['Flygt Dewatering Pump DW-01'], hazardNotes: '14,000 m³ rainwater accumulation requiring dual pumping.' }
            ].map((b, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedItem(b as any)}
                className={`px-2 py-1 rounded text-left text-[11px] transition-colors cursor-pointer ${
                  selectedItem?.name === b.name
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                {b.name}
              </button>
            ))}
          </div>
        </div>

        {/* HUD Overlay - Bottom: Selected Zone / Bench Inspector Drawer */}
        {selectedItem && (
          <div className="absolute bottom-3 left-3 right-3 bg-slate-950/90 border border-slate-800 p-3 rounded-md backdrop-blur-md z-10 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">
                  {selectedItem.name}
                </span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                    selectedItem.risk === 'High'
                      ? 'text-rose-400 bg-rose-950 border-rose-800 font-bold'
                      : selectedItem.risk === 'Medium'
                      ? 'text-amber-400 bg-amber-950 border-amber-800'
                      : 'text-emerald-400 bg-emerald-950 border-emerald-800'
                  }`}
                >
                  {selectedItem.risk} Risk · {selectedItem.status}
                </span>
              </div>
              <p className="text-slate-400 text-[11px] max-w-2xl leading-relaxed">
                {selectedItem.hazardNotes}
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono shrink-0">
              <div>
                <span className="text-[10px] text-slate-400 block font-sans">Ore Grade:</span>
                <strong className="text-emerald-400 text-sm">{selectedItem.gradeMn}% Mn</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-sans">Available:</span>
                <strong className="text-amber-300 text-sm">{selectedItem.reserveTons.toLocaleString()} MT</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-sans">Depth:</span>
                <strong className="text-slate-200 text-sm">{selectedItem.depthM}m</strong>
              </div>
              <button
                onClick={() => onOpenCopilotWithQuery(`Explain the extraction status and hazards on ${selectedItem.name}.`)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors cursor-pointer flex items-center gap-1 font-sans"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ask AI</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Explanation of 3D Model Construction */}
      <div className="p-3 rounded bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
        <span>
          3D Digital Twin constructed from MOIL pit survey coordinates, LiDAR bench contours, and Sentinel-2 elevation baselines.
        </span>
        <span className="font-mono text-cyan-400">Three.js WebGL Engine</span>
      </div>
    </div>
  );
};

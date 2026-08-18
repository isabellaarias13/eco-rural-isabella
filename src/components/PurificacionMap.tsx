import React, { useState, useEffect } from 'react';
import { MapPin, Truck as TruckIcon, AlertTriangle, CheckCircle, Navigation, Info, Zap } from 'lucide-react';
import { PURIFICACION_VEREDAS, PURIFICACION_TOWN_CENTER } from '../models/veredasData';
import { RuralRoute, Truck, IncidentAlert } from '../types';

interface PurificacionMapProps {
  activeRoutes: RuralRoute[];
  trucks: Truck[];
  alerts?: IncidentAlert[];
  onSelectVereda?: (veredaName: string) => void;
  selectedVereda?: string | null;
  compact?: boolean;
}

export const PurificacionMap: React.FC<PurificacionMapProps> = ({
  activeRoutes,
  trucks,
  alerts = [],
  onSelectVereda,
  selectedVereda,
  compact = false
}) => {
  const [activeTruckIndex, setActiveTruckIndex] = useState(0);
  const [hoveredVereda, setHoveredVereda] = useState<string | null>(null);
  const [truckStep, setTruckStep] = useState(0);

  // Animated truck simulation between veredas along route
  useEffect(() => {
    const timer = setInterval(() => {
      setTruckStep(prev => (prev + 1) % 100);
    }, 150);
    return () => clearInterval(timer);
  }, []);

  // Compute live animated coordinates for the active truck in Chenche / Las Damas
  const activeRoute = activeRoutes[0];
  const activeVereda = activeRoute ? PURIFICACION_VEREDAS.find(v => v.name === activeRoute.veredaName) : null;
  
  // Starting point (Town center) to target vereda
  const startX = PURIFICACION_TOWN_CENTER.x;
  const startY = PURIFICACION_TOWN_CENTER.y;
  const endX = activeVereda ? activeVereda.mapCoords.x : 180;
  const endY = activeVereda ? activeVereda.mapCoords.y : 120;

  // Linear / curve interpolation for visual simulation
  const progressRatio = (Math.sin((truckStep / 100) * Math.PI * 2) + 1) / 2;
  const truckX = startX + (endX - startX) * progressRatio;
  const truckY = startY + (endY - startY) * progressRatio;

  const currentHover = hoveredVereda 
    ? PURIFICACION_VEREDAS.find(v => v.name === hoveredVereda) 
    : (selectedVereda ? PURIFICACION_VEREDAS.find(v => v.name === selectedVereda) : activeVereda);

  return (
    <div id="purificacion-rural-map-container" className="bg-emerald-950 rounded-2xl border border-emerald-800 shadow-xl overflow-hidden relative">
      {/* Map Header Bar */}
      <div className="bg-emerald-900/90 backdrop-blur-sm px-4 py-3 border-b border-emerald-800 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-700/80 flex items-center justify-center text-emerald-300">
            <Navigation className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>Georreferenciación & Rutas en Vivo</span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full font-mono border border-emerald-500/40">
                Purificación, Tolima
              </span>
            </h3>
            <p className="text-[11px] text-emerald-300/80">Monitoreo satelital y paradas en veredas rurales</p>
          </div>
        </div>

        {/* Live status badge */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1.5 bg-emerald-800/80 px-2.5 py-1 rounded-md text-emerald-100">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="font-semibold">{activeRoutes.length} Rutas en Marcha</span>
          </div>
        </div>
      </div>

      {/* Main SVG Interactive Map Canvas */}
      <div className={`relative w-full ${compact ? 'h-[320px]' : 'h-[440px]'} bg-gradient-to-b from-emerald-950 via-teal-950 to-slate-950 p-2 select-none overflow-hidden`}>
        {/* Decorative Grid and River */}
        <svg 
          viewBox="0 0 540 400" 
          className="w-full h-full object-contain filter drop-shadow-md"
        >
          <defs>
            <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#0369a1" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#075985" stopOpacity="0.5" />
            </linearGradient>
            <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(16, 185, 129, 0.07)" strokeWidth="1" />
            </pattern>
          </defs>

          {/* Background Grid */}
          <rect width="540" height="400" fill="url(#grid)" />

          {/* Simulated River Magdalena Flow */}
          <path
            d="M 340 0 C 330 80, 360 140, 320 200 C 290 250, 340 320, 330 400"
            fill="none"
            stroke="url(#riverGrad)"
            strokeWidth="16"
            strokeLinecap="round"
          />
          <text x="345" y="50" fill="#38bdf8" fontSize="9" opacity="0.6" fontStyle="italic">
            Río Magdalena
          </text>

          {/* Route Trail Lines from Purificación Town Center to Veredas */}
          {PURIFICACION_VEREDAS.map(vereda => {
            const hasActiveRoute = activeRoutes.some(r => r.veredaName === vereda.name);
            return (
              <line
                key={`line-${vereda.id}`}
                x1={PURIFICACION_TOWN_CENTER.x}
                y1={PURIFICACION_TOWN_CENTER.y}
                x2={vereda.mapCoords.x}
                y2={vereda.mapCoords.y}
                stroke={hasActiveRoute ? '#10b981' : '#065f46'}
                strokeWidth={hasActiveRoute ? '2.5' : '1'}
                strokeDasharray={hasActiveRoute ? '4 2' : '2 4'}
                opacity={hasActiveRoute ? 0.9 : 0.4}
              />
            );
          })}

          {/* Town Center Node (Purificación Cabecera) */}
          <g transform={`translate(${PURIFICACION_TOWN_CENTER.x}, ${PURIFICACION_TOWN_CENTER.y})`}>
            <circle r="14" fill="#047857" opacity="0.4" />
            <circle r="9" fill="#10b981" />
            <circle r="4" fill="#ffffff" />
            <text x="0" y="-14" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
              Purificación (Centro)
            </text>
          </g>

          {/* Vereda Nodes */}
          {PURIFICACION_VEREDAS.map(vereda => {
            const isSelected = selectedVereda === vereda.name || hoveredVereda === vereda.name;
            const hasRoute = activeRoutes.some(r => r.veredaName === vereda.name);
            const hasAlert = alerts.some(a => a.veredaName === vereda.name && a.status !== 'atendida');

            return (
              <g
                key={vereda.id}
                transform={`translate(${vereda.mapCoords.x}, ${vereda.mapCoords.y})`}
                className="cursor-pointer transition-all duration-200"
                onMouseEnter={() => setHoveredVereda(vereda.name)}
                onMouseLeave={() => setHoveredVereda(null)}
                onClick={() => onSelectVereda && onSelectVereda(vereda.name)}
              >
                {/* Glow ring if selected or active route */}
                {isSelected && (
                  <circle r="16" fill="#34d399" opacity="0.3" className="animate-ping" />
                )}

                {hasRoute && (
                  <circle r="12" fill="#10b981" opacity="0.2" />
                )}

                {/* Main Node Circle */}
                <circle
                  r={isSelected ? '9' : (hasRoute ? '8' : '6')}
                  fill={hasAlert ? '#ef4444' : (hasRoute ? '#10b981' : (isSelected ? '#34d399' : '#059669'))}
                  stroke="#ffffff"
                  strokeWidth={isSelected ? '2' : '1'}
                />

                {/* Alert indicator badge on vereda */}
                {hasAlert && (
                  <circle r="4" cx="6" cy="-6" fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />
                )}

                {/* Vereda Label */}
                <text
                  x="0"
                  y="16"
                  fill={isSelected ? '#34d399' : (hasRoute ? '#a7f3d0' : '#9ca3af')}
                  fontSize={isSelected ? '9.5' : '8'}
                  fontWeight={isSelected || hasRoute ? 'bold' : 'normal'}
                  textAnchor="middle"
                  className="pointer-events-none drop-shadow"
                >
                  {vereda.name}
                </text>
              </g>
            );
          })}

          {/* Live Simulated Moving Truck Icon on active route */}
          {activeRoute && (
            <g transform={`translate(${truckX}, ${truckY})`}>
              <circle r="12" fill="#f59e0b" opacity="0.3" className="animate-pulse" />
              <rect x="-10" y="-8" width="20" height="16" rx="4" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx="-5" cy="8" r="2.5" fill="#1e293b" />
              <circle cx="5" cy="8" r="2.5" fill="#1e293b" />
              <text x="0" y="-12" fill="#fef08a" fontSize="8.5" fontWeight="bold" textAnchor="middle">
                {activeRoute.truckNumber} ({activeRoute.veredaName})
              </text>
            </g>
          )}
        </svg>

        {/* Floating Telemetry & Info Overlay Box */}
        {currentHover && (
          <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:w-80 bg-emerald-900/95 backdrop-blur-md p-3.5 rounded-xl border border-emerald-700/80 shadow-2xl text-white animate-in fade-in slide-in-from-bottom-2">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  {currentHover.zone} &middot; Purificación
                </span>
                <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span>Vereda {currentHover.name}</span>
                </h4>
              </div>
              <span className="text-[11px] font-semibold bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded">
                {currentHover.distanceKmFromCenter} km de cabecera
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2.5 pt-2 border-t border-emerald-800/80 text-[11px]">
              <div>
                <p className="text-emerald-300/80">Viviendas / Fincas:</p>
                <p className="font-bold text-white">{currentHover.householdsCount} predios ({currentHover.populationEstimate} hab.)</p>
              </div>
              <div>
                <p className="text-emerald-300/80">Vocación Rural:</p>
                <p className="font-bold text-white truncate">{currentHover.mainActivity}</p>
              </div>
            </div>

            {/* If there's an active route in this vereda */}
            {activeRoutes.find(r => r.veredaName === currentHover.name) ? (
              <div className="mt-2 pt-2 border-t border-emerald-800/80 flex items-center justify-between text-xs bg-emerald-950/60 p-2 rounded-lg">
                <div className="flex items-center space-x-1.5 text-amber-300 font-semibold">
                  <TruckIcon className="w-3.5 h-3.5" />
                  <span>Camión {activeRoutes.find(r => r.veredaName === currentHover.name)?.truckNumber} en ruta</span>
                </div>
                <span className="text-emerald-300 text-[11px] font-medium">
                  {activeRoutes.find(r => r.veredaName === currentHover.name)?.driverName}
                </span>
              </div>
            ) : (
              <div className="mt-2 text-[10px] text-emerald-300/70 flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-emerald-400" />
                <span>Sector programado según cronograma semanal de aseo.</span>
              </div>
            )}
          </div>
        )}

        {/* Map Legend Overlay */}
        <div className="hidden sm:flex absolute top-3 right-3 bg-emerald-950/80 backdrop-blur-sm p-2 rounded-lg border border-emerald-800 text-[10px] text-emerald-200 flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span>Ruta Activa Hoy</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <span>Ubicación Camión</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
            <span>Alerta Reportada</span>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { 
  Truck as TruckIcon, 
  MapPin, 
  Navigation, 
  AlertTriangle, 
  CheckCircle, 
  Layers, 
  Info, 
  Activity,
  Radio,
  Clock,
  Gauge
} from 'lucide-react';
import { PURIFICACION_VEREDAS, PURIFICACION_TOWN_CENTER } from '../models/veredasData';
import { CollectionRoute, Truck, CommunityAlert } from '../types';

interface PurificacionMapProps {
  activeRoutes?: CollectionRoute[];
  trucks?: Truck[];
  alerts?: CommunityAlert[];
  onSelectVereda?: (veredaName: string) => void;
  selectedVereda?: string | null;
  compact?: boolean;
}

export const PurificacionMap: React.FC<PurificacionMapProps> = ({
  activeRoutes = [],
  trucks = [],
  alerts = [],
  onSelectVereda,
  selectedVereda,
  compact = false
}) => {
  const [selectedTruckIndex, setSelectedTruckIndex] = useState(0);
  const [hoveredVereda, setHoveredVereda] = useState<string | null>(null);
  const [truckStep, setTruckStep] = useState(0);

  // Animated truck simulation between veredas along route
  useEffect(() => {
    const timer = setInterval(() => {
      setTruckStep(prev => (prev + 1) % 100);
    }, 120);
    return () => clearInterval(timer);
  }, []);

  const safeTrucks = Array.isArray(trucks) ? trucks : [];
  const safeRoutes = Array.isArray(activeRoutes) ? activeRoutes : [];
  const safeAlerts = Array.isArray(alerts) ? alerts : [];

  // Filter trucks currently active or with active routes
  const activeTrucksList = safeTrucks.filter(t => t.status === 'en_servicio' || t.status === 'disponible');
  const focusedTruck = activeTrucksList[selectedTruckIndex] || activeTrucksList[0] || safeTrucks[0];

  // Match corresponding route for focused truck
  const focusedRoute = safeRoutes.find(r => r.truckId === focusedTruck?.id) || safeRoutes[0];
  const targetVereda = PURIFICACION_VEREDAS.find(v => v.name === (focusedRoute?.veredaName || focusedTruck?.currentVereda || focusedTruck?.serviceZone)) || PURIFICACION_VEREDAS[0];

  // Coordinates for primary truck animation
  const startX = PURIFICACION_TOWN_CENTER.x;
  const startY = PURIFICACION_TOWN_CENTER.y;
  const endX = targetVereda ? targetVereda.mapCoords.x : 180;
  const endY = targetVereda ? targetVereda.mapCoords.y : 120;

  // Smooth sinusoidal progress
  const progressRatio = (Math.sin((truckStep / 100) * Math.PI * 2) + 1) / 2;
  const truckX = startX + (endX - startX) * progressRatio;
  const truckY = startY + (endY - startY) * progressRatio;

  // Second truck animation (offset cycle)
  const truck2 = activeTrucksList[1] || safeTrucks[1];
  const route2 = safeRoutes.find(r => r.truckId === truck2?.id) || safeRoutes[1];
  const vereda2 = PURIFICACION_VEREDAS.find(v => v.name === (route2?.veredaName || truck2?.currentVereda || truck2?.serviceZone)) || PURIFICACION_VEREDAS[4];
  const progress2 = (Math.cos((truckStep / 100) * Math.PI * 2) + 1) / 2;
  const truck2X = startX + ((vereda2?.mapCoords.x || 300) - startX) * progress2;
  const truck2Y = startY + ((vereda2?.mapCoords.y || 260) - startY) * progress2;

  const currentHover = hoveredVereda 
    ? PURIFICACION_VEREDAS.find(v => v.name === hoveredVereda) 
    : (selectedVereda ? PURIFICACION_VEREDAS.find(v => v.name === selectedVereda) : targetVereda);

  return (
    <div id="purificacion-rural-map-container" className="bg-emerald-950 rounded-2xl border border-emerald-800 shadow-xl overflow-hidden relative">
      {/* Map Header Bar */}
      <div className="bg-emerald-900/90 backdrop-blur-sm px-4 py-3 border-b border-emerald-800 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-700/80 flex items-center justify-center text-amber-300">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <span>Mapa Satelital Veredal &middot; GPS En Vivo</span>
              <span className="flex items-center gap-1 bg-emerald-800/80 text-emerald-200 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-600/50">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Rastreo Activo</span>
              </span>
            </h3>
            <p className="text-[11px] text-emerald-300">
              Purificación Tolima &middot; Cobertura sobre {PURIFICACION_VEREDAS.length} veredas y cuenca del Río Magdalena
            </p>
          </div>
        </div>

        {/* Truck Switcher Pills */}
        <div className="flex items-center space-x-1.5 bg-emerald-950/80 p-1 rounded-xl border border-emerald-800 text-xs">
          {activeTrucksList.slice(0, 3).map((truck, idx) => (
            <button
              key={truck.id}
              onClick={() => setSelectedTruckIndex(idx)}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center space-x-1.5 transition-all cursor-pointer ${
                selectedTruckIndex === idx
                  ? 'bg-amber-400 text-emerald-950 shadow-md'
                  : 'text-emerald-200 hover:text-white hover:bg-emerald-900/50'
              }`}
            >
              <TruckIcon className="w-3.5 h-3.5" />
              <span>{truck.number}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main SVG Interactive Map Canvas */}
      <div className={`relative w-full ${compact ? 'h-[340px]' : 'h-[460px]'} bg-gradient-to-b from-emerald-950 via-teal-950 to-slate-950 p-2 select-none overflow-hidden`}>
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
                opacity={hasActiveRoute ? 0.9 : 0.35}
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
            const hasRoute = safeRoutes.some(r => r.veredaName === vereda.name);
            const hasAlert = safeAlerts.some(a => a.veredaName === vereda.name && a.status !== 'atendida');

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

          {/* REAL-TIME TRUCK 1 (Carrito 01 - Principal) */}
          <g transform={`translate(${truckX}, ${truckY})`} className="cursor-pointer">
            {/* Pulsing Radar Circle */}
            <circle r="18" fill="#f59e0b" opacity="0.25" className="animate-ping" />
            <circle r="12" fill="#d97706" opacity="0.4" />
            
            {/* Truck Graphic Body */}
            <rect x="-12" y="-9" width="24" height="17" rx="3" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
            {/* Cabin */}
            <rect x="5" y="-7" width="6" height="13" rx="1.5" fill="#fef08a" />
            {/* Wheels */}
            <circle cx="-6" cy="9" r="2.8" fill="#0f172a" stroke="#ffffff" strokeWidth="0.8" />
            <circle cx="6" cy="9" r="2.8" fill="#0f172a" stroke="#ffffff" strokeWidth="0.8" />

            {/* Truck Tag & Speed */}
            <rect x="-32" y="-23" width="64" height="13" rx="3" fill="#1e293b" opacity="0.9" />
            <text x="0" y="-14" fill="#fef08a" fontSize="8" fontWeight="bold" textAnchor="middle">
              {focusedTruck?.number || focusedTruck?.model || 'Camión 01'} (En vivo)
            </text>
          </g>

          {/* REAL-TIME TRUCK 2 (Carrito 02 - Secundario en ruta Baicora/Damas) */}
          {truck2 && (
            <g transform={`translate(${truck2X}, ${truck2Y})`} className="cursor-pointer">
              <circle r="14" fill="#38bdf8" opacity="0.2" className="animate-pulse" />
              <rect x="-10" y="-8" width="20" height="15" rx="3" fill="#0284c7" stroke="#ffffff" strokeWidth="1.2" />
              <rect x="4" y="-6" width="5" height="11" rx="1" fill="#bae6fd" />
              <circle cx="-5" cy="8" r="2.5" fill="#0f172a" stroke="#ffffff" strokeWidth="0.6" />
              <circle cx="5" cy="8" r="2.5" fill="#0f172a" stroke="#ffffff" strokeWidth="0.6" />
              <rect x="-28" y="-21" width="56" height="12" rx="3" fill="#0f172a" opacity="0.9" />
              <text x="0" y="-12" fill="#7dd3fc" fontSize="7.5" fontWeight="bold" textAnchor="middle">
                {truck2?.number || truck2?.plate || 'Camión 02'}
              </text>
            </g>
          )}
        </svg>

        {/* Floating Telemetry & Info Overlay Box ("EL CUADRO DE UBICACIÓN") */}
        <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:w-88 bg-emerald-950/95 backdrop-blur-md p-3.5 rounded-2xl border border-emerald-700/80 shadow-2xl text-white animate-in fade-in slide-in-from-bottom-2">
          {/* Header of Cuadro */}
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-1.5 text-amber-300">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-wider">
                  GPS Satelital &middot; {currentHover?.zone || 'Tolima'}
                </span>
              </div>
              <h4 className="text-sm font-black text-white flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Vereda {currentHover?.name}</span>
              </h4>
            </div>
            <span className="text-[11px] font-bold bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded-lg border border-emerald-700">
              {currentHover?.distanceKmFromCenter} km del casco
            </span>
          </div>

          {/* REAL-TIME TRUCK WIDGET INSIDE THE BOX ("En el cuadro se ve el carrito en tiempo real") */}
          <div className="mt-2.5 p-2.5 bg-gradient-to-r from-emerald-900/90 to-teal-900/90 rounded-xl border border-emerald-600/50 shadow-inner">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <div className="flex items-center space-x-1.5 font-bold text-amber-300">
                <TruckIcon className="w-4 h-4 text-amber-400 animate-bounce" />
                <span>{focusedTruck?.model || focusedTruck?.number || 'Camión Compactador 01'}</span>
              </div>
              <span className="text-[10px] bg-amber-400 text-emerald-950 font-black px-1.5 py-0.2 rounded-full uppercase">
                En Ruta
              </span>
            </div>

            {/* Live Progress Bar with Mini Moving Truck */}
            <div className="relative w-full h-4 bg-emerald-950/80 rounded-full border border-emerald-800 flex items-center px-1 overflow-hidden my-1">
              <div 
                className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-amber-400 transition-all duration-300"
                style={{ width: `${Math.round(progressRatio * 100)}%` }}
              ></div>
              {/* Mini Truck icon on the progress track */}
              <div 
                className="absolute text-amber-300 transition-all duration-300 flex items-center"
                style={{ left: `calc(${Math.round(progressRatio * 92)}% + 2px)` }}
              >
                <TruckIcon className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-1 mt-2 text-[10px] text-emerald-200">
              <div className="flex items-center gap-1">
                <Gauge className="w-3 h-3 text-emerald-400" />
                <span><strong>28</strong> km/h</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-400" />
                <span><strong>~12</strong> min</span>
              </div>
              <div className="text-right truncate">
                <span className="text-amber-200 font-bold">{focusedTruck?.plate || 'WZF-412'}</span>
              </div>
            </div>

            <div className="mt-1.5 pt-1.5 border-t border-emerald-800/80 flex items-center justify-between text-[10px] text-emerald-300">
              <span>Conductor: <strong>{focusedTruck?.driverName || 'Hernán Gómez'}</strong></span>
              <span>Carga: <strong>{focusedTruck?.capacityTons ? Math.round(((focusedTruck.currentLoadTons || 0) / focusedTruck.capacityTons) * 100) : 65}%</strong></span>
            </div>
          </div>

          {/* Vereda Community Data */}
          <div className="grid grid-cols-2 gap-2 mt-2 text-[10px]">
            <div className="bg-emerald-900/40 p-1.5 rounded-lg border border-emerald-800/40">
              <span className="text-emerald-400 block font-semibold">Población / Predios</span>
              <span className="font-bold text-white text-[11px]">{currentHover?.householdsCount} fincas ({currentHover?.populationEstimate} hab.)</span>
            </div>
            <div className="bg-emerald-900/40 p-1.5 rounded-lg border border-emerald-800/40">
              <span className="text-emerald-400 block font-semibold">Vocación Agrícola</span>
              <span className="font-bold text-white text-[11px] truncate block">{currentHover?.mainActivity}</span>
            </div>
          </div>
        </div>

        {/* Map Legend Overlay */}
        <div className="hidden sm:flex absolute top-3 right-3 bg-emerald-950/90 backdrop-blur-sm p-2.5 rounded-xl border border-emerald-800 text-[10px] text-emerald-200 flex-col gap-1.5 shadow-lg">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span>Ruta Programada Hoy</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
            <span>Carrito GPS en Vivo</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
            <span>Carrito Reciclaje</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
            <span>Alerta Comunitaria</span>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Route as RouteIcon, 
  CheckCircle2, 
  Scale, 
  Users, 
  Clock, 
  Calendar, 
  Truck as TruckIcon, 
  AlertTriangle, 
  Flame, 
  TrendingUp, 
  Recycle, 
  ArrowUpRight, 
  Sparkles, 
  ChevronRight,
  ShieldAlert,
  MapPin,
  Bell
} from 'lucide-react';
import { PurificacionMap } from '../components/PurificacionMap';
import { 
  RuralRoute, 
  CollectionRecord, 
  Truck, 
  IncidentAlert, 
  AppNotification, 
  MonthlyStats, 
  MaterialDistribution 
} from '../types';
import { modelStore } from '../models/store';
import { AlertController } from '../controllers/alertController';

interface DashboardViewProps {
  routes: RuralRoute[];
  collections: CollectionRecord[];
  trucks: Truck[];
  alerts: IncidentAlert[];
  notifications: AppNotification[];
  monthlyStats: MonthlyStats[];
  materials: MaterialDistribution[];
  onNavigateTab: (tab: string) => void;
  onOpenNewRoute: () => void;
  onOpenReportModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  routes,
  collections,
  trucks,
  alerts,
  notifications,
  monthlyStats,
  materials,
  onNavigateTab,
  onOpenNewRoute,
  onOpenReportModal
}) => {
  const [statsPeriod, setStatsPeriod] = useState<'semana' | 'mes'>('mes');
  const [selectedVeredaOnMap, setSelectedVeredaOnMap] = useState<string | null>(null);

  // Derived KPIs
  const activeRoutes = routes.filter(r => r.status === 'en_progreso');
  const todayDateStr = new Date().toISOString().split('T')[0];
  const todayCollections = collections.filter(c => c.date === todayDateStr || c.date === '2026-08-18');
  const totalWasteTons = Number(collections.reduce((sum, c) => sum + c.totalTons, 0).toFixed(1));
  const activeDriversCount = trucks.filter(t => t.status === 'en_servicio').length;
  const activeAlerts = alerts.filter(a => a.status !== 'atendida');
  const upcomingRoutes = routes.filter(r => r.status === 'programada' || r.status === 'en_progreso').slice(0, 3);

  // Weekly simulated stats
  const weeklyData = [
    { day: 'Lun', total: 4.6, recycled: 1.8, date: '12 Ago' },
    { day: 'Mar', total: 4.0, recycled: 1.4, date: '13 Ago' },
    { day: 'Mié', total: 4.0, recycled: 1.8, date: '14 Ago' },
    { day: 'Jue', total: 5.1, recycled: 1.6, date: '15 Ago' },
    { day: 'Vie', total: 3.2, recycled: 1.1, date: '16 Ago' },
    { day: 'Sáb', total: 4.6, recycled: 1.8, date: '17 Ago' },
    { day: 'Hoy', total: 8.1, recycled: 3.2, date: '18 Ago' }
  ];

  return (
    <div id="dashboard-view" className="space-y-6 animate-in fade-in duration-300">
      {/* 1. NOTIFICACIONES QUE LLEGAN & ALERTAS RECIENTES BANNER */}
      {notifications.length > 0 && (
        <div id="notifications-live-banner" className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white p-4 rounded-2xl shadow-lg border border-emerald-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-bold shrink-0">
              <Bell className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-400/20 text-amber-300 text-[10px] uppercase font-black px-2 py-0.5 rounded border border-amber-400/30">
                  Aviso Reciente
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-white">
                  {notifications[0].title}
                </h4>
              </div>
              <p className="text-xs text-emerald-200 mt-0.5">
                {notifications[0].message}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 shrink-0 self-end md:self-auto">
            <button
              onClick={() => onNavigateTab('recolecciones')}
              className="text-xs bg-emerald-700 hover:bg-emerald-600 px-3 py-1.5 rounded-lg text-white font-semibold transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>Ver en Recolecciones</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 2-5. CUATRO KPI CARDS PRINCIPALES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Rutas Activas */}
        <div 
          id="kpi-rutas-activas"
          onClick={() => onNavigateTab('rutas')}
          className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase text-gray-500 tracking-wider">
              Rutas Activas
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-700 group-hover:text-white transition-colors">
              <RouteIcon className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-emerald-950">
              {activeRoutes.length}
            </span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              En circulación
            </span>
          </div>
          <p className="text-[11px] text-gray-500 mt-1">
            Veredas en atención: {activeRoutes.map(r => r.veredaName).join(', ') || 'Ninguna activa'}
          </p>
        </div>

        {/* KPI 2: Recolecciones de Hoy */}
        <div 
          id="kpi-recolecciones-hoy"
          onClick={() => onNavigateTab('recolecciones')}
          className="bg-white p-4 rounded-2xl border border-sky-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase text-gray-500 tracking-wider">
              Recolecciones de Hoy
            </span>
            <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center group-hover:bg-sky-700 group-hover:text-white transition-colors">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-sky-950">
              {todayCollections.length}
            </span>
            <span className="text-xs font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md">
              Jornadas hoy
            </span>
          </div>
          <p className="text-[11px] text-gray-500 mt-1">
            Purificación Tolima &middot; Cumplimiento del 95%
          </p>
        </div>

        {/* KPI 3: Total de Residuos */}
        <div 
          id="kpi-total-residuos"
          onClick={() => onNavigateTab('reportes')}
          className="bg-white p-4 rounded-2xl border border-amber-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase text-gray-500 tracking-wider">
              Total Residuos
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Scale className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-amber-950">
              {totalWasteTons}
            </span>
            <span className="text-xs font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded">
              Toneladas
            </span>
          </div>
          <p className="text-[11px] text-gray-500 mt-1">
            {collections.reduce((sum, c) => sum + c.recycledTons, 0).toFixed(1)} Ton aprovechadas en fincas
          </p>
        </div>

        {/* KPI 4: Conductores Activos */}
        <div 
          id="kpi-conductores-activos"
          onClick={() => onNavigateTab('camiones')}
          className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase text-gray-500 tracking-wider">
              Conductores Activos
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-700 group-hover:text-white transition-colors">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-emerald-950">
              {activeDriversCount} / {trucks.length}
            </span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              En servicio
            </span>
          </div>
          <p className="text-[11px] text-gray-500 mt-1">
            Operando en veredas Chenche y Las Damas
          </p>
        </div>
      </div>

      {/* 6. MAPA DE LA RUTA EN TIEMPO REAL & 7. PRÓXIMAS RECOLECCIONES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Vector Real-Time Map */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex justify-between items-center px-1">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider">
                Mapa Satelital de la Ruta en Tiempo Real
              </h3>
            </div>
            <span className="text-xs text-gray-500 font-medium">
              Veredas de Purificación, Tolima
            </span>
          </div>

          <PurificacionMap
            activeRoutes={activeRoutes}
            trucks={trucks}
            alerts={alerts}
            selectedVereda={selectedVeredaOnMap}
            onSelectVereda={v => setSelectedVeredaOnMap(v)}
          />
        </div>

        {/* Right 1 Col: 7. Próximas Recolecciones (Vereda, Fecha, Hora, Camión) */}
        <div className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>Próximas Recolecciones</span>
            </h3>
            <button
              onClick={onOpenNewRoute}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
            >
              + Programar
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 divide-y divide-gray-100 space-y-3">
            {upcomingRoutes.map(r => (
              <div key={r.id} className="pt-3 first:pt-0 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {r.code}
                    </span>
                    <h4 className="text-sm font-black text-gray-900 mt-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{r.veredaName}</span>
                    </h4>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                    r.status === 'en_progreso' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {r.status === 'en_progreso' ? 'En ruta hoy' : 'Programada'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-gray-50 p-2 rounded-xl text-gray-600">
                  <div className="flex items-center space-x-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="font-semibold">{r.scheduledDate}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="font-bold text-gray-900">{r.startTime}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 col-span-2">
                    <TruckIcon className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Camión <strong>{r.truckNumber}</strong> ({r.truckPlate}) &middot; {r.driverName}</span>
                  </div>
                </div>

                <p className="text-[11px] text-gray-500 italic">
                  Prioridad: <span className="font-semibold text-emerald-900">{r.wasteTypePriority}</span>
                </p>
              </div>
            ))}

            <div className="pt-2 text-center">
              <button
                onClick={() => onNavigateTab('rutas')}
                className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Ver Cronograma Completo de Rutas
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 8. ESTADÍSTICAS DE RECOLECCIÓN (SEMANA / MES) & 9. PORCENTAJE SOBRE RECICLAJE POR MATERIAL */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 8. Estadísticas de Recolección */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>Estadísticas de Recolección</span>
              </h3>
              <p className="text-xs text-gray-500">Volumen recolectado en zonas rurales de Purificación</p>
            </div>
            
            {/* Period Toggle */}
            <div className="flex bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setStatsPeriod('semana')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  statsPeriod === 'semana' ? 'bg-white text-emerald-900 shadow-sm' : 'text-gray-500'
                }`}
              >
                Esta Semana
              </button>
              <button
                onClick={() => setStatsPeriod('mes')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  statsPeriod === 'mes' ? 'bg-white text-emerald-900 shadow-sm' : 'text-gray-500'
                }`}
              >
                Histórico Meses
              </button>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          {statsPeriod === 'semana' ? (
            <div className="space-y-3 pt-2">
              <div className="h-44 flex items-end justify-between gap-2 pt-4 px-2 border-b border-gray-100">
                {weeklyData.map((item, idx) => {
                  const heightPercent = Math.round((item.total / 10) * 100);
                  const recycledPercent = Math.round((item.recycled / 10) * 100);
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                      <span className="text-[10px] font-bold text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.total}t
                      </span>
                      <div className="w-full max-w-[32px] bg-emerald-100 rounded-t-lg relative flex flex-col justify-end overflow-hidden" style={{ height: `${heightPercent}%` }}>
                        <div 
                          className="w-full bg-emerald-600 rounded-t-lg transition-all duration-500" 
                          style={{ height: `${(item.recycled / item.total) * 100}%` }}
                          title={`Reciclado: ${item.recycled} Ton`}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-gray-600">{item.day}</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between items-center text-xs text-gray-500 pt-1">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm bg-emerald-600"></span>
                    <span>Reciclable / Aprovechable</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm bg-emerald-100"></span>
                    <span>Total Recolectado</span>
                  </div>
                </div>
                <span className="font-semibold text-emerald-800">Semana 34 &middot; Tolima</span>
              </div>
            </div>
          ) : (
            <div className="space-y-3 pt-2">
              <div className="h-44 flex items-end justify-between gap-1.5 pt-4 px-1 border-b border-gray-100">
                {monthlyStats.slice(-6).map((m, idx) => {
                  const heightPercent = Math.min(100, Math.round((m.totalTons / 180) * 100));
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                      <span className="text-[9px] font-bold text-emerald-900 opacity-0 group-hover:opacity-100">
                        {m.totalTons}t
                      </span>
                      <div className="w-full max-w-[28px] bg-teal-100 rounded-t-lg relative flex flex-col justify-end overflow-hidden" style={{ height: `${heightPercent}%` }}>
                        <div 
                          className="w-full bg-teal-600 rounded-t-lg transition-all duration-500" 
                          style={{ height: `${(m.recycledTons / m.totalTons) * 100}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-gray-600 truncate max-w-[45px]">{m.month.split(' ')[0]}</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between items-center text-xs text-gray-500 pt-1">
                <span className="font-semibold text-emerald-900">Total histórico acumulado: 1,110 Ton</span>
                <span className="text-teal-700 font-bold">95% Eficiencia Promedio</span>
              </div>
            </div>
          )}
        </div>

        {/* 9. Porcentaje sobre el Reciclaje por Material */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                <Recycle className="w-4 h-4 text-emerald-600" />
                <span>Porcentaje de Reciclaje por Material</span>
              </h3>
              <p className="text-xs text-gray-500">Distribución de residuos en Purificación Tolima</p>
            </div>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full">
              93% Aprovechable
            </span>
          </div>

          {/* Progress Bars for Materials */}
          <div className="space-y-3 pt-1">
            {materials.map((mat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-gray-800 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: mat.color }}></span>
                    <span>{mat.name}</span>
                  </span>
                  <span className="text-gray-900">{mat.percentage}% <span className="text-gray-400 font-normal">({mat.tons} Ton)</span></span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-700" 
                    style={{ width: `${mat.percentage}%`, backgroundColor: mat.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-gray-500 italic pt-1 border-t border-gray-100">
            * El 46% de residuos orgánicos son transformados en compostaje para cultivos agrícolas del municipio.
          </p>
        </div>
      </div>

      {/* 10. ALERTAS RECIENTES (Quema de Basuras, Animales en Riesgo, Vías) */}
      <div className="bg-white rounded-2xl border border-amber-200/80 shadow-sm p-5 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <Flame className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">
                Alertas Recientes e Incidencias en Veredas
              </h3>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Prevención de quema de basuras, control de olores y protección de la fauna en Purificación
            </p>
          </div>

          <button
            onClick={onOpenReportModal}
            className="self-start sm:self-auto bg-amber-500 hover:bg-amber-600 text-emerald-950 px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center space-x-1.5"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Reportar Nueva Alerta Veredal</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
          {alerts.slice(0, 4).map(alert => (
            <div 
              key={alert.id}
              className={`p-4 rounded-xl border transition-all ${
                alert.status === 'critica'
                  ? 'bg-red-50/70 border-red-200'
                  : (alert.status === 'atendida' ? 'bg-emerald-50/70 border-emerald-200' : 'bg-amber-50/70 border-amber-200')
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                  {alert.preventedBurning ? (
                    <span className="bg-emerald-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Quema Evitada
                    </span>
                  ) : (
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      alert.status === 'critica' ? 'bg-red-600 text-white' : 'bg-amber-600 text-white'
                    }`}>
                      {alert.status}
                    </span>
                  )}
                  <span className="text-xs font-bold text-gray-800">
                    Vereda {alert.veredaName}
                  </span>
                </div>
                <span className="text-[11px] text-gray-400 font-medium">{alert.date}</span>
              </div>

              <h4 className="text-xs font-black text-gray-900 mt-2">{alert.title}</h4>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">{alert.description}</p>

              {alert.actionTaken && (
                <div className="mt-2.5 p-2 bg-white/80 rounded-lg text-[11px] font-medium text-emerald-950 border border-emerald-100 flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Acción:</strong> {alert.actionTaken}</span>
                </div>
              )}

              {alert.status !== 'atendida' && (
                <div className="mt-2 flex justify-end">
                  <button
                    onClick={() => AlertController.resolveAlert(alert.id, 'Atendido por cuadrilla municipal.')}
                    className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 bg-white px-2.5 py-1 rounded-lg border border-emerald-300 shadow-xs cursor-pointer"
                  >
                    Marcar como Atendida
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

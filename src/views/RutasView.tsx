import React, { useState } from 'react';
import { 
  Plus, 
  Route as RouteIcon, 
  Truck as TruckIcon, 
  Scale, 
  AlertTriangle, 
  Calendar, 
  Clock, 
  MapPin, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Play, 
  CheckSquare, 
  Sparkles, 
  X,
  ShieldCheck,
  Search
} from 'lucide-react';
import { RuralRoute, Truck, IncidentAlert, RouteStatus } from '../types';
import { PURIFICACION_VEREDAS } from '../models/veredasData';
import { RouteController } from '../controllers/routeController';

interface RutasViewProps {
  routes: RuralRoute[];
  trucks: Truck[];
  alerts: IncidentAlert[];
  onOpenNewRoute: () => void;
  onOpenReportModal: () => void;
}

export const RutasView: React.FC<RutasViewProps> = ({
  routes,
  trucks,
  alerts,
  onOpenNewRoute,
  onOpenReportModal
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [editingRoute, setEditingRoute] = useState<RuralRoute | null>(null);

  // Edit form states
  const [editVereda, setEditVereda] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editStartTime, setEditStartTime] = useState('');
  const [editEndTime, setEditEndTime] = useState('');
  const [editTruckId, setEditTruckId] = useState('');
  const [editStatus, setEditStatus] = useState<RouteStatus>('programada');
  const [editNotes, setEditNotes] = useState('');

  // 4 Top KPIs for Rutas: Rutas Activas, Camiones en Servicio, Toneladas del Día, Incidencias
  const activeRoutesCount = routes.filter(r => r.status === 'en_progreso').length;
  const trucksInServiceCount = trucks.filter(t => t.status === 'en_servicio').length;
  const estimatedTonsToday = Number(
    routes
      .filter(r => r.status === 'en_progreso' || r.status === 'completada')
      .reduce((sum, r) => sum + r.estimatedTons, 0)
      .toFixed(1)
  ) || 9.6;
  const activeIncidentsCount = alerts.filter(a => a.status !== 'atendida').length;

  const filteredRoutes = routes.filter(r => {
    const matchSearch = r.veredaName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        r.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        r.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        r.truckNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'todos' ? true : r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const openEditModal = (route: RuralRoute) => {
    setEditingRoute(route);
    setEditVereda(route.veredaName);
    setEditDate(route.scheduledDate);
    setEditStartTime(route.startTime);
    setEditEndTime(route.estimatedEndTime);
    setEditTruckId(route.truckId);
    setEditStatus(route.status);
    setEditNotes(route.notes);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRoute) return;

    RouteController.updateRoute(editingRoute.id, {
      veredaName: editVereda,
      scheduledDate: editDate,
      startTime: editStartTime,
      estimatedEndTime: editEndTime,
      truckId: editTruckId,
      status: editStatus,
      notes: editNotes
    });

    setEditingRoute(null);
  };

  return (
    <div id="rutas-view" className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header with "Nueva Ruta" Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <h2 className="text-xl font-black text-emerald-950 tracking-tight">
              Control de Rutas y Cronograma Veredal
            </h2>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Programación de recorridos por veredas de Purificación, asignación de cuadrillas y seguimiento
          </p>
        </div>

        <button
          id="btn-nueva-ruta"
          onClick={onOpenNewRoute}
          className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-900/20 transition-all cursor-pointer flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Ruta</span>
        </button>
      </div>

      {/* 4 KPIs: Rutas Activas, Camiones en Servicio, Toneladas del Día, Incidencias */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Rutas Activas */}
        <div id="kpi-rutas-activas-tab" className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase text-gray-500">Rutas Activas</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <RouteIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-emerald-950">{activeRoutesCount}</span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Recorriendo veredas
            </span>
          </div>
          <p className="text-[11px] text-gray-500 mt-1">Chenche y Las Damas activas hoy</p>
        </div>

        {/* KPI 2: Camiones en Servicio */}
        <div id="kpi-camiones-servicio-tab" className="bg-white p-4 rounded-2xl border border-sky-100 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase text-gray-500">Camiones en Servicio</span>
            <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
              <TruckIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-sky-950">{trucksInServiceCount}</span>
            <span className="text-xs font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
              Flota operativa
            </span>
          </div>
          <p className="text-[11px] text-gray-500 mt-1">Conducción y pesaje simultáneo</p>
        </div>

        {/* KPI 3: Toneladas del Día */}
        <div id="kpi-toneladas-dia-tab" className="bg-white p-4 rounded-2xl border border-amber-100 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase text-gray-500">Toneladas del Día</span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-amber-950">{estimatedTonsToday}</span>
            <span className="text-xs font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded">Ton Est.</span>
          </div>
          <p className="text-[11px] text-gray-500 mt-1">Estimación según censo predial</p>
        </div>

        {/* KPI 4: Incidencias */}
        <div id="kpi-incidencias-tab" className="bg-white p-4 rounded-2xl border border-red-100 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase text-gray-500">Incidencias</span>
            <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-red-950">{activeIncidentsCount}</span>
            <span className="text-xs font-semibold text-red-700 bg-red-50 px-2 py-0.5 rounded">
              Por resolver
            </span>
          </div>
          <p className="text-[11px] text-gray-500 mt-1">Quemas evitadas y estado de vías</p>
        </div>
      </div>

      {/* RUTAS PROGRAMADAS TABLE (Ruta y número, Zona, Fecha, Camión, Conductor, Estados, Acciones) */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-3">
          <div>
            <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider">
              Listado de Rutas Programadas y en Servicio
            </h3>
            <p className="text-xs text-gray-500">
              Veredas de Purificación: Chenche Asoleado, Las Damas, El Baura, El Tambo, Santa Lucía, El Tigre, Sabaneta...
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Buscar ruta o vereda..."
                className="pl-8 pr-3 py-1.5 rounded-xl border border-gray-300 text-xs w-48 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-gray-300 text-xs font-semibold bg-gray-50"
            >
              <option value="todos">Todos los Estados</option>
              <option value="en_progreso">En Progreso</option>
              <option value="programada">Programadas</option>
              <option value="completada">Completadas</option>
            </select>
          </div>
        </div>

        {/* Routes Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-emerald-900 text-white uppercase text-[10px] tracking-wider rounded-lg">
              <tr>
                <th className="p-3 rounded-l-lg">Ruta y Código</th>
                <th className="p-3">Zona / Vereda de Purificación</th>
                <th className="p-3">Fecha y Horario</th>
                <th className="p-3">Camión & Placa</th>
                <th className="p-3">Conductor</th>
                <th className="p-3">Estado</th>
                <th className="p-3 text-right rounded-r-lg">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {filteredRoutes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-gray-500">
                    No se encontraron rutas con los filtros especificados.
                  </td>
                </tr>
              ) : (
                filteredRoutes.map(route => (
                  <tr key={route.id} className="hover:bg-emerald-50/50 transition-colors">
                    <td className="p-3">
                      <span className="font-extrabold text-emerald-950 block">{route.code}</span>
                      <span className="text-[10px] text-gray-500">Cap: {route.estimatedTons} Ton</span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="font-bold text-gray-900">{route.veredaName}</span>
                      </div>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded mt-0.5 inline-block">
                        {route.wasteTypePriority}
                      </span>
                    </td>
                    <td className="p-3 text-gray-700">
                      <div className="flex items-center gap-1 font-semibold">
                        <Calendar className="w-3 h-3 text-emerald-600" />
                        <span>{route.scheduledDate}</span>
                      </div>
                      <div className="text-[10px] text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{route.startTime} - {route.estimatedEndTime}</span>
                      </div>
                    </td>
                    <td className="p-3 font-bold text-gray-800">
                      <div>{route.truckNumber}</div>
                      <div className="text-[10px] text-gray-500 font-mono">{route.truckPlate}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-gray-900">{route.driverName}</div>
                      <div className="text-[10px] text-gray-500">{route.driverPhone}</div>
                    </td>
                    <td className="p-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize inline-flex items-center gap-1 ${
                        route.status === 'en_progreso'
                          ? 'bg-amber-100 text-amber-900 ring-1 ring-amber-300'
                          : (route.status === 'completada' ? 'bg-emerald-100 text-emerald-900' : 'bg-blue-100 text-blue-900')
                      }`}>
                        {route.status === 'en_progreso' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>}
                        {route.status === 'en_progreso' ? 'En Progreso' : route.status}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-1 whitespace-nowrap">
                      {/* Change status buttons */}
                      {route.status === 'programada' && (
                        <button
                          onClick={() => RouteController.changeStatus(route.id, 'en_progreso')}
                          className="px-2 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                          title="Iniciar Recorrido"
                        >
                          Iniciar
                        </button>
                      )}
                      {route.status === 'en_progreso' && (
                        <button
                          onClick={() => RouteController.changeStatus(route.id, 'completada')}
                          className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                          title="Finalizar Ruta"
                        >
                          Completar
                        </button>
                      )}

                      {/* Edit Route Button */}
                      <button
                        onClick={() => openEditModal(route)}
                        className="p-1.5 text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        title="Editar Ruta"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      {/* Delete Route Button */}
                      <button
                        onClick={() => RouteController.deleteRoute(route.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Eliminar Ruta"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* INCIDENCIAS & PARADAS INTERACTIVAS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Paradas de la Ruta Activa */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
              <CheckSquare className="w-4 h-4 text-emerald-600" />
              <span>Puntos de Control & Paradas en Vereda</span>
            </h3>
            <span className="text-xs text-emerald-700 font-bold">Chenche Asoleado</span>
          </div>

          <p className="text-xs text-gray-500">
            Haz clic en los puntos verificados por el conductor para actualizar el progreso:
          </p>

          <div className="space-y-2 pt-1">
            {routes[0]?.stops.map(stop => (
              <div 
                key={stop.id}
                onClick={() => RouteController.toggleStop(routes[0].id, stop.id)}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  stop.completed 
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950' 
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center ${
                    stop.completed ? 'bg-emerald-600 text-white' : 'border-2 border-gray-300'
                  }`}>
                    {stop.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <p className="text-xs font-bold">{stop.name}</p>
                    {stop.notes && <p className="text-[10px] text-gray-500">{stop.notes}</p>}
                  </div>
                </div>
                <span className="text-[11px] font-bold text-gray-500">{stop.timeEst}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Panel de Incidencias en Ruta */}
        <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-5 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Incidencias en Rutas Veredales</span>
            </h3>
            <button
              onClick={onOpenReportModal}
              className="text-xs font-bold text-amber-800 hover:text-amber-950 cursor-pointer"
            >
              + Reportar
            </button>
          </div>

          <div className="space-y-2.5 max-h-72 overflow-y-auto">
            {alerts.map(a => (
              <div key={a.id} className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
                <div className="flex justify-between items-start">
                  <span className="font-black text-xs text-gray-900">{a.title}</span>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded capitalize">
                    {a.veredaName}
                  </span>
                </div>
                <p className="text-xs text-gray-600">{a.description}</p>
                <div className="text-[10px] text-gray-400 flex justify-between items-center pt-1">
                  <span>Reportado por: {a.reportedBy}</span>
                  <span className="font-semibold text-emerald-800">{a.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MODAL EDITAR RUTA */}
      {editingRoute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-emerald-200 overflow-hidden">
            <div className="bg-emerald-800 px-6 py-4 text-white flex justify-between items-center">
              <h3 className="font-bold text-base">Editar Ruta {editingRoute.code}</h3>
              <button onClick={() => setEditingRoute(null)} className="text-emerald-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Vereda de Purificación</label>
                <select
                  value={editVereda}
                  onChange={e => setEditVereda(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 font-medium"
                >
                  {PURIFICACION_VEREDAS.map(v => (
                    <option key={v.id} value={v.name}>{v.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Fecha</label>
                  <input
                    type="date"
                    value={editDate}
                    onChange={e => setEditDate(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg border border-gray-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Inicio</label>
                  <input
                    type="text"
                    value={editStartTime}
                    onChange={e => setEditStartTime(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg border border-gray-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Fin Estimado</label>
                  <input
                    type="text"
                    value={editEndTime}
                    onChange={e => setEditEndTime(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg border border-gray-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Camión Asignado</label>
                  <select
                    value={editTruckId}
                    onChange={e => setEditTruckId(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg border border-gray-300"
                  >
                    {trucks.map(t => (
                      <option key={t.id} value={t.id}>{t.number} - {t.plate}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Estado de Ruta</label>
                  <select
                    value={editStatus}
                    onChange={e => setEditStatus(e.target.value as RouteStatus)}
                    className="w-full px-2 py-1.5 rounded-lg border border-gray-300 font-bold text-emerald-900"
                  >
                    <option value="programada">Programada</option>
                    <option value="en_progreso">En Progreso</option>
                    <option value="completada">Completada</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Observaciones</label>
                <textarea
                  rows={2}
                  value={editNotes}
                  onChange={e => setEditNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingRoute(null)}
                  className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow cursor-pointer"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Plus, 
  Route as RouteIcon, 
  Scale, 
  Recycle, 
  CheckCircle2, 
  Truck as TruckIcon, 
  MapPin, 
  Calendar, 
  Clock, 
  Activity, 
  Search, 
  Filter, 
  Fuel, 
  Gauge,
  Eye,
  Trash2,
  Sparkles
} from 'lucide-react';
import { PurificacionMap } from '../components/PurificacionMap';
import { RuralRoute, CollectionRecord, Truck } from '../types';
import { CollectionController } from '../controllers/collectionController';

interface RecoleccionesViewProps {
  routes: RuralRoute[];
  collections: CollectionRecord[];
  trucks: Truck[];
  onOpenNewRoute: () => void;
  onOpenNewCollection: () => void;
}

export const RecoleccionesView: React.FC<RecoleccionesViewProps> = ({
  routes,
  collections,
  trucks,
  onOpenNewRoute,
  onOpenNewCollection
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [selectedCollection, setSelectedCollection] = useState<CollectionRecord | null>(null);

  // Derived Metrics
  const activeRoutesCount = routes.filter(r => r.status === 'en_progreso').length;
  const totalTonsCollected = Number(collections.reduce((sum, c) => sum + c.totalTons, 0).toFixed(1));
  const totalRecycledTons = Number(collections.reduce((sum, c) => sum + c.recycledTons, 0).toFixed(1));
  const upcomingRoutes = routes.filter(r => r.status === 'programada' || r.status === 'en_progreso');

  // Filtered collections list
  const filteredCollections = collections.filter(c => {
    const matchSearch = c.veredaName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        c.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        c.truckPlate.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'todos' ? true : c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Active truck telemetry summary
  const activeTruck = trucks.find(t => t.status === 'en_servicio') || trucks[0];

  return (
    <div id="recolecciones-view" className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header & Program Route Action Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <h2 className="text-xl font-black text-emerald-950 tracking-tight">
              Módulo de Recolecciones Rurales
            </h2>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Supervisión de recolección de basura, reciclaje y pesajes en Purificación, Tolima
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            id="btn-registrar-pesaje-directo"
            onClick={onOpenNewCollection}
            className="px-3.5 py-2.5 bg-sky-700 hover:bg-sky-800 text-white rounded-xl font-bold text-xs shadow-sm transition-all cursor-pointer flex items-center space-x-1.5"
          >
            <Scale className="w-4 h-4" />
            <span>Registrar Pesaje</span>
          </button>
          <button
            id="btn-programar-ruta-recoleccion"
            onClick={onOpenNewRoute}
            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-900/20 transition-all cursor-pointer flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Programar una Ruta</span>
          </button>
        </div>
      </div>

      {/* 4 KPIs: Rutas Activas, Total Toneladas, Residuos Reciclados, Eficiencia */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm">
          <span className="text-xs font-bold uppercase text-gray-500">Rutas Activas</span>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-emerald-950">{activeRoutesCount}</span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              en campo
            </span>
          </div>
          <p className="text-[11px] text-gray-500 mt-1">Veredas cubiertas hoy</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-sky-100 shadow-sm">
          <span className="text-xs font-bold uppercase text-gray-500">Total Toneladas Recogidas</span>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-sky-950">{totalTonsCollected}</span>
            <span className="text-xs font-bold text-sky-800 bg-sky-50 px-1.5 py-0.5 rounded">Ton</span>
          </div>
          <p className="text-[11px] text-gray-500 mt-1">Acumulado rural en pesajes</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-sm">
          <span className="text-xs font-bold uppercase text-gray-500">Residuos Reciclados</span>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-amber-950">{totalRecycledTons}</span>
            <span className="text-xs font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded">Ton</span>
          </div>
          <p className="text-[11px] text-gray-500 mt-1">Plásticos, cartón, vidrio y metales</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-teal-100 shadow-sm">
          <span className="text-xs font-bold uppercase text-gray-500">Eficiencia Promedio</span>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-teal-950">94%</span>
            <span className="text-xs font-bold text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded">Aprovechable</span>
          </div>
          <p className="text-[11px] text-gray-500 mt-1">Incluyendo compostaje de fincas</p>
        </div>
      </div>

      {/* MAPAS Y LAS RUTAS + RESUMEN ACTIVIDAD DEL CAMIÓN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2 space-y-2">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Mapas y Rutas Rurales de Purificación</span>
            </h3>
            <span className="text-xs text-emerald-700 font-bold">Tolima &middot; Cobertura Veredal</span>
          </div>
          <PurificacionMap
            activeRoutes={routes.filter(r => r.status === 'en_progreso')}
            trucks={trucks}
            compact={true}
          />
        </div>

        {/* Resumen de la Actividad del Camión */}
        <div className="space-y-2">
          <h3 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider flex items-center gap-1.5 px-1">
            <Activity className="w-4 h-4 text-emerald-600" />
            <span>Resumen de Actividad del Camión</span>
          </h3>

          {activeTruck ? (
            <div className="bg-white rounded-2xl border border-emerald-200 shadow-sm p-5 space-y-4">
              <div className="flex justify-between items-start pb-3 border-b border-gray-100">
                <div>
                  <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    {activeTruck.number} &middot; {activeTruck.plate}
                  </span>
                  <h4 className="text-sm font-black text-gray-900 mt-1.5">{activeTruck.model}</h4>
                  <p className="text-xs text-gray-500">Conductor: <strong className="text-gray-800">{activeTruck.driverName}</strong></p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                  activeTruck.status === 'en_servicio' ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
                }`}>
                  {activeTruck.status === 'en_servicio' ? 'En servicio hoy' : activeTruck.status}
                </span>
              </div>

              {/* Telemetry Metrics */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100">
                  <div className="flex items-center space-x-1 text-emerald-700 font-semibold text-[11px]">
                    <Gauge className="w-3.5 h-3.5" />
                    <span>Carga Actual</span>
                  </div>
                  <p className="text-base font-black text-emerald-950 mt-1">
                    {activeTruck.currentLoadTons} / {activeTruck.capacityTons} Ton
                  </p>
                  <div className="w-full bg-emerald-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div 
                      className="bg-emerald-600 h-full rounded-full" 
                      style={{ width: `${(activeTruck.currentLoadTons / activeTruck.capacityTons) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="bg-sky-50/70 p-2.5 rounded-xl border border-sky-100">
                  <div className="flex items-center space-x-1 text-sky-700 font-semibold text-[11px]">
                    <Fuel className="w-3.5 h-3.5" />
                    <span>Combustible</span>
                  </div>
                  <p className="text-base font-black text-sky-950 mt-1">
                    {activeTruck.fuelLevelPercent}%
                  </p>
                  <div className="w-full bg-sky-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div 
                      className="bg-sky-600 h-full rounded-full" 
                      style={{ width: `${activeTruck.fuelLevelPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="text-xs bg-gray-50 p-3 rounded-xl border border-gray-200 space-y-1">
                <p className="text-gray-500">Sector actual:</p>
                <p className="font-bold text-gray-900 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Vereda {activeTruck.currentVereda || 'Base Municipal'}</span>
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-2xl text-center text-xs text-gray-500">
              No hay camiones en servicio activo en este momento.
            </div>
          )}
        </div>
      </div>

      {/* TABLA: LISTA DE LAS RECOLECCIONES (ID, Zona/Vereda, Fecha, Camión, Estado, Acciones) */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-3">
          <div>
            <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider">
              Historial y Lista de Recolecciones Realizadas
            </h3>
            <p className="text-xs text-gray-500">Registros detallados de pesaje en Purificación</p>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Buscar por vereda, placa o código..."
                className="pl-8 pr-3 py-1.5 rounded-xl border border-gray-300 text-xs w-56 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-gray-300 text-xs font-semibold bg-gray-50"
            >
              <option value="todos">Todos los Estados</option>
              <option value="completado">Completado</option>
              <option value="en_curso">En Curso</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-emerald-900 text-white uppercase text-[10px] tracking-wider rounded-lg">
              <tr>
                <th className="p-3 rounded-l-lg">ID / Código</th>
                <th className="p-3">Zona / Vereda</th>
                <th className="p-3">Fecha & Hora</th>
                <th className="p-3">Camión & Placa</th>
                <th className="p-3">Total (Ton)</th>
                <th className="p-3">Reciclado (Ton)</th>
                <th className="p-3">Estado</th>
                <th className="p-3 text-right rounded-r-lg">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {filteredCollections.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-6 text-center text-gray-500">
                    No se encontraron recolecciones con los filtros aplicados.
                  </td>
                </tr>
              ) : (
                filteredCollections.map(col => (
                  <tr key={col.id} className="hover:bg-emerald-50/50 transition-colors">
                    <td className="p-3 font-bold text-emerald-950">{col.code}</td>
                    <td className="p-3">
                      <div className="flex items-center space-x-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="font-bold text-gray-900">{col.veredaName}</span>
                      </div>
                    </td>
                    <td className="p-3 text-gray-600">
                      <div>{col.date}</div>
                      <div className="text-[10px] text-gray-400">{col.time}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-gray-800">{col.truckNumber} ({col.truckPlate})</div>
                      <div className="text-[10px] text-gray-500">{col.driverName}</div>
                    </td>
                    <td className="p-3 font-extrabold text-gray-900">{col.totalTons} Ton</td>
                    <td className="p-3">
                      <span className="text-emerald-700 font-bold">{col.recycledTons} Ton</span>
                      <span className="text-[10px] text-gray-400 block">{col.efficiencyPercent}% ef.</span>
                    </td>
                    <td className="p-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                        col.status === 'completado' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {col.status}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-1">
                      <button
                        onClick={() => setSelectedCollection(col)}
                        className="p-1.5 text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
                        title="Ver Desglose de Pesaje"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => CollectionController.deleteCollection(col.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Eliminar Registro"
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

      {/* PRÓXIMAS RUTAS CARD */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 p-5 space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-emerald-700" />
            <h3 className="text-sm font-extrabold text-emerald-950 uppercase tracking-wider">
              Próximas Rutas de Recolección Programadas
            </h3>
          </div>
          <button
            onClick={onOpenNewRoute}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 cursor-pointer"
          >
            + Programar Otra
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {upcomingRoutes.slice(0, 3).map(r => (
            <div key={r.id} className="bg-white p-3.5 rounded-xl border border-emerald-100 shadow-xs space-y-2">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {r.code}
                </span>
                <span className="text-xs font-bold text-gray-900">{r.startTime}</span>
              </div>
              <h4 className="text-xs font-black text-gray-900">Vereda {r.veredaName}</h4>
              <p className="text-[11px] text-gray-500">
                Camión: <strong>{r.truckNumber}</strong> ({r.truckPlate}) &middot; {r.driverName}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Detail for Collection */}
      {selectedCollection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-emerald-200 p-6 space-y-4">
            <div className="flex justify-between items-start pb-2 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-700">{selectedCollection.code}</span>
                <h3 className="text-base font-black text-gray-900">Vereda {selectedCollection.veredaName}</h3>
                <p className="text-xs text-gray-500">{selectedCollection.date} &middot; {selectedCollection.time}</p>
              </div>
              <button onClick={() => setSelectedCollection(null)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <div className="bg-emerald-50/70 p-3.5 rounded-xl space-y-2 text-xs">
              <h4 className="font-bold text-emerald-950 uppercase text-[10px] tracking-wider">Desglose de Materiales:</h4>
              <div className="grid grid-cols-2 gap-2">
                <div>🌱 Orgánicos: <strong>{selectedCollection.organicTons} Ton</strong></div>
                <div>🧴 Plásticos: <strong>{selectedCollection.plasticTons} Ton</strong></div>
                <div>📦 Cartón / Papel: <strong>{selectedCollection.cardboardTons} Ton</strong></div>
                <div>🍾 Vidrio: <strong>{selectedCollection.glassTons} Ton</strong></div>
                <div>⚙️ Metales: <strong>{selectedCollection.metalTons} Ton</strong></div>
                <div>🗑️ Ordinario: <strong>{selectedCollection.ordinaryTons} Ton</strong></div>
              </div>
              <div className="pt-2 border-t border-emerald-200 flex justify-between font-black text-emerald-950">
                <span>Total: {selectedCollection.totalTons} Ton</span>
                <span>Aprovechable: {selectedCollection.recycledTons} Ton ({selectedCollection.efficiencyPercent}%)</span>
              </div>
            </div>

            {selectedCollection.notes && (
              <p className="text-xs text-gray-600 bg-gray-50 p-2.5 rounded-lg italic">
                "{selectedCollection.notes}"
              </p>
            )}

            <button
              onClick={() => setSelectedCollection(null)}
              className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              Cerrar Detalle
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

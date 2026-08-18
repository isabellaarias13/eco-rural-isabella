import React, { useState } from 'react';
import { 
  Plus, 
  Truck as TruckIcon, 
  CheckCircle2, 
  Wrench, 
  Clock, 
  User as UserIcon, 
  Phone, 
  Fuel, 
  Gauge, 
  Scale, 
  MapPin, 
  ShieldCheck,
  Search,
  Trash2,
  Edit2
} from 'lucide-react';
import { Truck, TruckStatus } from '../types';
import { TruckController } from '../controllers/truckController';

interface CamionesViewProps {
  trucks: Truck[];
  onOpenNewTruck: () => void;
}

export const CamionesView: React.FC<CamionesViewProps> = ({
  trucks,
  onOpenNewTruck
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');

  // KPIs: Número total de camiones, Operativos, En mantenimiento
  const totalTrucksCount = trucks.length;
  const operationalTrucksCount = trucks.filter(t => t.status === 'disponible' || t.status === 'en_servicio').length;
  const maintenanceTrucksCount = trucks.filter(t => t.status === 'mantenimiento').length;
  const busyTrucksCount = trucks.filter(t => t.status === 'en_servicio').length;

  const filteredTrucks = trucks.filter(t => {
    const matchSearch = t.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        t.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        t.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        t.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'todos' ? true : t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div id="camiones-view" className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header with "Agregar Camión" Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <h2 className="text-xl font-black text-emerald-950 tracking-tight">
              Flota de Camiones y Conductores Rurales
            </h2>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Gestión vehicular de aseo, capacidades en toneladas y asignación en Purificación, Tolima
          </p>
        </div>

        <button
          id="btn-agregar-camion"
          onClick={onOpenNewTruck}
          className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-900/20 transition-all cursor-pointer flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Agregar Camión</span>
        </button>
      </div>

      {/* 3 KPIs: Número Total de Camiones, Operativos, En Mantenimiento */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* KPI 1: Número Total de Camiones */}
        <div id="kpi-total-camiones" className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase text-gray-500">Número Total de Camiones</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <TruckIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-emerald-950">{totalTrucksCount}</span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Unidades en flota
            </span>
          </div>
          <p className="text-[11px] text-gray-500 mt-1">Parque automotor oficial Purificación</p>
        </div>

        {/* KPI 2: Operativos */}
        <div id="kpi-camiones-operativos" className="bg-white p-4 rounded-2xl border border-sky-100 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase text-gray-500">Camiones Operativos</span>
            <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-sky-950">{operationalTrucksCount}</span>
            <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
              {busyTrucksCount} en ruta / {operationalTrucksCount - busyTrucksCount} disponibles
            </span>
          </div>
          <p className="text-[11px] text-gray-500 mt-1">Listos para servicio en veredas</p>
        </div>

        {/* KPI 3: En Mantenimiento */}
        <div id="kpi-camiones-mantenimiento" className="bg-white p-4 rounded-2xl border border-amber-100 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase text-gray-500">En Mantenimiento</span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-amber-950">{maintenanceTrucksCount}</span>
            <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
              Revisión preventiva
            </span>
          </div>
          <p className="text-[11px] text-gray-500 mt-1">En taller municipal para alistamiento</p>
        </div>
      </div>

      {/* FILTER AND SEARCH BAR */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Buscar por placa, número o conductor..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center space-x-2 self-end sm:self-auto">
          <span className="text-xs font-bold text-gray-500">Filtrar Estado:</span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-gray-300 text-xs font-bold bg-gray-50"
          >
            <option value="todos">Todos los Estados</option>
            <option value="disponible">Disponible</option>
            <option value="en_servicio">Ocupado / En Servicio</option>
            <option value="mantenimiento">En Mantenimiento</option>
          </select>
        </div>
      </div>

      {/* LISTA / TARJETAS DETALLADAS DE CAMIONES (Placa, Número, Toneladas, Conductor, Estado) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredTrucks.map(truck => {
          const isAvailable = truck.status === 'disponible';
          const isBusy = truck.status === 'en_servicio';
          const isMaintenance = truck.status === 'mantenimiento';

          return (
            <div 
              key={truck.id}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4 hover:border-emerald-300 transition-all"
            >
              {/* Header: Placa, Número de Camión y Estado */}
              <div className="flex justify-between items-start pb-3 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex flex-col items-center justify-center font-black">
                    <TruckIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-extrabold text-base text-gray-900">{truck.number}</span>
                      <span className="bg-gray-100 text-gray-800 text-xs font-mono font-bold px-2 py-0.5 rounded border border-gray-300">
                        {truck.plate}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{truck.model} ({truck.year})</p>
                  </div>
                </div>

                {/* Status Badge with quick toggle */}
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                    isAvailable
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : (isBusy ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-red-100 text-red-900 border border-red-300')
                  }`}>
                    {isAvailable ? 'Disponible' : (isBusy ? 'Ocupado / En Ruta' : 'En Mantenimiento')}
                  </span>
                  <span className="text-[10px] text-gray-400">Purificación</span>
                </div>
              </div>

              {/* Toneladas y Capacidad */}
              <div className="grid grid-cols-3 gap-2 text-xs bg-gray-50 p-3 rounded-xl">
                <div>
                  <span className="text-[10px] text-gray-500 font-semibold uppercase block">Capacidad</span>
                  <span className="text-sm font-black text-emerald-950">{truck.capacityTons} Ton</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 font-semibold uppercase block">Carga Actual</span>
                  <span className="text-sm font-black text-gray-800">{truck.currentLoadTons} Ton</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 font-semibold uppercase block">Combustible</span>
                  <span className="text-sm font-black text-sky-700">{truck.fuelLevelPercent}%</span>
                </div>
              </div>

              {/* Nombre del Conductor que maneja el camión */}
              <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-100 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                    {truck.driverName.charAt(0)}
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-800 font-semibold uppercase block">Conductor Asignado:</span>
                    <h5 className="font-extrabold text-gray-900 text-xs">{truck.driverName}</h5>
                  </div>
                </div>
                <div className="flex items-center space-x-1 text-gray-600 font-medium text-[11px] bg-white px-2 py-1 rounded-lg border border-emerald-200">
                  <Phone className="w-3 h-3 text-emerald-600" />
                  <span>{truck.driverPhone}</span>
                </div>
              </div>

              {/* Action buttons to toggle status */}
              <div className="pt-2 border-t border-gray-100 flex justify-between items-center text-xs">
                <span className="text-[11px] text-gray-500">
                  Zona: <strong>{truck.serviceZone}</strong>
                </span>

                <div className="flex items-center space-x-1.5">
                  <select
                    value={truck.status}
                    onChange={e => TruckController.setStatus(truck.id, e.target.value as TruckStatus)}
                    className="px-2.5 py-1 rounded-lg border border-gray-300 text-xs font-bold bg-white cursor-pointer focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="disponible">Marcar Disponible</option>
                    <option value="en_servicio">Marcar Ocupado</option>
                    <option value="mantenimiento">Marcar Mantenimiento</option>
                  </select>

                  <button
                    onClick={() => TruckController.deleteTruck(truck.id)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Eliminar Camión"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { X, Calendar, Clock, Truck as TruckIcon, MapPin, Sparkles, AlertCircle } from 'lucide-react';
import { PURIFICACION_VEREDAS } from '../models/veredasData';
import { Truck, RuralRoute } from '../types';
import { RouteController } from '../controllers/routeController';

interface NewRouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  trucks: Truck[];
  onRouteCreated?: (route: RuralRoute) => void;
}

export const NewRouteModal: React.FC<NewRouteModalProps> = ({
  isOpen,
  onClose,
  trucks,
  onRouteCreated
}) => {
  const [veredaName, setVeredaName] = useState(PURIFICACION_VEREDAS[0].name);
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('06:30 AM');
  const [estimatedEndTime, setEstimatedEndTime] = useState('11:45 AM');
  const [truckId, setTruckId] = useState(trucks[0]?.id || '');
  const [wasteTypePriority, setWasteTypePriority] = useState<'Mixto Rural' | 'Orgánico Agropecuario' | 'Aprovechables Secos' | 'Ordinarios'>('Aprovechables Secos');
  const [estimatedTons, setEstimatedTons] = useState('4.5');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRoute = RouteController.createRoute({
      veredaName,
      scheduledDate,
      startTime,
      estimatedEndTime,
      truckId: truckId || trucks[0]?.id,
      wasteTypePriority,
      estimatedTons: parseFloat(estimatedTons) || 4.0,
      notes
    });

    if (onRouteCreated) onRouteCreated(newRoute);
    onClose();
  };

  const selectedVeredaObj = PURIFICACION_VEREDAS.find(v => v.name === veredaName);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-emerald-200 overflow-hidden">
        {/* Modal Header */}
        <div className="bg-emerald-800 px-6 py-4 text-white flex justify-between items-center">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-amber-300">
              <TruckIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Programar Nueva Ruta Rural</h3>
              <p className="text-xs text-emerald-200">Asignación para veredas de Purificación, Tolima</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-300 hover:text-white p-1.5 rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Vereda Selector from Purificación */}
          <div>
            <label className="block text-xs font-bold uppercase text-emerald-950 mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>Vereda de Purificación</span>
            </label>
            <select
              id="select-vereda-ruta"
              value={veredaName}
              onChange={e => setVeredaName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm font-medium bg-gray-50/50"
            >
              {PURIFICACION_VEREDAS.map(v => (
                <option key={v.id} value={v.name}>
                  {v.name} ({v.zone} - {v.distanceKmFromCenter} km)
                </option>
              ))}
            </select>
            {selectedVeredaObj && (
              <p className="text-[11px] text-gray-500 mt-1">
                Fincas estimadas: <span className="font-semibold text-gray-700">{selectedVeredaObj.householdsCount} predios</span> | Vocación: <span className="font-semibold text-gray-700">{selectedVeredaObj.mainActivity}</span>
              </p>
            )}
          </div>

          {/* Date and Time Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                <span>Fecha</span>
              </label>
              <input
                id="input-fecha-ruta"
                type="date"
                value={scheduledDate}
                onChange={e => setScheduledDate(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 text-xs font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Hora Inicio</span>
              </label>
              <input
                id="input-hora-inicio"
                type="text"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                placeholder="06:30 AM"
                required
                className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 text-xs font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Hora Fin Est.</span>
              </label>
              <input
                id="input-hora-fin"
                type="text"
                value={estimatedEndTime}
                onChange={e => setEstimatedEndTime(e.target.value)}
                placeholder="11:45 AM"
                required
                className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 text-xs font-medium"
              />
            </div>
          </div>

          {/* Truck & Driver Assignment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                <TruckIcon className="w-3.5 h-3.5 text-emerald-600" />
                <span>Camión Asignado</span>
              </label>
              <select
                id="select-camion-ruta"
                value={truckId}
                onChange={e => setTruckId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 text-xs font-medium bg-white"
              >
                {trucks.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.number} - {t.plate} ({t.model}) [{t.status}]
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Toneladas Estimadas (Capacidad)
              </label>
              <input
                id="input-toneladas-est"
                type="number"
                step="0.1"
                min="0.5"
                max="12"
                value={estimatedTons}
                onChange={e => setEstimatedTons(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 text-xs font-medium"
              />
            </div>
          </div>

          {/* Waste Type Priority */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Tipo de Residuo Prioritario</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['Aprovechables Secos', 'Orgánico Agropecuario', 'Mixto Rural', 'Ordinarios'] as const).map(type => (
                <button
                  type="button"
                  key={type}
                  onClick={() => setWasteTypePriority(type)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold text-left border transition-all cursor-pointer ${
                    wasteTypePriority === type
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-900 ring-1 ring-emerald-500'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Observations & Instructions for rural community */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Instrucciones y Observaciones
            </label>
            <textarea
              id="input-observaciones-ruta"
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Ej: Socializar con la JAC la prohibición de quema de plásticos agrícolas y recolección de empaques limpios..."
              className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 text-xs font-medium"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              id="btn-confirmar-guardar-ruta"
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-md transition-all cursor-pointer"
            >
              Programar e Iniciar Ruta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

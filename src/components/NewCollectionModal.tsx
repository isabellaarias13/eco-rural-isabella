import React, { useState } from 'react';
import { X, Scale, MapPin, Calendar, Clock, Truck as TruckIcon, Sparkles } from 'lucide-react';
import { PURIFICACION_VEREDAS } from '../models/veredasData';
import { Truck, CollectionRecord } from '../types';
import { CollectionController } from '../controllers/collectionController';

interface NewCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  trucks: Truck[];
  onCollectionCreated?: (collection: CollectionRecord) => void;
}

export const NewCollectionModal: React.FC<NewCollectionModalProps> = ({
  isOpen,
  onClose,
  trucks,
  onCollectionCreated
}) => {
  const [veredaName, setVeredaName] = useState(PURIFICACION_VEREDAS[0].name);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }));
  const [truckId, setTruckId] = useState(trucks[0]?.id || '');
  
  // Materials in Tons
  const [organicTons, setOrganicTons] = useState('1.8');
  const [plasticTons, setPlasticTons] = useState('0.8');
  const [glassTons, setGlassTons] = useState('0.3');
  const [cardboardTons, setCardboardTons] = useState('0.5');
  const [metalTons, setMetalTons] = useState('0.2');
  const [ordinaryTons, setOrdinaryTons] = useState('1.0');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const org = parseFloat(organicTons) || 0;
  const pla = parseFloat(plasticTons) || 0;
  const gla = parseFloat(glassTons) || 0;
  const car = parseFloat(cardboardTons) || 0;
  const met = parseFloat(metalTons) || 0;
  const ord = parseFloat(ordinaryTons) || 0;

  const totalCalculated = Number((org + pla + gla + car + met + ord).toFixed(2));
  const totalRecycledCalculated = Number((pla + gla + car + met).toFixed(2));
  const computedEfficiency = totalCalculated > 0 ? Math.round(((org + totalRecycledCalculated) / totalCalculated) * 100) : 90;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created = CollectionController.createCollection({
      veredaName,
      date,
      time,
      truckId: truckId || trucks[0]?.id,
      organicTons: org,
      plasticTons: pla,
      glassTons: gla,
      cardboardTons: car,
      metalTons: met,
      ordinaryTons: ord,
      notes
    });

    if (onCollectionCreated) onCollectionCreated(created);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-emerald-200 overflow-hidden">
        {/* Header */}
        <div className="bg-emerald-800 px-6 py-4 text-white flex justify-between items-center">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-amber-300">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Registrar Pesaje de Recolección</h3>
              <p className="text-xs text-emerald-200">Pesaje por tipo de residuo &middot; Purificación Tolima</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-300 hover:text-white p-1.5 rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[82vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>Vereda de Purificación</span>
              </label>
              <select
                value={veredaName}
                onChange={e => setVeredaName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 text-xs font-medium bg-gray-50"
              >
                {PURIFICACION_VEREDAS.map(v => (
                  <option key={v.id} value={v.name}>{v.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                <TruckIcon className="w-3.5 h-3.5 text-emerald-600" />
                <span>Camión que recolectó</span>
              </label>
              <select
                value={truckId}
                onChange={e => setTruckId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 text-xs font-medium"
              >
                {trucks.map(t => (
                  <option key={t.id} value={t.id}>{t.number} - {t.plate} ({t.driverName})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                <span>Fecha</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                required
                className="w-full px-3 py-1.5 rounded-xl border border-gray-300 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Hora de pesaje</span>
              </label>
              <input
                type="text"
                value={time}
                onChange={e => setTime(e.target.value)}
                placeholder="10:30 AM"
                required
                className="w-full px-3 py-1.5 rounded-xl border border-gray-300 text-xs"
              />
            </div>
          </div>

          {/* Waste Breakdown in Tons */}
          <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200/80">
            <h4 className="text-xs font-black text-emerald-950 uppercase tracking-wider mb-2.5 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Desglose de Residuos Pesados (Toneladas)</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              <div>
                <label className="block font-semibold text-emerald-800 mb-1">Orgánicos (Abono)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={organicTons}
                  onChange={e => setOrganicTons(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-emerald-300 font-bold text-emerald-900"
                />
              </div>
              <div>
                <label className="block font-semibold text-sky-800 mb-1">Plásticos Limpios</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={plasticTons}
                  onChange={e => setPlasticTons(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-sky-300 font-bold text-sky-900"
                />
              </div>
              <div>
                <label className="block font-semibold text-amber-800 mb-1">Cartón y Papel</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={cardboardTons}
                  onChange={e => setCardboardTons(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-amber-300 font-bold text-amber-900"
                />
              </div>
              <div>
                <label className="block font-semibold text-teal-800 mb-1">Vidrio / Botellas</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={glassTons}
                  onChange={e => setGlassTons(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-teal-300 font-bold text-teal-900"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Metales / Chatarra</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={metalTons}
                  onChange={e => setMetalTons(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-slate-300 font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="block font-semibold text-red-800 mb-1">Ordinario / Basura</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={ordinaryTons}
                  onChange={e => setOrdinaryTons(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-red-300 font-bold text-red-900"
                />
              </div>
            </div>

            {/* Calculated Metrics preview */}
            <div className="mt-3 pt-3 border-t border-emerald-200 flex justify-between items-center text-xs">
              <span className="text-gray-600 font-medium">Total: <strong className="text-emerald-950">{totalCalculated} Ton</strong></span>
              <span className="text-gray-600 font-medium">Aprovechable: <strong className="text-emerald-700">{totalRecycledCalculated} Ton</strong></span>
              <span className="bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full text-[11px]">
                {computedEfficiency}% Eficiencia
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Observaciones de Ruta &middot; Estado Veredal
            </label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Ej: Buena participación comunitaria en el punto de acopio escolar..."
              className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              id="btn-guardar-pesaje-recoleccion"
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-md transition-all cursor-pointer"
            >
              Guardar Registro de Pesaje
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { X, Truck as TruckIcon, User, Phone, ShieldCheck } from 'lucide-react';
import { Truck } from '../types';
import { TruckController } from '../controllers/truckController';

interface NewTruckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTruckCreated?: (truck: Truck) => void;
}

export const NewTruckModal: React.FC<NewTruckModalProps> = ({
  isOpen,
  onClose,
  onTruckCreated
}) => {
  const [number, setNumber] = useState('CAM-05');
  const [plate, setPlate] = useState('PUR-904');
  const [model, setModel] = useState('Chevrolet FVR Compactador 4x4');
  const [capacityTons, setCapacityTons] = useState('6.5');
  const [driverName, setDriverName] = useState('Bernardo Silva');
  const [driverPhone, setDriverPhone] = useState('313 774 9012');
  const [serviceZone, setServiceZone] = useState('Sector Occidental (Purificación)');
  const [year, setYear] = useState('2024');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTruck = TruckController.addTruck({
      number,
      plate,
      model,
      capacityTons: parseFloat(capacityTons) || 5.0,
      driverName,
      driverPhone,
      serviceZone,
      year: parseInt(year) || 2024
    });

    if (onTruckCreated) onTruckCreated(newTruck);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-emerald-200 overflow-hidden">
        {/* Modal Header */}
        <div className="bg-emerald-800 px-6 py-4 text-white flex justify-between items-center">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-amber-300">
              <TruckIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Registrar Nuevo Camión de Aseo</h3>
              <p className="text-xs text-emerald-200">Flota Municipal de Purificación, Tolima</p>
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Número Interno
              </label>
              <input
                id="input-numero-camion"
                type="text"
                value={number}
                onChange={e => setNumber(e.target.value)}
                placeholder="CAM-05"
                required
                className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 text-xs font-bold uppercase"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Placa Oficial
              </label>
              <input
                id="input-placa-camion"
                type="text"
                value={plate}
                onChange={e => setPlate(e.target.value)}
                placeholder="PUR-904"
                required
                className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 text-xs font-bold uppercase"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Marca / Modelo
              </label>
              <input
                id="input-modelo-camion"
                type="text"
                value={model}
                onChange={e => setModel(e.target.value)}
                placeholder="Chevrolet FVR Compactador"
                required
                className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 text-xs font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Año / Modelo
              </label>
              <input
                id="input-ano-camion"
                type="number"
                value={year}
                onChange={e => setYear(e.target.value)}
                min="2010"
                max="2027"
                className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 text-xs font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Capacidad Máxima (Ton)
              </label>
              <input
                id="input-capacidad-ton"
                type="number"
                step="0.5"
                min="1"
                max="15"
                value={capacityTons}
                onChange={e => setCapacityTons(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 text-xs font-bold text-emerald-800"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Zona de Cobertura
              </label>
              <select
                id="select-zona-cobertura"
                value={serviceZone}
                onChange={e => setServiceZone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 text-xs font-medium"
              >
                <option value="Sector Norte (Chenche)">Sector Norte (Chenche)</option>
                <option value="Sector Oriental (Las Damas, La Mata)">Sector Oriental</option>
                <option value="Sector Sur (El Baura, Campo Alegre)">Sector Sur</option>
                <option value="Sector Occidental (El Tambo, Santa Lucía)">Sector Occidental</option>
                <option value="Todo el Municipio Purificación">Todo el Municipio</option>
              </select>
            </div>
          </div>

          <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-100 space-y-3">
            <h4 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-emerald-600" />
              <span>Conductor Asignado a la Unidad</span>
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                  Nombre Completo
                </label>
                <input
                  id="input-conductor-nombre"
                  type="text"
                  value={driverName}
                  onChange={e => setDriverName(e.target.value)}
                  placeholder="Nombre del conductor"
                  required
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-emerald-600" />
                  <span>Teléfono Móvil</span>
                </label>
                <input
                  id="input-conductor-telefono"
                  type="text"
                  value={driverPhone}
                  onChange={e => setDriverPhone(e.target.value)}
                  placeholder="315 000 0000"
                  required
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs bg-white"
                />
              </div>
            </div>
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
              id="btn-guardar-camion"
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-md transition-all cursor-pointer"
            >
              Guardar e Incorporar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

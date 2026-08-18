import React, { useState } from 'react';
import { X, Flame, AlertTriangle, MapPin, Phone, ShieldCheck, HeartPulse, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PURIFICACION_VEREDAS } from '../models/veredasData';
import { IncidentType } from '../types';
import { AlertController } from '../controllers/alertController';

interface ReportIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultVereda?: string;
}

export const ReportIncidentModal: React.FC<ReportIncidentModalProps> = ({
  isOpen,
  onClose,
  defaultVereda
}) => {
  const [type, setType] = useState<IncidentType>('quema_basura');
  const [veredaName, setVeredaName] = useState(defaultVereda || PURIFICACION_VEREDAS[0].name);
  const [title, setTitle] = useState('Reporte de Intento de Quema de Basura');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<'alta' | 'media' | 'baja'>('alta');
  const [preventedBurning, setPreventedBurning] = useState(true);
  const [reporterName, setReporterName] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    AlertController.reportIncident({
      title: title || (type === 'quema_basura' ? 'Alerta de Quema de Basura Veredal' : 'Reporte de Aseo y Residuos'),
      type,
      veredaName,
      description: description || 'Alerta reportada por habitantes rurales de Purificación para pronta atención.',
      severity,
      preventedBurning,
      reportedBy: reporterName,
      reporterPhone
    });

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {
      // ignore
    }

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 2000);
  };

  const incidentTypes = [
    { id: 'quema_basura', label: 'Quema de Basura / Hojas', icon: Flame, color: 'text-amber-600 bg-amber-50 border-amber-300' },
    { id: 'olor_fuerte', label: 'Malos Olores / Foco Infeccioso', icon: AlertTriangle, color: 'text-emerald-700 bg-emerald-50 border-emerald-300' },
    { id: 'animales_riesgo', label: 'Animales / Fauna en Riesgo', icon: HeartPulse, color: 'text-sky-700 bg-sky-50 border-sky-300' },
    { id: 'basurero_ilegal', label: 'Bote Clandestino de Escombros', icon: AlertTriangle, color: 'text-red-700 bg-red-50 border-red-300' },
    { id: 'via_bloqueada', label: 'Vía en Mal Estado / Derrumbe', icon: MapPin, color: 'text-gray-700 bg-gray-50 border-gray-300' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-amber-200 overflow-hidden">
        {/* Header with Anti-Quema Warning Banner */}
        <div className="bg-gradient-to-r from-amber-600 via-emerald-700 to-emerald-800 px-6 py-4 text-white flex justify-between items-center">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-emerald-950 flex items-center justify-center font-bold">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base leading-tight">Canal Ciudadano &middot; Aseo Rural</h3>
              <p className="text-xs text-amber-100">Evitemos la quema de basuras y protejamos la fauna de Purificación</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-amber-100 hover:text-white p-1 rounded-lg hover:bg-emerald-900/40 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-lg font-black text-emerald-950">¡Alerta Registrada con Éxito!</h4>
            <p className="text-xs text-gray-600 max-w-xs mx-auto">
              La central de Eco-Rural y los promotores ambientales en Purificación han recibido la notificación para actuar de inmediato.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            {/* Type selector */}
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">
                Tipo de Incidencia
              </label>
              <div className="grid grid-cols-2 gap-2">
                {incidentTypes.map(item => {
                  const Icon = item.icon;
                  const isSelected = type === item.id;
                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => {
                        setType(item.id as IncidentType);
                        if (item.id === 'quema_basura') {
                          setTitle('Alerta de Quema de Basura / Plásticos');
                        } else if (item.id === 'olor_fuerte') {
                          setTitle('Foco de Mal Olor y Acumulación');
                        } else if (item.id === 'animales_riesgo') {
                          setTitle('Fauna o Animales Silvestres Afectados');
                        }
                      }}
                      className={`flex items-center space-x-2 p-2.5 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer ${
                        isSelected
                          ? `${item.color} ring-2 ring-emerald-600 font-bold shadow-sm`
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="leading-tight">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Vereda Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Vereda Afectada</span>
                </label>
                <select
                  id="select-vereda-alerta"
                  value={veredaName}
                  onChange={e => setVeredaName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-medium bg-gray-50"
                >
                  {PURIFICACION_VEREDAS.map(v => (
                    <option key={v.id} value={v.name}>{v.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Nivel de Urgencia
                </label>
                <select
                  value={severity}
                  onChange={e => setSeverity(e.target.value as 'alta' | 'media' | 'baja')}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-medium bg-white"
                >
                  <option value="alta">🔴 Alta Urgencia (Humo / Riesgo)</option>
                  <option value="media">🟡 Media (Punto de Acopio)</option>
                  <option value="baja">🟢 Informativa</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Descripción del suceso o ubicación exacta
              </label>
              <textarea
                id="input-descripcion-alerta"
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Ej: En la finca El Remanso, cerca a la escuela, hay acumulación de bolsas y están encendiendo fuego para quemar plásticos..."
                required
                className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500 text-xs font-medium"
              />
            </div>

            {/* Contact info (Optional) */}
            <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200 text-xs">
              <div>
                <label className="block text-gray-600 font-semibold mb-1">Tu Nombre (Opcional)</label>
                <input
                  type="text"
                  value={reporterName}
                  onChange={e => setReporterName(e.target.value)}
                  placeholder="Líder comunitario / Vecino"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs bg-white"
                />
              </div>
              <div>
                <label className="block text-gray-600 font-semibold mb-1 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-emerald-600" />
                  <span>Teléfono</span>
                </label>
                <input
                  type="text"
                  value={reporterPhone}
                  onChange={e => setReporterPhone(e.target.value)}
                  placeholder="315 000 0000"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs bg-white"
                />
              </div>
            </div>

            {/* Anti-burning awareness badge */}
            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 flex items-start space-x-2.5 text-xs text-emerald-900">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>¿Sabías que quemar basura es una infracción ambiental en Colombia?</strong> Libera dioxinas que dañan los pulmones de niños y ahuyentan a las aves y fauna silvestre de Purificación. ¡Eco-Rural pasa por tu vereda!
              </p>
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
                id="btn-enviar-alerta-ciudadana"
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-md transition-all cursor-pointer flex items-center space-x-1.5"
              >
                <Flame className="w-4 h-4" />
                <span>Enviar Reporte Inmediato</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

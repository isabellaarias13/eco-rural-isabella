import React from 'react';
import { X, BookOpen, Leaf, Recycle, AlertOctagon, CheckCircle2, Sprout } from 'lucide-react';

interface RuralRecyclingGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RuralRecyclingGuideModal: React.FC<RuralRecyclingGuideModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-emerald-200 overflow-hidden">
        {/* Header */}
        <div className="bg-emerald-800 px-6 py-4 text-white flex justify-between items-center">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-amber-300">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Guía de Separación y Aseo Rural</h3>
              <p className="text-xs text-emerald-200">Cero Quemas &middot; Fincas Limpias &middot; Purificación Tolima</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-300 hover:text-white p-1.5 rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs text-gray-700">
          {/* Why Stop Burning Banner */}
          <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex items-start space-x-3">
            <AlertOctagon className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-extrabold text-sm text-amber-950">¿Por qué NO quemar basuras en las veredas?</h4>
              <p className="text-gray-700 mt-1 leading-relaxed">
                La quema de basuras y plásticos libera humo tóxico cargado de dioxinas y furanos. Afecta las vías respiratorias de los niños, genera riesgo de incendios forestales en la temporada seca del Tolima y contamina los nacimientos de agua y la fauna del municipio.
              </p>
            </div>
          </div>

          {/* Separation Colors */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            {/* Organic */}
            <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center space-x-2 text-emerald-800 font-bold">
                <Sprout className="w-4 h-4 text-emerald-600" />
                <span>1. Orgánicos (Verde)</span>
              </div>
              <p className="text-[11px] text-gray-600">
                Restos de comida, cáscaras de plátano, podas, estiércol compostable y bagazo.
              </p>
              <div className="bg-white p-2 rounded-lg text-[10px] text-emerald-900 font-semibold border border-emerald-200">
                🌱 Consejo: Úsalos en compostera para abonar tus cultivos de arroz, plátano o café.
              </div>
            </div>

            {/* Recyclables */}
            <div className="bg-sky-50 border border-sky-300 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center space-x-2 text-sky-800 font-bold">
                <Recycle className="w-4 h-4 text-sky-600" />
                <span>2. Reciclables (Blanco/Azul)</span>
              </div>
              <p className="text-[11px] text-gray-600">
                Plásticos limpios, botellas de gaseosa, latas, cartón seco, papel y chatarra metálica.
              </p>
              <div className="bg-white p-2 rounded-lg text-[10px] text-sky-900 font-semibold border border-sky-200">
                📦 Entrégaselo seco y amarrado al camión de Eco-Rural en el día programado.
              </div>
            </div>

            {/* Agroquímicos & Ordinarios */}
            <div className="bg-red-50 border border-red-300 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center space-x-2 text-red-800 font-bold">
                <Leaf className="w-4 h-4 text-red-600" />
                <span>3. Agroquímicos (Campo Limpio)</span>
              </div>
              <p className="text-[11px] text-gray-600">
                Envases de fungicidas o pesticidas. <strong>¡NUNCA QUEMARLOS NI TIRARLOS AL RÍO!</strong>
              </p>
              <div className="bg-white p-2 rounded-lg text-[10px] text-red-900 font-semibold border border-red-200">
                ⚠️ Realizar el triple lavado, perforar el envase y entregarlo en el punto especial.
              </div>
            </div>
          </div>

          {/* Veredas commitments */}
          <div className="bg-emerald-950 text-white p-4 rounded-xl space-y-2">
            <h4 className="font-bold text-sm text-emerald-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Decálogo del Habitante Rural de Purificación</span>
            </h4>
            <ul className="space-y-1.5 text-[11px] text-emerald-100 list-disc list-inside">
              <li>Saca tu basura en costal o bolsa cerrada solo el día que pasa la ruta por tu vereda.</li>
              <li>Mantén los puntos de acopio comunitarios limpios y alejados de perros y animales de corral.</li>
              <li>Avisa a tus vecinos sobre el horario del camión para evitar acumulaciones a la orilla del camino.</li>
            </ul>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={onClose}
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow cursor-pointer transition-colors"
            >
              Entendido &middot; Cerrar Guía
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  FileText, 
  FileSpreadsheet, 
  Download, 
  TrendingUp, 
  Recycle, 
  CheckCircle2, 
  Scale, 
  MapPin, 
  Calendar, 
  Sparkles, 
  Printer,
  Flame,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MonthlyStats, MaterialDistribution } from '../types';
import { ReportController, RouteReportSummary } from '../controllers/reportController';

interface ReportesViewProps {
  monthlyStats: MonthlyStats[];
  materials: MaterialDistribution[];
}

export const ReportesView: React.FC<ReportesViewProps> = ({
  monthlyStats,
  materials
}) => {
  const [selectedMonth, setSelectedMonth] = useState('todos');
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isExportingCSV, setIsExportingCSV] = useState(false);

  const globalMetrics = ReportController.getGlobalMetrics();
  const routeSummaries: RouteReportSummary[] = ReportController.getRouteSummaries();

  const handleExportPDF = () => {
    setIsExportingPDF(true);
    try {
      ReportController.exportToPDF();
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.8 } });
    } catch (err) {
      console.error('Error exporting PDF:', err);
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handleExportCSV = () => {
    setIsExportingCSV(true);
    try {
      ReportController.exportToExcelCSV();
      confetti({ particleCount: 30, spread: 40, origin: { y: 0.8 } });
    } catch (err) {
      console.error('Error exporting CSV:', err);
    } finally {
      setIsExportingCSV(false);
    }
  };

  return (
    <div id="reportes-view" className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header with Export Buttons (PDF & Excel) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <h2 className="text-xl font-black text-emerald-950 tracking-tight">
              Reportes, Análisis & Impacto Ambiental
            </h2>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Métricas de recolección rural, porcentaje de reciclaje y balances por vereda en Purificación, Tolima
          </p>
        </div>

        {/* Export Buttons: PDF & Excel */}
        <div className="flex items-center space-x-2.5">
          <button
            id="btn-exportar-excel"
            onClick={handleExportCSV}
            disabled={isExportingCSV}
            className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold text-xs shadow-sm transition-all cursor-pointer flex items-center space-x-1.5 active:scale-95"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
            <span>Exportar Excel / CSV</span>
          </button>

          <button
            id="btn-exportar-pdf"
            onClick={handleExportPDF}
            disabled={isExportingPDF}
            className="px-4 py-2.5 bg-red-700 hover:bg-red-800 text-white rounded-xl font-bold text-xs shadow-md shadow-red-900/20 transition-all cursor-pointer flex items-center space-x-1.5 active:scale-95"
          >
            <FileText className="w-4 h-4 text-amber-300" />
            <span>Exportar PDF Oficial</span>
          </button>
        </div>
      </div>

      {/* 3 TOP KPIS: Total Recolecciones, Material Reciclado, Eficiencia Promedio */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* KPI 1: Total Número de Recolecciones */}
        <div id="kpi-total-recolecciones-reporte" className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase text-gray-500">Total Número de Recolecciones</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-emerald-950">
              {globalMetrics.totalCollections}
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Jornadas
            </span>
          </div>
          <p className="text-[11px] text-gray-500 mt-1">Cumplimiento en todas las veredas de Purificación</p>
        </div>

        {/* KPI 2: Material Reciclado (Toneladas) */}
        <div id="kpi-material-reciclado-reporte" className="bg-white p-5 rounded-2xl border border-sky-100 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase text-gray-500">Material Reciclado y Compost</span>
            <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
              <Recycle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-sky-950">
              {globalMetrics.totalRecycledTons}
            </span>
            <span className="text-xs font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded">
              Toneladas
            </span>
          </div>
          <p className="text-[11px] text-gray-500 mt-1">Plásticos, abono orgánico y chatarra recuperada</p>
        </div>

        {/* KPI 3: Porcentaje de Eficiencia Promedio */}
        <div id="kpi-eficiencia-promedio-reporte" className="bg-white p-5 rounded-2xl border border-teal-100 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase text-gray-500">Porcentaje de Eficiencia Promedio</span>
            <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-teal-950">
              {globalMetrics.avgEfficiency}%
            </span>
            <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
              Aprovechamiento
            </span>
          </div>
          <p className="text-[11px] text-gray-500 mt-1">
            {globalMetrics.totalBurningsPrevented} quemas de basuras evitadas en Tolima
          </p>
        </div>
      </div>

      {/* TABLA: RECOLECCIONES POR MES & DISTRIBUCIÓN DE RESIDUOS EN UN PORCENTAJE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tabla sobre recolecciones por mes */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>Tabla de Recolecciones por Mes</span>
              </h3>
              <p className="text-xs text-gray-500">Histórico de volumen mensual en Purificación</p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full">
              Año 2026
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-100 text-gray-700 uppercase text-[10px] tracking-wider rounded-lg">
                <tr>
                  <th className="p-2.5 rounded-l-lg">Mes</th>
                  <th className="p-2.5 text-center">N° Recolecciones</th>
                  <th className="p-2.5 text-right">Total (Ton)</th>
                  <th className="p-2.5 text-right">Reciclado (Ton)</th>
                  <th className="p-2.5 text-right rounded-r-lg">Eficiencia %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {monthlyStats.map((item, idx) => (
                  <tr key={idx} className="hover:bg-emerald-50/40 transition-colors">
                    <td className="p-2.5 font-bold text-emerald-950">{item.month}</td>
                    <td className="p-2.5 text-center">{item.collectionsCount}</td>
                    <td className="p-2.5 text-right font-bold text-gray-900">{item.totalTons} Ton</td>
                    <td className="p-2.5 text-right text-emerald-700 font-bold">{item.recycledTons} Ton</td>
                    <td className="p-2.5 text-right">
                      <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full font-black text-[10px]">
                        {item.efficiencyPercent}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Distribución de residuos en un porcentaje */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                <Recycle className="w-4 h-4 text-emerald-600" />
                <span>Distribución de Residuos en Porcentaje</span>
              </h3>
              <p className="text-xs text-gray-500">Separación en la fuente rural de Purificación</p>
            </div>
            <span className="bg-amber-100 text-amber-900 text-xs font-bold px-2 py-0.5 rounded-full">
              Economía Circular
            </span>
          </div>

          {/* Cards for each Material */}
          <div className="space-y-2.5">
            {materials.map((mat, idx) => (
              <div key={idx} className="p-3 rounded-xl border border-gray-100 bg-gray-50/70 space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: mat.color }}></span>
                    <span className="font-bold text-gray-900">{mat.name}</span>
                  </div>
                  <span className="font-black text-sm text-emerald-950">{mat.percentage}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full" 
                    style={{ width: `${mat.percentage}%`, backgroundColor: mat.color }}
                  />
                </div>
                <p className="text-[11px] text-gray-500 leading-tight">{mat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TABLA DE DETALLE POR RUTA (Ruta, Número de Recolecciones, Toneladas, % Eficiencia) */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider">
              Tabla de Detalle por Ruta y Vereda de Purificación
            </h3>
            <p className="text-xs text-gray-500">
              Chenche Asoleado, Chenche 1, 2, 3, Las Damas, La Mata, El Baura, El Tambo, Santa Lucía 1 & 2, El Tigre, Sabaneta, Remolino, Campo Alegre, Buenavista
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl">
            {routeSummaries.length} Veredas Censadas
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-emerald-900 text-white uppercase text-[10px] tracking-wider rounded-lg">
              <tr>
                <th className="p-3 rounded-l-lg">Código de Ruta</th>
                <th className="p-3">Vereda de Purificación (Tolima)</th>
                <th className="p-3 text-center">N° de Recolecciones</th>
                <th className="p-3 text-right">Toneladas Totales</th>
                <th className="p-3 text-right">Material Reciclado (Ton)</th>
                <th className="p-3 text-right rounded-r-lg">Porcentaje de Eficiencia</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {routeSummaries.map((summary, idx) => (
                <tr key={idx} className="hover:bg-emerald-50/50 transition-colors">
                  <td className="p-3 font-extrabold text-emerald-950">{summary.routeName}</td>
                  <td className="p-3">
                    <div className="flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="font-bold text-gray-900">{summary.veredaName}</span>
                    </div>
                  </td>
                  <td className="p-3 text-center font-bold text-gray-800">{summary.collectionsCount}</td>
                  <td className="p-3 text-right font-black text-gray-900">{summary.totalTons} Ton</td>
                  <td className="p-3 text-right text-emerald-700 font-bold">{summary.recycledTons} Ton</td>
                  <td className="p-3 text-right">
                    <span className="bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full font-black text-xs">
                      {summary.efficiencyPercent}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Environmental Banner on Quema de Basuras prevention */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 rounded-2xl p-6 text-white flex flex-col md:flex-row justify-between items-center gap-4 border border-emerald-700 shadow-lg">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <Flame className="w-5 h-5 text-amber-400" />
            <h4 className="font-black text-base text-white">
              Purificación Limpia: Resultados de la Estrategia Cero Quemas
            </h4>
          </div>
          <p className="text-xs text-emerald-200 max-w-2xl leading-relaxed">
            Gracias al sistema Eco-Rural se han evitado más de 250 quemas de basura a cielo abierto en las veredas del municipio, protegiendo a la fauna silvestre, reduciendo malos olores e integrando residuos orgánicos como abono para las familias campesinas.
          </p>
        </div>

        <button
          onClick={handleExportPDF}
          className="bg-amber-400 hover:bg-amber-300 text-emerald-950 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer shrink-0 shadow flex items-center gap-1.5"
        >
          <Printer className="w-4 h-4" />
          <span>Imprimir Informe Oficial</span>
        </button>
      </div>
    </div>
  );
};

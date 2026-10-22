import React, { useState } from 'react';
import {
  METRICAS_CARTERA,
  DISTRIBUCION_MODALIDAD,
  DISTRIBUCION_COMPLEJIDAD,
  CASOS_PROXIMOS_VENCER,
} from '../data/mockCartera';
import { CasoCartera, NivelRiesgo } from '../types';
import {
  BarChart3,
  PieChart,
  Calendar,
  AlertTriangle,
  Clock,
  CheckCircle,
  FileText,
  Search,
  Filter,
  ArrowRight,
} from 'lucide-react';

interface TableroSectionProps {
  onSelectCaseToProject?: (radicado: string, modalidad: string) => void;
}

export const TableroSection: React.FC<TableroSectionProps> = ({ onSelectCaseToProject }) => {
  const [filtroRiesgo, setFiltroRiesgo] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Filter cases
  const casosFiltrados = CASOS_PROXIMOS_VENCER.filter((caso) => {
    const matchRiesgo =
      filtroRiesgo === 'todos' || caso.nivelRiesgo === filtroRiesgo;
    const matchSearch =
      caso.radicado.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caso.modalidad.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caso.solicitanteAnon.toLowerCase().includes(searchTerm.toLowerCase());
    return matchRiesgo && matchSearch;
  });

  const maxCantidadModalidad = Math.max(
    ...DISTRIBUCION_MODALIDAD.map((m) => m.cantidad)
  );

  const getRiesgoBadge = (nivel: NivelRiesgo, dias: number) => {
    switch (nivel) {
      case 'critico':
        return (
          <span className="inline-flex items-center space-x-1.5 bg-red-100 text-red-900 border border-red-300 px-2 py-0.5 text-xs font-bold uppercase">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block" />
            <span>Crítico ({dias} {dias === 1 ? 'día' : 'días'})</span>
          </span>
        );
      case 'alto':
        return (
          <span className="inline-flex items-center space-x-1.5 bg-orange-100 text-orange-900 border border-orange-300 px-2 py-0.5 text-xs font-bold uppercase">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block" />
            <span>Alto ({dias} días)</span>
          </span>
        );
      case 'moderado':
        return (
          <span className="inline-flex items-center space-x-1.5 bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 text-xs font-bold uppercase">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
            <span>Moderado ({dias} días)</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1.5 bg-green-100 text-green-900 border border-green-300 px-2 py-0.5 text-xs font-bold uppercase">
            <span className="w-2.5 h-2.5 rounded-full bg-green-600 inline-block" />
            <span>Normal ({dias} días)</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Info Banner */}
      <div className="bg-white border border-slate-200 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-[#1F3B63] tracking-tight font-sans">
              Tablero de Control de Cartera y Términos de Respuesta
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Monitoreo del cumplimiento de plazos legales fijados por la Ley 1755 de 2015 para la Secretaría de Movilidad.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs bg-[#1F3B63] text-white px-3 py-1 font-semibold">
              Periodo: Octubre 2026
            </span>
            <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 font-medium border border-slate-300">
              Conjunto de prueba sintético
            </span>
          </div>
        </div>
      </div>

      {/* 4 Indicadores (KPI Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total peticiones */}
        <div className="bg-white border-2 border-slate-300 p-4 border-t-4 border-t-[#1F3B63]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Total Peticiones del Periodo
            </span>
            <FileText className="w-5 h-5 text-[#1F3B63]" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-slate-900 tracking-tight font-sans">
              {METRICAS_CARTERA.totalPeriodo}
            </span>
            <span className="text-xs text-slate-500 ml-1.5 font-medium">expedientes</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-600 border-t border-slate-100 pt-2 flex items-center justify-between">
            <span>Muestra analizada</span>
            <span className="text-slate-800 font-bold">Conjunto de prueba, n = 60</span>
          </div>
        </div>

        {/* Card 2: Porcentaje a tiempo */}
        <div className="bg-white border-2 border-slate-300 p-4 border-t-4 border-t-green-600">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Respondido Dentro del Término
            </span>
            <CheckCircle className="w-5 h-5 text-green-700" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-green-800 tracking-tight font-sans">
              {METRICAS_CARTERA.porcentajeATiempo}%
            </span>
            <span className="text-xs text-slate-500 ml-1.5 font-medium">cumplimiento legal</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-600 border-t border-slate-100 pt-2 flex items-center justify-between">
            <span>Meta institucional: &gt; 90%</span>
            <span className="text-green-700 font-bold">Meta cumplida</span>
          </div>
        </div>

        {/* Card 3: Tiempo promedio de proyección */}
        <div className="bg-white border-2 border-slate-300 p-4 border-t-4 border-t-[#F2C230]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Tiempo Promedio de Proyección
            </span>
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-slate-900 tracking-tight font-sans">
              {METRICAS_CARTERA.tiempoPromedioDias}
            </span>
            <span className="text-xs text-slate-500 ml-1.5 font-medium">días hábiles</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-600 border-t border-slate-100 pt-2 flex items-center justify-between">
            <span>Límite normativo: 10/15 d</span>
            <span className="text-amber-700 font-bold">Holgura favorable</span>
          </div>
        </div>

        {/* Card 4: Casos en riesgo de vencimiento */}
        <div className="bg-white border-2 border-slate-300 p-4 border-t-4 border-t-red-600">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Casos en Riesgo de Vencimiento
            </span>
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-red-700 tracking-tight font-sans">
              {METRICAS_CARTERA.casosEnRiesgo}
            </span>
            <span className="text-xs text-slate-500 ml-1.5 font-medium">en alerta crítica</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-600 border-t border-slate-100 pt-2 flex items-center justify-between">
            <span>Vencimiento &le; 5 días hábiles</span>
            <span className="text-red-700 font-bold">Acción inmediata</span>
          </div>
        </div>
      </div>

      {/* Gráficas: Barras y Torta */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfica de Barras: Distribución por modalidad */}
        <div className="bg-white border-2 border-[#1F3B63] overflow-hidden">
          <div className="bg-[#1F3B63] text-white p-3.5 flex items-center justify-between border-b-2 border-[#F2C230]">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-[#F2C230]" />
              <h3 className="font-bold text-sm tracking-tight">
                Distribución de Peticiones por Modalidad
              </h3>
            </div>
            <span className="text-xs text-slate-300 font-medium">
              Total: {METRICAS_CARTERA.totalPeriodo}
            </span>
          </div>

          <div className="p-5 space-y-3.5">
            {DISTRIBUCION_MODALIDAD.map((mod) => {
              const anchoPorcentaje = (mod.cantidad / maxCantidadModalidad) * 100;
              return (
                <div key={mod.modalidad} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-slate-800 font-semibold truncate pr-2">
                      {mod.modalidad}
                    </span>
                    <span className="text-slate-600 flex-shrink-0 font-mono">
                      <strong className="text-slate-900">{mod.cantidad}</strong> ({mod.porcentaje}%)
                    </span>
                  </div>
                  {/* Clean SVG/CSS Bar */}
                  <div className="w-full h-4 bg-slate-100 border border-slate-200 overflow-hidden">
                    <div
                      className="h-full bg-[#1F3B63]"
                      style={{ width: `${anchoPorcentaje}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Gráfica de Torta: Distribución por complejidad jurídica */}
        <div className="bg-white border-2 border-[#1F3B63] overflow-hidden">
          <div className="bg-[#1F3B63] text-white p-3.5 flex items-center justify-between border-b-2 border-[#F2C230]">
            <div className="flex items-center space-x-2">
              <PieChart className="w-4 h-4 text-[#F2C230]" />
              <h3 className="font-bold text-sm tracking-tight">
                Distribución por Nivel de Complejidad Jurídica
              </h3>
            </div>
            <span className="text-xs text-slate-300 font-medium">
              3 Niveles
            </span>
          </div>

          <div className="p-5 flex flex-col sm:flex-row items-center justify-around gap-6">
            {/* SVG Donut / Pie Chart */}
            <div className="relative w-44 h-44 flex-shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                {/* Donut Segments */}
                {/* Segment 1: Baja (53.3%) -> 127.3 */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#16A34A"
                  strokeWidth="20"
                  strokeDasharray="127.3 238.76"
                  strokeDashoffset="0"
                />
                {/* Segment 2: Media (28.3%) -> 67.6 */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#D97706"
                  strokeWidth="20"
                  strokeDasharray="67.6 238.76"
                  strokeDashoffset="-127.3"
                />
                {/* Segment 3: Alta (18.3%) -> 43.9 */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#DC2626"
                  strokeWidth="20"
                  strokeDasharray="43.9 238.76"
                  strokeDashoffset="-194.9"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-black text-slate-800 leading-none">60</span>
                <span className="text-[10px] uppercase font-bold text-slate-500 mt-0.5">Casos</span>
              </div>
            </div>

            {/* Legend & Details */}
            <div className="w-full sm:w-auto space-y-3">
              {DISTRIBUCION_COMPLEJIDAD.map((comp, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between sm:justify-start space-x-3 text-xs border-b border-slate-100 pb-2"
                >
                  <div className="flex items-center space-x-2">
                    <span
                      className="w-3.5 h-3.5 rounded-none flex-shrink-0"
                      style={{ backgroundColor: comp.color }}
                    />
                    <span className="font-bold text-slate-800">
                      Complejidad {comp.nivel}
                    </span>
                  </div>
                  <span className="font-mono text-slate-700 font-semibold">
                    {comp.cantidad} casos ({comp.porcentaje}%)
                  </span>
                </div>
              ))}
              <p className="text-[11px] text-slate-500 pt-1 leading-relaxed">
                * Clasificación asignada automáticamente según tipo de comparendo, antecedentes y precedentes jurídicos.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de los Casos Próximos a Vencer */}
      <div className="bg-white border-2 border-slate-300 overflow-hidden">
        <div className="bg-slate-100 p-4 border-b border-slate-300 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="font-bold text-sm text-[#1F3B63] tracking-tight flex items-center">
              <Clock className="w-4 h-4 mr-2 text-red-600" />
              Casos Próximos a Vencer (Atención Prioritaria)
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Expedientes con fecha límite de vencimiento en los próximos días hábiles (Ley 1755 de 2015).
            </p>
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Buscar radicado..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-2.5 py-1.5 text-xs border border-slate-300 focus:border-[#1F3B63] focus:outline-none bg-white w-40"
              />
            </div>

            <div className="flex items-center space-x-1 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={filtroRiesgo}
                onChange={(e) => setFiltroRiesgo(e.target.value)}
                className="text-xs border border-slate-300 p-1.5 bg-white focus:outline-none"
              >
                <option value="todos">Todos los riesgos</option>
                <option value="critico">Solo Críticos (1-2 días)</option>
                <option value="alto">Solo Altos (3 días)</option>
                <option value="moderado">Moderados (4-5 días)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-300 uppercase tracking-wider font-bold">
              <tr>
                <th className="p-3 border-r border-slate-200">Radicado</th>
                <th className="p-3 border-r border-slate-200">Modalidad de Petición</th>
                <th className="p-3 border-r border-slate-200 text-center">Fecha Radicación</th>
                <th className="p-3 border-r border-slate-200 text-center">Término Legal</th>
                <th className="p-3 border-r border-slate-200 text-center">Días Restantes</th>
                <th className="p-3 border-r border-slate-200 text-center">Semáforo de Riesgo</th>
                <th className="p-3 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {casosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-slate-500 text-xs">
                    No se encontraron expedientes con los criterios seleccionados.
                  </td>
                </tr>
              ) : (
                casosFiltrados.map((caso, index) => (
                  <tr key={index} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-mono font-bold text-[#1F3B63] border-r border-slate-200">
                      {caso.radicado}
                    </td>
                    <td className="p-3 text-slate-800 border-r border-slate-200">
                      <div className="font-medium">{caso.modalidad}</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        Peticionario: {caso.solicitanteAnon} | {caso.estado}
                      </div>
                    </td>
                    <td className="p-3 text-center text-slate-700 font-mono border-r border-slate-200">
                      {caso.fechaRadicacion}
                    </td>
                    <td className="p-3 text-center font-bold text-slate-800 border-r border-slate-200">
                      {caso.terminoDias} días hábiles
                    </td>
                    <td className="p-3 text-center font-bold border-r border-slate-200">
                      <span
                        className={`text-sm font-mono ${
                          caso.diasHabilesRestantes <= 2
                            ? 'text-red-700 font-black'
                            : caso.diasHabilesRestantes <= 3
                            ? 'text-orange-700 font-bold'
                            : 'text-amber-700'
                        }`}
                      >
                        {caso.diasHabilesRestantes} d
                      </span>
                    </td>
                    <td className="p-3 text-center border-r border-slate-200">
                      {getRiesgoBadge(caso.nivelRiesgo, caso.diasHabilesRestantes)}
                    </td>
                    <td className="p-3 text-center">
                      {onSelectCaseToProject && (
                        <button
                          type="button"
                          onClick={() => onSelectCaseToProject(caso.radicado, caso.modalidad)}
                          className="text-[#1F3B63] hover:text-[#162a47] font-bold text-xs inline-flex items-center underline"
                          title="Cargar al módulo de proyección"
                        >
                          Proyectar
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

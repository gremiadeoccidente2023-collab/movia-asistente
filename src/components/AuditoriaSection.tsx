import React, { useState } from 'react';
import {
  FileCheck2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Loader2,
  RefreshCw,
  ShieldAlert,
  Info,
} from 'lucide-react';
import { AuditoriaResult, EstadoAuditoria } from '../types';
import { SAMPLE_AUDIT_DRAFTS } from '../data/samplePetitions';

export const AuditoriaSection: React.FC = () => {
  const [borradorTexto, setBorradorTexto] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resultado, setResultado] = useState<AuditoriaResult | null>(null);

  const handleAuditar = async () => {
    if (!borradorTexto.trim()) return;
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/auditar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ borrador: borradorTexto }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || `Error en el servidor (${response.status})`);
      }

      const data: AuditoriaResult = await response.json();
      setResultado(data);
    } catch (err: any) {
      console.error('Error al auditar borrador:', err);
      setErrorMsg(err.message || 'Ocurrió un error al auditar el borrador con el modelo.');
    } finally {
      setIsLoading(false);
    }
  };

  const getSemaforoBadge = (estado: EstadoAuditoria | string) => {
    const norm = (estado || '').toLowerCase();
    if (norm === 'cumple') {
      return (
        <span className="inline-flex items-center space-x-1.5 bg-green-100 text-green-900 border border-green-300 px-2.5 py-1 text-xs font-bold uppercase tracking-wider">
          <span className="w-2.5 h-2.5 rounded-full bg-green-600 inline-block" />
          <span>Cumple</span>
        </span>
      );
    }
    if (norm === 'cumple_parcialmente' || norm.includes('parcial')) {
      return (
        <span className="inline-flex items-center space-x-1.5 bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-1 text-xs font-bold uppercase tracking-wider">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
          <span>Cumple parcialmente</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-1.5 bg-red-100 text-red-900 border border-red-300 px-2.5 py-1 text-xs font-bold uppercase tracking-wider">
        <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block" />
        <span>No cumple</span>
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Title & Description */}
      <div className="bg-white border border-slate-200 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-[#1F3B63] tracking-tight font-sans">
              Auditoría Jurídica y Formal de Borradores
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Control de calidad de actos administrativos y respuestas proyectadas sobre siete puntos críticos de legalidad procesal.
            </p>
          </div>
          <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 font-semibold border border-slate-300 self-start sm:self-auto">
            Control Preventivo
          </span>
        </div>

        {/* Sample Templates */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-600 flex items-center">
            <Info className="w-3.5 h-3.5 mr-1 text-[#1F3B63]" />
            Cargar borrador de prueba:
          </span>
          {SAMPLE_AUDIT_DRAFTS.map((sample, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setBorradorTexto(sample.texto)}
              className="text-xs bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-300 px-2.5 py-1 transition-colors"
            >
              {sample.titulo}
            </button>
          ))}
          {borradorTexto && (
            <button
              type="button"
              onClick={() => setBorradorTexto('')}
              className="text-xs text-red-700 hover:text-red-900 ml-auto underline"
            >
              Limpiar campo
            </button>
          )}
        </div>
      </div>

      {/* Input Text Area */}
      <div className="bg-white border border-slate-200 p-5 space-y-4">
        <div>
          <label htmlFor="borrador-input" className="block text-sm font-bold text-slate-900 mb-1">
            Pegue aquí el borrador de acto administrativo o respuesta a auditar
          </label>
          <p className="text-xs text-slate-600 mb-2">
            El sistema verificará exhaustivamente la estructura formal de 6 bloques, la vigencia del marco normativo (art. 159 Ley 769 mod. DL 019/2012), congruencia, recursos y protección de datos.
          </p>

          <textarea
            id="borrador-input"
            value={borradorTexto}
            onChange={(e) => setBorradorTexto(e.target.value)}
            rows={10}
            placeholder="Pegue aquí el texto completo del borrador (Resolución, Auto o Oficio de respuesta)..."
            className="w-full p-3 text-sm font-mono text-slate-800 border-2 border-slate-300 focus:border-[#1F3B63] focus:outline-none transition-colors rounded-none resize-y"
          />

          <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
            <span>
              {borradorTexto.length} caracteres | {borradorTexto.trim() ? borradorTexto.trim().split(/\s+/).length : 0} palabras
            </span>
            <span>Auditoría de 7 puntos de control normativo</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={handleAuditar}
            disabled={!borradorTexto.trim() || isLoading}
            className={`px-6 py-2.5 font-bold text-sm tracking-wide transition-all inline-flex items-center justify-center ${
              !borradorTexto.trim() || isLoading
                ? 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed'
                : 'bg-[#1F3B63] hover:bg-[#162a47] text-white border-b-2 border-[#F2C230] cursor-pointer'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin text-[#F2C230]" />
                Auditando borrador contra marco normativo...
              </>
            ) : (
              <>
                <FileCheck2 className="w-4 h-4 mr-2 text-[#F2C230]" />
                Auditar
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div className="bg-red-50 border-2 border-red-500 p-4 text-red-900 flex items-start justify-between">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-700 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">Error en la auditoría</p>
              <p className="text-xs mt-0.5 text-red-800">{errorMsg}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleAuditar}
            className="bg-red-700 text-white text-xs px-3 py-1.5 font-semibold hover:bg-red-800 transition-colors inline-flex items-center"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1" />
            Reintentar
          </button>
        </div>
      )}

      {/* Audit Result Table (7 rows) */}
      {resultado && (
        <div className="space-y-6">
          <div className="bg-white border-2 border-[#1F3B63] overflow-hidden">
            <div className="bg-[#1F3B63] text-white p-3.5 flex items-center justify-between border-b-2 border-[#F2C230]">
              <div className="flex items-center space-x-2">
                <FileCheck2 className="w-5 h-5 text-[#F2C230]" />
                <h3 className="font-bold text-sm tracking-tight">
                  Matriz de Control de Calidad Jurídica (7 Puntos de Control)
                </h3>
              </div>
              <span className="text-xs bg-[#162a47] text-slate-200 px-2 py-0.5 border border-slate-600">
                Secretaría de Movilidad
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 text-slate-800 border-b border-slate-300 uppercase tracking-wider font-bold">
                  <tr>
                    <th className="p-3 w-12 text-center border-r border-slate-300">#</th>
                    <th className="p-3 w-72 border-r border-slate-300">Punto de Control</th>
                    <th className="p-3 w-48 text-center border-r border-slate-300">
                      Semáforo de Cumplimiento
                    </th>
                    <th className="p-3">Observación Técnica y Jurídica</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {resultado.puntosControl.map((pc, index) => (
                    <tr key={index} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 text-center font-bold text-slate-600 border-r border-slate-200 bg-slate-50">
                        {index + 1}
                      </td>
                      <td className="p-3 font-bold text-slate-900 border-r border-slate-200">
                        {pc.punto}
                      </td>
                      <td className="p-3 text-center border-r border-slate-200">
                        {getSemaforoBadge(pc.estado)}
                      </td>
                      <td className="p-3 text-slate-700 leading-relaxed font-sans">
                        {pc.observacion}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recuadro con los tres hallazgos de mayor riesgo */}
          <div className="bg-white border-2 border-red-500 overflow-hidden">
            <div className="bg-red-700 text-white p-3.5 flex items-center space-x-2 border-b-2 border-red-800">
              <ShieldAlert className="w-5 h-5 text-amber-300" />
              <h3 className="font-bold text-sm tracking-tight uppercase">
                Los Tres Hallazgos de Mayor Riesgo Jurídico y Procesal
              </h3>
            </div>

            <div className="p-5 bg-red-50/40 space-y-3">
              <p className="text-xs text-red-950 font-medium">
                Atención prioritaria antes de someter a firma del funcionario competente. Corregir estos puntos evita nulidades del acto administrativo o sanciones disciplinarias:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                {resultado.hallazgosMayorRiesgo.map((hallazgo, idx) => (
                  <div
                    key={idx}
                    className="bg-white border-l-4 border-red-600 border-y border-r border-slate-300 p-4 space-y-2 shadow-none"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase text-red-700 tracking-wider">
                        Riesgo #{idx + 1}
                      </span>
                      <span className="text-[10px] bg-red-100 text-red-800 px-1.5 py-0.5 font-bold uppercase">
                        Alta prioridad
                      </span>
                    </div>
                    <p className="text-xs text-slate-800 leading-relaxed">
                      {hallazgo}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

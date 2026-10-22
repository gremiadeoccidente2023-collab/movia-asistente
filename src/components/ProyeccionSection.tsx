import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Copy,
  Download,
  FileText,
  Loader2,
  RefreshCw,
  Sparkles,
  ShieldAlert,
  Info,
  Scale,
  BookOpen,
} from 'lucide-react';
import { ProyeccionResult } from '../types';
import { SAMPLE_PETITIONS } from '../data/samplePetitions';

export const ProyeccionSection: React.FC = () => {
  const [peticionTexto, setPeticionTexto] = useState<string>('');
  const [confirmacionChecked, setConfirmacionChecked] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resultado, setResultado] = useState<ProyeccionResult | null>(null);

  // Accordion open/collapse states for the 3 stages
  const [openStage1, setOpenStage1] = useState<boolean>(true);
  const [openStage2, setOpenStage2] = useState<boolean>(true);
  const [openStage3, setOpenStage3] = useState<boolean>(true);

  // Copied feedback states
  const [copiedBorrador, setCopiedBorrador] = useState<boolean>(false);

  // Automatic personal data detector
  const detectorResult = useMemo(() => {
    if (!peticionTexto.trim()) {
      return { hasIssues: false, cedulas: [], placas: [], emails: [] };
    }

    // Cedula regex: sequences of 7 to 10 consecutive digits not immediately preceded by # or $
    const cedulaMatches = peticionTexto.match(/\b\d{7,10}\b/g) || [];

    // Placa regex: 3 letters followed by 3 digits (or 2 digits and 1 letter)
    const placaMatches = peticionTexto.match(/\b[A-Za-z]{3}[-\s]?\d{3}\b|\b[A-Za-z]{3}[-\s]?\d{2}[A-Za-z]\b/g) || [];

    // Email regex
    const emailMatches = peticionTexto.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g) || [];

    const hasIssues = cedulaMatches.length > 0 || placaMatches.length > 0 || emailMatches.length > 0;

    return {
      hasIssues,
      cedulas: Array.from(new Set(cedulaMatches)),
      placas: Array.from(new Set(placaMatches)),
      emails: Array.from(new Set(emailMatches)),
    };
  }, [peticionTexto]);

  // Handler to auto-anonymize detected items with standard markers
  const handleAutoAnonimizar = () => {
    let replaced = peticionTexto;
    // Replace emails first
    detectorResult.emails.forEach((em) => {
      replaced = replaced.replaceAll(em, '[CORREO]');
    });
    // Replace placas
    detectorResult.placas.forEach((pl) => {
      replaced = replaced.replaceAll(pl, '[PLACA]');
    });
    // Replace cédulas
    detectorResult.cedulas.forEach((cd) => {
      replaced = replaced.replaceAll(cd, '[DOCUMENTO]');
    });
    setPeticionTexto(replaced);
    setConfirmacionChecked(false);
  };

  const handleProcesar = async () => {
    if (!peticionTexto.trim()) return;
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/proyectar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ peticion: peticionTexto }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || `Error en el servidor (${response.status})`);
      }

      const data: ProyeccionResult = await response.json();
      setResultado(data);
      // Auto open all 3 stages
      setOpenStage1(true);
      setOpenStage2(true);
      setOpenStage3(true);
    } catch (err: any) {
      console.error('Error al procesar petición:', err);
      setErrorMsg(err.message || 'Ocurrió un error al procesar la petición con el modelo.');
    } finally {
      setIsLoading(false);
    }
  };

  // Build the complete draft text for copying and downloading
  const getBorradorTextoCompleto = (): string => {
    if (!resultado) return '';
    if (resultado.proyeccion.borradorCompleto) {
      return resultado.proyeccion.borradorCompleto;
    }

    const { encabezado, antecedentes, consideraciones, decision, recursos, notificacion } =
      resultado.proyeccion;

    return `${encabezado}

I. ANTECEDENTES
${antecedentes.map((a, i) => `${i + 1}. ${a}`).join('\n')}

II. CONSIDERACIONES JURÍDICAS
${consideraciones}

III. DECISIÓN
RESUELVE:
${decision.join('\n')}

RECURSOS:
${recursos}

NOTIFICACIÓN:
${notificacion}

---
Borrador asistido. Requiere revisión jurídica y firma del funcionario competente.`;
  };

  const handleCopiarBorrador = async () => {
    const texto = getBorradorTextoCompleto();
    if (!texto) return;
    try {
      await navigator.clipboard.writeText(texto);
      setCopiedBorrador(true);
      setTimeout(() => setCopiedBorrador(false), 2500);
    } catch (e) {
      console.error('Error al copiar:', e);
    }
  };

  const handleDescargarTxt = () => {
    const texto = getBorradorTextoCompleto();
    if (!texto) return;
    const blob = new Blob([texto], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `borrador_movia_respuesta_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Button disabled logic: if issues exist, user must check the confirmation
  const isProcessDisabled =
    !peticionTexto.trim() ||
    isLoading ||
    (detectorResult.hasIssues && !confirmacionChecked);

  return (
    <div className="space-y-6">
      {/* Module Title Banner */}
      <div className="bg-white border border-slate-200 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-[#1F3B63] tracking-tight font-sans">
              Proyección de Respuestas a Peticiones Ciudadanas
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Herramienta de análisis normativo y estructuración formal del acto administrativo conforme a la Ley 1755 de 2015, Ley 769 de 2002 (mod. DL 019/2012) y Ley 1437 de 2011.
            </p>
          </div>
          <div className="flex-shrink-0">
            <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 font-semibold border border-slate-300">
              Módulo Principal
            </span>
          </div>
        </div>

        {/* Quick Sample Selector */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-600 flex items-center">
            <Info className="w-3.5 h-3.5 mr-1 text-[#1F3B63]" />
            Cargar ejemplo institucional:
          </span>
          {SAMPLE_PETITIONS.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => {
                setPeticionTexto(sample.texto);
                setConfirmacionChecked(false);
              }}
              className="text-xs bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-300 px-2.5 py-1 transition-colors"
            >
              {sample.titulo}
            </button>
          ))}
          {peticionTexto && (
            <button
              type="button"
              onClick={() => {
                setPeticionTexto('');
                setConfirmacionChecked(false);
              }}
              className="text-xs text-red-700 hover:text-red-900 ml-auto underline"
            >
              Limpiar campo
            </button>
          )}
        </div>
      </div>

      {/* Main Input Card */}
      <div className="bg-white border border-slate-200 p-5 space-y-4">
        {/* Automatic Personal Data Warning Box */}
        {detectorResult.hasIssues && (
          <div className="bg-red-50 border-2 border-red-500 p-4 text-red-900 space-y-2.5">
            <div className="flex items-start space-x-2.5">
              <ShieldAlert className="w-5 h-5 text-red-700 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold text-sm text-red-800">
                  Se detectaron posibles datos personales. Reemplácelos por marcadores antes de continuar.
                </p>
                <p className="text-xs text-red-700 mt-0.5">
                  Conforme a la Ley 1581 de 2012 y las directrices internas de la Secretaría de Movilidad, no deben remitirse cédulas, placas ni correos reales al procesador.
                </p>
              </div>
            </div>

            {/* List of detected items */}
            <div className="bg-white p-2.5 border border-red-200 text-xs space-y-1">
              {detectorResult.cedulas.length > 0 && (
                <div>
                  <span className="font-semibold text-red-800">Cédula(s) detectada(s): </span>
                  <span className="font-mono text-slate-700">{detectorResult.cedulas.join(', ')}</span>
                </div>
              )}
              {detectorResult.placas.length > 0 && (
                <div>
                  <span className="font-semibold text-red-800">Placa(s) detectada(s): </span>
                  <span className="font-mono text-slate-700">{detectorResult.placas.join(', ')}</span>
                </div>
              )}
              {detectorResult.emails.length > 0 && (
                <div>
                  <span className="font-semibold text-red-800">Correo(s) detectado(s): </span>
                  <span className="font-mono text-slate-700">{detectorResult.emails.join(', ')}</span>
                </div>
              )}
            </div>

            {/* Quick Anonymize Button & Checkbox */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
              <button
                type="button"
                onClick={handleAutoAnonimizar}
                className="bg-red-700 hover:bg-red-800 text-white text-xs font-semibold px-3 py-1.5 transition-colors inline-flex items-center"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                Anonimizar automáticamente con marcadores [ ]
              </button>

              <label className="flex items-center space-x-2 text-xs text-red-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmacionChecked}
                  onChange={(e) => setConfirmacionChecked(e.target.checked)}
                  className="rounded-none border-red-400 text-red-700 focus:ring-0 w-4 h-4 cursor-pointer"
                />
                <span className="font-medium">
                  He verificado y autorizo el procesamiento con estos términos
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Text Area */}
        <div>
          <label
            htmlFor="peticion-input"
            className="block text-sm font-bold text-slate-900 mb-1"
          >
            Pegue aquí el texto de la petición ciudadana
          </label>
          <p className="text-xs text-slate-600 mb-2">
            No incluya datos personales. Use marcadores:{' '}
            <span className="font-mono bg-slate-100 px-1 py-0.5 border border-slate-300 text-slate-800">
              [NOMBRE]
            </span>
            ,{' '}
            <span className="font-mono bg-slate-100 px-1 py-0.5 border border-slate-300 text-slate-800">
              [DOCUMENTO]
            </span>
            ,{' '}
            <span className="font-mono bg-slate-100 px-1 py-0.5 border border-slate-300 text-slate-800">
              [DIRECCIÓN]
            </span>
            ,{' '}
            <span className="font-mono bg-slate-100 px-1 py-0.5 border border-slate-300 text-slate-800">
              [PLACA]
            </span>
            ,{' '}
            <span className="font-mono bg-slate-100 px-1 py-0.5 border border-slate-300 text-slate-800">
              [NÚMERO]
            </span>
            .
          </p>

          <textarea
            id="peticion-input"
            value={peticionTexto}
            onChange={(e) => setPeticionTexto(e.target.value)}
            rows={9}
            placeholder="Señores Secretaría de Movilidad de [MUNICIPIO]... Solicito la prescripción del comparendo [NÚMERO] impuesto al vehículo [PLACA]..."
            className="w-full p-3 text-sm font-mono text-slate-800 border-2 border-slate-300 focus:border-[#1F3B63] focus:outline-none transition-colors rounded-none resize-y"
          />

          <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
            <span>
              {peticionTexto.length} caracteres | {peticionTexto.trim() ? peticionTexto.trim().split(/\s+/).length : 0} palabras
            </span>
            <span>Tono: Formal impersonal para servidor público</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="text-xs text-slate-600">
            {detectorResult.hasIssues && !confirmacionChecked && (
              <span className="text-red-700 font-semibold">
                * Botón bloqueado por detección de posibles datos personales.
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleProcesar}
            disabled={isProcessDisabled}
            className={`px-6 py-2.5 font-bold text-sm tracking-wide transition-all inline-flex items-center justify-center ${
              isProcessDisabled
                ? 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed'
                : 'bg-[#1F3B63] hover:bg-[#162a47] text-white border-b-2 border-[#F2C230] cursor-pointer'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin text-[#F2C230]" />
                Procesando petición y fundamentando...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4 mr-2 text-[#F2C230]" />
                Procesar petición
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Message & Retry */}
      {errorMsg && (
        <div className="bg-red-50 border-2 border-red-500 p-4 text-red-900 flex items-start justify-between">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-700 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">Error al procesar la petición</p>
              <p className="text-xs mt-0.5 text-red-800">{errorMsg}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleProcesar}
            className="bg-red-700 text-white text-xs px-3 py-1.5 font-semibold hover:bg-red-800 transition-colors inline-flex items-center"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1" />
            Reintentar
          </button>
        </div>
      )}

      {/* Result Section: 3 Collapsible Blocks */}
      {resultado && (
        <div className="space-y-4 pt-2">
          {/* ETAPA 1: CLASIFICACIÓN */}
          <div className="bg-white border-2 border-[#1F3B63] overflow-hidden">
            <button
              type="button"
              onClick={() => setOpenStage1(!openStage1)}
              className="w-full bg-[#1F3B63] text-white p-3.5 flex items-center justify-between text-left font-bold tracking-tight text-sm hover:bg-[#162a47] transition-colors"
            >
              <div className="flex items-center space-x-2">
                <span className="bg-[#F2C230] text-[#1F3B63] px-2 py-0.5 text-xs font-black">
                  ETAPA 1
                </span>
                <span>Clasificación Jurídica y Procesal</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-300 font-normal">5 controles</span>
                {openStage1 ? <ChevronUp className="w-4 h-4 text-[#F2C230]" /> : <ChevronDown className="w-4 h-4 text-[#F2C230]" />}
              </div>
            </button>

            {openStage1 && (
              <div className="p-4 sm:p-5">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-slate-300">
                    <thead className="bg-slate-100 text-slate-800 border-b border-slate-300 uppercase tracking-wider font-bold">
                      <tr>
                        <th className="p-3 w-1/3 border-r border-slate-300">Criterio Institucional</th>
                        <th className="p-3">Calificación / Determinación</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 font-semibold text-slate-800 border-r border-slate-200 bg-slate-50/50">
                          1. Modalidad de la petición
                        </td>
                        <td className="p-3 font-medium text-slate-900">
                          {resultado.clasificacion.modalidad}
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 font-semibold text-slate-800 border-r border-slate-200 bg-slate-50/50">
                          2. Término legal aplicable
                        </td>
                        <td className="p-3 font-medium text-slate-900">
                          <span className="bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 font-bold">
                            {resultado.clasificacion.terminoLegal}
                          </span>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 font-semibold text-slate-800 border-r border-slate-200 bg-slate-50/50">
                          3. Dependencia competente
                        </td>
                        <td className="p-3 font-medium text-slate-900">
                          {resultado.clasificacion.dependenciaCompetente}
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 font-semibold text-slate-800 border-r border-slate-200 bg-slate-50/50">
                          4. Nivel de complejidad jurídica
                        </td>
                        <td className="p-3 font-medium text-slate-900">
                          <span
                            className={`px-2 py-0.5 font-bold text-[11px] border ${
                              resultado.clasificacion.nivelComplejidad === 'Baja'
                                ? 'bg-green-100 text-green-900 border-green-300'
                                : resultado.clasificacion.nivelComplejidad === 'Media'
                                ? 'bg-amber-100 text-amber-900 border-amber-300'
                                : 'bg-red-100 text-red-900 border-red-300'
                            }`}
                          >
                            Complejidad {resultado.clasificacion.nivelComplejidad}
                          </span>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 font-semibold text-slate-800 border-r border-slate-200 bg-slate-50/50">
                          5. Alerta de datos personales
                        </td>
                        <td className="p-3 font-medium text-slate-900">
                          <div className="flex items-center space-x-1.5 text-green-800 font-medium">
                            <CheckCircle2 className="w-4 h-4 text-green-700 flex-shrink-0" />
                            <span>{resultado.clasificacion.alertaDatosPersonales}</span>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* ETAPA 2: FUNDAMENTO NORMATIVO */}
          <div className="bg-white border-2 border-[#1F3B63] overflow-hidden">
            <button
              type="button"
              onClick={() => setOpenStage2(!openStage2)}
              className="w-full bg-[#1F3B63] text-white p-3.5 flex items-center justify-between text-left font-bold tracking-tight text-sm hover:bg-[#162a47] transition-colors"
            >
              <div className="flex items-center space-x-2">
                <span className="bg-[#F2C230] text-[#1F3B63] px-2 py-0.5 text-xs font-black">
                  ETAPA 2
                </span>
                <span>Fundamento Normativo y Criterio Jurisprudencial</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-300 font-normal">
                  {Array.isArray(resultado.fundamentoNormativo)
                    ? (resultado.fundamentoNormativo as any[]).length
                    : (resultado.fundamentoNormativo?.normas?.length || 0)}{' '}
                  normas verificadas
                </span>
                {openStage2 ? <ChevronUp className="w-4 h-4 text-[#F2C230]" /> : <ChevronDown className="w-4 h-4 text-[#F2C230]" />}
              </div>
            </button>

            {openStage2 && (
              <div className="p-4 sm:p-5 space-y-6">
                {/* Bloque A: Disposiciones Normativas (con transcripción literal entre comillas) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#1F3B63] flex items-center">
                      <Scale className="w-3.5 h-3.5 mr-1.5 text-[#1F3B63]" />
                      Disposiciones Normativas Aplicables (Texto legal verificado)
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      Transcripción literal entre comillas
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {((Array.isArray(resultado.fundamentoNormativo)
                      ? resultado.fundamentoNormativo
                      : resultado.fundamentoNormativo?.normas) || []).map((normaItem: any, idx: number) => (
                      <div
                        key={idx}
                        className="border border-slate-300 p-3.5 bg-slate-50/80 space-y-1.5"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-1.5">
                          <span className="font-bold text-xs text-[#1F3B63] tracking-tight">
                            {normaItem.norma}
                          </span>
                          <span className="bg-slate-200 text-slate-800 px-2 py-0.5 text-[11px] font-bold">
                            {normaItem.articulo}
                          </span>
                        </div>
                        <p className="text-xs text-slate-800 italic bg-white p-2.5 border-l-2 border-[#1F3B63] font-mono leading-relaxed">
                          "{normaItem.transcripcionLiteral || normaItem.transcripcion}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bloque B: Criterio Jurisprudencial (referencia, no transcripción literal, sin comillas) */}
                <div className="space-y-3 pt-2">
                  <div className="flex flex-wrap items-center justify-between border-b border-slate-200 pb-2 gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center">
                      <BookOpen className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
                      Criterio jurisprudencial (referencia, no transcripción literal)
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 border border-slate-300 font-semibold uppercase tracking-wide">
                      Criterio auxiliar (art. 230 C.P.)
                    </span>
                  </div>

                  {(!Array.isArray(resultado.fundamentoNormativo) &&
                  resultado.fundamentoNormativo?.criteriosJurisprudenciales &&
                  resultado.fundamentoNormativo.criteriosJurisprudenciales.length > 0) ? (
                    <div className="grid grid-cols-1 gap-3">
                      {resultado.fundamentoNormativo.criteriosJurisprudenciales.map((cj, idx) => (
                        <div
                          key={idx}
                          className="border border-slate-300 bg-white p-4 space-y-2.5 shadow-none"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
                            <div className="space-y-0.5">
                              <span className="font-bold text-xs text-[#1F3B63] block">
                                {cj.corporacion} — {cj.sala}
                              </span>
                              <div className="flex items-center space-x-2 text-[11px] text-slate-600">
                                <span>Radicación: <strong className="font-mono text-slate-800">{cj.radicacion}</strong></span>
                                <span>•</span>
                                <span>Fecha: {cj.fecha}</span>
                              </div>
                            </div>
                            <span className="text-[10px] bg-amber-50 text-amber-900 border border-amber-300 px-2 py-0.5 font-bold">
                              Sección Primera
                            </span>
                          </div>

                          <div className="bg-slate-50 p-3 border-l-4 border-amber-500">
                            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                              Regla sustantiva en redacción propia (sin comillas):
                            </span>
                            <p className="text-xs text-slate-800 leading-relaxed font-sans">
                              {cj.reglaParafraseada}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="border border-slate-300 bg-white p-4 space-y-2.5">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
                        <div className="space-y-0.5">
                          <span className="font-bold text-xs text-[#1F3B63] block">
                            Consejo de Estado — Sala de lo Contencioso Administrativo (Sección Primera)
                          </span>
                          <div className="flex items-center space-x-2 text-[11px] text-slate-600">
                            <span>Radicación: <strong className="font-mono text-slate-800">11001-03-15-000-2015-03248-00</strong></span>
                            <span>•</span>
                            <span>Fecha: 11 de febrero de 2016</span>
                          </div>
                        </div>
                        <span className="text-[10px] bg-amber-50 text-amber-900 border border-amber-300 px-2 py-0.5 font-bold">
                          Criterio Auxiliar
                        </span>
                      </div>

                      <div className="bg-slate-50 p-3 border-l-4 border-amber-500">
                        <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                          Regla sustantiva en redacción propia (sin comillas):
                        </span>
                        <p className="text-xs text-slate-800 leading-relaxed font-sans">
                          En materia sancionatoria contravencional de tránsito, rige con primacía la norma especial del artículo 159 de la Ley 769 de 2002 (modificado por el artículo 206 del Decreto Ley 019 de 2012) frente a las remisiones al Estatuto Tributario. Por consiguiente, una vez interrumpido el término de prescripción mediante la debida notificación del mandamiento de pago, el plazo que vuelve a computarse para la prescripción de la acción ejecutiva de cobro es de tres (3) años, descartando la aplicación del término quinquenal del régimen tributario general.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ETAPA 3: PROYECCIÓN DEL ACTO */}
          <div className="bg-white border-2 border-[#1F3B63] overflow-hidden">
            <button
              type="button"
              onClick={() => setOpenStage3(!openStage3)}
              className="w-full bg-[#1F3B63] text-white p-3.5 flex items-center justify-between text-left font-bold tracking-tight text-sm hover:bg-[#162a47] transition-colors"
            >
              <div className="flex items-center space-x-2">
                <span className="bg-[#F2C230] text-[#1F3B63] px-2 py-0.5 text-xs font-black">
                  ETAPA 3
                </span>
                <span>Proyección del Acto Administrativo (Estructura Completa)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-300 font-normal">6 bloques estructurados</span>
                {openStage3 ? <ChevronUp className="w-4 h-4 text-[#F2C230]" /> : <ChevronDown className="w-4 h-4 text-[#F2C230]" />}
              </div>
            </button>

            {openStage3 && (
              <div className="p-4 sm:p-5 space-y-5">
                {/* 1. Encabezado */}
                <div className="border border-slate-200 p-3.5 bg-slate-50">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    1. Encabezado con radicado y referencia
                  </span>
                  <pre className="text-xs font-mono text-slate-800 whitespace-pre-wrap leading-relaxed">
                    {resultado.proyeccion.encabezado}
                  </pre>
                </div>

                {/* 2. Antecedentes numerados */}
                <div className="border border-slate-200 p-3.5 bg-slate-50">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    2. Antecedentes Fácticos Numerados
                  </span>
                  <div className="space-y-1.5 text-xs text-slate-800">
                    {resultado.proyeccion.antecedentes.map((item, i) => (
                      <p key={i} className="pl-4 relative">
                        <span className="absolute left-0 font-bold text-slate-700">{i + 1}.</span>
                        {item}
                      </p>
                    ))}
                  </div>
                </div>

                {/* 3. Consideraciones jurídicas */}
                <div className="border border-slate-200 p-3.5 bg-slate-50">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    3. Consideraciones Jurídicas y Técnicas
                  </span>
                  <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">
                    {resultado.proyeccion.consideraciones}
                  </p>
                </div>

                {/* 4. Decisión por artículos */}
                <div className="border border-slate-200 p-3.5 bg-slate-50">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    4. Decisión Resolutiva por Artículos
                  </span>
                  <div className="space-y-2 text-xs font-mono text-slate-900">
                    <span className="font-bold text-[#1F3B63] block">RESUELVE:</span>
                    {resultado.proyeccion.decision.map((art, i) => (
                      <div key={i} className="p-2 bg-white border-l-2 border-[#1F3B63]">
                        {art}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5. Recursos procedentes */}
                <div className="border border-slate-200 p-3.5 bg-slate-50">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    5. Recursos Procedentes (Ley 1437 de 2011)
                  </span>
                  <p className="text-xs text-slate-800 leading-relaxed font-sans">
                    {resultado.proyeccion.recursos}
                  </p>
                </div>

                {/* 6. Fórmula de notificación */}
                <div className="border border-slate-200 p-3.5 bg-slate-50">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    6. Fórmula Legal de Notificación (Arts. 67-69 CPACA)
                  </span>
                  <p className="text-xs text-slate-800 leading-relaxed font-sans">
                    {resultado.proyeccion.notificacion}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons: Copiar y Descargar */}
          <div className="bg-slate-100 border border-slate-300 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleCopiarBorrador}
                className="bg-white hover:bg-slate-50 text-slate-900 font-bold text-xs px-4 py-2 border border-slate-400 transition-colors inline-flex items-center"
              >
                <Copy className="w-3.5 h-3.5 mr-1.5 text-[#1F3B63]" />
                {copiedBorrador ? '¡Borrador copiado al portapapeles!' : 'Copiar borrador'}
              </button>

              <button
                type="button"
                onClick={handleDescargarTxt}
                className="bg-[#1F3B63] hover:bg-[#162a47] text-white font-bold text-xs px-4 py-2 border border-[#1F3B63] transition-colors inline-flex items-center"
              >
                <Download className="w-3.5 h-3.5 mr-1.5 text-[#F2C230]" />
                Descargar en .txt
              </button>
            </div>

            <span className="text-[11px] text-slate-500">
              Formato de texto plano estándar (.txt) listo para expediente
            </span>
          </div>

          {/* Institutional footer note: ALWAYS VISIBLE */}
          <div className="bg-amber-50 border-2 border-[#F2C230] p-3 text-center">
            <p className="text-xs font-bold text-[#1F3B63] tracking-wide">
              Borrador asistido. Requiere revisión jurídica y firma del funcionario competente.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

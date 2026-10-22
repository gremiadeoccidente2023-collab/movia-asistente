import React, { useState } from 'react';
import {
  Megaphone,
  Copy,
  Check,
  Loader2,
  RefreshCw,
  AlertTriangle,
  Radio,
  Share2,
  Volume2,
  Users,
} from 'lucide-react';
import { CampanaResult, PublicoObjetivo } from '../types';

export const CampanasSection: React.FC = () => {
  const [tema, setTema] = useState<string>('Uso obligatorio de casco reglamentario certificado y abrochado');
  const [publicoObjetivo, setPublicoObjetivo] = useState<PublicoObjetivo>('motociclistas');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resultado, setResultado] = useState<CampanaResult | null>(null);

  // Individual copy feedback states
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const TEMAS_SUGERIDOS = [
    { tema: 'Uso obligatorio de casco reglamentario certificado y abrochado', publico: 'motociclistas' as PublicoObjetivo },
    { tema: 'Respeto a los pasos peatonales (cebra) y prelación del caminante', publico: 'peatones' as PublicoObjetivo },
    { tema: 'Límites de velocidad a 30 km/h en entornos escolares', publico: 'conductores de servicio público' as PublicoObjetivo },
    { tema: 'Uso de elementos reflectivos y distancia lateral de 1.5 metros', publico: 'ciclistas' as PublicoObjetivo },
    { tema: 'Cruce seguro y no uso de celular al cruzar calzadas viales', publico: 'estudiantes' as PublicoObjetivo },
  ];

  const handleGenerarCampana = async () => {
    if (!tema.trim() || !publicoObjetivo) return;
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/campana', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tema, publicoObjetivo }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || `Error en el servidor (${response.status})`);
      }

      const data: CampanaResult = await response.json();
      setResultado(data);
    } catch (err: any) {
      console.error('Error al generar campaña:', err);
      setErrorMsg(err.message || 'Ocurrió un error al generar la campaña con el modelo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyText = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2500);
    } catch (e) {
      console.error('Error al copiar:', e);
    }
  };

  const countWords = (text: string): number => {
    return text.trim() ? text.trim().split(/\s+/).length : 0;
  };

  return (
    <div className="space-y-6">
      {/* Title & Description */}
      <div className="bg-white border border-slate-200 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-[#1F3B63] tracking-tight font-sans">
              Campañas Institucionales de Seguridad Vial
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Generación de piezas pedagógicas oficiales: mensaje principal sintético, variantes para redes sociales y guion para perifoneo en vía pública.
            </p>
          </div>
          <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 font-semibold border border-slate-300 self-start sm:self-auto">
            Comunicación Vial
          </span>
        </div>

        {/* Sugerencias Rápidas */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-600">
            Temas frecuentes:
          </span>
          {TEMAS_SUGERIDOS.map((sug, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setTema(sug.tema);
                setPublicoObjetivo(sug.publico);
              }}
              className="text-xs bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-300 px-2.5 py-1 transition-colors"
            >
              {sug.publico.charAt(0).toUpperCase() + sug.publico.slice(1)}: {sug.tema.slice(0, 32)}...
            </button>
          ))}
        </div>
      </div>

      {/* Inputs Card */}
      <div className="bg-white border border-slate-200 p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Campo 1: Tema */}
          <div className="md:col-span-2">
            <label htmlFor="tema-input" className="block text-sm font-bold text-slate-900 mb-1">
              Tema de la campaña
            </label>
            <input
              id="tema-input"
              type="text"
              value={tema}
              onChange={(e) => setTema(e.target.value)}
              placeholder="Ej: Respeto a las señales de pare y pasos peatonales"
              className="w-full p-2.5 text-sm text-slate-900 border-2 border-slate-300 focus:border-[#1F3B63] focus:outline-none transition-colors rounded-none"
            />
            <p className="text-xs text-slate-500 mt-1">
              Especifique la conducta vial, factor de riesgo o norma a promover.
            </p>
          </div>

          {/* Campo 2: Público objetivo */}
          <div>
            <label htmlFor="publico-select" className="block text-sm font-bold text-slate-900 mb-1">
              Público objetivo
            </label>
            <div className="relative">
              <select
                id="publico-select"
                value={publicoObjetivo}
                onChange={(e) => setPublicoObjetivo(e.target.value as PublicoObjetivo)}
                className="w-full p-2.5 text-sm text-slate-900 border-2 border-slate-300 focus:border-[#1F3B63] focus:outline-none transition-colors rounded-none bg-white cursor-pointer"
              >
                <option value="motociclistas">Motociclistas</option>
                <option value="peatones">Peatones</option>
                <option value="conductores de servicio público">Conductores de servicio público</option>
                <option value="ciclistas">Ciclistas</option>
                <option value="estudiantes">Estudiantes</option>
              </select>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Segmento prioritario del Plan Local de Seguridad Vial.
            </p>
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={handleGenerarCampana}
            disabled={!tema.trim() || isLoading}
            className={`px-6 py-2.5 font-bold text-sm tracking-wide transition-all inline-flex items-center justify-center ${
              !tema.trim() || isLoading
                ? 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed'
                : 'bg-[#1F3B63] hover:bg-[#162a47] text-white border-b-2 border-[#F2C230] cursor-pointer'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin text-[#F2C230]" />
                Diseñando piezas institucionales...
              </>
            ) : (
              <>
                <Megaphone className="w-4 h-4 mr-2 text-[#F2C230]" />
                Generar campaña
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
              <p className="font-bold text-sm">Error al generar campaña</p>
              <p className="text-xs mt-0.5 text-red-800">{errorMsg}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleGenerarCampana}
            className="bg-red-700 text-white text-xs px-3 py-1.5 font-semibold hover:bg-red-800 transition-colors inline-flex items-center"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1" />
            Reintentar
          </button>
        </div>
      )}

      {/* Results */}
      {resultado && (
        <div className="space-y-6">
          {/* 1. Mensaje Principal */}
          <div className="bg-white border-2 border-[#1F3B63] overflow-hidden">
            <div className="bg-[#1F3B63] text-white p-3 flex items-center justify-between border-b-2 border-[#F2C230]">
              <div className="flex items-center space-x-2">
                <span className="bg-[#F2C230] text-[#1F3B63] px-2 py-0.5 text-xs font-black">
                  PIEZA 1
                </span>
                <h3 className="font-bold text-sm tracking-tight">
                  Mensaje Principal (Máximo 12 palabras)
                </h3>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs bg-[#162a47] text-slate-200 px-2 py-0.5 border border-slate-600">
                  {countWords(resultado.mensajePrincipal)} / 12 palabras
                </span>
              </div>
            </div>

            <div className="p-6 bg-slate-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-lg sm:text-xl font-black text-[#1F3B63] tracking-tight leading-snug font-sans">
                "{resultado.mensajePrincipal}"
              </p>

              <button
                type="button"
                onClick={() => handleCopyText(resultado.mensajePrincipal, 'principal')}
                className="bg-white hover:bg-slate-100 text-[#1F3B63] border border-slate-400 font-bold text-xs px-3.5 py-2 transition-colors flex-shrink-0 inline-flex items-center self-start sm:self-center"
              >
                {copiedKey === 'principal' ? (
                  <>
                    <Check className="w-3.5 h-3.5 mr-1.5 text-green-700" />
                    ¡Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 mr-1.5 text-[#1F3B63]" />
                    Copiar mensaje
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 2. Tres variantes para redes sociales */}
          <div className="bg-white border-2 border-[#1F3B63] overflow-hidden">
            <div className="bg-[#1F3B63] text-white p-3 flex items-center justify-between border-b-2 border-[#F2C230]">
              <div className="flex items-center space-x-2">
                <span className="bg-[#F2C230] text-[#1F3B63] px-2 py-0.5 text-xs font-black">
                  PIEZA 2
                </span>
                <h3 className="font-bold text-sm tracking-tight">
                  Tres Variantes para Redes Sociales (Máximo 30 palabras c/u)
                </h3>
              </div>
              <Share2 className="w-4 h-4 text-[#F2C230]" />
            </div>

            <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
              {resultado.variantesRedes.map((variante, idx) => {
                const words = countWords(variante);
                const key = `variante-${idx}`;
                return (
                  <div
                    key={idx}
                    className="border border-slate-300 bg-slate-50 p-4 flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-[#1F3B63] uppercase tracking-wider">
                          Variante {idx + 1}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 border ${
                            words <= 30
                              ? 'bg-green-100 text-green-900 border-green-300'
                              : 'bg-red-100 text-red-900 border-red-300'
                          }`}
                        >
                          {words} / 30 palabras
                        </span>
                      </div>
                      <p className="text-xs text-slate-800 leading-relaxed font-sans">
                        {variante}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-200 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleCopyText(variante, key)}
                        className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs px-2.5 py-1.5 transition-colors inline-flex items-center font-medium"
                      >
                        {copiedKey === key ? (
                          <>
                            <Check className="w-3.5 h-3.5 mr-1 text-green-700" />
                            Copiado
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 mr-1 text-[#1F3B63]" />
                            Copiar variante
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Versión para perifoneo */}
          <div className="bg-white border-2 border-[#1F3B63] overflow-hidden">
            <div className="bg-[#1F3B63] text-white p-3 flex items-center justify-between border-b-2 border-[#F2C230]">
              <div className="flex items-center space-x-2">
                <span className="bg-[#F2C230] text-[#1F3B63] px-2 py-0.5 text-xs font-black">
                  PIEZA 3
                </span>
                <h3 className="font-bold text-sm tracking-tight">
                  Versión para Perifoneo en Vía Pública (Máximo 25 segundos de lectura)
                </h3>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs bg-[#162a47] text-slate-200 px-2 py-0.5 border border-slate-600">
                  {resultado.duracionEstimada || '22 seg'} | {countWords(resultado.perifoneo)} palabras
                </span>
                <Volume2 className="w-4 h-4 text-[#F2C230]" />
              </div>
            </div>

            <div className="p-5 bg-slate-50 space-y-4">
              <div className="p-4 bg-white border-l-4 border-[#1F3B63] border-y border-r border-slate-300">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Guion sonoro institucional para agentes y patrullas de tránsito:
                </span>
                <p className="text-sm text-slate-900 leading-relaxed font-mono whitespace-pre-wrap">
                  {resultado.perifoneo}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
                <div className="flex items-center space-x-1.5">
                  <Radio className="w-4 h-4 text-[#1F3B63]" />
                  <span>
                    Ritmo pausado con entonación clara y pausas respiratorias cada 5 a 7 palabras.
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopyText(resultado.perifoneo, 'perifoneo')}
                  className="bg-[#1F3B63] hover:bg-[#162a47] text-white border border-[#1F3B63] font-bold text-xs px-4 py-2 transition-colors inline-flex items-center"
                >
                  {copiedKey === 'perifoneo' ? (
                    <>
                      <Check className="w-3.5 h-3.5 mr-1.5 text-[#F2C230]" />
                      ¡Guion copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 mr-1.5 text-[#F2C230]" />
                      Copiar guion de perifoneo
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { X, BookOpen, Scale, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface NormativaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NormativaModal: React.FC<NormativaModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-none flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl border-2 border-[#1F3B63] shadow-none overflow-hidden my-6">
        {/* Header */}
        <div className="bg-[#1F3B63] text-white px-5 py-3.5 flex items-center justify-between border-b-2 border-[#F2C230]">
          <div className="flex items-center space-x-2.5">
            <BookOpen className="w-5 h-5 text-[#F2C230]" />
            <h2 className="font-bold text-base tracking-tight font-sans">
              Compendio Normativo — Secretaría de Movilidad
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 hover:bg-[#162a47] transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-5 text-sm text-slate-700">
          <div className="p-3 bg-amber-50 border-l-4 border-[#F2C230] text-xs text-amber-950 font-medium">
            Regla de verificación obligatoria para funcionarios: Antes de citar el artículo 159 de la Ley 769 de 2002, verificar siempre que se aplica el texto modificado por el Decreto Ley 019 de 2012 (artículo 206).
          </div>

          {/* Law 1 */}
          <div className="border border-slate-200 p-4 bg-slate-50">
            <div className="flex items-center space-x-2 mb-2">
              <Scale className="w-4 h-4 text-[#1F3B63]" />
              <h3 className="font-bold text-[#1F3B63]">
                1. Decreto Ley 019 de 2012 (Art. 206) / Ley 769 de 2002 (Art. 159)
              </h3>
            </div>
            <p className="text-xs text-slate-800 leading-relaxed font-mono bg-white p-2.5 border border-slate-200">
              "Las sanciones impuestas por infracciones a las normas de tránsito prescribirán en tres (3) años contados a partir de la ocurrencia del hecho; la prescripción deberá ser declarada de oficio y se interrumpirá con la notificación del mandamiento de pago. La autoridad de tránsito no podrá iniciar el cobro coactivo de sanciones respecto de las cuales se encuentren configurados los supuestos necesarios para declarar su prescripción."
            </p>
            <p className="text-[11px] text-slate-600 mt-2">
              <span className="font-semibold text-slate-800">Criterio aplicativo:</span> El término trienal opera desde el momento de la comisión de la infracción. La sola expedición del mandamiento de pago no interrumpe el plazo si no ha sido debidamente notificado al contraventor conforme al CPACA.
            </p>
            <div className="mt-3 p-3 bg-amber-50 border-l-4 border-amber-600 text-[11px] text-slate-800 space-y-1">
              <span className="font-bold text-[#1F3B63] block uppercase tracking-wide">
                Criterio jurisprudencial auxiliar (referencia, no transcripción literal):
              </span>
              <p className="text-slate-600 font-medium">
                Consejo de Estado, Sala de lo Contencioso Administrativo, Sección Primera. Sentencia de Tutela Rad. 11001-03-15-000-2015-03248-00 del 11 de febrero de 2016 (C.P. Guillermo Vargas Ayala). Constituye criterio auxiliar (art. 230 C.P.), no sentencia de unificación ni precedente vinculante.
              </p>
              <p className="pt-1 text-slate-800 leading-relaxed font-sans">
                Regla parafraseada: En los procesos contravencionales de tránsito prevalece el carácter de norma especial del artículo 159 de la Ley 769 de 2002 sobre las disposiciones generales del Estatuto Tributario. En consecuencia, si la prescripción se interrumpe válidamente mediante la notificación del mandamiento de pago, el plazo que vuelve a contabilizarse para la prescripción del cobro coactivo es de tres (3) años, y de ninguna manera el término quinquenal de cinco (5) años del régimen tributario.
              </p>
            </div>
          </div>

          {/* Law 2 */}
          <div className="border border-slate-200 p-4 bg-slate-50">
            <div className="flex items-center space-x-2 mb-2">
              <Scale className="w-4 h-4 text-[#1F3B63]" />
              <h3 className="font-bold text-[#1F3B63]">
                2. Ley 1755 de 2015 — Términos del Derecho Fundamental de Petición
              </h3>
            </div>
            <ul className="text-xs space-y-1.5 text-slate-700 list-disc list-inside">
              <li>
                <span className="font-semibold text-slate-900">15 días hábiles:</span> Término general para resolver peticiones de interés particular o general (Art. 14, inciso 1).
              </li>
              <li>
                <span className="font-semibold text-slate-900">10 días hábiles:</span> Peticiones de documentos y de información técnica o copias (Art. 14, parágrafo / num. 1).
              </li>
              <li>
                <span className="font-semibold text-slate-900">30 días hábiles:</span> Peticiones mediante las cuales se eleva una consulta a las autoridades en relación con las materias a su cargo (Art. 14, num. 2).
              </li>
            </ul>
          </div>

          {/* Law 3 */}
          <div className="border border-slate-200 p-4 bg-slate-50">
            <div className="flex items-center space-x-2 mb-2">
              <Scale className="w-4 h-4 text-[#1F3B63]" />
              <h3 className="font-bold text-[#1F3B63]">
                3. Ley 1437 de 2011 (CPACA) — Estructura y Notificación
              </h3>
            </div>
            <ul className="text-xs space-y-1.5 text-slate-700 list-disc list-inside">
              <li>
                <span className="font-semibold text-slate-900">Estructura del Acto:</span> Encabezado, antecedentes fácticos, motivación técnico-jurídica, parte resolutiva, indicación de recursos y régimen de notificación.
              </li>
              <li>
                <span className="font-semibold text-slate-900">Recursos (Art. 74 - 76):</span> Recurso de Reposición ante el mismo funcionario y en subsidio Apelación ante el superior jerárquico dentro de los diez (10) días siguientes a la notificación.
              </li>
              <li>
                <span className="font-semibold text-slate-900">Notificaciones (Arts. 67 a 69):</span> Personal, electrónica previa autorización, o por aviso con copia íntegra del acto.
              </li>
            </ul>
          </div>

          {/* Law 4 */}
          <div className="border border-slate-200 p-4 bg-slate-50">
            <div className="flex items-center space-x-2 mb-2">
              <Scale className="w-4 h-4 text-[#1F3B63]" />
              <h3 className="font-bold text-[#1F3B63]">
                4. Ley 1581 de 2012 — Protección de Datos Personales
              </h3>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              En la gestión documental automatizada y asistida por IA está prohibido incorporar o almacenar nombres completos, números de cédula, placas o direcciones residenciales. El software exige el empleo de marcadores institucionales estandarizados: <code className="bg-slate-200 px-1 py-0.5 text-slate-800 font-mono">[NOMBRE]</code>, <code className="bg-slate-200 px-1 py-0.5 text-slate-800 font-mono">[DOCUMENTO]</code>, <code className="bg-slate-200 px-1 py-0.5 text-slate-800 font-mono">[DIRECCIÓN]</code>, <code className="bg-slate-200 px-1 py-0.5 text-slate-800 font-mono">[PLACA]</code>.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-5 py-3 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="bg-[#1F3B63] hover:bg-[#162a47] text-white px-4 py-1.5 text-xs font-semibold tracking-wide transition-colors"
          >
            Entendido / Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

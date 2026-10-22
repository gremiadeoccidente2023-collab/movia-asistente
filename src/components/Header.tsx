import React from 'react';
import { ShieldCheck, BookOpen, Clock, Building2 } from 'lucide-react';

interface HeaderProps {
  onOpenNormativa: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNormativa }) => {
  return (
    <header className="bg-[#1F3B63] text-white border-b-4 border-[#F2C230] select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand / Logo Area */}
        <div className="flex items-center space-x-3.5">
          {/* Institutional Emblem / Badge */}
          <div className="w-11 h-11 bg-white rounded-none flex items-center justify-center border-2 border-[#F2C230] shadow-none flex-shrink-0">
            <Building2 className="w-6 h-6 text-[#1F3B63]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold tracking-tight text-white leading-none font-sans">
                MOVÍA
              </h1>
              <span className="text-[11px] font-semibold bg-[#F2C230] text-[#1F3B63] px-2 py-0.5 tracking-wide uppercase">
                v2.6 Jurídico
              </span>
            </div>
            <p className="text-xs text-slate-200 font-normal tracking-normal mt-0.5">
              Asistente de Gestión Documental y Comunicación Vial
            </p>
          </div>
        </div>

        {/* Right Area: Institutional Tag & Legal Reference Button */}
        <div className="flex items-center flex-wrap gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={onOpenNormativa}
            className="inline-flex items-center text-xs font-medium text-slate-200 hover:text-white bg-[#162a47] hover:bg-[#12223a] border border-slate-500/50 px-2.5 py-1.5 transition-colors"
            title="Consultar marco normativo aplicable (Ley 1755, Ley 769 art. 159, DL 019/2012, Ley 1437, Ley 1581)"
          >
            <BookOpen className="w-3.5 h-3.5 mr-1.5 text-[#F2C230]" />
            Marco Normativo
          </button>

          <div className="inline-flex items-center space-x-1.5 text-xs text-slate-300 bg-[#162a47] border border-slate-600/60 px-2.5 py-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[11px]">Términos: Ley 1755 / 2015</span>
          </div>

          <div className="inline-flex items-center space-x-1.5 bg-[#F2C230] text-[#1F3B63] px-3 py-1.5 font-bold text-xs tracking-wide uppercase border border-amber-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Secretaría de Movilidad — Uso interno</span>
          </div>
        </div>
      </div>
    </header>
  );
};

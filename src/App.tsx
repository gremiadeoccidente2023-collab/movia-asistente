import React, { useState } from 'react';
import { SectionTab } from './types';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ProyeccionSection } from './components/ProyeccionSection';
import { AuditoriaSection } from './components/AuditoriaSection';
import { CampanasSection } from './components/CampanasSection';
import { TableroSection } from './components/TableroSection';
import { NormativaModal } from './components/NormativaModal';
import { CASOS_PROXIMOS_VENCER, METRICAS_CARTERA } from './data/mockCartera';
import { Scale, ShieldCheck, Landmark } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<SectionTab>('proyeccion');
  const [isNormativaOpen, setIsNormativaOpen] = useState<boolean>(false);

  const urgentCount = METRICAS_CARTERA.casosEnRiesgo;

  const handleSelectCaseToProject = (radicado: string, modalidad: string) => {
    setActiveTab('proyeccion');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800 antialiased selection:bg-[#F2C230] selection:text-[#1F3B63]">
      {/* Institutional Top Header */}
      <Header onOpenNormativa={() => setIsNormativaOpen(true)} />

      {/* Main Layout Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col lg:flex-row shadow-none border-x border-slate-200 bg-white">
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          urgentCasesCount={urgentCount}
        />

        {/* Dynamic Content Pane */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-slate-50 min-w-0">
          {activeTab === 'proyeccion' && <ProyeccionSection />}
          {activeTab === 'auditoria' && <AuditoriaSection />}
          {activeTab === 'campanas' && <CampanasSection />}
          {activeTab === 'tablero' && (
            <TableroSection onSelectCaseToProject={handleSelectCaseToProject} />
          )}
        </main>
      </div>

      {/* Institutional Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs py-4 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center space-x-2">
            <Landmark className="w-4 h-4 text-[#F2C230]" />
            <span className="font-semibold text-slate-300">
              Secretaría de Movilidad — Entidad Territorial Municipal [MUNICIPIO]
            </span>
          </div>
          <div className="flex items-center space-x-3 text-[11px] text-slate-400">
            <span>Ley 1755 de 2015</span>
            <span>•</span>
            <span>Ley 769 / 2002 (mod. DL 019/2012)</span>
            <span>•</span>
            <span>Ley 1437 / 2011</span>
            <span>•</span>
            <span>Ley 1581 / 2012</span>
          </div>
        </div>
      </footer>

      {/* Normativa Reference Modal */}
      <NormativaModal
        isOpen={isNormativaOpen}
        onClose={() => setIsNormativaOpen(false)}
      />
    </div>
  );
}

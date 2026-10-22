import React from 'react';
import { SectionTab } from '../types';
import {
  FileText,
  ShieldAlert,
  Megaphone,
  BarChart3,
  AlertCircle,
  FileCheck2,
} from 'lucide-react';

interface SidebarProps {
  activeTab: SectionTab;
  onSelectTab: (tab: SectionTab) => void;
  urgentCasesCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  urgentCasesCount,
}) => {
  const navItems = [
    {
      id: 'proyeccion' as SectionTab,
      label: '1. Proyección de respuestas',
      icon: FileText,
      description: 'Clasificación, fundamento y borrador de acto',
    },
    {
      id: 'auditoria' as SectionTab,
      label: '2. Auditoría de borradores',
      icon: FileCheck2,
      description: 'Control de 7 puntos y matriz de riesgo',
    },
    {
      id: 'campanas' as SectionTab,
      label: '3. Campañas de seguridad vial',
      icon: Megaphone,
      description: 'Mensajes clave, redes y perifoneo',
    },
    {
      id: 'tablero' as SectionTab,
      label: '4. Tablero de cartera',
      icon: BarChart3,
      description: 'Indicadores de término y vencimientos',
      badge: urgentCasesCount > 0 ? `${urgentCasesCount} en riesgo` : undefined,
    },
  ];

  return (
    <aside className="w-full lg:w-72 bg-white border-r border-slate-200 flex flex-col justify-between flex-shrink-0">
      <div className="p-4 sm:p-5">
        <div className="mb-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Módulos del Sistema
          </span>
          <div className="h-0.5 w-10 bg-[#1F3B63] mt-1" />
        </div>

        <nav className="space-y-1.5" aria-label="Navegación principal">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`w-full text-left px-3.5 py-3 transition-all border flex items-start space-x-3 ${
                  isActive
                    ? 'bg-[#1F3B63] text-white border-[#1F3B63]'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <Icon
                  className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                    isActive ? 'text-[#F2C230]' : 'text-slate-500'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-sm font-semibold tracking-tight ${
                        isActive ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {item.label}
                    </span>
                    {item.badge && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 ml-2 ${
                          isActive
                            ? 'bg-[#F2C230] text-[#1F3B63]'
                            : 'bg-red-100 text-red-800 border border-red-200'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-xs mt-0.5 truncate ${
                      isActive ? 'text-slate-200' : 'text-slate-500'
                    }`}
                  >
                    {item.description}
                  </p>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Institutional Legal Disclaimer in Sidebar */}
      <div className="p-4 border-t border-slate-200 bg-slate-50 m-4 text-xs text-slate-600">
        <div className="flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 text-[#1F3B63] flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-slate-800 text-[11px] uppercase tracking-wide">
              Regla de Custodia y Rol
            </p>
            <p className="text-[11px] leading-relaxed text-slate-600">
              MOVÍA proyecta y asiste técnicamente. No sustituye la voluntad administrativa ni la firma del funcionario competente.
            </p>
            <p className="text-[10px] text-slate-500 font-medium pt-1">
              Municipio: <span className="text-slate-700">[MUNICIPIO]</span>
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

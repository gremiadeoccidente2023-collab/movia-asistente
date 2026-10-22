import { CasoCartera } from '../types';

export const METRICAS_CARTERA = {
  totalPeriodo: 60,
  porcentajeATiempo: 98.3,
  tiempoPromedioDias: 5.7,
  casosEnRiesgo: 7,
};

export const DISTRIBUCION_MODALIDAD = [
  { modalidad: 'Solicitud de prescripción de comparendo', cantidad: 17, porcentaje: 28.3 },
  { modalidad: 'Solicitud de información o documentos', cantidad: 13, porcentaje: 21.7 },
  { modalidad: 'Solicitud de certificación', cantidad: 7, porcentaje: 11.7 },
  { modalidad: 'Recurso de reposición contra comparendo', cantidad: 7, porcentaje: 11.7 },
  { modalidad: 'Consulta sobre materias a cargo', cantidad: 7, porcentaje: 11.7 },
  { modalidad: 'Queja por prestación del servicio', cantidad: 6, porcentaje: 10.0 },
  { modalidad: 'Requerimiento de organismo de control', cantidad: 3, porcentaje: 5.0 },
];

export const DISTRIBUCION_COMPLEJIDAD = [
  { nivel: 'Baja', cantidad: 32, porcentaje: 53.3, color: '#16A34A' },
  { nivel: 'Media', cantidad: 17, porcentaje: 28.3, color: '#D97706' },
  { nivel: 'Alta', cantidad: 11, porcentaje: 18.3, color: '#DC2626' },
];

export const CASOS_PROXIMOS_VENCER: CasoCartera[] = [
  {
    radicado: '2026-008',
    modalidad: 'Solicitud de prescripción de comparendo',
    fechaRadicacion: '2026-10-02',
    terminoDias: 15,
    diasHabilesRestantes: 1,
    nivelRiesgo: 'critico',
    complejidad: 'Media',
    solicitanteAnon: '[CIUDADANO-014]',
    estado: 'En proyección',
  },
  {
    radicado: '2026-015',
    modalidad: 'Solicitud de información o documentos',
    fechaRadicacion: '2026-10-08',
    terminoDias: 10,
    diasHabilesRestantes: 1,
    nivelRiesgo: 'critico',
    complejidad: 'Baja',
    solicitanteAnon: '[APODERADO-003]',
    estado: 'Pendiente firma',
  },
  {
    radicado: '2026-023',
    modalidad: 'Recurso de reposición contra comparendo',
    fechaRadicacion: '2026-10-03',
    terminoDias: 15,
    diasHabilesRestantes: 2,
    nivelRiesgo: 'critico',
    complejidad: 'Alta',
    solicitanteAnon: '[CIUDADANO-027]',
    estado: 'Revisión jurídica',
  },
  {
    radicado: '2026-031',
    modalidad: 'Requerimiento de organismo de control',
    fechaRadicacion: '2026-10-09',
    terminoDias: 10,
    diasHabilesRestantes: 2,
    nivelRiesgo: 'alto',
    complejidad: 'Alta',
    solicitanteAnon: '[ORGANISMO_CONTROL]',
    estado: 'En proyección',
  },
  {
    radicado: '2026-042',
    modalidad: 'Solicitud de prescripción de comparendo',
    fechaRadicacion: '2026-10-06',
    terminoDias: 15,
    diasHabilesRestantes: 3,
    nivelRiesgo: 'alto',
    complejidad: 'Media',
    solicitanteAnon: '[CIUDADANO-045]',
    estado: 'En proyección',
  },
  {
    radicado: '2026-049',
    modalidad: 'Consulta sobre materias a cargo',
    fechaRadicacion: '2026-09-22',
    terminoDias: 30,
    diasHabilesRestantes: 4,
    nivelRiesgo: 'moderado',
    complejidad: 'Media',
    solicitanteAnon: '[EMPRESA_TRANSPORTE]',
    estado: 'En proyección',
  },
  {
    radicado: '2026-057',
    modalidad: 'Solicitud de certificación',
    fechaRadicacion: '2026-10-08',
    terminoDias: 15,
    diasHabilesRestantes: 4,
    nivelRiesgo: 'moderado',
    complejidad: 'Baja',
    solicitanteAnon: '[CIUDADANO-058]',
    estado: 'Pendiente firma',
  },
];

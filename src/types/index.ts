export type SectionTab = 'proyeccion' | 'auditoria' | 'campanas' | 'tablero';

export interface ClasificacionPeticion {
  modalidad: string;
  terminoLegal: string;
  dependenciaCompetente: string;
  nivelComplejidad: 'Baja' | 'Media' | 'Alta' | string;
  alertaDatosPersonales: string;
}

export interface DisposicionNormativa {
  norma: string;
  articulo: string;
  transcripcionLiteral: string;
}

export interface CriterioJurisprudencial {
  corporacion: string;
  sala: string;
  fecha: string;
  radicacion: string;
  reglaParafraseada: string;
}

export interface Etapa2Fundamento {
  normas: DisposicionNormativa[];
  criteriosJurisprudenciales: CriterioJurisprudencial[];
}

export interface ProyeccionActo {
  encabezado: string;
  antecedentes: string[];
  consideraciones: string;
  decision: string[];
  recursos: string;
  notificacion: string;
  borradorCompleto: string;
}

export interface ProyeccionResult {
  clasificacion: ClasificacionPeticion;
  fundamentoNormativo: Etapa2Fundamento;
  proyeccion: ProyeccionActo;
}

export type EstadoAuditoria = 'cumple' | 'cumple_parcialmente' | 'no_cumple';

export interface PuntoControl {
  punto: string;
  estado: EstadoAuditoria;
  observacion: string;
}

export interface AuditoriaResult {
  puntosControl: PuntoControl[];
  hallazgosMayorRiesgo: string[];
}

export type PublicoObjetivo =
  | 'motociclistas'
  | 'peatones'
  | 'conductores de servicio público'
  | 'ciclistas'
  | 'estudiantes';

export interface CampanaResult {
  mensajePrincipal: string;
  variantesRedes: string[];
  perifoneo: string;
  duracionEstimada: string;
}

export type NivelRiesgo = 'critico' | 'alto' | 'moderado' | 'normal';

export interface CasoCartera {
  radicado: string;
  modalidad: string;
  fechaRadicacion: string;
  terminoDias: number;
  diasHabilesRestantes: number;
  nivelRiesgo: NivelRiesgo;
  complejidad: 'Baja' | 'Media' | 'Alta';
  solicitanteAnon: string;
  estado: 'En proyección' | 'Pendiente firma' | 'Revisión jurídica';
}

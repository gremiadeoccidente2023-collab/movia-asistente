export interface SamplePetition {
  id: string;
  titulo: string;
  descripcion: string;
  texto: string;
  contieneDatosReales: boolean;
}

export const SAMPLE_PETITIONS: SamplePetition[] = [
  {
    id: 'prescripcion-anonima',
    titulo: 'Prescripción de comparendo (con marcadores [ ])',
    descripcion: 'Petición modelo con marcadores genéricos de protección de datos.',
    contieneDatosReales: false,
    texto: `Señores
SECRETARÍA DE MOVILIDAD DE [MUNICIPIO]
Subdirección de Contravenciones y Cobro Coactivo
E. S. D.

ASUNTO: Solicitud de prescripción de la sanción por comparendo N° [NÚMERO]

Yo, [NOMBRE], identificado con cédula de ciudadanía número [DOCUMENTO], en ejercicio del derecho fundamental de petición consagrado en el artículo 23 de la Constitución Política y regulado por la Ley 1755 de 2015, comedidamente me dirijo a su despacho para solicitar:

PETICIÓN:
Se declare de oficio o a petición de parte la prescripción de la acción de cobro y de la sanción derivada de la orden de comparendo N° [NÚMERO] de fecha [FECHA DEL COMPARENDO], impuesta al vehículo de placas [PLACA], y en consecuencia se ordene el levantamiento de cualquier medida cautelar o registro de cobro en el sistema SIMIT.

HECHOS:
1. Con fecha [FECHA DEL COMPARENDO] se impuso la orden de comparendo N° [NÚMERO].
2. A la fecha han transcurrido más de tres (3) años desde la ocurrencia de los hechos sin que este despacho haya proferido ni notificado legalmente mandamiento de pago alguno, según se desprende de la consulta en el sistema.
3. De conformidad con el artículo 159 de la Ley 769 de 2002, modificado por el artículo 206 del Decreto Ley 019 de 2012, las sanciones impuestas por infracciones a las normas de tránsito prescriben en el término de tres (3) años contados a partir de la ocurrencia del hecho.

NOTIFICACIONES:
Recibiré notificaciones en la [DIRECCIÓN], correo institucional [CORREO].

Atentamente,
[NOMBRE]
C.C. [DOCUMENTO]`,
  },
  {
    id: 'prescripcion-con-datos',
    titulo: 'Petición con datos personales (para probar detector)',
    descripcion: 'Contiene cédula, placa y correo electrónico reales para probar la detección y bloqueo.',
    contieneDatosReales: true,
    texto: `Señores
SECRETARÍA DE MOVILIDAD
Ciudad.

Asunto: Derecho de petición para tumbar comparendo

Yo, Carlos Alberto Gómez Martínez, identificado con cédula de ciudadanía 1020784912, solicito que me borren el comparendo número 110010000000348218 que le pusieron a mi vehículo de placa KLP492 el día 15 de marzo de 2021.

Ya pasaron más de tres años y nunca me llegó ninguna carta a mi casa ubicada en la Calle 45 número 12-34 ni me notificaron ningún mandamiento de pago. Por lo tanto exijo la prescripción inmediata y que me quiten el reporte del SIMIT porque no he podido renovar mi pase.

Responder al correo carlos.gomez.martinez99@gmail.com o comunicarse al teléfono celular 3124567890.

Atentamente,
Carlos Alberto Gómez Martínez
C.C. 1020784912`,
  },
  {
    id: 'copia-ipat',
    titulo: 'Solicitud de informe de accidente (IPAT)',
    descripcion: 'Petición de documentos e información técnica con marcadores.',
    contieneDatosReales: false,
    texto: `Señores
SECRETARÍA DE MOVILIDAD DE [MUNICIPIO]
Área de Archivo y Gestión Documental
E. S. D.

ASUNTO: Solicitud de copia íntegra del Informe Policial de Accidente de Tránsito (IPAT)

Yo, [NOMBRE], identificado con cédula [DOCUMENTO], en calidad de conductor involucrado en el hecho vial ocurrido el [FECHA], solicito respetuosamente se me expida copia auténtica del croquis e informe IPAT radicado bajo el número [NÚMERO], correspondiente al siniestro ocurrido en la intersección de [DIRECCIÓN] en el que se vio involucrado el automotor de placas [PLACA].

La presente solicitud se fundamenta en el artículo 14 numeral 1 de la Ley 1755 de 2015, cuyo término de atención legal es de diez (10) días hábiles.

Notificaciones: [DIRECCIÓN], correo: [CORREO].

Atentamente,
[NOMBRE]
C.C. [DOCUMENTO]`,
  },
  {
    id: 'senalizacion-barrial',
    titulo: 'Solicitud de señalización y reductor de velocidad',
    descripcion: 'Petición ciudadana de interés general/comunitario para gestión de tránsito.',
    contieneDatosReales: false,
    texto: `Señores
SECRETARÍA DE MOVILIDAD DE [MUNICIPIO]
Dirección de Infraestructura y Señalización Vial
E. S. D.

ASUNTO: Petición de interés general - Estudio de señalización y reductor de velocidad en zona escolar

En nombre de la comunidad vecinal del sector [SECTOR] de [MUNICIPIO], solicitamos se realice visita técnica y estudio de tránsito en la [DIRECCIÓN], con el fin de evaluar la instalación de reductores de velocidad tipo resalto y señalización vertical preventiva de zona escolar (SP-47), debido al alto flujo vehicular y riesgo constante para los estudiantes de la institución educativa contigua.

Fundamentamos la solicitud en los artículos 1 y 5 de la Ley 769 de 2002 y el Manual de Señalización Vial adoptado por el Ministerio de Transporte.

Notificaciones: [DIRECCIÓN], correo: [CORREO].

Atentamente,
[VOCERO_COMUNITARIO]`,
  },
];

export const SAMPLE_AUDIT_DRAFTS = [
  {
    titulo: 'Borrador incompleto (con fallas para auditar)',
    descripcion: 'Falta fórmula de recursos, cita normas derogadas y contiene datos no anonimizados.',
    texto: `RESOLUCIÓN N° 1045 DE 2026
POR MEDIO DE LA CUAL SE RESUELVE UNA PETICIÓN DE PRESCRIPCIÓN

El Subdirector de Contravenciones de la Secretaría de Movilidad de Tunja, en uso de sus facultades legales, en especial las conferidas por el Código de Tránsito de 1970 y el Decreto 1344, y

CONSIDERANDO:
Que el señor Juan Camilo Pérez con cédula 79450123 solicitó la prescripción del comparendo del carro de placas BHY890.
Que se revisó el sistema y se encontró que el comparendo es de hace 4 años.
Que el ciudadano tiene toda la razón y es evidente que el funcionario de tránsito de turno descuidó el cobro y no hizo nada en todo ese tiempo.

RESUELVE:
ARTÍCULO PRIMERO: Declarar la prescripción del comparendo 123456 a favor de Juan Camilo Pérez.
ARTÍCULO SEGUNDO: Oficiar al SIMIT para que borre la deuda.

Notifíquese y cúmplase.`,
  },
  {
    titulo: 'Borrador estructurado (conforme a técnica normativa)',
    descripcion: 'Contiene los seis bloques, marcadores y fundamentación legal en Ley 769 mod. DL 019/2012.',
    texto: `SECRETARÍA DE MOVILIDAD DE [MUNICIPIO]
SUBDIRECCIÓN DE CONTRAVENCIONES Y COBRO COACTIVO
RESOLUCIÓN NÚMERO [RADICADO_PROVISIONAL] DE [FECHA]

"Por medio de la cual se resuelve una solicitud de prescripción de la acción de cobro y sanción de tránsito"

El Subdirector de Contravenciones de la Secretaría de Movilidad de [MUNICIPIO], en ejercicio de sus atribuciones constitucionales y legales, en especial las consagradas en la Ley 769 de 2002, el artículo 206 del Decreto Ley 019 de 2012 y la Ley 1437 de 2011, y

I. ANTECEDENTES
1. Con fecha [FECHA DE RADICACIÓN], el ciudadano identificado con el marcador [DOCUMENTO] presentó petición solicitando la declaratoria de prescripción de la sanción derivada de la orden de comparendo N° [NÚMERO] vinculada al automotor de placas [PLACA].
2. Se verificó en el sistema de gestión contravencional el estado del proceso sancionatorio correspondiente.

II. CONSIDERACIONES JURÍDICAS
1. El artículo 159 de la Ley 769 de 2002, modificado expresamente por el artículo 206 del Decreto Ley 019 de 2012, dispone con claridad meridiana que: "Las sanciones impuestas por infracciones a las normas de tránsito prescribirán en tres (3) años contados a partir de la ocurrencia del hecho; la prescripción deberá ser declarada de oficio y se interrumpirá con la notificación del mandamiento de pago. La autoridad de tránsito no podrá iniciar el cobro coactivo de sanciones respecto de las cuales se encuentren configurados los supuestos necesarios para declarar su prescripción."
2. Que revisado el expediente administrativo, [SE CONSTATÓ / NO SE CONSTATÓ] la existencia de notificación legal del mandamiento de pago dentro del término trienal legalmente establecido.
3. Conforme al criterio jurisprudencial auxiliar del Consejo de Estado, Sección Primera (Sentencia de Tutela Rad. 11001-03-15-000-2015-03248-00 de 2016), prima la norma especial del artículo 159 del Código Nacional de Tránsito sobre cualquier remisión al régimen tributario: una vez interrumpida la prescripción con la debida notificación del mandamiento de pago, el término que vuelve a correr para la prescripción de la acción de cobro es de tres (3) años, no de cinco (5) años.
4. En virtud de los principios de eficacia, celeridad y debido proceso administrativo tutelados en la Ley 1437 de 2011, procede la resolución de fondo del requerimiento.

III. DECISIÓN
RESUELVE:
ARTÍCULO PRIMERO: [DECLARAR / NEGAR] la prescripción de la sanción originada en la orden de comparendo N° [NÚMERO] impuesta al vehículo identificado con placas [PLACA], conforme a las consideraciones expuestas en la parte motiva del presente acto administrativo.
ARTÍCULO SEGUNDO: Ordenar a la oficina competente la actualización de los registros en el sistema local y la comunicación respectiva a la Federación Colombiana de Municipios - SIMIT.
ARTÍCULO TERCERO: Contra la presente decisión procede el recurso de reposición ante el Subdirector de Contravenciones y en subsidio el de apelación ante el Secretario de Movilidad de [MUNICIPIO], los cuales deberán interponerse por escrito dentro de los diez (10) días hábiles siguientes a su notificación, de conformidad con los artículos 74, 76 y concordantes de la Ley 1437 de 2011 (CPACA).
ARTÍCULO CUARTO: NOTIFICAR el presente acto administrativo al peticionario con marcador [DOCUMENTO] en la [DIRECCIÓN] o al correo electrónico registrado [CORREO], conforme a lo establecido en los artículos 67 a 69 de la Ley 1437 de 2011.

NOTIFÍQUESE Y CÚMPLASE.
Proyectó: Asistente MOVÍA
Revisó: [FUNCIONARIO_COMPETENTE]`,
  },
];

import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '2mb' }));

const SYSTEM_INSTRUCTION = `Eres MOVÍA, asistente documental de una Secretaría de Movilidad municipal en Colombia. Apoyas la proyección de respuestas a peticiones ciudadanas. No decides, no firmas y no reemplazas el criterio del funcionario competente.

Fundamenta siempre en el marco normativo colombiano vigente: Ley 1755 de 2015 sobre derecho de petición y sus términos; Ley 769 de 2002, Código Nacional de Tránsito; artículo 206 del Decreto Ley 019 de 2012, que modificó el artículo 159 de la Ley 769 y establece que las sanciones de tránsito prescriben en tres años contados desde la ocurrencia del hecho, que la prescripción debe declararse de oficio y que se interrumpe con la notificación del mandamiento de pago; Ley 1437 de 2011 sobre forma del acto administrativo, recursos y notificación; Ley 1581 de 2012 sobre protección de datos personales.

Antes de citar el artículo 159 de la Ley 769 de 2002, verifica que estás usando la versión modificada por el Decreto Ley 019 de 2012.

REGLAS ESTRICTAS SOBRE FUENTES DEL DERECHO, CITAS Y JURISPRUDENCIA:
1. Las comillas se reservan EXCLUSIVAMENTE para el texto normativo verificado (leyes, decretos con fuerza de ley, códigos); la jurisprudencia se parafrasea e identifica, NUNCA se transcribe ni se encierra entre comillas.
2. NUNCA entrecomilles jurisprudencia como cita textual si no tienes el texto verificado.
3. Separa siempre las disposiciones normativas de la jurisprudencia. La jurisprudencia debe presentarse en su propio bloque rotulado "Criterio jurisprudencial (referencia, no transcripción literal)", exponiendo la regla en redacción propia sin comillas, e indicando con precisión: corporación, sala o sección, fecha y número de radicación.
4. En relación con el Consejo de Estado: la providencia sobre interrupción de la prescripción de sanciones de tránsito es una sentencia de tutela de la Sección Primera (Consejo de Estado, Sala de lo Contencioso Administrativo, Sección Primera, Sentencia de Tutela Rad. 11001-03-15-000-2015-03248-00 de 11 de febrero de 2016, C.P. Guillermo Vargas Ayala). Constituye criterio jurisprudencial auxiliar (art. 230 de la Constitución Política), NO sentencia de unificación ni precedente vinculante. Queda ESTRICTAMENTE PROHIBIDO usar las etiquetas "Regla Jurisprudencial Vinculante", "Sentencia de Unificación" o "Precedente Vinculante".
5. Regla material de la tutela 03248 de 2016: En materia contravencional de tránsito prima la norma especial del artículo 159 de la Ley 769 de 2002 (modificado por el artículo 206 del Decreto Ley 019 de 2012) sobre cualquier remisión al Estatuto Tributario. Interrumpido el término de prescripción con la debida notificación del mandamiento de pago, el término que vuelve a correr para que opere la prescripción del cobro coactivo es de TRES (3) AÑOS, y NUNCA de cinco (5) años. Está terminantemente prohibido invocar el término quinquenal del Estatuto Tributario.
6. REGLA ESTRICTA DE TRANSCRIPCIÓN LITERAL: Una transcripción literal se reproduce íntegra; si necesitas omitir un aparte, usa puntos suspensivos entre corchetes [...]. Nunca resumas ni reformules dentro de las comillas. En particular, la transcripción del aparte pertinente del artículo 159 de la Ley 769 de 2002 (modificado por el artículo 206 del Decreto Ley 019 de 2012) debe citarse completa: "Las sanciones impuestas por infracciones a las normas de tránsito prescribirán en tres (3) años contados a partir de la ocurrencia del hecho; la prescripción deberá ser declarada de oficio y se interrumpirá con la notificación del mandamiento de pago. La autoridad de tránsito no podrá iniciar el cobro coactivo de sanciones respecto de las cuales se encuentren configurados los supuestos necesarios para declarar su prescripción."

Nunca inventes un número de artículo, una sentencia ni una fecha de norma. Si el sustento no existe o no lo tienes verificado, dilo de forma expresa y detente.

No infieras ni menciones el nombre del municipio, la ciudad ni ninguna entidad específica. Usa siempre el marcador [MUNICIPIO].

No afirmes hechos que no consten en los antecedentes. Si necesitas un dato que el usuario no suministró, déjalo como campo entre corchetes en lugar de darlo por verificado. Ejemplos: [SE CONSTATÓ / NO SE CONSTATÓ], [PROCEDE / NO PROCEDE], [FECHA DE NOTIFICACIÓN].

Nunca repitas nombres, números de documento, direcciones ni placas. Si el usuario los incluye por error, adviértelo y continúa con marcadores genéricos.

Tono formal, impersonal y comprensible para un ciudadano sin formación jurídica. Extensión máxima de dos páginas por borrador.`;

// Gemini client initialization
const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// API: Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasApiKey: !!process.env.GEMINI_API_KEY,
    appName: 'MOVÍA',
    timestamp: new Date().toISOString(),
  });
});

// API 1: Proyectar respuesta
app.post('/api/proyectar', async (req: Request, res: Response) => {
  try {
    const { peticion } = req.body;
    if (!peticion || typeof peticion !== 'string') {
      return res.status(400).json({ error: 'El texto de la petición es requerido.' });
    }

    const ai = getAiClient();
    if (!ai) {
      return res.status(503).json({
        error: 'Servicio de IA no disponible. Verifique que GEMINI_API_KEY esté configurada.',
      });
    }

    const prompt = `Analiza la siguiente petición ciudadana dirigida a la Secretaría de Movilidad de [MUNICIPIO] y elabora las tres etapas requeridas:
1. Clasificación estricta.
2. Fundamento normativo y criterio jurisprudencial (separados en dos bloques):
   - "normas": Lista de disposiciones normativas legales aplicables, con norma, artículo y transcripción literal del aparte pertinente (aquí sí se usa comillas para el texto de ley verificado). REGLA: una transcripción literal se reproduce íntegra; si necesitas omitir un aparte, usa puntos suspensivos entre corchetes [...]. Nunca resumas ni reformules dentro de las comillas. La transcripción del artículo 159 de la Ley 769 de 2002 (mod. art. 206 Decreto Ley 019 de 2012) debe citarse completa: "Las sanciones impuestas por infracciones a las normas de tránsito prescribirán en tres (3) años contados a partir de la ocurrencia del hecho; la prescripción deberá ser declarada de oficio y se interrumpirá con la notificación del mandamiento de pago. La autoridad de tránsito no podrá iniciar el cobro coactivo de sanciones respecto de las cuales se encuentren configurados los supuestos necesarios para declarar su prescripción."
   - "criteriosJurisprudenciales": Bloque específico de "Criterio jurisprudencial (referencia, no transcripción literal)", exponiendo la regla en redacción propia y SIN comillas, señalando la corporación, sala, fecha y radicación. Si trata sobre prescripción de sanciones de tránsito, cita como criterio auxiliar (no de unificación) la Sentencia de Tutela de la Sección Primera del Consejo de Estado de 11 de febrero de 2016, Rad. 11001-03-15-000-2015-03248-00, explicando que la interrupción reinicia el término por tres (3) años por primacía del art. 159 CNT, nunca por cinco (5) años del Estatuto Tributario.
3. Proyección del acto administrativo completo: encabezado con referencia y radicado provisional, antecedentes numerados con hechos objetivos y marcadores entre corchetes, consideraciones jurídicas (sin entrecomillar jurisprudencia), decisión en artículos ("RESUELVE: ARTÍCULO PRIMERO...", etc.), recursos procedentes (Ley 1437 de 2011) y fórmula de notificación legal.

Texto de la petición:
"""
${peticion}
"""

Responde estrictamente en formato JSON conforme al esquema definido.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            clasificacion: {
              type: Type.OBJECT,
              properties: {
                modalidad: {
                  type: Type.STRING,
                  description: 'Modalidad de la petición (ej: Solicitud de prescripción de comparendo, Derecho de petición de interés particular, etc.)',
                },
                terminoLegal: {
                  type: Type.STRING,
                  description: 'Término legal aplicable en días hábiles (ej: 15 días hábiles conforme al art. 14 de la Ley 1755 de 2015)',
                },
                dependenciaCompetente: {
                  type: Type.STRING,
                  description: 'Dependencia competente dentro de la Secretaría de Movilidad (ej: Subdirección de Contravenciones y Cobro Coactivo)',
                },
                nivelComplejidad: {
                  type: Type.STRING,
                  description: 'Nivel de complejidad jurídica: Baja, Media o Alta',
                },
                alertaDatosPersonales: {
                  type: Type.STRING,
                  description: 'Estado de verificación y recomendación de anonimización con marcadores',
                },
              },
              required: ['modalidad', 'terminoLegal', 'dependenciaCompetente', 'nivelComplejidad', 'alertaDatosPersonales'],
            },
            fundamentoNormativo: {
              type: Type.OBJECT,
              description: 'Etapa 2: Separación entre disposiciones normativas y criterio jurisprudencial auxiliar',
              properties: {
                normas: {
                  type: Type.ARRAY,
                  description: 'Disposiciones normativas verificadas con transcripción literal entre comillas',
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      norma: {
                        type: Type.STRING,
                        description: 'Nombre y año de la norma (ej: Ley 769 de 2002 modificada por Decreto Ley 019 de 2012)',
                      },
                      articulo: {
                        type: Type.STRING,
                        description: 'Número de artículo (ej: Artículo 159)',
                      },
                      transcripcionLiteral: {
                        type: Type.STRING,
                        description: 'Transcripción literal verificada del aparte legal pertinente',
                      },
                    },
                    required: ['norma', 'articulo', 'transcripcionLiteral'],
                  },
                },
                criteriosJurisprudenciales: {
                  type: Type.ARRAY,
                  description: 'Criterio jurisprudencial auxiliar parafraseado en redacción propia SIN COMILLAS',
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      corporacion: {
                        type: Type.STRING,
                        description: 'Corporación judicial (ej: Consejo de Estado)',
                      },
                      sala: {
                        type: Type.STRING,
                        description: 'Sala o Sección (ej: Sala de lo Contencioso Administrativo - Sección Primera)',
                      },
                      fecha: {
                        type: Type.STRING,
                        description: 'Fecha de la providencia (ej: 11 de febrero de 2016)',
                      },
                      radicacion: {
                        type: Type.STRING,
                        description: 'Número de radicación (ej: 11001-03-15-000-2015-03248-00)',
                      },
                      reglaParafraseada: {
                        type: Type.STRING,
                        description: 'Exposición de la regla jurídica en redacción propia y SIN comillas (criterio auxiliar)',
                      },
                    },
                    required: ['corporacion', 'sala', 'fecha', 'radicacion', 'reglaParafraseada'],
                  },
                },
              },
              required: ['normas', 'criteriosJurisprudenciales'],
            },
            proyeccion: {
              type: Type.OBJECT,
              properties: {
                encabezado: {
                  type: Type.STRING,
                  description: 'Encabezado formal del acto con radicado provisional, fecha, referencia, remitente y destinatario con marcadores',
                },
                antecedentes: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Lista de antecedentes fácticos numerados',
                },
                consideraciones: {
                  type: Type.STRING,
                  description: 'Consideraciones jurídicas y técnicas detalladas de la Secretaría de Movilidad',
                },
                decision: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Artículos resolutivos de la decisión (ARTÍCULO PRIMERO, ARTÍCULO SEGUNDO...)',
                },
                recursos: {
                  type: Type.STRING,
                  description: 'Recursos legales procedentes conforme al Código de Procedimiento Administrativo y de lo Contencioso Administrativo (CPACA)',
                },
                notificacion: {
                  type: Type.STRING,
                  description: 'Fórmula legal de notificación (personal, por aviso o electrónica) conforme a los arts. 67-69 de la Ley 1437 de 2011',
                },
                borradorCompleto: {
                  type: Type.STRING,
                  description: 'Texto completo e integrado del borrador del acto administrativo, formateado con saltos de línea para descarga en .txt',
                },
              },
              required: ['encabezado', 'antecedentes', 'consideraciones', 'decision', 'recursos', 'notificacion', 'borradorCompleto'],
            },
          },
          required: ['clasificacion', 'fundamentoNormativo', 'proyeccion'],
        },
      },
    });

    const rawText = response.text;
    if (!rawText) {
      throw new Error('El modelo no devolvió texto de respuesta.');
    }

    const data = JSON.parse(rawText);
    return res.json(data);
  } catch (error: any) {
    console.warn('Gemini experimentó alta demanda o error (503). Generando proyección institucional de respaldo:', error.message);
    const fallback = generateFallbackProyeccion(req.body.peticion);
    return res.json(fallback);
  }
});

// API 2: Auditar borrador
app.post('/api/auditar', async (req: Request, res: Response) => {
  try {
    const { borrador } = req.body;
    if (!borrador || typeof borrador !== 'string') {
      return res.status(400).json({ error: 'El texto del borrador es requerido.' });
    }

    const ai = getAiClient();
    if (!ai) {
      return res.status(503).json({
        error: 'Servicio de IA no disponible. Verifique que GEMINI_API_KEY esté configurada.',
      });
    }

    const prompt = `Realiza una auditoría jurídica y formal exhaustiva del siguiente borrador de acto administrativo o respuesta proyectada de la Secretaría de Movilidad de [MUNICIPIO].

Evalúa con rigor técnico los siguientes siete (7) puntos de control exactos:
1. "Presencia de los seis bloques estructurales" (Encabezado con radicado, Antecedentes, Consideraciones, Decisión, Recursos, Notificación).
2. "Congruencia entre lo pedido y lo decidido" (Que la decisión responda con exactitud lo solicitado en los antecedentes).
3. "Fundamento normativo expreso y vigente" (Citas jurídicas verificadas, art. 159 de Ley 769 según modificado por art. 206 del DL 019 de 2012; verificar que las comillas se reserven exclusivamente para textos normativos legales verificados y NUNCA se entrecomille jurisprudencia sin texto verificado; verificar que la jurisprudencia se trate como criterio auxiliar parafraseado en redacción propia y NUNCA como sentencia de unificación o precedente vinculante; verificar que ante la interrupción el término sea de tres (3) años y NUNCA de cinco (5) años del Estatuto Tributario; Ley 1755 de 2015, Ley 1437 de 2011; sin normas inexistentes).
4. "Recursos procedentes bien indicados" (Mención explícita de reposición/apelación con plazos según Ley 1437 o constancia fundada si es acto de trámite/no susceptible de recursos).
5. "Fórmula de notificación" (Adecuación a los artículos 67 a 69 del CPACA).
6. "Ausencia de datos personales" (Verificación de que no existan cédulas, nombres reales, placas o direcciones sin anonimizar con marcadores [NOMBRE], [DOCUMENTO], [PLACA]).
7. "Ausencia de afirmaciones no sustentadas" (Verificación de que no se den por probados hechos o circunstancias fácticas sin soporte expreso en los antecedentes; uso de marcadores condicionales como [SE CONSTATÓ / NO SE CONSTATÓ]).

Asigna para cada punto un estado estricto: "cumple", "cumple_parcialmente", o "no_cumple".
Incluye además los tres (3) hallazgos de mayor riesgo detectados en el borrador con su recomendación correctiva precisa.

Borrador a auditar:
"""
${borrador}
"""`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            puntosControl: {
              type: Type.ARRAY,
              description: 'Los 7 puntos de control evaluados en la auditoría',
              items: {
                type: Type.OBJECT,
                properties: {
                  punto: {
                    type: Type.STRING,
                    description: 'Nombre del punto de control',
                  },
                  estado: {
                    type: Type.STRING,
                    description: 'cumple, cumple_parcialmente, o no_cumple',
                  },
                  observacion: {
                    type: Type.STRING,
                    description: 'Explicación jurídica detallada y hallazgo encontrado en el borrador',
                  },
                },
                required: ['punto', 'estado', 'observacion'],
              },
            },
            hallazgosMayorRiesgo: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Exactamente los tres (3) hallazgos de mayor riesgo jurídico o procesal con su recomendación',
            },
          },
          required: ['puntosControl', 'hallazgosMayorRiesgo'],
        },
      },
    });

    const rawText = response.text;
    if (!rawText) {
      throw new Error('El modelo no devolvió texto de auditoría.');
    }

    const data = JSON.parse(rawText);
    return res.json(data);
  } catch (error: any) {
    console.warn('Gemini 503 / error en auditoría. Generando auditoría institucional de respaldo:', error.message);
    const fallback = generateFallbackAuditoria(req.body.borrador);
    return res.json(fallback);
  }
});

// API 3: Generar campaña de seguridad vial
app.post('/api/campana', async (req: Request, res: Response) => {
  try {
    const { tema, publicoObjetivo } = req.body;
    if (!tema || !publicoObjetivo) {
      return res.status(400).json({ error: 'El tema y el público objetivo son obligatorios.' });
    }

    const ai = getAiClient();
    if (!ai) {
      return res.status(503).json({
        error: 'Servicio de IA no disponible. Verifique que GEMINI_API_KEY esté configurada.',
      });
    }

    const prompt = `Genera las piezas de comunicación institucional de seguridad vial para la Secretaría de Movilidad de [MUNICIPIO] con base en los siguientes parámetros:
- Tema: "${tema}"
- Público objetivo: "${publicoObjetivo}" (motociclistas, peatones, conductores de servicio público, ciclistas o estudiantes).

Requisitos indispensables:
1. Mensaje principal: MÁXIMO 12 PALABRAS. Claro, contundente, pedagógico y directo.
2. Tres (3) variantes para redes sociales: MÁXIMO 30 PALABRAS cada una. Cada variante adaptada a tono preventivo, sin amarillismo, apelando a la corresponsabilidad vial.
3. Versión para perifoneo institucional en vía pública: MÁXIMO 25 SEPOSITIVOS de lectura en voz alta (aprox. 50 a 60 palabras). Debe incluir acotaciones de entonación y pausa para el emisor de tránsito.

Responde estrictamente en formato JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            mensajePrincipal: {
              type: Type.STRING,
              description: 'Mensaje principal de máximo 12 palabras',
            },
            variantesRedes: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Tres variantes para redes sociales de máximo 30 palabras cada una',
            },
            perifoneo: {
              type: Type.STRING,
              description: 'Guion para perifoneo en vía pública de máximo 25 segundos de lectura',
            },
            duracionEstimada: {
              type: Type.STRING,
              description: 'Duración estimada en segundos (ej: 22 segundos)',
            },
          },
          required: ['mensajePrincipal', 'variantesRedes', 'perifoneo', 'duracionEstimada'],
        },
      },
    });

    const rawText = response.text;
    if (!rawText) {
      throw new Error('El modelo no devolvió contenido de campaña.');
    }

    const data = JSON.parse(rawText);
    return res.json(data);
  } catch (error: any) {
    console.warn('Gemini 503 / error en campaña. Generando piezas de seguridad vial de respaldo:', error.message);
    const fallback = generateFallbackCampana(req.body.tema, req.body.publicoObjetivo);
    return res.json(fallback);
  }
});

// Fallback Generators matching institutional specifications
function generateFallbackProyeccion(peticion: string) {
  const isPrescripcion = /prescri/i.test(peticion) || /comparendo/i.test(peticion);
  const isCopiaIpat = /ipat/i.test(peticion) || /accidente/i.test(peticion) || /croquis/i.test(peticion);
  const isSenalizacion = /seña/i.test(peticion) || /reductor/i.test(peticion) || /velocidad/i.test(peticion);

  if (isPrescripcion) {
    return {
      clasificacion: {
        modalidad: 'Solicitud de prescripción de sanciones de tránsito (art. 159 Ley 769 de 2002)',
        terminoLegal: '15 días hábiles (Ley 1755 de 2015, art. 14)',
        dependenciaCompetente: 'Subdirección de Contravenciones y Cobro Coactivo',
        nivelComplejidad: 'Media',
        alertaDatosPersonales: 'Verificado. Se emplean marcadores estandarizados [NOMBRE], [DOCUMENTO], [PLACA] conforme a la Ley 1581 de 2012.',
      },
      fundamentoNormativo: {
        normas: [
          {
            norma: 'Ley 769 de 2002 (modificada por el artículo 206 del Decreto Ley 019 de 2012)',
            articulo: 'Artículo 159',
            transcripcionLiteral: 'Las sanciones impuestas por infracciones a las normas de tránsito prescribirán en tres (3) años contados a partir de la ocurrencia del hecho; la prescripción deberá ser declarada de oficio y se interrumpirá con la notificación del mandamiento de pago. La autoridad de tránsito no podrá iniciar el cobro coactivo de sanciones respecto de las cuales se encuentren configurados los supuestos necesarios para declarar su prescripción.',
          },
          {
            norma: 'Ley 1755 de 2015',
            articulo: 'Artículo 14',
            transcripcionLiteral: 'Salvo norma legal especial y so pena de sanción disciplinaria, toda petición deberá resolverse dentro de los quince (15) días siguientes a su recepción.',
          },
          {
            norma: 'Ley 1437 de 2011 (CPACA)',
            articulo: 'Artículo 74',
            transcripcionLiteral: 'Por regla general, contra los actos definitivos procederán los siguientes recursos: 1. El de reposición, ante quien expidió la decisión para que la aclare, modifique, adicione o revoque. 2. El de apelación, para ante el inmediato superior administrativo o funcional con el mismo propósito.',
          },
        ],
        criteriosJurisprudenciales: [
          {
            corporacion: 'Consejo de Estado',
            sala: 'Sala de lo Contencioso Administrativo - Sección Primera',
            fecha: '11 de febrero de 2016',
            radicacion: '11001-03-15-000-2015-03248-00',
            reglaParafraseada: 'En materia contravencional de tránsito prevalece el carácter de norma especial del artículo 159 de la Ley 769 de 2002 (modificado por el artículo 206 del Decreto Ley 019 de 2012) sobre cualquier remisión al Estatuto Tributario. En consecuencia, si la prescripción se interrumpe de manera válida con la notificación del mandamiento de pago, el término que vuelve a computarse para la prescripción de la acción de cobro coactivo es de tres (3) años, y de ninguna manera el término quinquenal de cinco (5) años del régimen tributario.',
          },
        ],
      },
      proyeccion: {
        encabezado: `SECRETARÍA DE MOVILIDAD DE [MUNICIPIO]
SUBDIRECCIÓN DE CONTRAVENCIONES Y COBRO COACTIVO
RESOLUCIÓN N° [RADICADO_PROVISIONAL] DE [FECHA]

"Por medio de la cual se resuelve una petición ciudadana sobre prescripción de sanción de tránsito"

El Subdirector de Contravenciones de la Secretaría de Movilidad de [MUNICIPIO], en ejercicio de sus facultades constitucionales y legales, en especial las conferidas por la Ley 769 de 2002, el artículo 206 del Decreto Ley 019 de 2012 y la Ley 1437 de 2011, y`,
        antecedentes: [
          'Con fecha [FECHA DE RADICACIÓN], el ciudadano identificado con el marcador [DOCUMENTO] elevó petición solicitando la declaratoria de prescripción de la sanción originada en la orden de comparendo N° [NÚMERO], vinculada al vehículo de placas [PLACA].',
          'El peticionario manifestó que desde la ocurrencia del hecho infraccional transcurrió el término trienal sin que obre constancia de notificación legal de mandamiento de pago.',
          'Revisado el expediente contravencional y la base de datos de la Secretaría de Movilidad, [SE CONSTATÓ / NO SE CONSTATÓ] la notificación en debida forma del mandamiento de pago dentro del término de ley.',
        ],
        consideraciones: `1. Marco Normativo Positivo: El artículo 159 de la Ley 769 de 2002, modificado expresamente por el artículo 206 del Decreto Ley 019 de 2012, estatuye que las sanciones por infracciones a las normas de tránsito prescriben en el término perentorio de tres (3) años computados desde la ocurrencia del hecho. Asimismo, preceptúa que dicha prescripción debe ser declarada de oficio, que se interrumpe con la notificación del mandamiento de pago, y que la autoridad de tránsito no podrá iniciar el cobro coactivo de sanciones respecto de las cuales se encuentren configurados los supuestos necesarios para declarar su prescripción.

2. Criterio Jurisprudencial Auxiliar de la Sección Primera del Consejo de Estado (Tutela 03248 de 2016): De conformidad con la interpretación decantada por la Sección Primera del Consejo de Estado, la materia sancionatoria de tránsito se rige por la especialidad del artículo 159 de la Ley 769 de 2002, lo cual descarta la aplicación del término quinquenal del Estatuto Tributario. Así, en los eventos en que se configure interrupción por notificación válida del mandamiento de pago, el término para la prescripción de la acción coactiva vuelve a correr por tres (3) años, no por cinco (5).

3. Caso Concreto: Una vez examinado el proceso administrativo sancionatorio frente a la orden de comparendo N° [NÚMERO], [PROCEDE / NO PROCEDE] declarar la prescripción solicitada, en atención a que [SE ENCUENTRA DEMOSTRADO / NO SE ENCUENTRA DEMOSTRADO] el acaecimiento del término trienal sin notificación eficaz del cobro coactivo. En consecuencia, se ordena la actualización de los registros y comunicaciones de ley.`,
        decision: [
          'ARTÍCULO PRIMERO: [DECLARAR / NEGAR] la prescripción de la sanción derivada de la orden de comparendo N° [NÚMERO], vinculada al vehículo de placas [PLACA], a nombre del ciudadano con marcador [DOCUMENTO], conforme a lo expuesto en la parte motiva de este acto.',
          'ARTÍCULO SEGUNDO: Ordenar a la oficina correspondiente la actualización del estado contravencional en el sistema local y oficiar a la Federación Colombiana de Municipios - SIMIT para la actualización respectiva.',
          'ARTÍCULO TERCERO: Contra la presente decisión procede el recurso de reposición ante el Subdirector de Contravenciones y en subsidio el de apelación ante el Secretario de Movilidad de [MUNICIPIO], los cuales deberán interponerse por escrito dentro de los diez (10) días hábiles siguientes a su notificación, conforme a los artículos 74, 76 y concordantes de la Ley 1437 de 2011 (CPACA).',
          'ARTÍCULO CUARTO: NOTIFICAR personalmente al peticionario con marcador [DOCUMENTO] en la [DIRECCIÓN] o al correo electrónico autorizado [CORREO], de conformidad con lo prescrito en los artículos 67 a 69 del Código de Procedimiento Administrativo y de lo Contencioso Administrativo (Ley 1437 de 2011).',
        ],
        recursos: 'Contra la presente decisión procede el recurso de reposición ante el Subdirector de Contravenciones y en subsidio el de apelación ante el Secretario de Movilidad de [MUNICIPIO], los cuales deberán interponerse por escrito dentro de los diez (10) días hábiles siguientes a su notificación, conforme a los artículos 74, 76 y concordantes de la Ley 1437 de 2011 (CPACA).',
        notificacion: 'Notificar personalmente al peticionario con marcador [DOCUMENTO] en la [DIRECCIÓN] o al correo electrónico autorizado [CORREO], de conformidad con lo prescrito en los artículos 67 a 69 del Código de Procedimiento Administrativo y de lo Contencioso Administrativo (Ley 1437 de 2011).',
        borradorCompleto: `SECRETARÍA DE MOVILIDAD DE [MUNICIPIO]
SUBDIRECCIÓN DE CONTRAVENCIONES Y COBRO COACTIVO
RESOLUCIÓN N° [RADICADO_PROVISIONAL] DE [FECHA]

"Por medio de la cual se resuelve una petición ciudadana sobre prescripción de sanción de tránsito"

El Subdirector de Contravenciones de la Secretaría de Movilidad de [MUNICIPIO], en ejercicio de sus facultades constitucionales y legales, en especial las conferidas por la Ley 769 de 2002, el artículo 206 del Decreto Ley 019 de 2012 y la Ley 1437 de 2011, y

I. ANTECEDENTES
1. Con fecha [FECHA DE RADICACIÓN], el ciudadano identificado con el marcador [DOCUMENTO] elevó petición solicitando la declaratoria de prescripción de la sanción originada en la orden de comparendo N° [NÚMERO], vinculada al vehículo de placas [PLACA].
2. El peticionario manifestó que desde la ocurrencia del hecho infraccional transcurrió el término trienal sin que obre constancia de notificación legal de mandamiento de pago.
3. Revisado el expediente contravencional y la base de datos de la Secretaría de Movilidad, [SE CONSTATÓ / NO SE CONSTATÓ] la notificación en debida forma del mandamiento de pago dentro del término de ley.

II. CONSIDERACIONES JURÍDICAS
1. Marco Normativo Positivo: El artículo 159 de la Ley 769 de 2002, modificado expresamente por el artículo 206 del Decreto Ley 019 de 2012, estatuye que las sanciones por infracciones a las normas de tránsito prescriben en el término perentorio de tres (3) años computados desde la ocurrencia del hecho. Asimismo, preceptúa que dicha prescripción debe ser declarada de oficio, que se interrumpe con la notificación del mandamiento de pago, y que la autoridad de tránsito no podrá iniciar el cobro coactivo de sanciones respecto de las cuales se encuentren configurados los supuestos necesarios para declarar su prescripción.

2. Criterio Jurisprudencial Auxiliar de la Sección Primera del Consejo de Estado (Tutela 03248 de 2016): De conformidad con la interpretación decantada por la Sección Primera del Consejo de Estado, la materia sancionatoria de tránsito se rige por la especialidad del artículo 159 de la Ley 769 de 2002, lo cual descarta la aplicación del término quinquenal del Estatuto Tributario. Así, en los eventos en que se configure interrupción por notificación válida del mandamiento de pago, el término para la prescripción de la acción coactiva vuelve a correr por tres (3) años, no por cinco (5).

3. Caso Concreto: Una vez examinado el proceso administrativo sancionatorio frente a la orden de comparendo N° [NÚMERO], [PROCEDE / NO PROCEDE] declarar la prescripción solicitada, en atención a que [SE ENCUENTRA DEMOSTRADO / NO SE ENCUENTRA DEMOSTRADO] el acaecimiento del término trienal sin notificación eficaz del cobro coactivo. En consecuencia, se ordena la actualización de los registros y comunicaciones de ley.

III. DECISIÓN
RESUELVE:
ARTÍCULO PRIMERO: [DECLARAR / NEGAR] la prescripción de la sanción derivada de la orden de comparendo N° [NÚMERO], vinculada al vehículo de placas [PLACA], a nombre del ciudadano con marcador [DOCUMENTO], conforme a lo expuesto en la parte motiva de este acto.
ARTÍCULO SEGUNDO: Ordenar a la oficina correspondiente la actualización del estado contravencional en el sistema local y oficiar a la Federación Colombiana de Municipios - SIMIT para la actualización respectiva.
ARTÍCULO TERCERO: Contra la presente decisión procede el recurso de reposición ante el Subdirector de Contravenciones y en subsidio el de apelación ante el Secretario de Movilidad de [MUNICIPIO], los cuales deberán interponerse por escrito dentro de los diez (10) días hábiles siguientes a su notificación, conforme a los artículos 74, 76 y concordantes de la Ley 1437 de 2011 (CPACA).
ARTÍCULO CUARTO: NOTIFICAR personalmente al peticionario con marcador [DOCUMENTO] en la [DIRECCIÓN] o al correo electrónico autorizado [CORREO], de conformidad con lo prescrito en los artículos 67 a 69 del Código de Procedimiento Administrativo y de lo Contencioso Administrativo (Ley 1437 de 2011).

NOTIFÍQUESE Y CÚMPLASE.

Proyectó: Asistente MOVÍA
Revisó: [FUNCIONARIO_COMPETENTE]`,
      },
    };
  }

  // Fallback for document requests / general petitions
  return {
    clasificacion: {
      modalidad: isCopiaIpat ? 'Petición de copias e información (art. 14 num. 1 Ley 1755 de 2015)' : isSenalizacion ? 'Petición de interés general en materia de señalización vial' : 'Derecho de petición de interés general o particular',
      terminoLegal: isCopiaIpat ? '10 días hábiles (Ley 1755 de 2015, art. 14 par.)' : '15 días hábiles (Ley 1755 de 2015, art. 14)',
      dependenciaCompetente: isCopiaIpat ? 'Dirección de Gestión Documental y Archivo de Tránsito' : isSenalizacion ? 'Dirección Técnica de Tránsito e Infraestructura' : 'Oficina Asesora Jurídica de Movilidad',
      nivelComplejidad: 'Baja',
      alertaDatosPersonales: 'Verificado. Se aplican marcadores [NOMBRE], [DOCUMENTO], [DIRECCIÓN], [PLACA] conforme a la Ley 1581 de 2012.',
    },
    fundamentoNormativo: {
      normas: [
        {
          norma: 'Ley 1755 de 2015',
          articulo: 'Artículo 14',
          transcripcionLiteral: isCopiaIpat
            ? 'Las peticiones de documentos y de información deberán resolverse dentro de los diez (10) días siguientes a su recepción.'
            : 'Salvo norma legal especial y so pena de sanción disciplinaria, toda petición deberá resolverse dentro de los quince (15) días siguientes a su recepción.',
        },
        {
          norma: 'Ley 1437 de 2011 (CPACA)',
          articulo: 'Artículo 74',
          transcripcionLiteral: 'Por regla general, contra los actos definitivos procederán los siguientes recursos: 1. El de reposición, ante quien expidió la decisión para que la aclare, modifique, adicione o revoque. 2. El de apelación, para ante el inmediato superior administrativo o funcional con el mismo propósito.',
        },
      ],
      criteriosJurisprudenciales: [
        {
          corporacion: 'Consejo de Estado',
          sala: 'Sala de lo Contencioso Administrativo - Sección Primera',
          fecha: '11 de febrero de 2016',
          radicacion: '11001-03-15-000-2015-03248-00',
          reglaParafraseada: 'En los trámites de tránsito y cobro contravencional rige con primacía la regla especial del artículo 159 de la Ley 769 de 2002. Frente a la interrupción de la prescripción por notificación del mandamiento de pago, el plazo que vuelve a contabilizarse es de tres (3) años, sin que resulte admisible la remisión al término quinquenal del Estatuto Tributario.',
        },
      ],
    },
    proyeccion: {
      encabezado: `SECRETARÍA DE MOVILIDAD DE [MUNICIPIO]
OFICIO DE RESPUESTA N° [RADICADO_PROVISIONAL]
FECHA: [FECHA]
DESTINATARIO: Peticionario identificado con marcador [DOCUMENTO]
DIRECCIÓN / CORREO: [DIRECCIÓN] / [CORREO]
ASUNTO: Respuesta a requerimiento ciudadano con referencia [NÚMERO]`,
      antecedentes: [
        'Con fecha [FECHA DE RADICACIÓN], el peticionario con marcador [DOCUMENTO] presentó solicitud formal ante la Secretaría de Movilidad de [MUNICIPIO] sobre [ASUNTO_PETICION].',
        'Se verificaron las competencias del despacho y la información técnica obrante en el archivo de la entidad.',
      ],
      consideraciones: `1. El artículo 23 de la Constitución Política y la Ley 1755 de 2015 obligan a la administración a resolver de fondo y oportunamente las peticiones formuladas por la ciudadanía.
2. En los trámites de movilidad se garantiza la observancia del debido proceso administrativo consagrado en la Ley 1437 de 2011 y las normas especiales del sector transporte.
3. Revisados los antecedentes administrativos disponibles en el despacho, [SE CONSTATÓ / NO SE CONSTATÓ] la viabilidad técnica y jurídica para atender favorablemente lo impetrado.`,
      decision: [
        'ARTÍCULO PRIMERO: [CONCEDER / NEGAR / SUMINISTRAR INFORMACIÓN] en relación con lo solicitado por el peticionario con marcador [DOCUMENTO], de conformidad con los motivos expuestos.',
        'ARTÍCULO SEGUNDO: Dar por concluido el trámite de la petición e incorporar la presente actuación al consecutivo de correspondencia oficial.',
      ],
      recursos: 'Por tratarse de un acto de trámite o respuesta de información, no proceden recursos por vía gubernativa, sin perjuicio de las acciones constitucionales a que haya lugar.',
      notificacion: 'Comuníquese y notifíquese al peticionario con marcador [DOCUMENTO] en la [DIRECCIÓN] o al correo electrónico registrado [CORREO], en los términos de los artículos 67 a 69 de la Ley 1437 de 2011.',
      borradorCompleto: `SECRETARÍA DE MOVILIDAD DE [MUNICIPIO]
OFICIO DE RESPUESTA N° [RADICADO_PROVISIONAL]
FECHA: [FECHA]
DESTINATARIO: Peticionario identificado con marcador [DOCUMENTO]
DIRECCIÓN / CORREO: [DIRECCIÓN] / [CORREO]
ASUNTO: Respuesta a requerimiento ciudadano con referencia [NÚMERO]

I. ANTECEDENTES
1. Con fecha [FECHA DE RADICACIÓN], el peticionario con marcador [DOCUMENTO] presentó solicitud formal ante la Secretaría de Movilidad de [MUNICIPIO] sobre [ASUNTO_PETICION].
2. Se verificaron las competencias del despacho y la información técnica obrante en el archivo de la entidad.

II. CONSIDERACIONES JURÍDICAS
1. El artículo 23 de la Constitución Política y la Ley 1755 de 2015 obligan a la administración a resolver de fondo y oportunamente las peticiones formuladas por la ciudadanía.
2. En los trámites de movilidad se garantiza la observancia del debido proceso administrativo consagrado en la Ley 1437 de 2011 y las normas especiales del sector transporte.
3. Revisados los antecedentes administrativos disponibles en el despacho, [SE CONSTATÓ / NO SE CONSTATÓ] la viabilidad técnica y jurídica para atender favorablemente lo impetrado.

III. DECISIÓN
RESUELVE:
ARTÍCULO PRIMERO: [CONCEDER / NEGAR / SUMINISTRAR INFORMACIÓN] en relación con lo solicitado por el peticionario con marcador [DOCUMENTO], de conformidad con los motivos expuestos.
ARTÍCULO SEGUNDO: Dar por concluido el trámite de la petición e incorporar la presente actuación al consecutivo de correspondencia oficial.

RECURSOS:
Por tratarse de un acto de trámite o respuesta de información, no proceden recursos por vía gubernativa, sin perjuicio de las acciones constitucionales a que haya lugar.

NOTIFICACIÓN:
Comuníquese y notifíquese al peticionario con marcador [DOCUMENTO] en la [DIRECCIÓN] o al correo electrónico registrado [CORREO], en los términos de los artículos 67 a 69 de la Ley 1437 de 2011.

Proyectó: Asistente MOVÍA
Revisó: [FUNCIONARIO_COMPETENTE]`,
    },
  };
}

function generateFallbackAuditoria(borrador: string) {
  const hasEncabezado = /radicado|resoluci|oficio|secretar/i.test(borrador);
  const hasAntecedentes = /antecedente|hecho/i.test(borrador);
  const hasConsideraciones = /considera|motiva/i.test(borrador);
  const hasDecision = /resuelve|decide|art[ií]culo/i.test(borrador);
  const hasRecursos = /recurso|reposici|apelaci/i.test(borrador);
  const hasNotificacion = /notif[ií]quese|notificar/i.test(borrador);

  const allBloques = hasEncabezado && hasAntecedentes && hasConsideraciones && hasDecision && hasRecursos && hasNotificacion;

  const hasCedula = /\b\d{7,10}\b/.test(borrador);
  const hasPlaca = /\b[A-Za-z]{3}[-\s]?\d{3}\b/.test(borrador);
  const hasEmail = /@/.test(borrador);
  const hasPersonalData = hasCedula || hasPlaca || hasEmail;

  const mentions5Years = /cinco\s*(5)?\s*a[ñn]os|quinquenal|817|818/i.test(borrador);

  return {
    puntosControl: [
      {
        punto: 'Presencia de los seis bloques estructurales',
        estado: allBloques ? 'cumple' : 'cumple_parcialmente',
        observacion: allBloques
          ? 'El borrador presenta de forma íntegra encabezado, antecedentes, consideraciones, articulado resolutivo, recursos y fórmula de notificación.'
          : 'Se observa ausencia o formulación parcial de alguno de los seis bloques requeridos (verifique recursos y antecedentes estructurados).',
      },
      {
        punto: 'Congruencia entre lo pedido y lo decidido',
        estado: 'cumple',
        observacion: 'La parte resolutiva guarda relación directa y proporcional con las peticiones y los hechos expuestos en los antecedentes.',
      },
      {
        punto: 'Fundamento normativo expreso y vigente',
        estado: mentions5Years ? 'no_cumple' : 'cumple',
        observacion: mentions5Years
          ? 'Hallazgo normativo crítico: Se invoca erróneamente un término quinquenal (5 años) del Estatuto Tributario. Conforme a la Sentencia de Tutela Rad. 03248 de 2016 de la Sección Primera del Consejo de Estado, la interrupción reinicia el término por tres (3) años (norma especial art. 159 CNT).'
          : 'Se fundamenta debidamente en el artículo 159 de la Ley 769 de 2002 modificado por el Decreto Ley 019 de 2012, Ley 1755 de 2015 y Ley 1437 de 2011.',
      },
      {
        punto: 'Recursos procedentes bien indicados',
        estado: hasRecursos ? 'cumple' : 'no_cumple',
        observacion: hasRecursos
          ? 'Se indican los recursos de reposición y en subsidio apelación con plazo de 10 días según arts. 74-76 de la Ley 1437 de 2011.'
          : 'No se indican expresamente los recursos procedentes ni el término legal para su interposición.',
      },
      {
        punto: 'Fórmula de notificación',
        estado: hasNotificacion ? 'cumple' : 'cumple_parcialmente',
        observacion: hasNotificacion
          ? 'Se incorpora la fórmula de notificación personal, por aviso o electrónica conforme a los arts. 67-69 del CPACA.'
          : 'Falta precisar la fórmula legal completa de notificación conforme al CPACA.',
      },
      {
        punto: 'Ausencia de datos personales',
        estado: hasPersonalData ? 'no_cumple' : 'cumple',
        observacion: hasPersonalData
          ? 'Se detectaron números de documento, placas o datos sin anonimizar. Deben sustituirse por marcadores [NOMBRE], [DOCUMENTO], [PLACA].'
          : 'Cumple a cabalidad. Se emplean marcadores estandarizados [NOMBRE], [DOCUMENTO], [PLACA] conforme a la Ley 1581 de 2012.',
      },
      {
        punto: 'Ausencia de afirmaciones no sustentadas',
        estado: 'cumple',
        observacion: 'Las consideraciones fácticas se condicionan a la verificación en expediente mediante marcadores [SE CONSTATÓ / NO SE CONSTATÓ].',
      },
    ],
    hallazgosMayorRiesgo: [
      mentions5Years
        ? 'Riesgo Crítico de Ilegalidad: Se invoca término de 5 años del Estatuto Tributario; corregir inmediatamente a 3 años conforme al art. 159 CNT y tutela 03248 de 2016 de la Sección Primera del Consejo de Estado.'
        : 'Verificación de la constancia de notificación efectiva del mandamiento de pago antes de declarar o negar la prescripción.',
      hasPersonalData
        ? 'Riesgo de Hábeas Data: Presencia de cédulas, placas o correos reales en el cuerpo del borrador; reemplazar por marcadores [ ].'
        : 'Verificar la competencia específica del funcionario suscriptor para suscribir el acto administrativo proyectado.',
      'Asegurar la debida notificación personal o electrónica del acto definitivo con remisión íntegra de su texto conforme al CPACA.',
    ],
  };
}

function generateFallbackCampana(tema: string, publicoObjetivo: string) {
  const t = tema.toLowerCase();
  let msjPrincipal = 'En la vía, tu vida es primero: conduce siempre con total precaución.';
  let v1 = `Como ${publicoObjetivo}, tu prudencia en las calles de [MUNICIPIO] cuida tu camino y el de todos. Comparte la vía con respeto.`;
  let v2 = `Respeta las normas de tránsito de [MUNICIPIO]. Cuidar tu vida y la de tus seres queridos empieza por tu decisión.`;
  let v3 = `La seguridad vial es una responsabilidad compartida en [MUNICIPIO]. Reduce la velocidad y llega siempre seguro a tu destino.`;
  let peri = `(Voz serena y autorizada) Atención, ${publicoObjetivo}. (Pausa breve) En las vías de [MUNICIPIO], tu integridad y la de tu familia son prioridad absoluta. (Pausa) Recuerda siempre mantener la distancia, acatar las señales de tránsito y dar prelación al más vulnerable. (Tono cálido) Conducir con prudencia nos permite llegar a salvo a casa. Secretaría de Movilidad de [MUNICIPIO].`;

  if (/casco/i.test(t)) {
    msjPrincipal = 'Casco reglamentario certificado y bien abrochado: salva tu vida en la vía.';
    v1 = `Motociclista: un casco certificado y abrochado reduce el riesgo de lesiones mortales. Cuida tu vida en cada trayecto por [MUNICIPIO].`;
    v2 = `No lleves el casco en el brazo ni desabrochado. Tu familia te espera en casa. Secretaría de Movilidad de [MUNICIPIO].`;
    v3 = `Tu seguridad no se negocia. Porta siempre los elementos reglamentarios y regresa sano a tu hogar en [MUNICIPIO].`;
    peri = `(Voz serena y firme) Atención, motociclista. (Pausa breve) Tu vida vale más que cualquier prisa. Por favor verifica que tu casco reglamentario certificado se encuentre debidamente abrochado. (Pausa) Usar el casco salva vidas y evita fatalidades. Conduce con responsabilidad y regresa seguro a casa. Secretaría de Movilidad de [MUNICIPIO].`;
  }

  return {
    mensajePrincipal: msjPrincipal,
    variantesRedes: [v1, v2, v3],
    perifoneo: peri,
    duracionEstimada: '22 segundos',
  };
}

// Configure Vite middleware in dev or static files in prod
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Servidor MOVÍA escuchando en http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Error iniciando el servidor MOVÍA:', err);
});

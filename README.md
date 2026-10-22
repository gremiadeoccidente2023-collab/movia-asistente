# MOVÍA — Asistente de Gestión Documental y Comunicación Vial

Prototipo funcional desarrollado para el Diplomado en Generative AI para la
Gestión Empresarial, asignatura Aplicaciones de Negocio y Gestión de Riesgos.
Asturias Corporación Universitaria, 2026.

## Qué hace

Herramienta interna de apoyo a la proyección de respuestas a peticiones
ciudadanas en una Secretaría de Movilidad municipal. Cuenta con cuatro módulos:

- **Proyección de respuestas.** Clasifica la petición, identifica el término
  legal y el fundamento normativo, y devuelve el borrador del acto
  administrativo con su estructura completa.
- **Auditoría de borradores.** Verifica siete puntos de control de forma sobre
  un borrador existente.
- **Campañas de seguridad vial.** Genera piezas de comunicación por público
  objetivo.
- **Tablero de cartera.** Indicadores de cumplimiento de términos sobre un
  conjunto de prueba.

## Marco normativo

Ley 1755 de 2015 · Ley 769 de 2002, modificada por el artículo 206 del Decreto
Ley 019 de 2012 · Ley 1437 de 2011 · Ley 1581 de 2012.

## Advertencias

- Lo que produce son **borradores**. Requieren revisión jurídica y firma del
  funcionario competente. La herramienta no decide ni sustituye el criterio
  de quien tiene la competencia.
- No se deben ingresar datos personales. La aplicación incorpora un detector
  que bloquea el envío al identificar cédulas, placas o correos, pero no
  detecta nombres propios: esos los reemplaza el funcionario.
- El repositorio no contiene datos de peticiones reales. El conjunto del
  tablero es sintético.
- La entidad aparece como `[MUNICIPIO]` de forma deliberada.

## Cómo ejecutarlo

1. `npm install`
2. Crear un archivo `.env` a partir de `.env.example` y poner una clave propia
   de la API de Gemini
3. `npm run dev`

## Tecnología

Construido con Google AI Studio. TypeScript, Vite y la API de Gemini.

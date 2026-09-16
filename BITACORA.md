<div align="center">

# 📘 Bitácora de Desarrollo — EcoTrack AI

Esta bitácora documenta el proceso de desarrollo de **EcoTrack AI**, un MVP construido mediante un enfoque de **Vibe Coding**.

El objetivo de esta documentación es evidenciar cómo se utilizaron prompts iterativos, validación crítica, debugging asistido por IA, restricciones explícitas y refinamientos incrementales para construir una aplicación funcional sin depender de un desarrollo manual tradicional.

</div>

**La bitácora registra:**

- Objetivo de cada iteración
- Prompt utilizado
- Resultado obtenido
- Problemas encontrados
- Decisiones tomadas
- Aprendizaje generado
- Evolución técnica del MVP

---

## 📑 Tabla de contenido

<details>
<summary>Ver todas las secciones</summary>

1. [Contexto del proyecto](#1-contexto-del-proyecto)
2. [Enfoque de Vibe Coding utilizado](#2-enfoque-de-vibe-coding-utilizado)
3. [Master Prompt v1 — Estructura inicial del MVP](#3-master-prompt-v1--estructura-inicial-del-mvp)
4. [Iteración 2 — Refinamiento visual](#4-iteración-2--refinamiento-visual)
5. [Iteración 3 — Lógica de análisis simulada](#5-iteración-3--lógica-de-análisis-simulada)
6. [Iteración 4 — Validación crítica y Check-and-Balance](#6-iteración-4--validación-crítica-y-check-and-balance)
7. [Iteración 5 — Corrección de errores críticos](#7-iteración-5--corrección-de-errores-críticos)
8. [Iteración 6 — Feedback específico de ambigüedades](#8-iteración-6--feedback-específico-de-ambigüedades)
9. [Evolución de las pruebas](#9-evolución-de-las-pruebas)
10. [Principales casos de prueba](#10-principales-casos-de-prueba)
11. [Estrategia de control de cambios](#11-estrategia-de-control-de-cambios)
12. [Uso de restricciones negativas](#12-uso-de-restricciones-negativas)
13. [Check-and-Balance](#13-check-and-balance)
14. [Feedback Loop aplicado](#14-feedback-loop-aplicado)
15. [Funcionalidad de IA simulada](#15-funcionalidad-de-ia-simulada)
16. [Limitaciones actuales](#16-limitaciones-actuales)
17. [Aprendizajes principales](#17-aprendizajes-principales)
18. [¿Cómo aceleró Vibe Coding el desarrollo?](#18-cómo-aceleró-vibe-coding-el-desarrollo)
19. [Reflexión final](#19-reflexión-final)
20. [Resumen de prompts](#20-resumen-de-prompts)

</details>

---

## 1. Contexto del proyecto

EcoTrack AI es un MVP orientado a pequeños negocios que desean obtener una primera aproximación a su huella de carbono sin llenar formularios complejos.

El usuario puede describir en lenguaje natural actividades como:

> "Hoy usamos 5 camionetas de reparto y consumimos 200 kWh de electricidad."

El sistema interpreta esa descripción, identifica categorías, extrae cantidades, genera una estimación demostrativa y presenta recomendaciones.

**Para este proyecto se utilizó:**

- Visual Studio Code
- React
- Vite
- JavaScript
- CSS
- ESLint
- Node Test Runner
- Git
- GitHub
- ChatGPT como asistente de IA

---

## 2. Enfoque de Vibe Coding utilizado

El proyecto se desarrolló siguiendo un ciclo iterativo:

```text
Definir intención
      ↓
Generar
      ↓
Ejecutar
      ↓
Observar
      ↓
Dar feedback
      ↓
Analizar errores
      ↓
Corregir de forma localizada
      ↓
Validar
      ↓
Consolidar
```

Durante el proceso se aplicaron principios vistos en el curso:

- Prompting iterativo
- Modularidad
- Referencia por bloques
- Negative constraints
- Cambios pequeños
- Validación crítica
- Check-and-Balance
- Debugging asistido por IA
- Refinamiento incremental
- Feedback específico
- Separación entre lógica y presentación

---

## 3. Master Prompt v1 — Estructura inicial del MVP

### 🎯 Objetivo

Definir desde el inicio:

- Propósito del producto
- Usuario objetivo
- Flujo funcional
- Identidad visual
- Restricciones de trabajo
- Arquitectura básica del MVP

La intención era evitar que la IA intentara construir toda la aplicación de una sola vez.

### 💬 Prompt utilizado

> Actúa como un desarrollador frontend senior especializado en React y en aplicaciones web asistidas por IA.
>
> Estamos construyendo un MVP llamado EcoTrack AI, orientado a pequeños negocios que quieren obtener una estimación simplificada de su huella de carbono sin llenar formularios complejos.
>
> El usuario debe poder describir en lenguaje natural las actividades diarias de su negocio, por ejemplo: "Hoy usamos 5 camionetas de reparto y consumimos 200 kWh de electricidad".
>
> El flujo principal de la aplicación será:
> 1. El usuario escribe una descripción de sus actividades.
> 2. La aplicación analiza el texto.
> 3. Se identifican actividades, cantidades y categorías relevantes.
> 4. Se muestra una estimación simplificada del impacto y recomendaciones.
>
> La aplicación debe sentirse:
> - Simple
> - Moderna
> - Confiable
> - Sostenible
> - Fácil de entender para usuarios no técnicos
>
> El diseño debe ser minimalista, con tonos verdes suaves, fondo claro, buena jerarquía visual, tarjetas limpias y suficiente espacio entre elementos.
>
> Estamos trabajando con React + Vite.
>
> Reglas de trabajo:
> - Trabaja de manera modular.
> - Realiza cambios pequeños e incrementales.
> - No modifiques componentes que ya funcionen si no es necesario.
> - No agregues librerías externas sin explicarlo primero.
> - No elimines lógica existente sin autorización.
> - Cuando realices un cambio, indica brevemente qué archivos modificarás.
> - Si detectas una ambigüedad, pregunta antes de asumir.
>
> Para esta primera iteración, crea únicamente la estructura visual principal del MVP. No implementes todavía la lógica de análisis con IA.

### ✅ Resultado obtenido

La IA implementó la estructura visual inicial del MVP con:

- Diseño adaptable a móviles
- Tonos verdes
- Tarjetas limpias
- Entrada de actividades
- Contador de caracteres
- Panel de impacto vacío
- Sección de recomendaciones
- Componentes modulares
- Análisis todavía deshabilitado
- Sin lógica de IA

También conservó la demo original en:

```
src/demo/
```

La compilación y ESLint quedaron correctos.

### 🧭 Decisión tomada

Se decidió no implementar todavía la lógica de análisis. La prioridad fue crear primero una base visual estable.

### 💡 Aprendizaje

Esta primera iteración permitió aplicar el principio de modularidad y evitar pedir a la IA una aplicación completa desde el primer prompt.

El alcance limitado redujo el riesgo de generar cambios innecesarios.

---

## 4. Iteración 2 — Refinamiento visual

### 🎯 Objetivo

Mejorar la apariencia de la aplicación sin modificar lógica ni estructura funcional.

La interfaz inicial funcionaba, pero se quería:

- Mayor jerarquía visual
- Tipografía más moderna
- Colores más atractivos
- Mejor uso del espacio
- Diseño más elegante y profesional

### 💬 Prompt utilizado

> Mantén intacta toda la estructura funcional actual de EcoTrack AI. No cambies la lógica, no agregues nuevas funcionalidades y no modifiques el comportamiento de los componentes.
>
> Quiero mejorar únicamente la apariencia visual para que el MVP se vea más moderno, atractivo y profesional, conservando un estilo elegante y relacionado con sostenibilidad.
>
> Realiza estos ajustes:
> 1. Aumenta ligeramente el tamaño de las tipografías para mejorar la legibilidad.
> 2. Usa una fuente moderna, limpia y profesional.
> 3. Mejora la jerarquía visual entre títulos, subtítulos, etiquetas y textos secundarios.
> 4. Añade un poco más de color sin perder el estilo sobrio: utiliza verdes más vivos combinados con tonos neutros y acentos suaves.
> 5. Mejora los espacios internos y externos entre secciones, tarjetas y bloques para que la interfaz respire mejor.
> 6. Haz que las tarjetas se vean más modernas mediante sombras suaves, bordes sutiles y mejor profundidad visual.
> 7. Refina el botón principal para que tenga mayor presencia visual y se perciba como la acción principal.
> 8. Mejora visualmente el área de entrada de texto para que invite más a escribir.
> 9. Mantén el diseño elegante, limpio, minimalista y profesional; evita colores demasiado saturados o elementos infantiles.
> 10. Conserva el diseño responsive.
>
> Importante:
> - No elimines ningún contenido existente.
> - No modifiques la estructura funcional.
> - No agregues librerías externas sin consultarlo.
> - No cambies nombres de componentes ni lógica existente.
> - Limita los cambios a estilos, tipografía, espaciado y presentación visual.
>
> Antes de modificar, indica brevemente qué archivos de estilos o componentes visuales vas a ajustar.

### ✅ Resultado obtenido

La IA modificó únicamente:

- `src/index.css`
- `src/App.css`

**Cambios realizados:**

- Tipografía más legible
- Mejor jerarquía
- Verdes más vivos
- Acentos suaves
- Mayor espaciado
- Más profundidad visual
- Sombras
- Campo de texto más amplio
- Botón principal más destacado

**Se conservaron:**

- Componentes
- Contenido
- Lógica
- Responsive
- Dependencias

Compilación y ESLint quedaron correctos.

### 🧭 Decisión tomada

Se mantuvo la estructura de la aplicación y se evitó tocar lógica.

### 💡 Aprendizaje

Esta iteración aplicó el principio de precisión quirúrgica.

La IA recibió una restricción explícita de modificar únicamente estilos, evitando que un cambio visual afectara funcionalidades existentes.

---

## 5. Iteración 3 — Lógica de análisis simulada

### 🎯 Objetivo

Convertir la interfaz visual en un flujo funcional completo.

Se decidió implementar primero una simulación local de IA, en lugar de conectar inmediatamente una API externa.

**Justificación**

El enunciado permitía que la funcionalidad de IA fuera:

- Real
- Simulada

La simulación permitió:

- Validar el flujo completo
- Evitar exponer claves
- Evitar dependencias externas
- Reducir complejidad
- Preparar una arquitectura reemplazable por una futura API real

### 💬 Prompt utilizado

> Trabaja sobre el estado actual de EcoTrack AI sin modificar el diseño visual existente.
>
> Objetivo de esta iteración:
> Implementar la lógica básica de análisis de actividades de forma simulada para que el MVP ya tenga un flujo funcional completo, manteniendo preparada la arquitectura para reemplazar esta simulación por una API de IA real más adelante.
>
> Requisitos:
> 1. Cuando el usuario escriba una descripción de sus actividades y presione "Estimar mi impacto", analiza el texto mediante una función local simulada.
> 2. Detecta, cuando sea posible, categorías como: energía, transporte, residuos.
> 3. Extrae cantidades simples cuando aparezcan en el texto, por ejemplo: kWh, número de vehículos, kg de residuos.
> 4. Devuelve siempre una estructura consistente con estos campos: actividadesDetectadas, categorias, impactoEstimado, unidadImpacto, recomendaciones.
> 5. Usa valores aproximados y claramente identificados como estimaciones simplificadas para fines demostrativos.
> 6. Muestra el resultado en los componentes visuales que ya existen.
> 7. Habilita el botón "Estimar mi impacto" únicamente cuando haya texto suficiente para analizar.
> 8. Incluye un estado de carga breve para simular el procesamiento.
> 9. Si el texto no contiene información suficiente, muestra un mensaje claro pidiendo más detalle.
> 10. Mantén la lógica de análisis separada de los componentes visuales, preferiblemente en un archivo como src/utils/analyzeActivity.js o equivalente.
>
> Restricciones:
> - No cambies el diseño ni los estilos actuales.
> - No agregues nuevas dependencias.
> - No elimines contenido existente.
> - No modifiques componentes que no sean necesarios.
> - No uses todavía ninguna API externa ni claves.
> - Antes de modificar, indica brevemente qué archivos vas a crear o editar.
> - Mantén la compilación y ESLint sin errores.

### ✅ Resultado obtenido

Se implementó el flujo completo mediante una función local simulada.

El sistema logró:

- Detectar energía
- Detectar transporte
- Detectar residuos
- Extraer cantidades
- Generar recomendaciones
- Calcular estimaciones demostrativas
- Mostrar carga
- Solicitar más información cuando faltaban datos
- Mostrar resultados parciales

La lógica quedó separada en:

```
src/utils/analyzeActivity.js
```

**Casos probados:**

| Caso | Entrada | Resultado |
|---|---|---|
| 1 | "Hoy usamos 5 camionetas de reparto y consumimos 200 kWh de electricidad." | Energía, transporte, 200 kWh, 5 vehículos, estimación de 90 kg de CO₂e, recomendaciones |
| 2 | "Generamos 30 kg de residuos y usamos 120 kWh de energía." | Energía, residuos, 120 kWh, 30 kg de residuos, estimación de 39 kg de CO₂e |
| 3 | "Hoy trabajamos normalmente." | *Faltan detalles* — el sistema pidió cantidades y unidades adicionales |

**Pruebas:**

Se obtuvieron **15 pruebas aprobadas**. Además: compilación correcta; ESLint correcto.

### 🧭 Decisión tomada

Se conservó el análisis como simulación local y se dejó preparado el contrato para una futura API.

### 💡 Aprendizaje

El flujo demostró que una funcionalidad de IA simulada puede utilizarse para validar:

- Experiencia
- Arquitectura
- Estados
- Contrato de datos

antes de introducir complejidad adicional.

---

## 6. Iteración 4 — Validación crítica y Check-and-Balance

### 🎯 Objetivo

Evaluar críticamente la solución antes de continuar agregando funcionalidades.

En lugar de pedir directamente:

> "Corrige el código."

se pidió primero:

> analizar la solución sin modificar archivos.

Esto aplicó la técnica de Check-and-Balance vista en el curso.

### 💬 Prompt utilizado

> Revisa críticamente la implementación actual de EcoTrack AI antes de hacer cualquier cambio.
>
> Importante: NO escribas ni modifiques código todavía.
>
> Quiero que analices específicamente la lógica de src/utils/analyzeActivity.js, su integración con ActivityInput e ImpactPreview, y las pruebas existentes.
>
> Evalúa:
> 1. Posibles errores lógicos o casos de borde no cubiertos.
> 2. Riesgos de resultados incorrectos o engañosos en la extracción de cantidades.
> 3. Si el contrato de salida está bien preparado para reemplazar la simulación por una API real en el futuro.
> 4. Si hay acoplamiento innecesario entre la lógica de análisis y la interfaz.
> 5. Si los estados de carga, error, resultado parcial y falta de información se manejan correctamente.
> 6. Si las validaciones actuales pueden rechazar entradas válidas o aceptar entradas problemáticas.
> 7. Si hay algún problema de accesibilidad, mantenibilidad o claridad técnica relacionado con esta funcionalidad.
> 8. Si las 15 pruebas actuales dejan algún escenario importante sin cubrir.
>
> Entrega únicamente un diagnóstico priorizado con:
> - Problema detectado
> - Por qué puede ocurrir
> - Impacto
> - Recomendación de corrección
>
> No implementes soluciones todavía. No cambies archivos. No agregues dependencias.

### ✅ Resultado obtenido

Las 15 pruebas seguían pasando, pero la IA detectó **10 áreas de mejora**.

Los problemas de mayor prioridad fueron:

**1. Extracción incorrecta de números**

| Entrada | Interpretación incorrecta |
|---|---|
| `1 000 kWh` | 0 kWh |
| `−200 kWh` | 200 kWh |
| `1/2 camionetas` | 2 vehículos |

**2. Falta de comprensión de contexto**

- Ejemplo: "No usamos 5 camionetas." podía producir: "50 kg de CO₂e"
- Otro caso: "Ahorramos 200 kWh." podía tratarse como consumo.

**3. Doble conteo**

Entrada: "Consumimos 200 kWh en total: 150 kWh en equipos y 50 kWh en iluminación." podía sumar 200 + 150 + 50, generando una estimación incorrecta.

**4. Resultados parciales poco claros**

Algunas entradas podían omitir actividades pendientes y presentar la estimación como si fuera completa.

**Otros puntos detectados**

También se encontraron mejoras relacionadas con:

- Residuos
- Formatos numéricos
- Período de cálculo
- Validación
- Contrato para futura API
- Manejo de errores
- Pruebas integradas
- Accesibilidad

### 🧭 Decisión tomada

No se intentó corregir los 10 puntos al mismo tiempo. Se priorizaron únicamente los errores capaces de producir resultados engañosos.

### 💡 Aprendizaje

Esta iteración fue una de las más importantes del proyecto.

Aunque 15 pruebas pasaban, la solución todavía contenía errores relevantes.

Esto demostró que:

> Tener pruebas aprobadas no significa que todos los casos importantes estén cubiertos.

También evidenció el valor de pedir a la IA que analice antes de corregir.

---

## 7. Iteración 5 — Corrección de errores críticos

### 🎯 Objetivo

Corregir únicamente los errores críticos identificados durante el diagnóstico.

### 💬 Prompt utilizado

> Corrige únicamente los problemas críticos detectados en el diagnóstico anterior relacionados con la interpretación de cantidades y resultados engañosos.
>
> En esta iteración quiero resolver solo estos puntos:
> 1. Evitar que se extraigan fragmentos de números inválidos o ambiguos, por ejemplo:
>    - 1 000 kWh no debe interpretarse como 0 kWh.
>    - −200 kWh o - 200 kWh no deben interpretarse como 200 kWh.
>    - 1/2 camionetas no debe interpretarse como 2 vehículos.
> 2. Evitar estimaciones cuando el contexto contradice o hace insegura la interpretación, por ejemplo:
>    - No usamos 5 camionetas.
>    - Ahorramos 200 kWh.
>    - frases donde aparezca un total junto con un desglose que pueda producir doble conteo.
> 3. Si existe información ambigua o parcial dentro de una categoría, no presentes el resultado como una estimación completa. Devuelve una advertencia estructurada o un estado parcial que pueda mostrarse en la interfaz.
>
> Requisitos:
> - Modifica únicamente la lógica de análisis y las pruebas necesarias.
> - No cambies el diseño visual.
> - No agregues dependencias.
> - Conserva el contrato actual siempre que sea posible.
> - Añade pruebas de regresión específicas para cada uno de los casos anteriores.
> - Antes de modificar, indica qué funciones o archivos vas a cambiar.
> - Al finalizar, informa cuántas pruebas pasan y cuáles nuevos casos quedaron cubiertos.
>
> No intentes resolver todavía todos los demás puntos del diagnóstico.

### ✅ Resultado obtenido

La IA modificó únicamente `analyzeActivity.js` y sus pruebas.

**Se corrigió:**

- Extracción de números fragmentados
- Signos negativos separados
- Signos negativos Unicode
- Fracciones
- Rangos ambiguos
- Negaciones
- Ahorros
- Posibles duplicaciones entre total y desglose

También se conservaron actividades pendientes mediante:

```js
advertencia: {
  codigo,
  mensaje
}
```

y cantidades: `null`

Esto permitió diferenciar resultados completos y parciales.

**Evolución de pruebas:**

| Momento | Pruebas aprobadas |
|---|---|
| Antes | 15 |
| Después | 41 |

Distribución: 15 pruebas existentes + 26 pruebas de regresión nuevas.

También: compilación correcta; ESLint correcto; estilos intactos; componentes intactos; sin nuevas dependencias.

**Pruebas manuales posteriores** — se probaron entradas como:

| Caso | Entrada |
|---|---|
| Negación | "No usamos 5 camionetas de reparto hoy." |
| Ahorro | "Ahorramos 200 kWh de electricidad este mes." |
| Total + desglose | "Consumimos 200 kWh en total: 150 kWh en equipos y 50 kWh en iluminación." |
| Fracción | "Usamos 1/2 camionetas para reparto." |

La lógica dejó de producir estimaciones engañosas.

**Nuevo problema detectado**

La lógica ya era correcta, pero la interfaz seguía mostrando mensajes demasiado genéricos como "Faltan detalles" o "cantidad pendiente". Esto generó una nueva iteración.

### 💡 Aprendizaje

Una corrección técnica puede ser correcta pero todavía generar una mala experiencia de usuario.

El feedback loop permitió detectar un nuevo problema después de validar manualmente el cambio.

---

## 8. Iteración 6 — Feedback específico de ambigüedades

### 🎯 Objetivo

Mejorar únicamente la forma en que la interfaz comunica las ambigüedades detectadas por el analizador.

La lógica de análisis ya funcionaba correctamente y no debía modificarse.

### 💬 Prompt utilizado

> Trabaja sobre el estado actual de EcoTrack AI.
>
> Las correcciones de análisis implementadas en la iteración anterior funcionan correctamente y no deben modificarse.
>
> Durante las pruebas manuales observé que, cuando el analizador rechaza una cantidad ambigua, la interfaz muestra únicamente mensajes genéricos como "Faltan detalles" o "cantidad pendiente", aunque analyzeActivity.js ya devuelve una advertencia con codigo y mensaje.
>
> Quiero mejorar únicamente la presentación de ese feedback.
>
> Requisitos:
> 1. Cuando una actividad tenga una advertencia, muestra al usuario su mensaje de forma clara dentro del panel de resultados.
> 2. Utiliza mensajes comprensibles para explicar casos como:
>    - una negación (No usamos 5 camionetas);
>    - un ahorro (Ahorramos 200 kWh);
>    - una cantidad ambigua (1/2 camionetas);
>    - un posible doble conteo entre un total y su desglose.
> 3. Evita mostrar varias líneas idénticas como Consumo eléctrico: cantidad pendiente cuando todas pertenecen a una misma ambigüedad. Agrupa o simplifica visualmente esa información.
> 4. Mantén la categoría detectada para que el usuario entienda qué información necesita aclarar.
> 5. No realices ninguna estimación cuando el analizador ya haya marcado la información como ambigua.
>
> Restricciones:
> - No modifiques las reglas de análisis de analyzeActivity.js, salvo que sea estrictamente necesario para exponer información que ya existe.
> - No cambies el diseño general de la aplicación.
> - No agregues dependencias.
> - Limita los cambios al componente encargado de presentar resultados y, si fuera necesario, a pruebas relacionadas con esa presentación.
> - Conserva los estilos actuales.
>
> Antes de modificar, indica qué archivo o archivos vas a tocar y por qué.
>
> Al finalizar, verifica compilación, ESLint y las pruebas existentes.

### ✅ Resultado obtenido

Se actualizó `ImpactPreview.jsx` para:

- Mostrar advertencias junto a su categoría
- Agrupar avisos idénticos
- Evitar líneas repetidas de "cantidad pendiente"
- Explicar qué necesita aclaración
- Explicar qué información queda excluida de resultados parciales

**Se mantuvieron intactos:**

- Analizador
- Estilos
- Dependencias

**Evolución de pruebas:**

Se añadieron **10 pruebas de presentación**.

Resultado final: **51 pruebas aprobadas** (41 pruebas anteriores + 10 pruebas nuevas).

También: compilación correcta; ESLint correcto.

**Resultado visual**

En lugar de mostrar únicamente "Faltan detalles", la interfaz pasó a mostrar "Requiere aclaración" y mensajes más específicos sobre:

- Negaciones
- Ahorros
- Cantidades ambiguas
- Posibles dobles conteos

### 💡 Aprendizaje

Esta iteración mostró que Vibe Coding no termina cuando la lógica funciona.

También es necesario validar:

- Claridad
- Comunicación
- Experiencia del usuario
- Coherencia del feedback

---

## 9. Evolución de las pruebas

La cobertura técnica aumentó progresivamente.

| Iteración | Pruebas aprobadas | Se agregaron |
|---|---|---|
| 3 | 15 | — |
| 5 | 41 | 26 pruebas de regresión |
| 6 | 51 | 10 pruebas de presentación |

**Estado final:**

✅ 51 pruebas aprobadas
✅ ESLint correcto
✅ Build correcto

---

## 10. Principales casos de prueba

Durante el desarrollo se probaron casos como:

- "Hoy usamos 5 camionetas de reparto y consumimos 200 kWh de electricidad."
- "Generamos 30 kg de residuos y usamos 120 kWh de energía."
- "Hoy trabajamos normalmente."
- "No usamos 5 camionetas de reparto hoy."
- "Ahorramos 200 kWh de electricidad este mes."
- "Consumimos 200 kWh en total: 150 kWh en equipos y 50 kWh en iluminación."
- "Usamos 1/2 camionetas para reparto."
- "Consumimos 100 kWh y además usamos electricidad adicional que no medimos."

**También se cubrieron:**

- Números decimales
- Formato español
- Negativos
- Fracciones
- Cero explícito
- Entradas irrelevantes
- Números mal formados
- Resultados parciales

---

## 11. Estrategia de control de cambios

Durante todo el desarrollo se mantuvo una regla:

> No modificar más de lo necesario.

**Ejemplos:**

| Iteración | Archivos modificados |
|---|---|
| Refinamiento visual | `src/index.css`, `src/App.css` |
| Análisis | Principalmente `src/utils/analyzeActivity.js` |
| Feedback | `ImpactPreview.jsx` |

Esta estrategia permitió reducir el riesgo de romper funcionalidades existentes.

---

## 12. Uso de restricciones negativas

Los prompts incluyeron instrucciones explícitas como:

- No cambies el diseño.
- No agregues dependencias.
- No modifiques componentes que no sean necesarios.
- No escribas código todavía.
- No intentes resolver todos los problemas al mismo tiempo.

Estas restricciones fueron importantes para limitar el radio de acción de la IA.

---

## 13. Check-and-Balance

Uno de los conceptos más importantes aplicados durante el proyecto fue:

> Pedir análisis antes de pedir corrección.

El prompt de validación crítica permitió descubrir problemas que no habían sido detectados por las primeras pruebas.

Esto evitó entrar en un ciclo de:

```text
error → cambio inmediato → nuevo error → nuevo cambio
```

En su lugar se siguió:

```text
problema → diagnóstico → priorización → corrección localizada → validación
```

---

## 14. Feedback Loop aplicado

El proyecto demuestra un ciclo real de retroalimentación.

**Ejemplo:**

```text
Análisis simulado
      ↓
15 pruebas aprobadas
      ↓
Validación crítica
      ↓
Se descubren errores
      ↓
Corrección
      ↓
41 pruebas
      ↓
Prueba manual
      ↓
Se detecta problema de UX
      ↓
Refinamiento visual del feedback
      ↓
51 pruebas
```

Esto representa directamente el concepto de Feedback Loop visto durante el curso.

---

## 15. Funcionalidad de IA simulada

El MVP utiliza una simulación local. No se utilizó una API externa real.

La función `analyzeActivity()` recibe texto y devuelve:

```js
{
  actividadesDetectadas,
  categorias,
  impactoEstimado,
  unidadImpacto,
  recomendaciones
}
```

La arquitectura permite reemplazar esta implementación en el futuro por:

```text
Frontend
   ↓
API
   ↓
Modelo de IA
   ↓
Respuesta estructurada
```

sin reconstruir la interfaz.

---

## 16. Limitaciones actuales

La aplicación:

- No realiza una medición ambiental certificada
- Utiliza factores ficticios
- Trabaja con categorías limitadas
- Utiliza análisis basado en reglas
- No guarda historial
- No incluye autenticación
- No utiliza una API real de IA

Estas limitaciones fueron aceptadas conscientemente porque el objetivo era validar el MVP y demostrar el proceso de Vibe Coding.

---

## 17. Aprendizajes principales

**1. La IA necesita límites**

Los mejores resultados se obtuvieron cuando los prompts indicaban claramente:

- Qué modificar
- Qué no modificar
- Qué archivos tocar
- Qué resultado esperar

**2. Más código no significa mejor solución**

Las iteraciones más efectivas fueron pequeñas y localizadas.

**3. Las pruebas no sustituyen el pensamiento crítico**

Las primeras 15 pruebas aprobaban, pero todavía existían errores importantes.

**4. Analizar antes de corregir mejora el resultado**

La etapa de Check-and-Balance permitió comprender primero el problema.

**5. El usuario también forma parte de la validación**

Después de corregir la lógica fue necesario mejorar cómo se comunicaban los errores.

---

## 18. ¿Cómo aceleró Vibe Coding el desarrollo?

La IA permitió acelerar tareas como:

- Generación de componentes
- Refinamiento visual
- Implementación de lógica
- Creación de pruebas
- Diagnóstico
- Correcciones
- Documentación

Sin embargo, el desarrollador mantuvo el control de:

- Arquitectura
- Prioridades
- Aceptación
- Alcance
- Validación

El proceso pasó de:

> escribir todo manualmente

a:

```text
definir → dirigir → revisar → refinar → validar
```

---

## 19. Reflexión final

El desarrollo de EcoTrack AI permitió comprender que Vibe Coding no consiste simplemente en pedirle código a una IA.

El verdadero valor está en saber:

- Describir correctamente el problema
- Limitar el alcance
- Detectar desviaciones
- Evaluar resultados
- Decidir cuándo detener una iteración
- Corregir únicamente lo necesario
- Validar de forma constante

Uno de los momentos más importantes ocurrió cuando el sistema tenía 15 pruebas aprobadas, pero un análisis crítico descubrió problemas capaces de generar resultados incorrectos.

Esto demostró que:

> La IA puede acelerar la implementación, pero no reemplaza la responsabilidad del desarrollador de validar la calidad del producto.

El resultado final fue un MVP funcional con **51 pruebas aprobadas**, construido mediante seis iteraciones controladas y documentadas.

---

## 20. Resumen de prompts

| Prompt | Objetivo |
|---|---|
| Master Prompt v1 | Definir visión, arquitectura, estilo y restricciones |
| Iteración 2 | Refinar únicamente la apariencia |
| Iteración 3 | Implementar análisis simulado |
| Iteración 4 | Analizar errores sin modificar código |
| Iteración 5 | Corregir únicamente errores críticos |
| Iteración 6 | Mejorar el feedback de ambigüedades |

---
name: prompt-agent-orchestrator
description: >-
  Utiliza esta skill para diseñar flujos de agentes autónomos avanzados (LangGraph, CrewAI, AutoGen), orquestar cadenas de razonamiento (Chain-of-Thought, ReAct), estructurar system prompts de alta fidelidad, validación de salidas estructuradas (JSON Schema con Zod/Pydantic) y bucles de autocorrección.
---

# Skill: Especialista en Orquestación de Agentes de IA & Prompt Engineering

Esta habilidad proporciona las técnicas más avanzadas de la industria para construir agentes autónomos fiables que completen tareas complejas sin desviarse ni alucinar.

---

## 🧠 1. Patrón ReAct (Reasoning + Acting)

El agente debe alternar entre razonamiento explícito y ejecución de herramientas:

```text
Pensamiento: El usuario necesita generar un carnet para el colaborador con ID 'colab-1'. Primero debo verificar si el colaborador existe y está activo.
Acción: get_colaborador({ id: "colab-1" })
Observación: { id: "colab-1", estado: "ACTIVO", nombre: "Carlos Gómez" }
Pensamiento: El colaborador está activo. Ahora debo verificar la cuota disponible de la empresa.
Acción: check_quota({ empresaId: "empresa-123" })
Observación: { carnetsDisponibles: 45, maximoPlan: 100 }
Pensamiento: Hay cuota suficiente. Procedo a emitir el carnet con la plantilla por defecto.
Acción: emitir_carnet({ colaboradorId: "colab-1", plantillaId: "default" })
Observación: { carnetId: "carnet-99", pdfUrl: "https://..." }
Pensamiento: El proceso finalizó con éxito. Informo al usuario.
Respuesta Final: El carnet de Carlos Gómez ha sido emitido exitosamente. Puedes descargarlo aquí: ...
```

---

## 🎯 2. Estructura de System Prompts de Alta Precisión

Un system prompt de grado de producción debe contener:
1. **Identidad & Rol:** Rol experto con restricciones de dominio claras.
2. **Contexto Operativo:** Variables de entorno, formato de fecha, directrices de empresa.
3. **Herramientas Disponibles & Criterios de Selección:** Cuándo invocar qué herramienta y cuándo responder directamente.
4. **Restricciones Negativas ("Never Do"):** Lo que el modelo tiene estrictamente prohibido hacer (ej. nunca inventar IDs, nunca borrar sin confirmación).
5. **Formato de Salida Obligatorio:** Schema JSON estricto o Markdown estructurado.

---

## 🔄 3. Bucle de Autocorrección (Self-Correction Loop)

Si un modelo produce una salida inválida o falla en un paso:
1. **Captura del Error:** Interceptar la excepción o el fallo de validación de esquema (Zod/Pydantic).
2. **Re-inyección Focalizada:** Enviar al modelo un mensaje del sistema que contenga el JSON devuelto + el error de validación exacto:
   *"Tu salida falló la validación: el campo 'email' es obligatorio. Corrige tu JSON y devuélvelo de nuevo."*
3. **Límite de Reintentos:** Establecer un máximo de 3 reintentos antes de escalar al usuario o fallback seguro.

---
name: sre-disaster-recovery
description: >-
  Utiliza esta skill para implementar observabilidad y monitoreo (Sentry, Prometheus, OpenTelemetry), definir objetivos de confiabilidad (SLI, SLO, SLA), diseñar planes de recuperación ante desastres (RTO, RPO), gestión de incidentes y redacción de análisis Post-Mortem sin culpa.
---

# Skill: Especialista en Confiabilidad de Sistemas (SRE) & Disaster Recovery

Esta habilidad establece las prácticas de ingeniería para asegurar que el sistema sea resistente a fallos, monitoreable en tiempo real y capaz de recuperarse rápidamente ante catástrofes.

---

## 📊 1. Jerarquía de Métricas de Confiabilidad

* **SLI (Service Level Indicator):** La métrica técnica real que se mide (ej. *"latencia del endpoint de validación de carnet"* o *"tasa de respuestas exitosas 2xx"*).
* **SLO (Service Level Objective):** El objetivo interno que el equipo se compromete a alcanzar (ej. *"el 99.5% de las validaciones de carnet deben completarse en menos de 200ms en una ventana móvil de 30 días"*).
* **SLA (Service Level Agreement):** El acuerdo contractual con los clientes con penalizaciones económicas si se incumple (ej. *"disponibilidad mínima del servicio del 99.0% mensual"*).
* **Error Budget (Presupuesto de Error):** $100\% - \text{SLO}$. Si se agota el presupuesto en un mes, se congelan nuevos despliegues de features y todo el equipo se dedica exclusivamente a estabilidad y bugs.

---

## 🔍 2. Observabilidad: Los Tres Pilares

1. **Logs Estructurados:** Formato JSON con campos uniformes (`timestamp`, `level`, `trace_id`, `user_id`, `message`, `context`).
2. **Métricas en Tiempo Real:** Contadores, gauges e histogramas expuestos para Prometheus o Datadog.
3. **Trazas Distribuidas (Distributed Tracing):** Propagación de `X-Correlation-ID` o cabeceras W3C `traceparent` desde el frontend hasta la base de datos para rastrear una petición en microservicios.

---

## 📋 3. Plantilla de Post-Mortem sin Culpa (Blameless Post-Mortem)

```markdown
# Reporte Post-Mortem del Incidente [INC-2026-09]

## 📅 Resumen del Incidente
* **Fecha y Hora de Inicio:** 26/09/2026 03:15 UTC
* **Fecha y Hora de Resolución:** 26/09/2026 03:48 UTC
* **Duración Total:** 33 minutos
* **Impacto:** 12% de los usuarios no pudieron emitir carnets en PDF; los errores arrojaban HTTP 504.

## 🎯 Causa Raíz (Root Cause)
Agotamiento de descriptores de archivos en el worker de Puppeteer por no cerrar las páginas tras el renderizado de PDFs con alto volumen simultáneo.

## ⏱️ Línea de Tiempo de Eventos
* **03:15:** La alerta de Sentry dispara spike de errores 504.
* **03:22:** El ingeniero de guardia es notificado y escala el incidente.
* **03:35:** Se reinician los contenedores de generación de PDF.
* **03:48:** Se despliega el hotfix que fuerza `browser.close()` dentro del bloque `finally`.

## 🛠️ Acciones Preventivas (Action Items)
- [ ] Implementar timeout forzado de 5 segundos en cada instancia de Chromium.
- [ ] Configurar alerta temprana en Prometheus cuando el consumo de descriptores supere el 75%.
- [ ] Añadir prueba de estrés de 100 PDFs concurrentes en el pipeline de CI/CD.
```

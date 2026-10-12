---
name: n8n-expert
description: >-
  Utiliza esta skill cuando el usuario requiera diseñar, refactorizar, depurar o documentar flujos de trabajo en n8n, incluyendo nodos de código JavaScript/Python, integración de webhooks, manejo de errores, credenciales y conexión con APIs o bases de datos.
---

# Skill: Especialista en Automatizaciones y Flujos con n8n

Esta habilidad provee la metodología estándar para crear flujos de trabajo automatizados en n8n que sean resilientes, modulares y de grado empresarial.

---

## ⚙️ 1. Arquitectura de Flujos en n8n

### Estructura Recomendada
1. **Trigger / Disparador:**
   * Webhook, Cron/Schedule, Polling o cola de mensajería (RabbitMQ/Kafka).
2. **Validación y Normalización Inicial (Code Node / Set):**
   * Verificar que los datos entrantes contengan las claves requeridas antes de procesar pasos costosos.
3. **Procesamiento de Negocio:**
   * Uso de nodos específicos o Code Nodes con JavaScript limpio.
4. **Manejo de Errores (Error Trigger Workflow):**
   * Configurar siempre un *Error Workflow* vinculado en los settings del flujo principal para capturar excepciones, registrar la traza y enviar alertas (Discord/Slack/Email).

---

## 💻 2. Mejores Prácticas en Nodos de Código (JavaScript en n8n)

* **Trabajar con la estructura de items de n8n:**
  * En n8n versión moderna, acceder a datos con `$('NombreDelNodo').item.json` o `$input.all()`.
* **Procesamiento en Lote (Batching):**
  ```javascript
  // Iteración limpia preservando estructura de n8n
  const items = $input.all();
  
  return items.map(item => {
    const data = item.json;
    return {
      json: {
        id: data.id,
        nombreCompleto: `${data.nombres} ${data.apellidos}`.trim(),
        emailNormalizado: (data.email || '').toLowerCase().trim(),
        procesadoEn: new Date().toISOString()
      }
    };
  });
  ```
* **Comentarios JSDoc en Nodos Complejos:** Explicar el objetivo de la transformación en la cabecera del código.

---

## 🛡️ 3. Resiliencia y Manejo de Rate Limits
* **Retry on Fail:** Habilitar *Retry On Fail* (2 a 3 intentos con backoff exponencial) en llamadas HTTP hacia APIs con límites de cuota o inestabilidad de red.
* **Wait Nodes:** Utilizar nodos *Wait* para respetar políticas de rate limit (ej. no más de 5 peticiones por segundo).
* **Gestión Segura de Credenciales:** Nunca escribir tokens, API keys o contraseñas en duro dentro de nodos *Code* o expresiones; referenciar siempre el gestor de *Credentials* nativo de n8n o variables de entorno `$env.VARIABLE_NAME`.

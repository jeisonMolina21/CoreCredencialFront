---
name: diataxis-documentation-framework
description: >-
  Especialista en el Framework Diátaxis para Documentación Técnica de Software.
  Activa esta skill para estructurar, auditar, redactar o refactorizar portales
  de documentación técnica dividiéndolos rigurosamente en los 4 cuadrantes cognitivos:
  Tutoriales (aprendizaje), Guías Prácticas / How-To (orientadas a problemas),
  Referencia Técnica (orientada a información exacta) y Explicaciones / Arquitectura (orientadas a la comprensión profunda).
---

# 📚 Diátaxis Documentation Framework (Master Specification)

El framework **Diátaxis** (creado por Daniele Procida y adoptado globalmente por organizaciones como Canonical/Ubuntu, Cloudflare, Django, NumPy y Python) es el estándar arquitectónico de facto para resolver la crisis de usabilidad en la documentación de software.

Diátaxis postula que los usuarios abordan la documentación con dos necesidades cognitivas fundamentales:
1. **Acción práctica** (hacer algo en el sistema) vs **Reflexión teórica** (entender cómo funciona).
2. **Fase de adquisición** (están aprendiendo) vs **Fase de aplicación** (están trabajando en producción).

---

## 🧭 La Matriz de los 4 Cuadrantes Cognitivos

```
                    PRÁCTICA (Hacer)            TEORÍA (Comprender)
               +---------------------------+---------------------------+
               |                           |                           |
APRENDIZAJE    |      1. TUTORIALES        |     4. EXPLICACIONES      |
(Principiante) |   (Learning-oriented)     | (Understanding-oriented)  |
               |                           |                           |
               +---------------------------+---------------------------+
               |                           |                           |
TRABAJO /      |    2. GUÍAS HOW-TO        |       3. REFERENCIA       |
APLICACIÓN     |    (Problem-oriented)     |   (Information-oriented)  |
(Profesional)  |                           |                           |
               +---------------------------+---------------------------+
```

---

## 🔬 Desglose Exhaustivo por Cuadrante

### 1. 🎓 Cuadrante 1: Tutoriales (Orientados al Aprendizaje)
* **Objetivo:** Guiar a un principiante absoluto paso a paso para que experimente un primer éxito inmediato y tangible (*"Aha! moment"*).
* **Rol del autor:** Un tutor paciente que lleva de la mano al aprendiz.
* **Tono y estilo:** Alentador, directo, con comandos verificables y resultados inmediatos.
* **Reglas de oro:**
  1. **Cero digresiones teóricas:** No expliques por qué el algoritmo usa SHA-256 o cómo funciona el pool de MySQL. Simplemente dile qué escribir y qué esperar.
  2. **Un solo camino feliz:** No ofrezcas alternativas ("puedes usar npm o yarn o pnpm"). Escoge una sola vía infalible.
  3. **Resultado inmediato:** En menos de 10 minutos, el usuario debe ver algo funcionando (un servidor respondiendo, un carnet generado).
  4. **Secuencia lineal e ininterrumpida:** Paso 1 -> Paso 2 -> Paso 3. Si un paso falla, el tutorial está roto.

#### Estructura Estándar de un Tutorial:
```markdown
# Tutorial: Creando tu primer carnet digital en 5 minutos

## Qué aprenderás
En este tutorial aprenderás a desplegar un servidor local, registrar una organización de prueba y generar tu primera credencial digital con código QR.

## Requisitos previos
- Node.js v20+ instalado en tu máquina.
- Acceso a un terminal de comandos.

## Paso 1. Clonar e inicializar el entorno
Ejecuta el siguiente comando para clonar el repositorio:
\`\`\`bash
git clone https://github.com/empresa/carnet-digital.git
cd carnet-digital
npm install
\`\`\`

## Paso 2. Configurar la base de datos de desarrollo
Copia el archivo de entorno base:
\`\`\`bash
cp .env.example .env
npm run db:seed
\`\`\`

## Paso 3. Iniciar el servicio y emitir tu credencial
Inicia el backend:
\`\`\`bash
npm run dev
\`\`\`
Abre tu navegador en `http://localhost:5173` e inicia sesión con `Admin@admin` y contraseña `password123`.

## Conclusión y próximos pasos
¡Felicitaciones! Has emitido tu primer carnet digital.
- Para personalizar el diseño del carnet, consulta la [Guía de diseño de plantillas](how-to-templates.md).
- Para comprender cómo se aíslan los datos de las empresas, lee la [Explicación de Multi-Tenancy](explanation-multitenancy.md).
```

---

### 2. 🛠️ Cuadrante 2: Guías How-To / Prácticas (Orientadas a Problemas)
* **Objetivo:** Ayudar a un desarrollador o administrador que ya conoce el sistema a resolver una tarea específica o superar un problema real de producción.
* **Rol del autor:** Un colega experto que responde una pregunta operativa concreta.
* **Tono y estilo:** Pragmático, profesional, estructurado en pasos orientados a resultados.
* **Reglas de oro:**
  1. **Asume competencia:** No expliques cómo abrir un terminal ni qué es una variable de entorno. Ve directo al grano.
  2. **Enfocado en el resultado:** El título siempre debe iniciar con un verbo de acción o la frase *"Cómo..."* (ej. *"Cómo rotar la semilla JWT_SECRET sin interrumpir sesiones activas"*).
  3. **Admite flexibilidad y contexto:** Puede advertir sobre trampas comunes (*gotchas*), configuraciones de producción y directivas de seguridad.

#### Estructura Estándar de una Guía How-To:
```markdown
# Cómo configurar el Webhook de Mercado Pago para auto-activación de empresas

## Problema
Al completar una suscripción en la pasarela de pagos, la empresa cliente debe activarse inmediatamente en la base de datos sin requerir intervención manual de un SuperAdmin.

## Solución técnica
Configurar el endpoint `/api/webhooks/mercadopago` con validación criptográfica de firma HMAC `x-signature`.

### Requisitos previos
- Una cuenta activa en Mercado Pago Developers.
- El token de producción `MERCADOPAGO_PROD_ACCESS_TOKEN` configurado en el archivo `.env`.

### Procedimiento paso a paso
1. **Registrar la URL del Webhook en la consola de Mercado Pago:**
   Ingresa a tu panel de desarrollador y agrega la URL pública del backend:
   `https://api.tudominio.com/api/webhooks/mercadopago`

2. **Habilitar el evento de suscripciones:**
   Selecciona la casilla `subscription_preapproval` y guarda los cambios.

3. **Verificar la firma criptográfica en el backend:**
   Asegúrate de que tu middleware extraiga la cabecera `x-signature` y verifique el hash SHA-256:
   \`\`\`javascript
   const isValid = verifyMercadoPagoSignature(req.headers['x-signature'], req.body);
   if (!isValid) return res.status(401).json({ error: 'Firma HMAC inválida' });
   \`\`\`

4. **Validar la activación en la base de datos:**
   Ejecuta una compra en Sandbox y verifica que el estado de la empresa cambie a `active`:
   \`\`\`sql
   SELECT id, name, status FROM companies WHERE id = 15;
   \`\`\`
```

---

### 3. 📖 Cuadrante 3: Referencia Técnica (Orientada a la Información Exacta)
* **Objetivo:** Describir con rigor matemático y exhaustividad técnica la maquinaria del sistema (APIs, esquemas de tablas, opciones de configuración, flags de CLI).
* **Rol del autor:** Un catalogador o lexicógrafo estricto. La referencia debe ser el espejo exacto de la realidad del código.
* **Tono y estilo:** Neutro, preciso, formal, tabular, sin opiniones ni consejos.
* **Reglas de oro:**
  1. **Consistencia estructural:** Todas las funciones, endpoints o modelos deben documentarse con la misma plantilla de atributos.
  2. **Completitud:** Ningún parámetro opcional o código de error puede omitirse.
  3. **Cero narrativa:** No cuentes historias ni expliques el negocio; proporciona tipos, valores permitidos, defaults y excepciones.

#### Estructura Estándar de Referencia Técnica:
```markdown
# Referencia de API: POST /api/carnets

Emite una nueva credencial digital para un colaborador perteneciente a la organización del usuario autenticado.

### Endpoint
`POST /api/carnets`

### Cabeceras HTTP
| Cabecera | Tipo | Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| `Authorization` | String | Sí | Token Bearer JWT emitido por `/api/auth/login`. |
| `Content-Type` | String | Sí | Debe ser `application/json`. |

### Parámetros del Body (JSON)
| Parámetro | Tipo | Requerido | Restricciones / Validación | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| `user_id` | Integer | Sí | Entero positivo existente en `company_users`. | ID del colaborador receptor de la credencial. |
| `template_id` | Integer | Sí | Entero positivo existente en `carnet_templates`. | ID de la plantilla gráfica a utilizar. |
| `expiration_date` | String | Sí | Formato ISO 8601 (`YYYY-MM-DD`). Debe ser fecha futura. | Fecha de caducidad formal del carnet. |

### Respuestas HTTP
* `201 Created`: Credencial emitida exitosamente.
  \`\`\`json
  {
    "success": true,
    "data": {
      "id": 142,
      "qr_hash": "a4f89d3e8712bca0129845...",
      "status": "active",
      "expiration_date": "2027-12-31"
    }
  }
  \`\`\`
* `400 Bad Request`: Payload con formato inválido o fecha pasada (Joi validation).
* `403 Forbidden`: Límite de carnets del plan comercial superado (`planLimits.js`).
* `404 Not Found`: Colaborador o plantilla no pertenecen a la empresa del solicitante.
```

---

### 4. 🧠 Cuadrante 4: Explicaciones y Arquitectura (Orientadas a la Comprensión)
* **Objetivo:** Explicar el **por qué** detrás del diseño del software. Aclara conceptos arquitectónicos, compensaciones (*trade-offs*), decisiones de seguridad y contexto histórico.
* **Rol del autor:** Un arquitecto de software experimentado que reflexiona sobre el diseño.
* **Tono y estilo:** Analítico, profundo, conceptual, comparativo.
* **Reglas de oro:**
  1. **Enfoque panorámico:** Conecta partes dispares del sistema para mostrar cómo trabajan en conjunto.
  2. **Explica las alternativas descartadas:** ¿Por qué usamos MySQL con Sequelize en lugar de MongoDB? ¿Por qué AsyncLocalStorage en lugar de inyectar `companyId` manualmente?
  3. **No des instrucciones operativas:** Deja los pasos para los How-To y los tutoriales; aquí se transmiten modelos mentales.

#### Estructura Estándar de una Explicación:
```markdown
# Explicación: Arquitectura de Aislamiento Multi-Inquilino (Multi-Tenancy)

## Contexto del problema
Carnet Digital es un SaaS B2B donde cientos de empresas independientes comparten la misma instancia de base de datos MySQL y la misma API en Express. La fuga de datos entre empresas (IDOR) representa un riesgo crítico de seguridad y cumplimiento legal (Habeas Data / GDPR).

## Patrones evaluados
1. **Base de datos por inquilino (Database-per-tenant):**
   * *Ventaja:* Aislamiento físico absoluto.
   * *Desventaja:* Costo de infraestructura insostenible y complejidad en migraciones masivas para cientos de PYMES.
2. **Esquema compartido con clave de discriminación (Shared Schema with Tenant ID):**
   * *Ventaja:* Escalabilidad horizontal de bajo costo y migraciones atómicas centralizadas.
   * *Desventaja:* Requiere un blindaje infalible a nivel de aplicación para no olvidar el filtro `WHERE company_id = ?`.

## Decisión de diseño e implementación
Adoptamos el modelo de **Esquema Compartido con Contexto Asíncrono**:
- Cada token JWT de empresa encapsula de forma inmutable el atributo `company_id`.
- El middleware `contextMiddleware.js` inicializa un almacén seguro con `AsyncLocalStorage`.
- Todas las consultas relacionales de Sequelize aplican automáticamente la restricción de inquilino.
- Los carnets públicos utilizan un `qr_hash` criptográfico de 256 bits en lugar de IDs secuenciales para neutralizar ataques de enumeración.
```

---

## 🚫 Matriz Anti-Contaminación de Cuadrantes

| Si intentas... | En el cuadrante de... | El resultado es... | Corrección Diátaxis |
| :--- | :--- | :--- | :--- |
| Explicar la teoría matemática de SHA-256 | **Tutorial** | El principiante se aburre, se frustra y abandona. | Mueve la teoría a **Explicación**. Mantén el tutorial en pasos ejecutables. |
| Omitir opciones secundarias de configuración | **Referencia** | El desarrollador avanzado queda desprotegido ante edge-cases. | Documenta el 100% de flags y opciones en **Referencia**. |
| Escribir pasos paso a paso "Paso 1, Paso 2" | **Explicación** | Se mezcla la reflexión con la acción operativa. | Traslada los pasos a una **Guía How-To**. Deja la explicación para el por qué. |
| Asumir que el lector no sabe qué es un terminal | **Guía How-To** | La guía se vuelve condescendiente y pierde agilidad. | Asume competencia en **How-To**. Si necesita aprender desde cero, enlázalo a un **Tutorial**. |

---

## ✅ Checklist de Auditoría Diátaxis para Antigravity

Al auditar o redactar cualquier documento técnico, verifica:
- [ ] ¿El documento pertenece a exactamente **uno** de los 4 cuadrantes?
- [ ] Si es un **Tutorial**, ¿se puede completar de principio a fin sin fallos y en menos de 15 minutos?
- [ ] Si es un **How-To**, ¿el título describe un problema concreto ("Cómo resolver X")?
- [ ] Si es una **Referencia**, ¿están todos los tipos de datos, códigos de error y respuestas tabulados?
- [ ] Si es una **Explicación**, ¿se aclaran los *trade-offs*, alternativas descartadas y decisiones de diseño?
- [ ] ¿Los enlaces entre documentos respetan la matriz (un tutorial enlaza a How-Tos y Explicaciones, nunca los contiene dentro)?

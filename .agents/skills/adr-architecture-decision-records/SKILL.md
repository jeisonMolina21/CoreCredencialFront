---
name: adr-architecture-decision-records
description: >-
  Especialista en Registros de Decisiones de Arquitectura (ADR - Architecture Decision Records) bajo los formatos MADR y Nygard.
  Activa esta skill para redactar, auditar o catalogar decisiones arquitectónicas críticas de software:
  Estado (Propuesto, Aceptado, Deprecado, Reemplazado), Contexto y Fuerzas Impulsoras, Opciones Consideradas con Pros y Contras,
  Resultado de la Decisión y Consecuencias Positivas, Negativas y Neutras.
---

# 📜 Architecture Decision Records (ADR Master Standard)

Un **Registro de Decisión de Arquitectura (ADR)** es un documento conciso en formato Markdown que captura una decisión arquitectónica de software de alto impacto, junto con su contexto, las alternativas evaluadas y sus consecuencias técnicas y de negocio.

La adopción de ADRs erradica el fenómeno de *"amnesia arquitectónica"* en los equipos de desarrollo, permitiendo entender con exactitud **por qué** el sistema fue diseñado de cierta manera meses o años después.

---

## 🚦 Ciclo de Vida y Estados de un ADR

```
 [ Propuesto ]  --->  [ Aceptado ]  --->  [ Reemplazado ] (apunta a ADR posterior)
       |                     |
       v                     v
 [ Rechazado ]         [ Deprecado ]
```

* **Propuesto:** En discusión activa por el equipo técnico.
* **Aceptado:** Aprobado formalmente y aplicado en el código base.
* **Rechazado:** La propuesta no cumplió con las restricciones técnicas o de negocio.
* **Deprecado:** La solución ya no se recomienda pero sigue en soporte transitorio.
* **Reemplazado (Superseded):** Sustituido formalmente por un ADR más reciente (debe indicar enlace al nuevo ADR).

---

## 📝 Plantilla Oficial MADR (Markdown Architectural Decision Record)

```markdown
# [ADR-000X] [Título en imperativo: ej. Adopción de MySQL con Sequelize para Persistencia Relacional]

* **Estado:** Aceptado
* **Fecha:** YYYY-MM-DD
* **Autores:** [Nombre del Arquitecto / Equipo]
* **Revisores:** [Líder Técnico / Dirección TIC]
* **PR / Issue Vinculado:** [#123 / PR-45]

---

## 🎯 Contexto y Planteamiento del Problema
[Describe el contexto técnico y de negocio. ¿Qué necesidad surgió? ¿Por qué la solución actual es insuficiente? Explica las restricciones (presupuesto, plazos, habilidades del equipo, SLAs)].

---

## ⚡ Fuerzas Impulsoras de la Decisión (Decision Drivers)
1. Necesidad de transacciones ACID estrictas para facturación y suscripciones.
2. Soporte de integridad referencial con borrados restringidos (`ON DELETE RESTRICT`).
3. Curva de aprendizaje del equipo y ecosistema maduro de herramientas de monitoreo.
4. Presupuesto acotado de infraestructura en la fase de crecimiento inicial.

---

## ⚖️ Opciones Consideradas

### Opción 1: [Nombre de la Opción 1, ej. PostgreSQL con Prisma ORM]
* **Descripción:** Base de datos relacional de código abierto con ORM de nueva generación tipado en TypeScript.
* **Aspectos positivos (+):**
  * Tipado estático nativo y generación automática de clientes.
  * Excelente soporte de extensiones como pgvector si se requiere IA en el futuro.
* **Aspectos negativos (-):**
  * Mayor consumo de memoria RAM en instancias de bajo costo.
  * Menor familiaridad previa en el equipo actual.

### Opción 2: [Nombre de la Opción 2, ej. MySQL 8 con Sequelize ORM] (Opción Elegida)
* **Descripción:** Motor relacional maduro, altamente eficiente en lectura con ORM clásico en JavaScript.
* **Aspectos positivos (+):**
  * Amplio dominio técnico en el equipo de desarrollo.
  * Excelente desempeño en consultas indexadas con costo de hosting mínimo.
  * Soporte nativo de pooling de conexiones y transacciones administradas.
* **Aspectos negativos (-):**
  * Sequelize tiene una sintaxis de asociaciones más verbosa que los ORMs modernos.
  * Migraciones manuales que requieren validación estricta en staging.

### Opción 3: [Nombre de la Opción 3, ej. MongoDB con Mongoose]
* **Descripción:** Base de datos NoSQL documental orientada a esquemas flexibles.
* **Aspectos positivos (+):**
  * Rapidez inicial para guardar el JSON de diseño de las plantillas canvas.
* **Aspectos negativos (-):**
  * Carencia de integridad referencial estricta por defecto.
  * Riesgo elevado de inconsistencia en relaciones jerárquicas complejas (Empresa -> Sede -> Área -> Cargo -> Colaborador).

---

## 🏆 Resultado de la Decisión
Elegimos la **Opción 2: MySQL 8 con Sequelize ORM** porque garantiza la integridad referencial y las transacciones ACID indispensables para el modelo multi-inquilino y la facturación, maximizando la velocidad de entrega del equipo sin incurrir en sobrecostos de infraestructura.

---

## 📊 Consecuencias

### Consecuencias Positivas (+)
* Integridad referencial protegida a nivel de base de datos (`ON DELETE RESTRICT`).
* Facilidad de respaldo y restauración mediante utilidades estándar de MySQL.
* Consultas de verificación de carnets ejecutadas en menos de 10 milisegundos gracias a índices compuestos B-Tree.

### Consecuencias Negativas (-)
* El esquema gráfico dinámico de las plantillas de carnet debe guardarse en una columna tipo `JSON` dentro de MySQL, requiriendo validación en la capa de aplicación con Joi.
* Las migraciones deben gestionarse de forma planificada para no bloquear tablas en producción.

### Consecuencias Neutras (o)
* El equipo debe mantener sincronizados los modelos de Sequelize con la base de datos mediante scripts controlados de migración.

---

## 🔍 Validación y Cumplimiento
* Pruebas de carga con 100 usuarios concurrentes en staging verificando que el pool de conexiones (`max: 10`) responda sin fugas de conexiones.
* Pruebas de aislamiento multi-tenant comprobando que ninguna consulta omita la cláusula `WHERE company_id = ?`.
```

---

## 🗂️ Registro Maestro de ADRs de Carnet Digital

| ID | Título de la Decisión | Estado | Fecha | Decisión Adoptada |
| :---: | :--- | :---: | :---: | :--- |
| **ADR-001** | Adopción de MySQL con Sequelize para Persistencia Relacional | **Aceptado** | 2026-01-10 | MySQL 8 + Sequelize con borrado restringido para integridad multi-inquilino. |
| **ADR-002** | Contexto Asíncrono Multi-Inquilino con AsyncLocalStorage | **Aceptado** | 2026-01-15 | `contextMiddleware.js` inyecta `x-request-id` y `company_id` sin contaminar firmas de función. |
| **ADR-003** | Renderizado de Carnets en el Cliente mediante HTML5 Canvas | **Aceptado** | 2026-02-01 | Delegar el renderizado gráfico a 300 DPI en el navegador del usuario para proteger la CPU del backend. |
| **ADR-004** | Hashing Criptográfico SHA-256 para Códigos QR | **Aceptado** | 2026-02-10 | Utilizar hashes de 256 bits no secuenciales para impedir la enumeración y falsificación de carnets. |
| **ADR-005** | Integración con Mercado Pago Checkout Pro y Webhooks HMAC | **Aceptado** | 2026-02-20 | Procesamiento seguro de suscripciones recurrentes con validación criptográfica `x-signature`. |
| **ADR-006** | Adopción de Express 5 para Manejo Nativo de Promesas | **Aceptado** | 2026-03-01 | Migración a Express 5 para eliminar envoltorios redundantes `try/catch` en controladores. |

---

## ✅ Checklist de Auditoría para un ADR

- [ ] ¿El título expresa claramente la decisión en tiempo presente o infinitivo?
- [ ] ¿El estado es claro (Propuesto, Aceptado, Deprecado o Reemplazado)?
- [ ] ¿Se evaluaron al menos **dos alternativas viables** además de la elegida?
- [ ] ¿Se identificaron con honestidad las **consecuencias negativas** y la deuda técnica asumida?
- [ ] ¿Se definió el mecanismo de validación para comprobar que la decisión fue acertada?

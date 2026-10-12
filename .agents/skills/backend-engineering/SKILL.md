---
name: backend-engineering
description: >-
  Utiliza esta skill para diseñar, implementar, auditar o refactorizar servicios backend, APIs REST o GraphQL, conexiones a bases de datos (PostgreSQL, MySQL, MongoDB), autenticación segura (JWT/OAuth), middleware y seguridad OWASP en Node.js, Python o Go.
---

# Skill: Especialista en Backend Engineering, APIs y Bases de Datos

Esta habilidad establece las mejores prácticas de la industria para el desarrollo backend robusto, escalable y seguro.

---

## 🏛️ 1. Arquitectura en Capas (Layered Architecture)

Cada servicio backend debe estructurarse con estricta separación de responsabilidades:

1. **Rutas / Controladores (`routes` / `controllers`):**
   * Reciben el request HTTP, validan el esquema de entrada (con Zod, Joi o Pydantic), invocan la capa de servicios y retornan el status HTTP correspondiente (`200`, `201`, `400`, `401`, `404`, `500`).
   * No deben contener consultas directas a la base de datos ni lógica de negocio compleja.
2. **Servicios (`services`):**
   * Contienen las reglas de negocio, transacciones, orquestación de llamadas a APIs externas y validaciones de dominio.
3. **Acceso a Datos / Repositorios (`repositories` / `models`):**
   * Interactúan con la base de datos (queries SQL, Prisma, Sequelize, SQLAlchemy, Mongoose).
4. **Manejo Centralizado de Errores (`middlewares/errorHandler`):**
   * Capturan excepciones no controladas y devuelven respuestas JSON uniformes, registrando trazas con logs estructurados sin exponer datos sensibles ni stack traces en producción.

---

## 🔒 2. Seguridad OWASP y Autenticación

* **Validación Estricta de Entradas:**
  * Sanitizar y tipar todo payload (`req.body`, `req.query`, `req.params`) para prevenir Inyección SQL y XSS.
* **Autenticación y Autorización:**
  * Uso de tokens JWT con algoritmos seguros (`HS256` o `RS256`), expiración corta (`15m` a `2h`) y mecanismo de refresh token.
  * Verificación obligatoria de Roles y Permisos (RBAC) a nivel de middleware antes de procesar el controlador.
* **Headers Seguros:**
  * Implementación de `helmet` para configurar CSP, HSTS, X-Frame-Options.
  * Configuración restrictiva de CORS (solo orígenes de confianza permitidos).
* **Rate Limiting:**
  * Aplicar límites de peticiones por IP en endpoints sensibles (login, registro, recuperación de contraseña).

---

## 🗄️ 3. Bases de Datos y Rendimiento

* **Consultas Eficientes:**
  * Evitar el problema N+1 utilizando `JOIN` o eager loading optimizado.
  * Índices en columnas de búsqueda frecuente (`tenant_id`, `email`, `created_at`).
* **Transacciones Atómicas:**
  * Operaciones que modifiquen múltiples tablas dependientes deben ejecutarse dentro de una transacción (`BEGIN ... COMMIT / ROLLBACK`).
* **Pool de Conexiones:**
  * Configurar límites razonables de conexiones simultáneas y timeouts para evitar agotamiento de recursos.

---

## 📋 Formato de Respuesta API Estándar

```json
{
  "success": true,
  "data": {
    "id": "e2a45c32-...",
    "nombre": "Ejemplo"
  },
  "message": "Operación completada exitosamente",
  "meta": {
    "timestamp": "2026-09-26T12:00:00Z",
    "page": 1,
    "limit": 20,
    "total": 150
  }
}
```
En caso de error:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "El campo 'email' no es válido",
    "details": ["email must be a valid email address"]
  }
}
```

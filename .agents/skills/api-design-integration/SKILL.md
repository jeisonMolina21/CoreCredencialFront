---
name: api-design-integration
description: >-
  Utiliza esta skill para diseñar e integrar APIs RESTful, GraphQL o Webhooks de nivel empresarial, diseñar contratos OpenAPI/Swagger, definir esquemas de paginación eficiente (Cursor vs Offset), idempotencia y seguridad en firmas criptográficas de webhooks (HMAC SHA-256).
---

# Skill: Especialista en Diseño de APIs, Integraciones y Webhooks

Esta habilidad estandariza los principios de diseño de APIs elegantes, consistentes y predecibles para desarrolladores internos y consumidores externos.

---

## 🌐 1. Principios RESTful de Nivel de Madurez Richardson (Nivel 2-3)

### Nomenclatura de Rutas y Recursos
* Usar sustantivos en plural para colecciones: `/api/v1/colaboradores`, `/api/v1/empresas`.
* Jerarquía de recursos dependientes: `/api/v1/empresas/:empresaId/sedes`.
* Acciones específicas de negocio que no encajen en CRUD: usar verbos claros como subrecursos:
  * `POST /api/v1/carnets/:id/revocar` (en lugar de `DELETE /api/v1/carnets/:id`).

### Códigos de Estado HTTP Correctos
* `200 OK`: Consulta o actualización exitosa con payload de retorno.
* `201 Created`: Creación exitosa de un nuevo recurso (debe incluir cabecera `Location` o el recurso en el cuerpo).
* `204 No Content`: Eliminación exitosa sin contenido en el cuerpo.
* `400 Bad Request`: Error de validación en los datos enviados por el cliente.
* `401 Unauthorized`: Falta de token o token inválido/expirado.
* `403 Forbidden`: Token válido pero el usuario no tiene permisos suficientes para este recurso.
* `409 Conflict`: Conflicto de estado (ej. email ya registrado o carnet ya revocado).
* `422 Unprocessable Entity`: La sintaxis es correcta pero las reglas de negocio fallaron.
* `429 Too Many Requests`: Límite de tasa de peticiones excedido (*Rate Limit*).

---

## 🔁 2. Idempotencia y Reintentos Seguros

Para operaciones de pago o emisión sensible, soportar la cabecera `Idempotency-Key`:
```http
POST /api/v1/pagos/checkout
Idempotency-Key: 7b22a012-3b1a-4c22-87ad-d345a019882b
Content-Type: application/json
```
* Si la clave ya fue procesada, devolver la misma respuesta almacenada en caché sin volver a realizar el cobro o mutación.

---

## 📄 3. Paginación Eficiente (Cursor-Based Pagination)

Evitar `OFFSET` en colecciones que superen miles de registros por su alto costo en base de datos. Utilizar paginación basada en cursor:

```http
GET /api/v1/colaboradores?limit=25&after=cursor_eyJsYXN0SWQiOiAiY29sYWItMTIzIn0=
```

Respuesta estructurada:
```json
{
  "data": [...],
  "pagination": {
    "hasMore": true,
    "nextCursor": "cursor_eyJsYXN0SWQiOiAiY29sYWItMTUwIn0=",
    "limit": 25
  }
}
```

---

## 🪝 4. Webhooks Empresariales Seguros (HMAC SHA-256)

Al emitir webhooks hacia sistemas de terceros:
1. Incluir siempre una firma criptográfica en las cabeceras:
   ```http
   X-CoreCredential-Signature: sha256=5d41402abc4b2a76b9719d911017c592...
   X-CoreCredential-Timestamp: 1727337600
   ```
2. El destinatario valida calculando `HMAC_SHA256(secret, timestamp + "." + body)`.
3. Prevenir ataques de repetición rechazando timestamps mayores a 5 minutos de antigüedad.

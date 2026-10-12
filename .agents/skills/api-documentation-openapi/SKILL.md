---
name: api-documentation-openapi
description: >-
  Utiliza esta skill para diseñar y redactar especificaciones OpenAPI 3.1 / Swagger en YAML/JSON, generar portales de documentación interactiva de APIs (Redoc, Swagger UI), documentar esquemas de autenticación Bearer/ApiKey y generar SDKs o tipos TypeScript automáticamente.
---

# Skill: Especialista en Documentación OpenAPI & Portales de API

Esta habilidad estandariza la especificación formal de APIs REST para que puedan ser consumidas por terceros, generar SDKs automáticos y renderizarse en portales interactivos de documentación.

---

## 📜 1. Especificación OpenAPI 3.1 Estándar (YAML)

Estructura canónica de un endpoint con autenticación Bearer y esquemas de respuesta:

```yaml
openapi: 3.1.0
info:
  title: CoreCredential Public API
  version: 1.0.0
  description: API empresarial para emisión, validación y gestión de credenciales digitales.
servers:
  - url: https://api.corecredential.com/v1
    description: Servidor de Producción

paths:
  /colaboradores:
    get:
      summary: Listar colaboradores de la empresa
      operationId: listarColaboradores
      security:
        - BearerAuth: []
      parameters:
        - name: limit
          in: query
          required: false
          schema:
            type: integer
            default: 20
        - name: cursor
          in: query
          required: false
          schema:
            type: string
      responses:
        '200':
          description: Lista de colaboradores obtenida exitosamente
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/Colaborador'
        '401':
          $ref: '#/components/responses/UnauthorizedError'

components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  schemas:
    Colaborador:
      type: object
      required:
        - id
        - nombres
        - apellidos
        - email
      properties:
        id:
          type: string
          format: uuid
        nombres:
          type: string
          example: "Alejandro"
        apellidos:
          type: string
          example: "Morales"
        email:
          type: string
          format: email
          example: "a.morales@empresa.com"
```

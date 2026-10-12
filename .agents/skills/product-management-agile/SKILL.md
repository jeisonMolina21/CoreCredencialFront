---
name: product-management-agile
description: >-
  Utiliza esta skill para redactar Documentos de Requerimientos de Producto (PRD), Historias de Usuario con criterios de aceptación en formato BDD/Gherkin (Given-When-Then), priorización con frameworks MoSCoW o RICE, y diseño de roadmaps ágiles de producto.
---

# Skill: Especialista en Gestión de Producto, Agile Scrum & Requerimientos

Esta habilidad estandariza la traducción de necesidades de negocio y de los usuarios en especificaciones técnicas inequívocas listas para desarrollo y pruebas.

---

## 📝 1. Historias de Usuario con Criterios de Aceptación BDD (Gherkin)

### Estructura de la Historia:
* **Como** [tipo de usuario o rol].
* **Quiero** [realizar una acción o contar con una capacidad].
* **Para** [obtener un beneficio concreto o resolver un dolor].

### Ejemplo con Criterios de Aceptación (Given-When-Then):
```gherkin
Feature: Revocación de Carnet Digital por Baja Laboral
  Como Administrador de Recursos Humanos
  Quiero revocar inmediatamente el carnet digital de un empleado desvinculado
  Para impedir que continúe ingresando a las instalaciones o accediendo a beneficios corporativos.

  Scenario: Revocación exitosa de un carnet activo
    Given que el colaborador "Pedro Martínez" tiene un carnet con estado "ACTIVO"
    When el administrador presiona el botón "Revocar Carnet" en el directorio
    And confirma la acción en el diálogo de confirmación indicando el motivo "Fin de contrato"
    Then el estado del carnet debe cambiar inmediatamente a "REVOCADO"
    And el código QR debe responder "CREDENCIAL NO VÁLIDA" al ser escaneado
    And se debe registrar un evento en la bitácora de auditoría con la fecha, hora y usuario administrador.

  Scenario: Intento de revocar un carnet ya revocado
    Given que el carnet ya se encuentra en estado "REVOCADO"
    When el administrador intenta ejecutar la acción de revocación
    Then el sistema debe mostrar un mensaje "El carnet ya se encuentra revocado previamente"
    And no debe realizar ningún cambio en la base de datos.
```

---

## 🎯 2. Priorización de Características con Framework MoSCoW

| Categoría | Significado | Regla de Decisión |
| :--- | :--- | :--- |
| **Must Have** (Debe tener) | Crítico para el lanzamiento | Sin esto, el producto es inviable o ilegal. No negociable para el MVP. |
| **Should Have** (Debería tener) | Muy importante pero no bloqueante | Se puede posponer con una solución manual temporal si es necesario. |
| **Could Have** (Podría tener) | Deseable si hay tiempo | Se incluye solo si no pone en riesgo las fechas del sprint o entrega. |
| **Won't Have** (No tendrá por ahora) | Descartado explícitamente | Aclarado por escrito para evitar expectativas falsas en este ciclo. |

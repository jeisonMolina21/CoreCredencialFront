---
name: git-code-review-maestro
description: >-
  Utiliza esta skill para estandarizar flujos de trabajo en Git (GitFlow, Trunk-Based Development), redactar Conventional Commits estructurados, realizar auditorías de Pull Requests (Code Reviews exhaustivos), resolución de conflictos y generación automática de changelogs de versiones (SemVer).
---

# Skill: Maestro en Git, Code Reviews & Flujos de Integración

Esta habilidad define las reglas para mantener un historial de versiones limpio, profesional y trazable, así como guías para revisiones de código de alto estándar.

---

## 🌿 1. Estándar de Conventional Commits

Todo mensaje de commit debe seguir la estructura: `<tipo>(<alcance opcional>): <descripción imperativa>`

### Tipos Válidos:
* `feat`: Una nueva característica o funcionalidad para el usuario.
* `fix`: Corrección de un bug o error.
* `perf`: Cambio de código que mejora el rendimiento de ejecución.
* `refactor`: Cambio de código que no arregla un bug ni añade una característica.
* `docs`: Modificaciones únicamente en documentación o comentarios.
* `test`: Adición o corrección de pruebas existentes.
* `chore`: Mantenimiento de dependencias, scripts de build o configuraciones.

### Ejemplo de Commit Profesional:
```git
feat(carnetizacion): agregar exportación por lotes en formato PDF de alta resolución

- Implementar generación asíncrona mediante worker en background
- Añadir indicador de progreso en porcentaje para el usuario
- Limpiar archivos temporales tras la descarga

Closes #142
```

---

## 🔍 2. Marco de Code Review (Checklist para Pull Requests)

Al revisar un Pull Request, evaluar en este orden de prioridad:

1. **Corrección Funcional & Lógica:** ¿El código hace exactamente lo que el ticket o requerimiento pide? ¿Se consideran los *edge cases*?
2. **Seguridad:** ¿Se sanitizan los datos? ¿Hay riesgos de fuga de memoria o secretos expuestos?
3. **Mantenibilidad:** ¿El código es legible sin necesidad de explicaciones verbales? ¿Se respetan los principios SOLID?
4. **Pruebas:** ¿El PR incluye tests automatizados que cubran la nueva lógica?
5. **Estilo:** Dejar que los linters (`ESLint`, `Prettier`, `Biome`) se encarguen del formato; el revisor humano/AI debe enfocarse en la arquitectura.

---

## 📋 3. Nomenclatura Estándar de Ramas (Branches)
* `feature/CC-102-filtro-colaboradores`
* `bugfix/CC-204-error-modal-sede`
* `hotfix/CC-999-fuga-token-header`
* `release/v2.1.0`

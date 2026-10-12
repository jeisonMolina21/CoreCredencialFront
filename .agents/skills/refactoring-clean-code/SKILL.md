---
name: refactoring-clean-code
description: >-
  Utiliza esta skill cuando el usuario solicite refactorizar código, limpiar deuda técnica, aplicar principios SOLID/Clean Code, optimizar algoritmos o simplificar componentes y funciones sobrecargadas sin alterar el comportamiento externo.
---

# Skill: Especialista en Refactorización, Clean Code y Deuda Técnica

Esta habilidad establece una metodología rigurosa para transformar código complejo o endeudado en código limpio, modular, legible y testeable, preservando intacto el comportamiento del sistema.

---

## 🧼 1. Principios Rectores

* **SOLID:**
  * **S (Single Responsibility):** Cada módulo, clase o función debe tener una única razón para cambiar.
  * **O (Open/Closed):** Abierto a extensión, cerrado a modificación (estrategias, polimorfismo, handlers).
  * **L (Liskov Substitution):** Subtipos deben ser reemplazables por sus tipos base.
  * **I (Interface Segregation):** No forzar a un consumidor a depender de métodos que no utiliza.
  * **D (Dependency Inversion):** Depender de abstracciones, no de implementaciones concretas.
* **KISS (Keep It Simple, Stupid):** La solución más simple y directa suele ser la más confiable.
* **DRY (Don't Repeat Yourself):** Extraer lógica duplicada, pero recordando que *"la duplicación accidental es más barata que la abstracción equivocada"*.

---

## 👃 2. Catálogo de Code Smells y Soluciones

### 1. Funciones Monstruo (> 50 líneas)
* **Síntoma:** Una función realiza lectura de datos, validación, cálculo matemático, formateo y llamada de red.
* **Solución:** *Extract Function* (Extraer en funciones puras con nombres que revelen su intención).

### 2. Parámetros Excesivos (> 3 argumentos)
* **Síntoma:** `crearUsuario(nombre, apellido, email, telefono, rol, sede, estado, fecha)`
* **Solución:** *Introduce Parameter Object* (Agrupar en un objeto estructurado `{ datosPersonales, configuracion }`).

### 3. Código Muerto / Comentado
* **Síntoma:** Bloques de código comentados con anotaciones del pasado ("// antiguo cálculo").
* **Solución:** Eliminación inmediata. El control de versiones (Git) guarda el histórico; el código fuente debe estar 100% limpio.

### 4. Anidamiento Profundo (Arrow Anti-Pattern)
* **Síntoma:** Múltiples `if ... else if ... else` anidados con más de 3 niveles de indentación.
* **Solución:** *Early Return / Guard Clauses* (Retornos tempranos que salgan de la función si la condición falla).

---

## 🔄 3. Flujo Seguro de Refactorización

1. **Asegurar Red de Contención (Tests):**
   * Antes de tocar una sola línea de código, verificar que existan pruebas que validen la funcionalidad actual. Si no existen, escribir tests de caracterización antes de refactorizar.
2. **Pasos Atómicos:**
   * Realizar un solo cambio estructural a la vez (ej. solo renombrar variables o solo extraer un helper).
3. **Verificación Continua:**
   * Ejecutar la suite de pruebas tras cada paso para garantizar que nada se ha roto.

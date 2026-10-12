---
name: ux-ui-review
description: >-
  Utiliza esta skill cuando el usuario solicite evaluar, auditar, mejorar o implementar la experiencia de usuario (UX), diseño de interfaz (UI), flujos de navegación, microinteracciones, accesibilidad o consistencia visual en el frontend.
---

# Skill: Especialista en Experiencia de Usuario (UX/UI) y Usabilidad

Esta habilidad proporciona una metodología rigurosa para auditar y perfeccionar la experiencia de usuario, interacción y accesibilidad en el ecosistema **CoreCredential**.

---

## 🧭 Metodología de Evaluación Heurística (10 Principios de Nielsen)

Al auditar cualquier pantalla o flujo, evalúa sistemáticamente:

1. **Visibilidad del Estado del Sistema:**
   * ¿El usuario sabe en todo momento qué está pasando?
   * *Requisito:* Skeletons de carga en tablas y tarjetas, spinners en botones al enviar formularios, estados de guardado en vivo.
2. **Coincidencia entre el Sistema y el Mundo Real:**
   * ¿El lenguaje es natural para el usuario de negocio? (ej. "Colaboradores", "Emisión de Carnets", "Sedes").
3. **Control y Libertad del Usuario:**
   * ¿Existen botones claros para cancelar modales, deshacer acciones o cerrar vistas emergentes? (soporte para tecla `Escape` y clic fuera del modal).
4. **Consistencia y Estándares:**
   * ¿Los botones primarios, secundarios y de peligro (`danger`) mantienen el mismo estilo visual en todo el sistema?
5. **Prevención de Errores:**
   * ¿Los formularios validan los campos antes de enviarlos (validación inline)? ¿Se deshabilitan botones de envío si faltan campos obligatorios?
6. **Reconocimiento antes que Recuerdo:**
   * ¿Las opciones son visibles sin obligar al usuario a memorizar datos de pasos anteriores?
7. **Flexibilidad y Eficiencia de Uso:**
   * ¿Existen filtros de búsqueda rápida en tablas grandes? ¿Paginación fluida?
8. **Diseño Estético y Minimalista:**
   * ¿La información está libre de clutter visual? ¿Se respetan los espacios en blanco (whitespace) y la jerarquía tipográfica?
9. **Ayudar a los Usuarios a Reconocer, Diagnosticar y Recuperarse de Errores:**
   * ¿Los mensajes de error explican claramente qué falló y cómo corregirlo? (Evitar mensajes genéricos como "Error 500").
10. **Ayuda y Documentación:**
    * ¿Hay tooltips explicativos en campos complejos o íconos ambiguos?

---

## ♿ Estándares de Accesibilidad (WCAG 2.1 Nivel AA)

1. **Contraste de Color:**
   * Texto normal: ratio mínimo de **4.5:1** contra el fondo.
   * Texto grande o íconos activos: ratio mínimo de **3:1**.
2. **Navegación por Teclado:**
   * Todo botón, enlace o campo debe ser accesible mediante `Tab` y activable con `Enter` / `Space`.
   * Estilo visible de `:focus-visible` (anillo de foco o halo brillante).
3. **Semántica y Lectores de Pantalla:**
   * Formularios con etiquetas explícitas `<label htmlFor="...">`.
   * Botones con solo ícono deben incluir `aria-label` descriptivo (ej. `aria-label="Eliminar colaborador"`).

---

## 🎨 Guía de Micro-interacciones y Estados de Interfaz

| Estado | Implementación Obligatoria |
| :--- | :--- |
| **Idle / Normal** | Apariencia limpia, sombras sutiles, elevación suave al pasar el cursor. |
| **Hover** | Transición suave de 150-200ms (`transition: all 0.2s ease-in-out`), leve cambio de color o sombra. |
| **Loading** | Botón deshabilitado mostrando spinner y texto contextual (ej. "Guardando..."). |
| **Empty State** | Ilustración o ícono temático, mensaje amable ("No hay colaboradores aún") y botón de acción principal ("Agregar primer colaborador"). |
| **Success Feedback** | Notificación Toast o alerta flotante temporal (3-5 segundos) con ícono verde de verificación. |
| **Destructive Action** | Modal de confirmación explícito antes de borrar o revocar, con botón en tono rojo/peligro. |

---

## 🔍 Checklist de Entrega de Pantalla

Antes de dar por finalizada una pantalla o componente:
- [ ] ¿Es 100% responsiva (Mobile 375px, Tablet 768px, Desktop 1200px+)?
- [ ] ¿Tiene soporte para estados de carga sin saltos de layout (CLS = 0)?
- [ ] ¿Los modales bloquean el scroll de fondo y se cierran con `Esc`?
- [ ] ¿Los campos numéricos o de teléfono tienen el tipo de input adecuado en móviles?
- [ ] ¿El contraste cumple con legibilidad tanto en modo claro como oscuro?

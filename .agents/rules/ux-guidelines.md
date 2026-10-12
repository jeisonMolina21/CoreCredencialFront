# Reglas de Experiencia de Usuario (UX) y Estándares de Diseño

Estas directrices son de cumplimiento estricto para cualquier modificación o creación de componentes visuales en el frontend de **CoreCredential**.

---

## 1. Ergonomía Visual y Coherencia de Marca
* **Paleta Armónica:** Mantener el contraste y los acentos primarios (azules y púrpuras de CoreCredential) sin saturar la vista.
* **Espaciado Modular:** Utilizar múltiplos de 4 u 8px (`gap-2`, `gap-4`, `p-4`, `p-6`) para garantizar alineaciones limpias.
* **Tipografía Legible:** Jerarquía clara con tamaños proporcionales (H1: 2rem+, H2: 1.5rem, Body: 1rem, Small/Muted: 0.875rem).

---

## 2. Micro-interacciones y Feedback Inmediato
* **Sin bloqueos ciegos:** Cada botón que dispare una petición asíncrona debe mostrar indicador de carga o spinner y deshabilitarse temporalmente para evitar doble clic.
* **Transiciones fluidas:** Usar transiciones CSS suaves de entre 150ms y 250ms para hovers y aperturas de modales.
* **Confirmación Destructiva:** Cualquier acción de borrado o revocación (carnets, colaboradores, sedes) debe requerir confirmación explícita mediante modal o alerta.

---

## 3. Manejo de Estados de Pantalla
* **Empty States Atractivos:** Si una tabla o lista está vacía, nunca mostrar un espacio en blanco; mostrar un mensaje claro con ícono temático y botón directo de acción (ej. "Aún no tienes áreas registradas. Crea tu primera área").
* **Skeletons de Carga:** Preferir esqueletos visuales (skeletons) que repliquen la silueta de los datos en lugar de simples spinners a pantalla completa, para evitar saltos de diseño (CLS).

---

## 4. Accesibilidad y Responsividad
* **Mobile-First:** Las vistas deben ser cómodamente navegables en pantallas de 375px en adelante.
* **Navegabilidad por teclado:** Modales deben atrapar el foco y cerrarse con la tecla `Escape`.
* **Semántica:** Evitar el uso excesivo de `<div>` clickeables; usar elementos nativos `<button>` o enlaces `<a>`.

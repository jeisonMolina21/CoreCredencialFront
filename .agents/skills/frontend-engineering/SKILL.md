---
name: frontend-engineering
description: >-
  Utiliza esta skill para desarrollo, optimización y resolución de problemas en el frontend moderno (React, Next.js, Vite, TypeScript/JavaScript, gestión de estado, renderizado, componentes reutilizables y CSS/estilos).
---

# Skill: Especialista en Frontend Engineering & Arquitectura Web

Esta habilidad define los estándares y procedimientos para construir interfaces web modernas, reactivas, de alto rendimiento y mantenibles en ecosistemas React, Next.js y Vite.

---

## 🏛️ 1. Arquitectura y Organización de Componentes

### Jerarquía de Responsabilidades
1. **Páginas / Vistas (`/pages` o `/routes`):** Orquestan componentes y leen parámetros de URL. No deben contener lógica de presentación profunda ni estilos atómicos.
2. **Contenedores de Módulo (`/modules/.../components`):** Agrupan lógica de negocio específica y conectan los datos con los componentes visuales.
3. **Componentes Atómicos / UI Común (`/components/ui`):** Componentes puros, desacoplados del dominio (Botones, Modales, Inputs, Tablas, Badges, Dropdowns).

### Reglas de Estado (State Management)
* **Principio de Localidad:** Mantén el estado lo más cerca posible de donde se utiliza. No eleves estado a un contexto global si solo dos componentes hermanos lo requieren.
* **Separación de Lógica y UI:** Extrae lógica compleja o llamadas a APIs en **Custom Hooks** (`useNombreDelFlujo.js`).
* **Inmutabilidad:** En mutaciones de estado complejo, utiliza siempre operaciones inmutables o funciones actualizadoras: `setItems(prev => [...prev, newItem])`.

---

## ⚡ 2. Rendimiento y Optimización de Renderizado

* **Evitar Renders Innecesarios:**
  * No crear funciones flecha anónimas dentro de bucles o props críticas si disparan re-renderizados pesados; memoizar con `useCallback`.
  * Cálculos intensivos (filtros de listas con miles de filas, agrupaciones) deben memoizarse con `useMemo`.
* **Code Splitting & Lazy Loading:**
  * Dividir rutas pesadas con `React.lazy` y `Suspense`:
    ```jsx
    const DashboardModule = React.lazy(() => import('./modules/dashboard'));
    ```
* **Virtualización:** Si una lista o tabla supera los 100 elementos sin paginación en servidor, implementar virtualización de listas.

---

## 🎨 3. Estilos y Sistema de Diseño

* **Consistencia de Tokens:** Utilizar variables CSS o tokens de diseño para colores, radios de borde y sombras.
* **Diseño Fluido:** Evitar anchos fijos en píxeles para contenedores principales; utilizar porcentajes, `clamp()` y CSS Grid con `auto-fill`/`auto-fit`.
* **Zero Cumulative Layout Shift (CLS):** Reservar siempre espacio para imágenes y contenido asíncrono con placeholders o skeletons para evitar saltos visuales durante la carga.

---

## 📋 Checklist de Calidad Frontend
- [ ] ¿El componente está libre de advertencias de consola y ciclos infinitos en `useEffect`?
- [ ] ¿Los custom hooks tienen su array de dependencias completo y justificado?
- [ ] ¿La interfaz responde suavemente a 60fps sin bloqueos en el hilo principal?
- [ ] ¿Se manejan adecuadamente los estados de carga, vacío, error y datos listos?

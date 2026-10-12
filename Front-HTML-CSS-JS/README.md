# CoreCredential - Sistema de Carnetización y Credenciales Digitales
## Front-End con Fundamentos de HTML5, CSS3 y JavaScript Vanilla

**Autor / Desarrollador:** Jeison Molina  
**Área:** Análisis y Desarrollo de Software (Front-End & Arquitectura Web)  
**Entorno:** 100% Web Estándar (Sin dependencias externas ni compiladores)

---

## 📌 1. Descripción del Proyecto

**CoreCredential** es una plataforma web ligera, ágil y reactiva para la gestión de identidad corporativa e institucional. Permite la emisión de carnets digitales en formato estándar CR-80 con código QR encriptado, previsualización biométrica en vivo, consulta de vigencia y soporte técnico.

Este desarrollo fue estructurado cumpliendo estrictamente los fundamentos de desarrollo front-end y los cuatro criterios obligatorios de evaluación técnica:

1. **Solucionar el problema propuesto:** Implementación completa del flujo de emisión y validación de credenciales para el caso de estudio empresarial (*Innovatech Global*).
2. **Estructurar enlaces y contenido:** Grilla de soluciones en el portal de inicio donde cada módulo enlaza a su página correspondiente e incluye una imagen (`<img>`), un título (`<h3>`) y una descripción detallada (`<p>`).
3. **Aplicar estilos CSS:** Arquitectura modular de estilos (5 archivos CSS) con variables de diseño, glassmorphism, sombras realistas, diseño responsivo y modelado físico del carnet.
4. **Emplear listas ordenadas:** Incorporación de listas numeradas (`<ol>`) en todas las vistas principales detallando los pasos secuenciales de emisión, protocolos de auditoría y flujo de soporte.

---

## 🚀 2. Verificación de Criterios de la Rúbrica de Evaluación

| Criterio de la Rúbrica | Estado | Implementación en el Código |
| :--- | :---: | :--- |
| **1. Solucionar el problema propuesto** | ✅ Cumplido | Sistema completo de emisión de credenciales digitales con vista previa en tiempo real y módulo de validación QR. |
| **2. Estructurar enlaces y contenido** | ✅ Cumplido | Sección `Soluciones y Módulos` en `index.html` con 3 tarjetas enlazadas (`<a href>`), cada una con imagen (`<img>`), título (`<h3>`) y descripción (`<p>`). |
| **3. Aplicar estilos CSS** | ✅ Cumplido | Más de 650 líneas de CSS3 modular (`variables.css`, `base.css`, `navbar.css`, `carnet.css`, `components.css`). Cero estilos en línea. |
| **4. Emplear listas ordenadas** | ✅ Cumplido | Lista `<ol>` en `index.html` (Flujo de adopción), `<ol>` en `emitir-carnet.html` (Instrucciones), `<ol>` en `verificar-qr.html` (Protocolo) y `<ol>` en `contacto.html`. |

---

## 📁 3. Estructura de Archivos del Proyecto

```text
Front-HTML-CSS-JS/
│
├── Entregable_Fundamentos_Frontend_CoreCredential.docx  # Documento técnico oficial en formato APA 7
├── README.md                                            # Documentación general del proyecto
│
├── index.html                                           # Portal principal y catálogo de módulos
├── emitir-carnet.html                                   # Generador interactivo de carnets en tiempo real
├── verificar-qr.html                                    # Módulo de auditoría y verificación QR
├── contacto.html                                        # Centro de soporte técnico y reporte
│
├── assets/
│   └── images/
│       ├── logo.png                                     # Isotipo corporativo
│       ├── logo-core.png                                # Logotipo institucional
│       ├── hero-carnet.png                              # Banner de portada
│       └── preview-carnet.png                           # Previsualización de tarjeta CR-80
│
├── css/
│   ├── variables.css                                    # Paleta de color, tipografía y tokens CSS
│   ├── base.css                                         # Reset, layouts, botones y listas <ol>
│   ├── navbar.css                                       # Barra de navegación Glassmorphism
│   ├── carnet.css                                       # Tarjeta física CR-80, chip y código QR
│   └── components.css                                   # Tarjetas enlazadas, formularios y toasts
│
└── js/
    ├── data.js                                          # Persistencia local y perfiles de prueba
    ├── carnet.js                                        # Reactividad en vivo al escribir y carga de foto
    ├── verificador.js                                   # Motor de búsqueda y validación de carnets
    └── main.js                                          # Menú móvil y sistema de notificaciones toast
```

---

## 💻 4. Cómo Probar el Proyecto

1. **Apertura Directa:**  
   Haz doble clic sobre el archivo `index.html`. Se abrirá de forma inmediata en tu navegador preferido (Google Chrome, Edge, Firefox, Safari, etc.).
2. **Navegación:**  
   - En **Inicio (`index.html`)**, explora los módulos enlazados haciendo clic sobre cualquiera de las tarjetas de solución.
   - En **Emitir Carnet (`emitir-carnet.html`)**, haz clic en cualquiera de los botones de **Perfiles de Demostración** (Alejandro Morales, Camila Restrepo, David Quintana) o escribe en los campos del formulario para ver la actualización inmediata en el carnet.
   - Puedes subir una foto desde tu equipo con el botón "Seleccionar Fotografía".
   - En **Verificar QR (`verificar-qr.html`)**, haz clic en el botón de prueba rápida `Probar con CC-2026-001` para verificar el estado de vigencia de una credencial activa.

---

## 👤 Autor

- **Desarrollador:** Jeison Molina  
- **Año:** 2026  

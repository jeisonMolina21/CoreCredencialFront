---
name: mobile-pwa-specialist
description: >-
  Utiliza esta skill para convertir aplicaciones web en Progressive Web Apps (PWA) de alto impacto, implementar Service Workers con soporte Offline-First, notificaciones Push, optimización táctil (touch gestures, tap targets) y adaptación a pantallas móviles y tablets.
---

# Skill: Especialista en Mobile Web, PWA & Experiencia Móvil

Esta habilidad optimiza aplicaciones web para que brinden una experiencia indistinguible de una app nativa en dispositivos móviles Android e iOS.

---

## 📱 1. Fundamentos de Progressive Web Apps (PWA)

### Manifiesto de la Aplicación (`manifest.json` / `manifest.webmanifest`)
```json
{
  "name": "CoreCredential Mobile",
  "short_name": "CoreCredential",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0f172a",
  "theme_color": "#2563eb",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

---

## ⚡ 2. Estrategias de Caché con Service Workers (Workbox)

Elegir la estrategia adecuada según el tipo de recurso:

1. **Assets Estáticos (JS, CSS, Fuentes):** `CacheFirst` (leer de caché primero; expirar a los 30-90 días).
2. **Carnets y Credenciales ya generadas:** `StaleWhileRevalidate` (mostrar la credencial en caché inmediatamente y actualizarla en segundo plano si hay conexión).
3. **Peticiones Críticas de Autenticación / Pagos:** `NetworkOnly` (nunca cachear tokens o llamadas bancarias).

```javascript
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

// Caché de imágenes de carnets y fotos de colaboradores
registerRoute(
  ({ request }) => request.destination === 'image',
  new StaleWhileRevalidate({
    cacheName: 'credential-images',
    plugins: [new ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 30 * 24 * 60 * 60 })]
  })
);
```

---

## 👆 3. Ergonomía Táctil y Mobile UX

* **Áreas Táctiles Mínimas (Tap Targets):** Botones y elementos interactivos deben medir como mínimo **48x48 píxeles** con suficiente espaciado entre sí para evitar toques accidentales.
* **Prevención de Zoom Accidental:** Evitar tamaños de fuente inferiores a `16px` en inputs para que iOS Safari no dispare el auto-zoom al enfocar campos.
* **Safe Area Insets:** Respetar los bordes de pantallas con notch o barra de navegación inferior:
  ```css
  padding-bottom: max(16px, env(safe-area-inset-bottom));
  padding-top: max(16px, env(safe-area-inset-top));
  ```

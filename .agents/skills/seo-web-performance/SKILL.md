---
name: seo-web-performance
description: >-
  Utiliza esta skill para auditorías y optimización de SEO técnico, posicionamiento orgánico en motores de búsqueda, optimización de Core Web Vitals (LCP, INP, CLS), metadatos estructurados (JSON-LD), Open Graph, sitemaps y tiempos de carga web.
---

# Skill: Especialista en SEO Técnico, Posicionamiento y Web Performance

Esta habilidad capacita al asistente para auditar y optimizar sitios web para que alcancen la máxima visibilidad en motores de búsqueda y tiempos de carga instantáneos.

---

## 🔍 1. SEO On-Page y Metadatos Fundamentales

### Estructura de Encabezados HTML
* **Único `<h1>` por página:** Representa la palabra clave o intención principal de búsqueda.
* **Jerarquía Estricta:** `<h1>` $\rightarrow$ `<h2>` $\rightarrow$ `<h3>` sin saltarse niveles.
* **HTML5 Semántico:** Uso de `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>` y `<footer>`.

### Metadatos Obligatorios en el `<head>`
```html
<!-- SEO Esencial -->
<title>CoreCredential - Plataforma Líder de Credencialización e Identidad Digital</title>
<meta name="description" content="Emite, gestiona y valida carnets digitales y credenciales seguras para empresas e instituciones. Despliegue en la nube o local. Solicita tu demo.">
<link rel="canonical" href="https://corecredential.com/">
<meta name="robots" content="index, follow">

<!-- Open Graph (Redes Sociales / WhatsApp / LinkedIn) -->
<meta property="og:type" content="website">
<meta property="og:title" content="CoreCredential - Emisión Inteligente de Credenciales">
<meta property="og:description" content="Digitaliza las identificaciones de tus colaboradores con máxima seguridad.">
<meta property="og:image" content="https://corecredential.com/og-image.png">
<meta property="og:url" content="https://corecredential.com/">

<!-- Twitter Cards -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="CoreCredential - Credenciales Digitales">
<meta name="twitter:image" content="https://corecredential.com/og-image.png">
```

---

## 📊 2. Datos Estructurados (Schema.org / JSON-LD)

Implementar marcado Schema.org para enriquecer los resultados en Google (Rich Snippets):

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "CoreCredential",
  "operatingSystem": "All",
  "applicationCategory": "BusinessApplication",
  "description": "Software integral para emisión, validación y gestión de carnets corporativos.",
  "offers": {
    "@type": "Offer",
    "priceCurrency": "USD",
    "price": "29.00"
  }
}
</script>
```

---

## ⚡ 3. Optimización de Core Web Vitals

| Métrica | Objetivo | Qué Mide | Cómo Optimizarla |
| :--- | :--- | :--- | :--- |
| **LCP** (Largest Contentful Paint) | $\le$ 2.5s | Tiempo de render del elemento visible más grande | Precargar fuentes clave (`preload`), optimizar imágenes en formato WebP/AVIF y usar CDN |
| **INP** (Interaction to Next Paint) | $\le$ 200ms | Capacidad de respuesta a clics y teclas | Dividir tareas largas de JavaScript (`scheduler.yield()`), evitar bloqueos en el main thread |
| **CLS** (Cumulative Layout Shift) | $\le$ 0.1 | Estabilidad visual durante la carga | Asignar atributos `width` y `height` a imágenes/videos; reservar espacio con skeletons |

---

## 🤖 4. Rastreo e Indexación (`robots.txt` y `sitemap.xml`)
* `robots.txt`: Permitir rastreo a Googlebot y bloquear rutas privadas (`Disallow: /system/`, `Disallow: /company/`).
* `sitemap.xml`: Lista actualizada de todas las URLs públicas (`/`, `/planes`, `/servicios`, `/blog/*`) con fecha de última modificación (`lastmod`).

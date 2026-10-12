---
name: manual-usuario
description: >-
  Utiliza esta skill cuando el usuario solicite redactar, estructurar o actualizar manuales de usuario, guías de inicio rápido, tutoriales paso a paso o documentación funcional de CoreCredential utilizando las capturas de pantalla existentes.
---

# Skill: Especialista en Manuales de Usuario y Guías de Capacitación

Esta habilidad estandariza la elaboración de manuales de usuario y documentación orientada al cliente para **CoreCredential**, garantizando un tono profesional, claro, pedagógico e ilustrado con capturas de pantalla reales.

---

## 🎯 Estructura Estándar de una Sección de Manual

Cada módulo o pantalla documentada debe seguir obligatoriamente este formato:

```markdown
# [Nombre del Módulo o Proceso]

## 📌 Objetivo
Breve resumen (1-2 párrafos) de qué permite hacer este módulo y qué valor aporta a la empresa o administrador.

## 👤 Perfil / Rol Requerido
Indicar qué tipo de usuario tiene acceso:
- SuperAdministrador de Sistema
- Administrador de Empresa / Tenant
- Colaborador / Usuario Final

## 📋 Requisitos Previos
Listado de elementos o configuraciones necesarias antes de usar esta pantalla (ej. "Tener al menos una sede creada antes de registrar un área").

## 📸 Vista de la Pantalla
![Descripción clara de la pantalla](manual_capturas/[nombre_archivo].png)

## 🛠️ Guía Paso a Paso

1. **Paso 1: Acceso y Navegación**
   - Cómo llegar a la pantalla desde el menú lateral o superior.
2. **Paso 2: Diligenciamiento de Datos**
   - Descripción de campos obligatorios (*) y opcionales.
3. **Paso 3: Confirmación y Guardado**
   - Acción final (clic en botón, confirmación en modal, etc.).

## 💡 Recomendaciones y Alertas

> [!TIP]
> Sugerencia para optimizar tiempo o mejorar la gestión.

> [!WARNING]
> Advertencia sobre acciones irreversibles (ej. revocación de carnet, eliminación de sede).

## ❓ Preguntas Frecuentes (FAQ) & Solución de Problemas

| Problema / Duda Común | Causa Probable | Solución Paso a Paso |
| :--- | :--- | :--- |
| No aparece el botón de emisión | Plan agotado o cuota excedida | Ir al módulo Suscripción y solicitar recarga de carnets |
```

---

## 🖼️ Mapeo de Capturas Disponibles para Manuales

Al redactar cualquier sección, utiliza las capturas de la carpeta `manual_capturas/`:

* **Portal Público y Comercial:**
  * `01_public_landing_hero.png` (Portada principal)
  * `02_public_landing_servicios.png` (Catálogo de soluciones)
  * `03_public_landing_planes.png` (Planes de suscripción)
  * `04_public_landing_despliegue.png` (Cloud vs On-Premise)
  * `05_public_landing_cta.png` (Contacto comercial)
  * `06_public_blog.png` (Blog informativo)
  * `07_auth_login.png` (Inicio de sesión)
  * `08_auth_registro_paso1.png` (Alta de nueva empresa)
  * `09_auth_pago_aprobado.png` (Confirmación de suscripción)

* **Módulo SuperAdmin Sistema (`/system`):**
  * `10_system_dashboard.png` (Métricas de plataforma)
  * `11_system_empresas.png` / `12_system_modal_crear_empresa.png` (Gestión de empresas)
  * `13_system_planes.png` (Configuración de precios y planes)
  * `14_system_suscripciones.png` (Monitoreo de pagos)
  * `15_system_usuarios.png` (Operadores de sistema)
  * `16_system_roles.png` (Matriz de permisos)
  * `17_system_parametros_banners.png` (Banners globales)

* **Módulo Empresa / Tenant (`/company`):**
  * `18_company_dashboard.png` (Resumen corporativo)
  * `19_company_sedes.png` / `20_company_modal_crear_sede.png` (Sedes y sucursales)
  * `21_company_areas.png` / `22_company_modal_crear_area.png` (Áreas y departamentos)
  * `23_company_cargos.png` / `24_company_modal_crear_cargo.png` (Puestos de trabajo)
  * `25_company_colaboradores.png` / `26_company_modal_colaborador.png` (Directorio de personal)
  * `27_company_plantillas.png` (Catálogo de plantillas de carnet)
  * `28_company_disenador_canvas.png` (Editor interactivo de carnets)
  * `29_company_carnetizacion.png` (Emisión, descarga PDF y revocación)
  * `30_company_branding_parametros.png` (Colores de marca y logos)
  * `31_company_suscripcion.png` (Control de plan y cuota de carnets)

---

## ✍️ Principios de Redacción
1. **Claridad sobre tecnicismos:** Evita términos de base de datos o backend en el manual (ej. di "Identificación de la empresa" en lugar de `tenant_id` o `UUID`).
2. **Uso de negritas para elementos de la interfaz:** Resalta los nombres exactos de botones, menús y campos (ej. **"Haga clic en Guardar Cambios"**).
3. **Flujos visuales:** Cuando un proceso requiera más de 3 pasos, apóyate en un diagrama Mermaid de flujo para ilustrar el camino que seguirá el usuario.

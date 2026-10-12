---
name: styleguide-technical-writing
description: >-
  Especialista en Redacción Técnica Profesional bajo las Guías de Estilo de Microsoft y Google (Microsoft Writing Style Guide & Google Developer Documentation Style Guide).
  Activa esta skill para auditar, redactar o corregir documentación técnica con tono conversacional, cálido, directo y accesible:
  Uso estricto de sentence-case en encabezados (sin puntos finales), voz activa, tiempo presente, modo imperativo para instrucciones,
  tablas escaneables, cajas de alerta normalizadas (NOTE, TIP, IMPORTANT, WARNING, CAUTION), texto de anclaje accesible y eliminación de jerga innecesaria.
---

# ✍️ Technical Writing Mastery (Microsoft & Google Style Guide Standard)

Esta skill sintetiza las mejores prácticas de la **Guía de Estilo de Escritura de Microsoft** (*Microsoft Writing Style Guide*) y la **Guía de Estilo de Documentación para Desarrolladores de Google** (*Google Developer Documentation Style Guide*).

Su objetivo es erradicar el lenguaje robótico, la jerga técnica confusa y las oraciones pasivas en favor de una comunicación técnica **clara, concisa, cálida, empática y centrada en el usuario**.

---

## 💎 Los 4 Principios Fundamentales de Redacción

1. **Cálido y Accesible:** Usa un tono conversacional natural. Dirígete al lector de tú a tú en segunda persona ("tú", "tu cuenta", "puedes configurar").
2. **Nítido y Directo:** Ve directo al punto. Elimina palabras de relleno (*"con el fin de proceder a realizar el inicio de sesión"* -> *"para iniciar sesión"*).
3. **Estructura Escaneable:** Los desarrolladores y usuarios no leen línea por línea; escanean la pantalla en busca de respuestas. Usa encabezados claros, listas cortas, tablas y cajas de alerta.
4. **Accesible e Inclusivo:** Lenguaje neutral, libre de términos excluyentes o violentos (*allowlist/denylist* en lugar de *whitelist/blacklist*; *primary/replica* en lugar de *master/slave*).

---

## 📐 Reglas Estrictas de Formato y Sintaxis

### 1. Mayúsculas y Encabezados: *Sentence-Case* Estricto
* **Regla:** Usa mayúscula únicamente en la primera palabra del encabezado y en los nombres propios. **Nunca** uses Title Case (mayúscula en cada palabra) y **jamás** coloques punto final ni dos puntos al final de un encabezado.
* ❌ *Incorrecto:* `## 1.1 Configuración De La Base De Datos En Producción:`
* ❌ *Incorrecto:* `## Paso 2. Haz Clic En Guardar.`
* ✅ **Correcto:** `## 1.1 Configuración de la base de datos en producción`
* ✅ **Correcto:** `## Paso 2. Guarda los cambios`

---

### 2. Voz Activa sobre Voz Pasiva
* **Regla:** Coloca al sujeto ejecutando la acción al inicio de la oración. La voz activa es más enérgica, breve y clara.
* ❌ *Pasiva:* `El carnet digital es generado por el servicio una vez que los límites son comprobados.` (15 palabras)
* ✅ **Activa:** `El servicio genera el carnet digital tras comprobar los límites del plan.` (12 palabras)
* ❌ *Pasiva:* `La solicitud fue rechazada por el servidor debido a un token inválido.`
* ✅ **Activa:** `El servidor rechazó la solicitud porque el token no es válido.`

---

### 3. Tiempo Presente sobre Tiempo Futuro
* **Regla:** Describe el comportamiento del sistema en presente continuo o presente simple. Evita el uso artificial del tiempo futuro ("será", "estará").
* ❌ *Futuro:* `Cuando el usuario presione el botón, el sistema enviará un correo y actualizará la base de datos.`
* ✅ **Presente:** `Al presionar el botón, el sistema envía un correo y actualiza la base de datos.`

---

### 4. Modo Imperativo para Procedimientos Paso a Paso
* **Regla:** Las instrucciones operativas deben comenzar con un verbo de acción en imperativo directo.
* ❌ *Débil/Condicional:* `Deberías abrir la consola y después tendrías que ejecutar npm start.`
* ❌ *Gerundio vago:* `Abriendo la consola y ejecutando el comando npm start...`
* ✅ **Imperativo Directo:**
  1. Abre la consola de comandos.
  2. Ejecuta `npm start`.
  3. Comprueba que el mensaje `Servidor escuchando en puerto 4000` aparezca en pantalla.

---

### 5. Cajas de Alerta Normalizadas (GitHub / Microsoft Callouts)
Utiliza exclusivamente los 5 tipos de alerta estándar para enfatizar información crítica sin abusar de ellas:

```markdown
> [!NOTE]
> Proporciona contexto de fondo, detalles de implementación o aclaraciones útiles.

> [!TIP]
> Sugerencias prácticas para optimizar el rendimiento o acelerar el flujo de trabajo.

> [!IMPORTANT]
> Información esencial que el usuario debe conocer para no cometer errores.

> [!WARNING]
> Advertencias sobre cambios incompatibles (breaking changes) o posibles efectos secundarios.

> [!CAUTION]
> Acciones de alto riesgo que podrían provocar pérdida de datos o brechas de seguridad.
```

---

### 6. Enlaces Accesibles y Descriptivos
* **Regla:** El texto del enlace debe describir exactamente hacia dónde lleva. **Nunca** uses *"haz clic aquí"*, *"este enlace"* ni la URL cruda como texto.
* ❌ *Incorrecto:* `Para ver la documentación de pagos haz clic [aquí](https://api.mercadopago.com).`
* ❌ *Incorrecto:* `Consulta https://expressjs.com para más información.`
* ✅ **Correcto:** `Para mayor detalle sobre la integración, consulta la [referencia de la API de Mercado Pago](https://api.mercadopago.com).`
* ✅ **Correcto:** `Revisa la [guía de enrutamiento de Express](https://expressjs.com).`

---

### 7. Glosario de Términos Preferidos

| Término Desaconsejado | Término Preferido (Microsoft / Google) | Razón técnica |
| :--- | :--- | :--- |
| On-premise | **On-premises** | "Premise" significa premisa lógica; "premises" significa instalaciones físicas. |
| Login / Sign in (como verbo) | **Iniciar sesión** (Log in / Sign in) | "Login" es un sustantivo o adjetivo; como acción verbal se escribe separado. |
| Logout / Sign out (como verbo)| **Cerrar sesión** (Log out / Sign out) | Acción verbal separada. |
| Setup (como verbo) | **Configurar / Instalar** (Set up) | "Setup" es el sustantivo (la configuración); "to set up" es la acción. |
| Master / Slave | **Primary / Replica** o **Main / Secondary** | Términos inclusivos y técnicamente más exactos. |
| Whitelist / Blacklist | **Allowlist / Denylist** | Términos inclusivos y directos. |
| Abortar | **Cancelar / Detener** | Tono más humano y menos agresivo para el usuario. |
| Ejecutar (para el usuario) | **Abrir / Iniciar / Seleccionar** | Reserva "ejecutar" para comandos de terminal o código. |

---

## 🔍 Checklist de Control de Calidad Editorial

Antes de publicar cualquier documento técnico, audita:
- [ ] ¿Todos los encabezados están en **sentence-case** y no terminan con punto ni dos puntos?
- [ ] ¿El texto usa **voz activa** en al menos el 90% de las oraciones?
- [ ] ¿Las instrucciones paso a paso utilizan el **modo imperativo** directo?
- [ ] ¿Los acrónimos complejos están explicados la primera vez que aparecen (ej. *Control de Acceso Basado en Roles (RBAC)*)?
- [ ] ¿Las tablas tienen encabezados claros, alineación consistente y datos legibles?
- [ ] ¿Los enlaces son descriptivos y no dicen "haz clic aquí"?
- [ ] ¿Las alertas (`NOTE`, `TIP`, `IMPORTANT`, `WARNING`, `CAUTION`) están correctamente tipadas?

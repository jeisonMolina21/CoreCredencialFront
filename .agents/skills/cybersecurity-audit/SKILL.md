---
name: cybersecurity-audit
description: >-
  Utiliza esta skill para realizar auditorías de seguridad en aplicaciones web y APIs, verificar cumplimiento de OWASP Top 10, análisis de vulnerabilidades (XSS, CSRF, SQL Injection, SSRF), configuración de Content Security Policy (CSP), gestión segura de secretos y hardening de servidores.
---

# Skill: Especialista en Ciberseguridad, Ethical Hacking & SecOps

Esta habilidad dota al equipo de procedimientos rigurosos para auditar, blindar y remediar vulnerabilidades en aplicaciones fullstack conforme a los estándares de **OWASP Top 10** y **NIST**.

---

## 🛡️ 1. Mitigación de Vulnerabilidades Críticas (OWASP Top 10)

### 1. Inyecciones (SQL / NoSQL / Command Injection)
* **Regla estricta:** Jamás concatenar variables en sentencias SQL o comandos de sistema:
  * ❌ *Vulnerable:* `db.query("SELECT * FROM users WHERE email = '" + email + "'")`
  * ✅ *Seguro:* `db.query("SELECT * FROM users WHERE email = $1", [email])`
* Usar ORMs o Query Builders con consultas parametrizadas obligatorias.

### 2. Autenticación Rota y Gestión de Sesiones
* Hash de contraseñas con algoritmos modernos y salt: `bcrypt` con factor de coste $\ge 12$ o `Argon2id`.
* Cookies de sesión obligatoriamente con flags: `HttpOnly; Secure; SameSite=Strict`.
* Invalidación inmediata de tokens en logout mediante listas de revocación o TTLs cortos.

### 3. Exposición de Datos Sensibles (PII & Secretos)
* Escaneo preventivo en pre-commit con herramientas como `trufflehog` o `git-secrets` para impedir subir API keys, contraseñas o certificados al repositorio.
* Sanitización de respuestas de la API: nunca devolver hashes de contraseñas, tokens de reseteo ni datos bancarios completos.

---

## 🔒 2. Content Security Policy (CSP) & Cabeceras HTTP

Implementar las cabeceras recomendadas por OWASP Secure Headers Project:

```javascript
// Ejemplo con Helmet en Express
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'trusted-scripts.com'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
      connectSrc: ["'self'", "https://api.midominio.com"],
      frameAncestors: ["'none'"], // Protección anti-clickjacking
      objectSrc: ["'none'"],
      upgradeInsecureRequests: []
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

---

## 🔍 3. Auditoría de Dependencias y Código Estático (SAST)

Comandos estándar para escaneo de seguridad en Node.js y Python:

```bash
# Node.js
npm audit --audit-level=moderate
npx snyk test

# Python
pip-audit
bandit -r ./src
```

---

## 📋 Checklist de Certificación de Seguridad
- [ ] ¿Están deshabilitadas las trazas de depuración (stack traces) en respuestas públicas de producción?
- [ ] ¿Los endpoints de autenticación cuentan con protección de rate limiting contra fuerza bruta?
- [ ] ¿Se valida el tipo, tamaño y extensión real (magic bytes) de archivos subidos por usuarios?
- [ ] ¿El CORS restringe el acceso únicamente a los dominios del cliente legítimos?

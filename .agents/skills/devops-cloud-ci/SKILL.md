---
name: devops-cloud-ci
description: >-
  Utiliza esta skill para diseñar y automatizar pipelines de CI/CD (GitHub Actions, GitLab CI), contenedorización con Docker y Docker Compose, despliegues en la nube (AWS, GCP, DigitalOcean, Vercel, Railway), Kubernetes, configuración de servidores Nginx/Caddy y automatización de infraestructura.
---

# Skill: Especialista en DevOps, CI/CD y Cloud Infrastructure

Esta habilidad provee los estándares para diseñar arquitecturas de despliegue automatizadas, contenedores ligeros y seguros, y flujos de integración y entrega continua (CI/CD) con cero tiempo de inactividad (*Zero-Downtime Deployment*).

---

## 🐳 1. Buenas Prácticas de Contenedorización con Docker

### Dockerfile Multi-Etapa (Multi-Stage Build)
Reduce drásticamente el peso de las imágenes finales y excluye herramientas de desarrollo y secretos de producción:

```dockerfile
# Etapa 1: Build y dependencias
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Etapa 2: Imagen de producción minimalista
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 appuser
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
USER appuser
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

### Reglas de Seguridad en Contenedores:
* **Nunca ejecutar como root:** Crear siempre un usuario sin privilegios (`USER appuser`).
* **Imágenes Alpine o Distroless:** Minimizar la superficie de ataque utilizando tags minimalistas (`alpine` o `distroless`).
* **`.dockerignore` estricto:** Excluir siempre `.git`, `node_modules`, `.env`, tests y documentación.

---

## 🚀 2. Pipelines de CI/CD con GitHub Actions

Flujo estándar de integración continua con validaciones automáticas:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  validate-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - name: Install Dependencies
        run: npm ci
      - name: Run Linter & Typecheck
        run: |
          npm run lint
          npm run typecheck --if-present
      - name: Run Unit & Integration Tests
        run: npm test -- --coverage
      - name: Security Audit
        run: npm audit --audit-level=high
```

---

## 🌐 3. Servidor Web y Reverse Proxy (Nginx)

Configuración recomendada para SPA (React/Vue/Vite) con compresión Gzip/Brotli y cabeceras de seguridad:

```nginx
server {
    listen 80;
    server_name midominio.com;
    root /var/www/dist;
    index index.html;

    # Compresión
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml image/svg+xml;

    # Soporte para React Router (SPA Fallback)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Caché inmutable para assets estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Proxy hacia API Backend
    location /api/ {
        proxy_pass http://backend_upstream:4000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 📋 Checklist de Entrega DevOps
- [ ] ¿Los secretos se gestionan mediante GitHub Secrets o un Vault (nunca en archivos versionados)?
- [ ] ¿Los contenedores tienen definidos límites de CPU y memoria (`resources.limits`)?
- [ ] ¿Se cuenta con verificación de salud (`healthcheck`) en Docker y Kubernetes?
- [ ] ¿Los logs se emiten a `stdout`/`stderr` en formato JSON estructurado?

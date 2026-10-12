---
name: caching-scalability
description: >-
  Utiliza esta skill para diseñar arquitecturas de alta concurrencia, estrategias de caché multicapa con Redis (Cache-Aside, Write-Through), invalidación segura (stale-while-revalidate), colas de procesamiento asíncrono (BullMQ, RabbitMQ) y balanceo de carga para escalabilidad horizontal.
---

# Skill: Especialista en Caché, Alta Concurrencia y Escalabilidad

Esta habilidad define los patrones de diseño necesarios para que las aplicaciones soporten miles de usuarios simultáneos con latencias mínimas y sin sobrecargar las bases de datos.

---

## ⚡ 1. Estrategia Cache-Aside con Redis

Patrón estándar para lectura rápida de entidades frecuentes (ej. planes, configuraciones de empresa):

```javascript
/**
 * Obtiene los datos de una empresa aprovechando caché en Redis.
 */
async function getEmpresaConCache(empresaId) {
  const cacheKey = `empresa:${empresaId}`;
  
  // 1. Intentar leer de Redis
  const cachedData = await redisClient.get(cacheKey);
  if (cachedData) {
    return JSON.parse(cachedData);
  }
  
  // 2. Si hay Cache Miss, consultar la base de datos
  const empresa = await db.empresas.findById(empresaId);
  if (!empresa) return null;
  
  // 3. Guardar en Redis con TTL (ej. 1 hora = 3600s)
  await redisClient.setEx(cacheKey, 3600, JSON.stringify(empresa));
  
  return empresa;
}
```

### Invalidación Inmediata en Mutaciones:
* Al ejecutar `UPDATE` o `DELETE` sobre una empresa, borrar inmediatamente la clave: `await redisClient.del('empresa:' + empresaId)`.

---

## 📬 2. Procesamiento Asíncrono con Colas de Trabajo (BullMQ)

Para tareas pesadas que no deben bloquear la respuesta HTTP (ej. renderizado de lotes de carnets en PDF, envío masivo de correos):

```javascript
import { Queue, Worker } from 'bullmq';

// Cola de generación de carnets
export const carnetQueue = new Queue('generacion-carnets', { connection: redisConfig });

// Encolar tarea desde el controlador HTTP
export async function solicitarLoteCarnets(colaboradorIds) {
  const job = await carnetQueue.add('procesar-lote', {
    colaboradorIds,
    timestamp: Date.now()
  }, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 2000 }
  });
  return { jobId: job.id, status: 'ENCOLADO' };
}
```

---

## 🌐 3. Cabeceras HTTP de Caché en el Edge / CDN
* **Para datos dinámicos que cambian con frecuencia moderada:**
  ```http
  Cache-Control: public, max-age=60, stale-while-revalidate=300
  ```
  *(El navegador sirve la versión vieja al instante durante 5 minutos mientras descarga la nueva en segundo plano).*
* **Para assets inmutables con hash en el nombre (`main.a1b2c3.js`):**
  ```http
  Cache-Control: public, max-age=31536000, immutable
  ```

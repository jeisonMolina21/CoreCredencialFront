---
name: database-dba-optimization
description: >-
  Utiliza esta skill para modelado relacional y NoSQL, optimización de consultas SQL lentas con EXPLAIN ANALYZE, diseño de índices eficientes (B-Tree, GIN, compuestos), particionamiento de tablas, migraciones seguras sin bloqueo y afinamiento de PostgreSQL, MySQL o MongoDB.
---

# Skill: Especialista en Bases de Datos, Modelado y Optimización DBA

Esta habilidad proporciona las directrices y herramientas analíticas para diseñar esquemas de datos escalables y optimizar consultas en bases de datos empresariales.

---

## 📐 1. Principios de Modelado y Normalización

* **Forma Normal (3NF):** Diseñar esquemas relacionales hasta 3NF para operaciones OLTP (garantizando integridad y previniendo anomalías de actualización).
* **Desnormalización Controlada:** Aplicar únicamente en tablas de solo lectura para reportes o paneles analíticos (OLAP) donde el costo de múltiples JOINs degrade la experiencia.
* **UUIDs vs Claves Secuenciales:**
  * Usar UUID v7 (secuenciales basados en tiempo) para claves primarias en sistemas distribuidos para evitar la fragmentación de índices B-Tree que provocan los UUID v4 aleatorios.
  * Usar enteros secuenciales (`BIGINT`) solo para secuencias internas de alta velocidad.

---

## ⚡ 2. Estrategias de Indexación Avanzada (PostgreSQL / MySQL)

### Cuándo y Cómo Indexar
1. **Columnas de Clave Foránea (`foreign keys`):** Indexar siempre para evitar bloqueos en operaciones de eliminación o actualización en cascada.
2. **Consultas con Filtros Compuestos:**
   * Si la consulta es: `WHERE empresa_id = $1 AND estado = $2 ORDER BY created_at DESC`
   * Crear un **índice compuesto**:
     ```sql
     CREATE INDEX CONCURRENTLY idx_colab_empresa_estado_created 
     ON colaboradores (empresa_id, estado, created_at DESC);
     ```
3. **Búsquedas de Texto Parcial o JSONB (GIN):**
   * Para búsquedas de texto rápido o filtros dentro de campos JSONB:
     ```sql
     CREATE INDEX idx_audit_log_payload ON audit_logs USING GIN (payload jsonb_path_ops);
     ```

### Peligros a Evitar:
* **Sobre-indexación:** Cada índice adicional penaliza las operaciones `INSERT`, `UPDATE` y `DELETE`.
* **Creación de Índices con Bloqueo:** En producción, usar siempre `CREATE INDEX CONCURRENTLY` para no bloquear lecturas ni escrituras en la tabla.

---

## 🔍 3. Diagnóstico y Optimización con `EXPLAIN ANALYZE`

Pasos para depurar una consulta lenta:
1. Ejecutar la consulta precedida de `EXPLAIN (ANALYZE, BUFFERS)`:
   ```sql
   EXPLAIN (ANALYZE, BUFFERS) 
   SELECT * FROM carnets WHERE empresa_id = 'e5b7...' AND estado = 'ACTIVO';
   ```
2. **Identificar Cuellos de Botella:**
   * **Seq Scan (Scan Secuencial) en tablas grandes:** Indica falta de índice en las columnas filtradas.
   * **Hash Join vs Nested Loop:** Verificar si el optimizador está usando demasiada memoria de trabajo (`work_mem`).
   * **Rows Removed by Filter:** Si este número es alto, el índice no está filtrando adecuadamente.

---

## 🔄 4. Migraciones de Base de Datos Seguras (Zero Downtime)

* **Agregar Columnas:**
  * Si la columna tiene valor por defecto, asegurarse de que no requiera reescribir toda la tabla (PostgreSQL 11+ maneja `DEFAULT` constante de forma instantánea).
* **Eliminar Columnas (Patrón Expand and Contract):**
  1. Paso 1: Dejar de escribir en la columna en el código de la aplicación.
  2. Paso 2: Dejar de leer de la columna.
  3. Paso 3: Eliminar la columna de la base de datos en una migración posterior.

---
name: data-analytics-bi
description: >-
  Utiliza esta skill para diseñar tableros de analítica y Business Intelligence (BI), visualizaciones interactivas de datos (Recharts, Chart.js, D3), métricas de producto SaaS (MRR, Churn, LTV, retención de cohortes), pipelines de datos y consultas analíticas SQL avanzadas (Window Functions).
---

# Skill: Especialista en Analítica de Datos, Dashboards & Business Intelligence

Esta habilidad guía el diseño e implementación de paneles de control visuales, cálculo de métricas financieras y análisis cuantitativo de usuarios.

---

## 📈 1. Métricas Clave de Negocio SaaS

* **MRR (Monthly Recurring Revenue):** Ingresos recurrentes mensuales normalizados por suscripciones activas.
* **Churn Rate (Tasa de Cancelación):** $\frac{\text{Clientes perdidos en el periodo}}{\text{Clientes al inicio del periodo}} \times 100$.
* **LTV (Customer Lifetime Value):** $\frac{\text{Ingreso Promedio por Usuario (ARPU)}}{\text{Churn Rate}}$.
* **Net Revenue Retention (NRR):** Porcentaje de ingresos recurrentes retenidos de la base existente incluyendo upgrades menos downgrades y cancelaciones (meta: $> 100\%$).

---

## 📊 2. Visualización Efectiva con Recharts (React)

Reglas para diseñar gráficos claros y responsivos:
* Usar `ResponsiveContainer` con ancho del `100%` y altura adecuada.
* Tooltips con formato monetario o numérico localizado (`Intl.NumberFormat`).
* Paleta accesible de colores con contraste diferenciado para daltonismo.

```jsx
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export function IngresosChart({ data }) {
  return (
    <div style={{ width: '100%', height: 320 }}>
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorMRR" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
          <XAxis dataKey="mes" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" tickFormatter={(v) => `$${v}`} />
          <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Ingresos']} />
          <Area type="monotone" dataKey="mrr" stroke="#2563eb" fillOpacity={1} fill="url(#colorMRR)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
```

---

## 🗄️ 3. SQL Analítico Avanzado (Window Functions)

Ejemplo de cálculo de ingresos acumulados y crecimiento mes a mes:

```sql
SELECT 
    DATE_TRUNC('month', created_at) AS mes,
    SUM(monto) AS ingresos_mes,
    SUM(SUM(monto)) OVER (ORDER BY DATE_TRUNC('month', created_at)) AS ingresos_acumulados,
    LAG(SUM(monto), 1) OVER (ORDER BY DATE_TRUNC('month', created_at)) AS ingresos_mes_anterior,
    ROUND(
        ((SUM(monto) - LAG(SUM(monto), 1) OVER (ORDER BY DATE_TRUNC('month', created_at))) / 
         NULLIF(LAG(SUM(monto), 1) OVER (ORDER BY DATE_TRUNC('month', created_at)), 0)) * 100, 2
    ) AS porcentaje_crecimiento
FROM pagos
WHERE estado = 'APROBADO'
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY mes ASC;
```

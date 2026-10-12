---
name: qa-testing
description: >-
  Utiliza esta skill para diseñar estrategias de aseguramiento de calidad (QA), escribir y ejecutar pruebas unitarias, de integración y end-to-end (E2E) con Playwright, Vitest, Jest o Pytest, así como pruebas de carga, regresión y validación de APIs.
---

# Skill: Especialista en QA, Automatización de Pruebas y Testing E2E

Esta habilidad guía la creación de suites de pruebas confiables, reproducibles y resistentes a cambios para garantizar la máxima estabilidad del software.

---

## 🧪 1. Pirámide de Pruebas

1. **Pruebas Unitarias (70%):**
   * Validan funciones puras, utilidades, helpers, custom hooks y cálculos de negocio de forma aislada.
   * Ejecución ultra rápida (< 10ms por test) usando mocks para dependencias externas.
2. **Pruebas de Integración (20%):**
   * Validan cómo interactúan múltiples componentes o cómo se comunica un controlador backend con la base de datos de pruebas o servicios adyacentes.
3. **Pruebas End-to-End / E2E (10%):**
   * Validan los flujos críticos de usuario (Happy Path y caminos de error principales) en un navegador real automatizado con Playwright o Puppeteer.

---

## 🎭 2. Metodología de Pruebas E2E (Playwright / Puppeteer)

### Reglas de Oro para Tests E2E Estables:
* **No depender de Timeouts fijos (`sleep`):** Usar siempre esperas basadas en eventos (`waitForSelector`, `waitForResponse`, `waitForLoadState('networkidle')`).
* **Selectores Resilientes:**
  * Priorizar selectores accesibles: `getByRole('button', { name: /guardar/i })`, `getByLabel('Correo electrónico')`.
  * Usar atributos de prueba dedicados: `data-testid="submit-button"`.
  * Evitar selectores CSS frágiles basados en estructura DOM (`div > div:nth-child(3) > span`).
* **Aislamiento de Entorno:**
  * Cada prueba debe limpiar o crear sus propios datos de prueba para no depender del orden de ejecución.

---

## 🔬 3. Patrón AAA (Arrange, Act, Assert)

Toda prueba automatizada debe seguir la estructura:

```javascript
describe('Módulo de Emisión de Carnet', () => {
  it('debe emitir un carnet exitosamente cuando los datos son válidos y hay cuota disponible', async () => {
    // 1. Arrange (Preparar datos y mocks)
    const colaboradorMock = { id: 'colab-1', nombre: 'Juan Pérez' };
    const plantillaMock = { id: 'plant-1', diseño: 'default' };

    // 2. Act (Ejecutar la acción)
    const resultado = await servicioCarnets.emitir(colaboradorMock.id, plantillaMock.id);

    // 3. Assert (Comprobar resultados)
    expect(resultado.status).toBe('EMITIDO');
    expect(resultado.pdfUrl).toMatch(/^https:\/\/.+\.pdf$/);
    expect(resultado.fechaEmision).toBeDefined();
  });
});
```

---

## 📋 Checklist de Certificación QA
- [ ] ¿Los tests pasan limpiamente en entornos locales y pipelines de CI/CD?
- [ ] ¿Se cubren los casos límite (*edge cases*): campos vacíos, cadenas gigantes, caracteres especiales, caída de red?
- [ ] ¿Las aserciones son específicas y no genéricas (`toBeTruthy()` frente a `toEqual(valorExacto)`)?
- [ ] ¿Los mocks se restauran después de cada suite de pruebas (`afterEach(() => vi.restoreAllMocks())`)?

const fs = require('fs');
const path = require('path');

const jwt = require('f:/personal/CoreCredential-Back-main/node_modules/jsonwebtoken');
const JWT_SECRET = '9f2e4a8c16b32d64f0e1d2c3b4a59876';

const adminToken = jwt.sign({ id: 1, email: 'Admin@admin', role: 'admin', type: 'system' }, JWT_SECRET, { expiresIn: '24h' });
const companyToken = jwt.sign({ id: 1, email: 'admin@innovatech.com', role: 'admin', type: 'company', company_id: 1 }, JWT_SECRET, { expiresIn: '24h' });

const adminUser = { id: 1, name: 'Administrador del Sistema', email: 'Admin@admin', role: 'admin', system_role: 'admin', type: 'system' };
const companyUser = { id: 1, first_name: 'Carlos', last_name: 'Mendoza', name: 'Carlos Mendoza', email: 'admin@innovatech.com', role: 'admin', type: 'company', company_id: 1 };
const companyBranding = { primary_color: '#0062E3', secondary_color: '#001F3F', font_family: 'Inter', border_radius: '12px', company_id: 1, name: 'Innovatech Solutions S.A.S.' };

const OUT_DIR = path.resolve(__dirname);

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
    console.log('Iniciando captura masiva con logging detallado...');

    const targetsRes = await fetch('http://127.0.0.1:9222/json');
    const targets = await targetsRes.json();
    const pageTarget = targets.find(t => t.type === 'page' && t.url.includes('localhost:5173')) || targets.find(t => t.type === 'page');

    if (!pageTarget) {
        throw new Error('No se encontró página Chrome');
    }

    console.log(`Conectando a: ${pageTarget.title} (${pageTarget.webSocketDebuggerUrl})`);
    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

    await new Promise((resolve, reject) => {
        ws.onopen = resolve;
        ws.onerror = reject;
    });

    const pending = new Map();
    ws.onmessage = (event) => {
        try {
            const msg = JSON.parse(event.data);
            if (msg.id && pending.has(msg.id)) {
                const { resolve, reject, timer } = pending.get(msg.id);
                clearTimeout(timer);
                pending.delete(msg.id);
                if (msg.error) {
                    console.error(`CDP Error en id ${msg.id}:`, msg.error);
                    resolve({ error: msg.error });
                } else {
                    resolve(msg.result);
                }
            }
        } catch (e) {
            console.error('Error parseando mensaje CDP:', e);
        }
    };

    let nextId = 1;
    function send(method, params = {}, timeoutMs = 8000) {
        const id = nextId++;
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                pending.delete(id);
                console.warn(`[TIMEOUT ${timeoutMs}ms] en ${method} (id ${id})`);
                resolve({});
            }, timeoutMs);
            pending.set(id, { resolve, reject, timer });
            ws.send(JSON.stringify({ id, method, params }));
        });
    }

    await send('Emulation.setDeviceMetricsOverride', {
        width: 1920,
        height: 1080,
        deviceScaleFactor: 1,
        mobile: false
    });

    async function evaluate(script) {
        return await send('Runtime.evaluate', {
            expression: `(() => { ${script} })()`,
            returnByValue: true
        });
    }

    async function capture(fileName) {
        await delay(1000);
        console.log(`Capturando: ${fileName}...`);
        const res = await send('Page.captureScreenshot', { format: 'png' });
        if (res && res.data) {
            const dest = path.join(OUT_DIR, fileName);
            fs.writeFileSync(dest, Buffer.from(res.data, 'base64'));
            console.log(`[OK] Guardado: ${fileName} (${(res.data.length / 1024).toFixed(1)} KB)`);
        } else {
            console.warn(`[ADVERTENCIA] No se recibieron datos para ${fileName}`);
        }
    }

    async function navigate(url) {
        console.log(`Navegando a: ${url}`);
        await send('Page.navigate', { url });
        await delay(1500);
    }

    // ==========================================
    // FASE 1: RUTAS PÚBLICAS
    // ==========================================
    console.log('\n--- FASE 1: VISTAS PÚBLICAS ---');
    await navigate('http://localhost:5173/');
    await evaluate(`localStorage.clear();`);
    await delay(500);

    // 01. Landing Hero
    await evaluate(`window.scrollTo(0, 0);`);
    await capture('01_public_landing_hero.png');

    // 02. Landing Servicios
    await evaluate(`
        const s = document.getElementById('servicios');
        if (s) s.scrollIntoView();
    `);
    await capture('02_public_landing_servicios.png');

    // 03. Landing Planes
    await evaluate(`
        const p = document.getElementById('suscripciones');
        if (p) p.scrollIntoView();
    `);
    await capture('03_public_landing_planes.png');

    // 04. Landing Despliegue
    await evaluate(`
        const d = document.getElementById('despliegue');
        if (d) d.scrollIntoView();
    `);
    await capture('04_public_landing_despliegue.png');

    // 05. Blog
    await navigate('http://localhost:5173/blog');
    await capture('05_public_blog.png');

    // 06. Login
    await navigate('http://localhost:5173/login');
    await capture('06_auth_login.png');

    // 07. Registro de Empresa (Paso 1)
    await evaluate(`
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Registrar'));
        if (btn) btn.click();
    `);
    await delay(800);
    await capture('07_auth_registro_paso1.png');

    // 08. Pasarela Pago Aprobado
    await navigate('http://localhost:5173/payment-success?status=approved&payment_id=12345678');
    await capture('08_auth_pago_exitoso.png');

    // ==========================================
    // FASE 2: PANEL SUPERADMIN
    // ==========================================
    console.log('\n--- FASE 2: PANEL SUPERADMIN ---');
    await navigate('http://localhost:5173/system/home');
    await evaluate(`
        localStorage.setItem('token', '${adminToken}');
        localStorage.setItem('user', JSON.stringify(${JSON.stringify(adminUser)}));
        localStorage.removeItem('branding');
        window.location.reload();
    `);
    await delay(2000);

    // 09. System Dashboard
    await capture('09_system_dashboard.png');

    // 10. System Empresas
    await navigate('http://localhost:5173/system/companies');
    await capture('10_system_empresas.png');

    // 11. System Modal Nueva Empresa
    await evaluate(`
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Empresa') || b.textContent.includes('Registrar') || b.textContent.includes('Nueva'));
        if (btn) btn.click();
    `);
    await delay(800);
    await capture('11_system_modal_nueva_empresa.png');

    // Cerrar modal
    await evaluate(`
        const closeBtn = document.querySelector('svg.lucide-x')?.parentElement || document.querySelector('button[aria-label="Cerrar"]');
        if (closeBtn) closeBtn.click();
    `);
    await delay(500);

    // 12. System Planes
    await navigate('http://localhost:5173/system/plans');
    await capture('12_system_planes.png');

    // 13. System Suscripciones
    await navigate('http://localhost:5173/system/subscriptions');
    await capture('13_system_suscripciones.png');

    // 14. System Usuarios
    await navigate('http://localhost:5173/system/users');
    await capture('14_system_usuarios.png');

    // 15. System Roles
    await navigate('http://localhost:5173/system/roles');
    await capture('15_system_roles.png');

    // 16. System Parámetros y Banners
    await navigate('http://localhost:5173/system/parameters');
    await capture('16_system_parametros_banners.png');

    // ==========================================
    // FASE 3: PANEL EMPRESA (INNOVATECH SOLUTIONS)
    // ==========================================
    console.log('\n--- FASE 3: PANEL EMPRESA ---');
    await navigate('http://localhost:5173/company/home');
    await evaluate(`
        localStorage.setItem('token', '${companyToken}');
        localStorage.setItem('user', JSON.stringify(${JSON.stringify(companyUser)}));
        localStorage.setItem('branding', JSON.stringify(${JSON.stringify(companyBranding)}));
        window.location.reload();
    `);
    await delay(2000);

    // 17. Company Dashboard
    await capture('17_company_dashboard.png');

    // 18. Company Sedes
    await navigate('http://localhost:5173/company/headquarters');
    await capture('18_company_sedes.png');

    // 19. Company Áreas
    await navigate('http://localhost:5173/company/areas');
    await capture('19_company_areas.png');

    // 20. Company Cargos
    await navigate('http://localhost:5173/company/cargos');
    await capture('20_company_cargos.png');

    // 21. Company Colaboradores
    await navigate('http://localhost:5173/company/users');
    await capture('21_company_colaboradores.png');

    // 22. Company Modal Nuevo Colaborador
    await evaluate(`
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Colaborador') || b.textContent.includes('Nuevo') || b.textContent.includes('Agregar'));
        if (btn) btn.click();
    `);
    await delay(800);
    await capture('22_company_modal_colaborador.png');

    // Cerrar modal
    await evaluate(`
        const closeBtn = document.querySelector('svg.lucide-x')?.parentElement;
        if (closeBtn) closeBtn.click();
    `);
    await delay(500);

    // 23. Company Plantillas
    await navigate('http://localhost:5173/company/templates');
    await capture('23_company_plantillas.png');

    // 24. Company Diseñador Canvas de Carnets
    await evaluate(`
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Plantilla') || b.textContent.includes('Crear') || b.textContent.includes('Nueva'));
        if (btn) btn.click();
    `);
    await delay(1200);
    await capture('24_company_disenador_plantilla_canvas.png');

    // Cerrar modal diseñador
    await evaluate(`
        const closeBtn = document.querySelector('svg.lucide-x')?.parentElement;
        if (closeBtn) closeBtn.click();
    `);
    await delay(500);

    // 25. Company Carnetización
    await navigate('http://localhost:5173/company/carnets');
    await capture('25_company_carnetizacion.png');

    // 26. Company Configuración de Marca (White-Label)
    await navigate('http://localhost:5173/company/parameter');
    await capture('26_company_branding_parametros.png');

    // 27. Company Suscripción
    await navigate('http://localhost:5173/company/subscription');
    await capture('27_company_suscripcion_limites.png');

    console.log('\n======================================================');
    console.log('¡TODAS LAS 27 CAPTURAS FINALIZADAS EXITOSAMENTE!');
    console.log(`Ubicación: ${OUT_DIR}`);
    console.log('======================================================\n');

    ws.close();
    process.exit(0);
}

run().catch(err => {
    console.error('Error fatal durante la captura:', err);
    process.exit(1);
});

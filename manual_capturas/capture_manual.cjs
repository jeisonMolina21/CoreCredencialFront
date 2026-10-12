const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');
const jwt = require('f:/personal/CoreCredential-Back-main/node_modules/jsonwebtoken');

const JWT_SECRET = '9f2e4a8c16b32d64f0e1d2c3b4a59876';

// Generar tokens válidos
const adminToken = jwt.sign({ id: 1, email: 'Admin@admin', role: 'admin', type: 'system' }, JWT_SECRET, { expiresIn: '24h' });
const companyToken = jwt.sign({ id: 1, email: 'admin@innovatech.com', role: 'admin', type: 'company', company_id: 1 }, JWT_SECRET, { expiresIn: '24h' });

const adminUser = { id: 1, name: 'Administrador del Sistema', email: 'Admin@admin', role: 'admin', system_role: 'admin', type: 'system' };
const companyUser = { id: 1, first_name: 'Carlos', last_name: 'Mendoza', name: 'Carlos Mendoza', email: 'admin@innovatech.com', role: 'admin', type: 'company', company_id: 1 };
const companyBranding = { primary_color: '#0062E3', secondary_color: '#001F3F', font_family: 'Inter', border_radius: '12px', company_id: 1, name: 'Innovatech Solutions S.A.S.' };

const OUT_DIR = path.resolve(__dirname);
const PROGRESS_FILE = path.join(OUT_DIR, 'progress.txt');
fs.writeFileSync(PROGRESS_FILE, '=== INICIANDO CAPTURA MASIVA MANUAL DE USUARIO ===\n');

function log(msg) {
    console.log(msg);
    fs.appendFileSync(PROGRESS_FILE, `[${new Date().toLocaleTimeString()}] ${msg}\n`);
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
    log('Conectando Puppeteer a Chrome...');
    const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
    const pages = await browser.pages();
    const page = pages.find(p => p.url().includes('localhost:5173')) || pages[0];

    await page.bringToFront();
    await page.setViewport({ width: 1920, height: 1080 });

    // Habilitar reduced-motion para capturas instantáneas sin bloqueo de animación
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);

    async function injectInstantStyles() {
        try {
            await page.addStyleTag({
                content: `*, *::before, *::after { animation-duration: 0.001s !important; transition-duration: 0.001s !important; }`
            });
        } catch (_) {}
    }

    async function take(name, waitMs = 400) {
        await delay(waitMs);
        const filePath = path.join(OUT_DIR, name);
        await page.screenshot({ path: filePath });
        log(`[OK] Capturado: ${name}`);
    }

    // ==========================================
    // SECCIÓN 1: VISTAS PÚBLICAS Y COMERCIALES
    // ==========================================
    log('\n--- SECCIÓN 1: VISTAS PÚBLICAS ---');
    await page.goto('http://localhost:5173/', { waitUntil: 'load' });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'load' });
    await injectInstantStyles();

    // 01. Landing Hero
    await page.evaluate(() => window.scrollTo(0, 0));
    await take('01_public_landing_hero.png');

    // 02. Landing Servicios
    await page.evaluate(() => window.scrollTo(0, 850));
    await take('02_public_landing_servicios.png');

    // 03. Landing Planes
    await page.evaluate(() => window.scrollTo(0, 1850));
    await take('03_public_landing_planes.png');

    // 04. Landing Despliegue
    await page.evaluate(() => window.scrollTo(0, 2800));
    await take('04_public_landing_despliegue.png');

    // 05. Landing CTA & Footer
    await page.evaluate(() => window.scrollTo(0, 3800));
    await take('05_public_landing_cta.png');

    // 06. Blog
    await page.goto('http://localhost:5173/blog', { waitUntil: 'load' });
    await injectInstantStyles();
    await take('06_public_blog.png');

    // 07. Login
    await page.goto('http://localhost:5173/login', { waitUntil: 'load' });
    await injectInstantStyles();
    await take('07_auth_login.png');

    // 08. Registro Paso 1 (Datos de Empresa)
    await page.evaluate(() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Registrar'));
        if (btn) btn.click();
    });
    await delay(300);
    await injectInstantStyles();
    await take('08_auth_registro_paso1.png');

    // 09. Pasarela Pago Éxito
    await page.goto('http://localhost:5173/payment-success?status=approved&payment_id=987654321', { waitUntil: 'load' });
    await injectInstantStyles();
    await take('09_auth_pago_aprobado.png');


    // ==========================================
    // SECCIÓN 2: PANEL SUPERADMIN (SISTEMA)
    // ==========================================
    log('\n--- SECCIÓN 2: PANEL SUPERADMIN ---');
    await page.goto('http://localhost:5173/login', { waitUntil: 'load' });
    await page.evaluate((tok, usr) => {
        localStorage.setItem('token', tok);
        localStorage.setItem('user', JSON.stringify(usr));
        localStorage.removeItem('branding');
    }, adminToken, adminUser);

    // 10. Dashboard Sistema
    await page.goto('http://localhost:5173/system/home', { waitUntil: 'load' });
    await injectInstantStyles();
    await take('10_system_dashboard.png');

    // 11. Empresas
    await page.goto('http://localhost:5173/system/companies', { waitUntil: 'load' });
    await injectInstantStyles();
    await take('11_system_empresas.png');

    // 12. Modal Crear Empresa
    await page.evaluate(() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Empresa') || b.textContent.includes('Registrar') || b.textContent.includes('Nueva'));
        if (btn) btn.click();
    });
    await delay(300);
    await injectInstantStyles();
    await take('12_system_modal_crear_empresa.png');

    // Cerrar modal
    await page.evaluate(() => {
        const close = document.querySelector('svg.lucide-x')?.parentElement || document.querySelector('button[aria-label="Cerrar"]');
        if (close) close.click();
    });
    await delay(200);

    // 13. Planes
    await page.goto('http://localhost:5173/system/plans', { waitUntil: 'load' });
    await injectInstantStyles();
    await take('13_system_planes.png');

    // 14. Suscripciones
    await page.goto('http://localhost:5173/system/subscriptions', { waitUntil: 'load' });
    await injectInstantStyles();
    await take('14_system_suscripciones.png');

    // 15. Usuarios Sistema
    await page.goto('http://localhost:5173/system/users', { waitUntil: 'load' });
    await injectInstantStyles();
    await take('15_system_usuarios.png');

    // 16. Roles Sistema
    await page.goto('http://localhost:5173/system/roles', { waitUntil: 'load' });
    await injectInstantStyles();
    await take('16_system_roles.png');

    // 17. Parámetros y Banners
    await page.goto('http://localhost:5173/system/parameters', { waitUntil: 'load' });
    await injectInstantStyles();
    await take('17_system_parametros_banners.png');


    // ==========================================
    // SECCIÓN 3: PANEL EMPRESA (INNOVATECH SOLUTIONS)
    // ==========================================
    log('\n--- SECCIÓN 3: PANEL EMPRESA ---');
    await page.evaluate((tok, usr, brn) => {
        localStorage.setItem('token', tok);
        localStorage.setItem('user', JSON.stringify(usr));
        localStorage.setItem('branding', JSON.stringify(brn));
    }, companyToken, companyUser, companyBranding);

    // 18. Dashboard Empresa
    await page.goto('http://localhost:5173/company/home', { waitUntil: 'load' });
    await injectInstantStyles();
    await take('18_company_dashboard.png');

    // 19. Sedes
    await page.goto('http://localhost:5173/company/headquarters', { waitUntil: 'load' });
    await injectInstantStyles();
    await take('19_company_sedes.png');

    // 20. Modal Crear Sede
    await page.evaluate(() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Sede') || b.textContent.includes('Nueva') || b.textContent.includes('Agregar'));
        if (btn) btn.click();
    });
    await delay(300);
    await injectInstantStyles();
    await take('20_company_modal_crear_sede.png');
    await page.evaluate(() => {
        const close = document.querySelector('svg.lucide-x')?.parentElement;
        if (close) close.click();
    });
    await delay(200);

    // 21. Áreas
    await page.goto('http://localhost:5173/company/areas', { waitUntil: 'load' });
    await injectInstantStyles();
    await take('21_company_areas.png');

    // 22. Modal Crear Área
    await page.evaluate(() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Área') || b.textContent.includes('Nueva') || b.textContent.includes('Agregar'));
        if (btn) btn.click();
    });
    await delay(300);
    await injectInstantStyles();
    await take('22_company_modal_crear_area.png');
    await page.evaluate(() => {
        const close = document.querySelector('svg.lucide-x')?.parentElement;
        if (close) close.click();
    });
    await delay(200);

    // 23. Cargos
    await page.goto('http://localhost:5173/company/cargos', { waitUntil: 'load' });
    await injectInstantStyles();
    await take('23_company_cargos.png');

    // 24. Modal Crear Cargo
    await page.evaluate(() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Cargo') || b.textContent.includes('Nuevo') || b.textContent.includes('Agregar'));
        if (btn) btn.click();
    });
    await delay(300);
    await injectInstantStyles();
    await take('24_company_modal_crear_cargo.png');
    await page.evaluate(() => {
        const close = document.querySelector('svg.lucide-x')?.parentElement;
        if (close) close.click();
    });
    await delay(200);

    // 25. Colaboradores
    await page.goto('http://localhost:5173/company/users', { waitUntil: 'load' });
    await injectInstantStyles();
    await take('25_company_colaboradores.png');

    // 26. Modal Nuevo Colaborador
    await page.evaluate(() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Colaborador') || b.textContent.includes('Nuevo') || b.textContent.includes('Agregar'));
        if (btn) btn.click();
    });
    await delay(300);
    await injectInstantStyles();
    await take('26_company_modal_colaborador.png');
    await page.evaluate(() => {
        const close = document.querySelector('svg.lucide-x')?.parentElement;
        if (close) close.click();
    });
    await delay(200);

    // 27. Plantillas
    await page.goto('http://localhost:5173/company/templates', { waitUntil: 'load' });
    await injectInstantStyles();
    await take('27_company_plantillas.png');

    // 28. Diseñador Canvas de Carnets
    await page.evaluate(() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Plantilla') || b.textContent.includes('Crear') || b.textContent.includes('Nueva'));
        if (btn) btn.click();
    });
    await delay(500);
    await injectInstantStyles();
    await take('28_company_disenador_canvas.png');
    await page.evaluate(() => {
        const close = document.querySelector('svg.lucide-x')?.parentElement;
        if (close) close.click();
    });
    await delay(200);

    // 29. Carnetización
    await page.goto('http://localhost:5173/company/carnets', { waitUntil: 'load' });
    await injectInstantStyles();
    await take('29_company_carnetizacion.png');

    // 30. Parámetros de Marca (White-Label)
    await page.goto('http://localhost:5173/company/parameter', { waitUntil: 'load' });
    await injectInstantStyles();
    await take('30_company_branding_parametros.png');

    // 31. Suscripción y Cuotas
    await page.goto('http://localhost:5173/company/subscription', { waitUntil: 'load' });
    await injectInstantStyles();
    await take('31_company_suscripcion.png');

    log('\n=============================================================');
    log('🎉 ¡TODAS LAS 31 CAPTURAS HAN SIDO COMPLETADAS CON ÉXITO!');
    log(`Directorio de destino: ${OUT_DIR}`);
    log('=============================================================\n');

    process.exit(0);
}

run().catch(err => {
    log(`Error fatal: ${err.message}\n${err.stack}`);
    process.exit(1);
});

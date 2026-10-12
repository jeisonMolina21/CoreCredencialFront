const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');
const jwt = require('f:/personal/CoreCredential-Back-main/node_modules/jsonwebtoken');

const JWT_SECRET = '9f2e4a8c16b32d64f0e1d2c3b4a59876';

const adminToken = jwt.sign({ id: 1, email: 'Admin@admin', role: 'admin', type: 'system' }, JWT_SECRET, { expiresIn: '24h' });
const companyToken = jwt.sign({ id: 1, email: 'admin@innovatech.com', role: 'admin', type: 'company', company_id: 1 }, JWT_SECRET, { expiresIn: '24h' });

const adminUser = { id: 1, name: 'Administrador del Sistema', email: 'Admin@admin', role: 'admin', system_role: 'admin', type: 'system' };
const companyUser = { id: 1, first_name: 'Carlos', last_name: 'Mendoza', name: 'Carlos Mendoza', email: 'admin@innovatech.com', role: 'admin', type: 'company', company_id: 1 };
const companyBranding = { primary_color: '#0062E3', secondary_color: '#001F3F', font_family: 'Inter', border_radius: '12px', company_id: 1, name: 'Innovatech Solutions S.A.S.' };

const OUT_DIR = path.resolve(__dirname, 'recortadas');
if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
    console.log('=== INICIANDO CAPTURAS RECORTADAS Y PROFESIONALES ===');
    console.log(`Carpeta de destino: ${OUT_DIR}`);

    const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
    const pages = await browser.pages();
    const page = pages.find(p => p.url().includes('localhost:5173')) || pages[0];

    await page.bringToFront();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);

    async function injectInstantStyles() {
        try {
            await page.addStyleTag({
                content: `*, *::before, *::after { animation-duration: 0.001s !important; transition-duration: 0.001s !important; }`
            });
        } catch (_) {}
    }

    // Función inteligente para tomar captura de un elemento o del contenedor principal
    async function takeElement(selector, filename, fallbackClip = null) {
        await delay(350);
        await injectInstantStyles();
        const filePath = path.join(OUT_DIR, filename);

        try {
            const el = await page.$(selector);
            if (el) {
                const box = await el.boundingBox();
                if (box && box.width > 50 && box.height > 50) {
                    await el.screenshot({ path: filePath });
                    console.log(`[OK ELEMENT] ${filename} (${Math.round(box.width)}x${Math.round(box.height)})`);
                    return;
                }
            }
        } catch (e) {
            console.warn(`Aviso al capturar selector ${selector}: ${e.message}`);
        }

        // Fallback a clip si se especificó
        if (fallbackClip) {
            await page.screenshot({ path: filePath, clip: fallbackClip });
            console.log(`[OK CLIP] ${filename}`);
            return;
        }

        // Fallback estándar
        await page.screenshot({ path: filePath });
        console.log(`[OK FULL] ${filename}`);
    }

    // Función para capturar modal actualmente abierto
    async function takeModal(filename) {
        await delay(350);
        await injectInstantStyles();
        const filePath = path.join(OUT_DIR, filename);

        // Buscar el contenedor específico del modal (excluyendo el overlay negro)
        const modalBox = await page.evaluate(() => {
            const overlays = Array.from(document.querySelectorAll('div')).filter(el => {
                const st = window.getComputedStyle(el);
                return (st.position === 'fixed' || st.position === 'absolute') && el.offsetWidth > 600 && el.offsetHeight > 400;
            });

            for (const overlay of overlays) {
                // Buscar hijo directo que sea el cuadro del modal
                for (const child of overlay.children) {
                    if (child.offsetWidth > 280 && child.offsetHeight > 180 && child.offsetWidth < window.innerWidth) {
                        const rect = child.getBoundingClientRect();
                        return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
                    }
                }
            }
            return null;
        });

        if (modalBox) {
            // Añadir un padding elegante de 20px alrededor
            const pad = 20;
            const clip = {
                x: Math.max(0, modalBox.x - pad),
                y: Math.max(0, modalBox.y - pad),
                width: Math.min(1920 - Math.max(0, modalBox.x - pad), modalBox.width + pad * 2),
                height: Math.min(1080 - Math.max(0, modalBox.y - pad), modalBox.height + pad * 2)
            };
            await page.screenshot({ path: filePath, clip });
            console.log(`[OK MODAL] ${filename} (${Math.round(clip.width)}x${Math.round(clip.height)})`);
        } else {
            await page.screenshot({ path: filePath });
            console.log(`[FALLBACK MODAL] ${filename}`);
        }

        // Cerrar modal
        await page.evaluate(() => {
            const close = document.querySelector('svg.lucide-x')?.parentElement || document.querySelector('button[aria-label="Cerrar"]');
            if (close) close.click();
        });
        await delay(200);
    }

    // ==========================================
    // 1. VISTAS PÚBLICAS Y COMERCIALES RECORTADAS
    // ==========================================
    console.log('\n--- 1. Recortando Vistas Públicas ---');
    await page.goto('http://localhost:5173/', { waitUntil: 'load' });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'load' });
    await injectInstantStyles();

    // 01. Hero (Cabecera principal + CTA)
    await takeElement('header, div[class*="hero_"], section:first-of-type', '01_public_landing_hero.png', { x: 0, y: 0, width: 1920, height: 850 });

    // 02. Servicios
    await page.evaluate(() => window.scrollTo(0, 850));
    await takeElement('section#servicios, div[class*="services_"]', '02_public_landing_servicios.png', { x: 180, y: 850, width: 1560, height: 950 });

    // 03. Planes
    await page.evaluate(() => window.scrollTo(0, 1850));
    await takeElement('section#planes, div[class*="plans_"]', '03_public_landing_planes.png', { x: 180, y: 1850, width: 1560, height: 900 });

    // 04. Despliegue
    await page.evaluate(() => window.scrollTo(0, 2800));
    await takeElement('section#despliegue, div[class*="deployment_"]', '04_public_landing_despliegue.png', { x: 180, y: 2800, width: 1560, height: 900 });

    // 05. CTA Final
    await page.evaluate(() => window.scrollTo(0, 3800));
    await takeElement('footer, div[class*="cta_"]', '05_public_landing_cta.png', { x: 0, y: 3800, width: 1920, height: 850 });

    // 06. Blog
    await page.goto('http://localhost:5173/blog', { waitUntil: 'load' });
    await injectInstantStyles();
    await takeElement('main, div[class*="blogContainer"]', '06_public_blog.png', { x: 180, y: 80, width: 1560, height: 1000 });

    // 07. Login (Tarjeta de Formulario Recortada)
    await page.goto('http://localhost:5173/login', { waitUntil: 'load' });
    await injectInstantStyles();
    await takeElement('form, div[class*="authCard"], div[class*="card"]', '07_auth_login.png', { x: 680, y: 180, width: 560, height: 720 });

    // 08. Registro (Tarjeta de Onboarding Recortada)
    await page.evaluate(() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Registrar'));
        if (btn) btn.click();
    });
    await delay(300);
    await injectInstantStyles();
    await takeElement('form, div[class*="authCard"], div[class*="registerCard"]', '08_auth_registro_paso1.png', { x: 650, y: 140, width: 620, height: 800 });

    // 09. Pago Aprobado (Tarjeta de Confirmación Recortada)
    await page.goto('http://localhost:5173/payment-success?status=approved&payment_id=987654321', { waitUntil: 'load' });
    await injectInstantStyles();
    await takeElement('div[class*="card"], div[class*="successCard"]', '09_auth_pago_aprobado.png', { x: 650, y: 200, width: 620, height: 600 });


    // ==========================================
    // 2. CONSOLA SUPERADMIN RECORTADA
    // ==========================================
    console.log('\n--- 2. Recortando Vistas y Modales de SuperAdmin ---');
    await page.goto('http://localhost:5173/login', { waitUntil: 'load' });
    await page.evaluate((tok, usr) => {
        localStorage.setItem('token', tok);
        localStorage.setItem('user', JSON.stringify(usr));
        localStorage.removeItem('branding');
    }, adminToken, adminUser);

    // 10. Dashboard Sistema (Área central de KPIs)
    await page.goto('http://localhost:5173/system/home', { waitUntil: 'load' });
    await injectInstantStyles();
    await takeElement('main, div[class*="container"]', '10_system_dashboard.png');

    // 11. Empresas (Tabla)
    await page.goto('http://localhost:5173/system/companies', { waitUntil: 'load' });
    await injectInstantStyles();
    await takeElement('main, div[class*="container"]', '11_system_empresas.png');

    // 12. Modal Crear Empresa (Recortado al cuadro del diálogo)
    await page.evaluate(() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Empresa') || b.textContent.includes('Registrar'));
        if (btn) btn.click();
    });
    await takeModal('12_system_modal_crear_empresa.png');

    // 13. Planes (Tabla)
    await page.goto('http://localhost:5173/system/plans', { waitUntil: 'load' });
    await injectInstantStyles();
    await takeElement('main, div[class*="container"]', '13_system_planes.png');

    // 13b. Modal Crear Plan
    await page.evaluate(() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Plan'));
        if (btn) btn.click();
    });
    await takeModal('13b_system_modal_crear_plan.png');

    // 14. Suscripciones (Tabla)
    await page.goto('http://localhost:5173/system/subscriptions', { waitUntil: 'load' });
    await injectInstantStyles();
    await takeElement('main, div[class*="container"]', '14_system_suscripciones.png');

    // 15. Usuarios Sistema (Tabla)
    await page.goto('http://localhost:5173/system/users', { waitUntil: 'load' });
    await injectInstantStyles();
    await takeElement('main, div[class*="container"]', '15_system_usuarios.png');

    // 15b. Modal Crear Usuario Sistema
    await page.evaluate(() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Usuario'));
        if (btn) btn.click();
    });
    await takeModal('15b_system_modal_crear_usuario.png');

    // 16. Roles Sistema (Tabla)
    await page.goto('http://localhost:5173/system/roles', { waitUntil: 'load' });
    await injectInstantStyles();
    await takeElement('main, div[class*="container"]', '16_system_roles.png');

    // 16b. Modal Crear Rol Sistema
    await page.evaluate(() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Rol'));
        if (btn) btn.click();
    });
    await takeModal('16b_system_modal_crear_rol.png');

    // 17. Parámetros y Banners
    await page.goto('http://localhost:5173/system/parameters', { waitUntil: 'load' });
    await injectInstantStyles();
    await takeElement('main, div[class*="container"]', '17_system_parametros_banners.png');


    // ==========================================
    // 3. PANEL EMPRESA RECORTADO
    // ==========================================
    console.log('\n--- 3. Recortando Vistas y Modales de Empresa ---');
    await page.evaluate((tok, usr, brn) => {
        localStorage.setItem('token', tok);
        localStorage.setItem('user', JSON.stringify(usr));
        localStorage.setItem('branding', JSON.stringify(brn));
    }, companyToken, companyUser, companyBranding);

    // 18. Dashboard Empresa (Área de bienvenida, KPIs y accesos directos)
    await page.goto('http://localhost:5173/company/home', { waitUntil: 'load' });
    await injectInstantStyles();
    await takeElement('main, div[class*="container"]', '18_company_dashboard.png');

    // 19. Sedes (Tabla)
    await page.goto('http://localhost:5173/company/headquarters', { waitUntil: 'load' });
    await injectInstantStyles();
    await takeElement('main, div[class*="container"]', '19_company_sedes.png');

    // 20. Modal Crear Sede
    await page.evaluate(() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Sede') || b.textContent.includes('Nueva'));
        if (btn) btn.click();
    });
    await takeModal('20_company_modal_crear_sede.png');

    // 21. Áreas (Tabla)
    await page.goto('http://localhost:5173/company/areas', { waitUntil: 'load' });
    await injectInstantStyles();
    await takeElement('main, div[class*="container"]', '21_company_areas.png');

    // 22. Modal Crear Área
    await page.evaluate(() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Área') || b.textContent.includes('Nueva'));
        if (btn) btn.click();
    });
    await takeModal('22_company_modal_crear_area.png');

    // 23. Cargos (Tabla)
    await page.goto('http://localhost:5173/company/cargos', { waitUntil: 'load' });
    await injectInstantStyles();
    await takeElement('main, div[class*="container"]', '23_company_cargos.png');

    // 24. Modal Crear Cargo
    await page.evaluate(() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Cargo') || b.textContent.includes('Nuevo'));
        if (btn) btn.click();
    });
    await takeModal('24_company_modal_crear_cargo.png');

    // 25. Colaboradores (Directorio)
    await page.goto('http://localhost:5173/company/users', { waitUntil: 'load' });
    await injectInstantStyles();
    await takeElement('main, div[class*="container"]', '25_company_colaboradores.png');

    // 26. Modal Crear Colaborador
    await page.evaluate(() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Colaborador') || b.textContent.includes('Nuevo'));
        if (btn) btn.click();
    });
    await takeModal('26_company_modal_colaborador.png');

    // 27. Plantillas (Catálogo)
    await page.goto('http://localhost:5173/company/templates', { waitUntil: 'load' });
    await injectInstantStyles();
    await takeElement('main, div[class*="container"]', '27_company_plantillas.png');

    // 28. Diseñador Canvas
    await page.evaluate(() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Plantilla') || b.textContent.includes('Crear'));
        if (btn) btn.click();
    });
    await delay(500);
    await injectInstantStyles();
    await takeElement('div[class*="canvasContainer"], div[class*="editor"]', '28_company_disenador_canvas.png', { x: 260, y: 80, width: 1400, height: 900 });
    await page.evaluate(() => {
        const close = document.querySelector('svg.lucide-x')?.parentElement;
        if (close) close.click();
    });
    await delay(200);

    // 29. Carnetización (Tabla)
    await page.goto('http://localhost:5173/company/carnets', { waitUntil: 'load' });
    await injectInstantStyles();
    await takeElement('main, div[class*="container"]', '29_company_carnetizacion.png');

    // 29b. Modal Emitir Carnet
    await page.evaluate(() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Emitir'));
        if (btn) btn.click();
    });
    await takeModal('29b_company_modal_emitir_carnet.png');

    // 30. Branding / White-Labeling
    await page.goto('http://localhost:5173/company/parameter', { waitUntil: 'load' });
    await injectInstantStyles();
    await takeElement('main, div[class*="container"]', '30_company_branding_parametros.png');

    // 31. Suscripción y Cuotas
    await page.goto('http://localhost:5173/company/subscription', { waitUntil: 'load' });
    await injectInstantStyles();
    await takeElement('main, div[class*="container"]', '31_company_suscripcion.png');

    console.log('\n=============================================================');
    console.log('🎉 ¡TODAS LAS CAPTURAS RECORTADAS Y PROFESIONALES COMPLETADAS!');
    console.log(`Guardadas en: ${OUT_DIR}`);
    console.log('=============================================================\n');

    process.exit(0);
}

run().catch(err => {
    console.error('Error fatal:', err);
    process.exit(1);
});

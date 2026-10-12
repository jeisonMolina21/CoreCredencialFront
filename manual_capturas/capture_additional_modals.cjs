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

const OUT_DIR = path.resolve(__dirname);

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
    console.log('Conectando a Chrome para capturar modales complementarios...');
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

    async function take(name) {
        await delay(300);
        const filePath = path.join(OUT_DIR, name);
        await page.screenshot({ path: filePath });
        console.log(`[OK] Capturado modal: ${name}`);
    }

    // 1. Modal Crear Plan
    console.log('Capturando modal Crear Plan...');
    await page.goto('http://localhost:5173/login', { waitUntil: 'load' });
    await page.evaluate((tok, usr) => {
        localStorage.setItem('token', tok);
        localStorage.setItem('user', JSON.stringify(usr));
        localStorage.removeItem('branding');
    }, adminToken, adminUser);

    await page.goto('http://localhost:5173/system/plans', { waitUntil: 'load' });
    await injectInstantStyles();
    await page.evaluate(() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Plan'));
        if (btn) btn.click();
    });
    await injectInstantStyles();
    await take('13b_system_modal_crear_plan.png');

    // 2. Modal Crear Usuario Sistema
    console.log('Capturando modal Crear Usuario Sistema...');
    await page.goto('http://localhost:5173/system/users', { waitUntil: 'load' });
    await injectInstantStyles();
    await page.evaluate(() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Usuario'));
        if (btn) btn.click();
    });
    await injectInstantStyles();
    await take('15b_system_modal_crear_usuario.png');

    // 3. Modal Crear Rol Sistema
    console.log('Capturando modal Crear Rol Sistema...');
    await page.goto('http://localhost:5173/system/roles', { waitUntil: 'load' });
    await injectInstantStyles();
    await page.evaluate(() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Rol'));
        if (btn) btn.click();
    });
    await injectInstantStyles();
    await take('16b_system_modal_crear_rol.png');

    // 4. Modal Emitir Carnet (Empresa)
    console.log('Capturando modal Emitir Carnet...');
    await page.evaluate((tok, usr, brn) => {
        localStorage.setItem('token', tok);
        localStorage.setItem('user', JSON.stringify(usr));
        localStorage.setItem('branding', JSON.stringify(brn));
    }, companyToken, companyUser, companyBranding);

    await page.goto('http://localhost:5173/company/carnets', { waitUntil: 'load' });
    await injectInstantStyles();
    await page.evaluate(() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Emitir'));
        if (btn) btn.click();
    });
    await injectInstantStyles();
    await take('29b_company_modal_emitir_carnet.png');

    console.log('¡Todos los modales complementarios han sido capturados!');
    process.exit(0);
}

run().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});

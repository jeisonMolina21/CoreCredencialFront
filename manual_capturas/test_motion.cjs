const puppeteer = require('puppeteer-core');

async function test() {
    console.log('Testing reduced motion...');
    const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
    const page = (await browser.pages())[0];
    await page.bringToFront();
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    
    await page.goto('http://localhost:5173/', { waitUntil: 'load' });
    await page.addStyleTag({
        content: `*, *::before, *::after { animation-duration: 0s !important; transition-duration: 0s !important; }`
    });

    console.log('Taking 01...');
    await page.screenshot({ path: 'manual_capturas/01_public_landing_hero.png' });
    console.log('Taking 02...');
    await page.evaluate(() => window.scrollTo(0, 850));
    await page.screenshot({ path: 'manual_capturas/02_public_landing_servicios.png' });
    console.log('Taking 03...');
    await page.evaluate(() => window.scrollTo(0, 1850));
    await page.screenshot({ path: 'manual_capturas/03_public_landing_planes.png' });
    console.log('Taking 04...');
    await page.evaluate(() => window.scrollTo(0, 2800));
    await page.screenshot({ path: 'manual_capturas/04_public_landing_despliegue.png' });
    console.log('Taking 05...');
    await page.evaluate(() => window.scrollTo(0, 3800));
    await page.screenshot({ path: 'manual_capturas/05_public_landing_cta.png' });
    console.log('ALL 5 LANDING SLICES CAPTURED SUCCESSFULLY!');
    process.exit(0);
}
test().catch(console.error);

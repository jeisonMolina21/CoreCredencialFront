const fs = require('fs');
const jwt = require('f:/personal/CoreCredential-Back-main/node_modules/jsonwebtoken');
const JWT_SECRET = '9f2e4a8c16b32d64f0e1d2c3b4a59876';

const adminToken = jwt.sign({ id: 1, email: 'Admin@admin', role: 'admin', type: 'system' }, JWT_SECRET, { expiresIn: '24h' });
const adminUser = { id: 1, name: 'Administrador del Sistema', email: 'Admin@admin', role: 'admin', system_role: 'admin', type: 'system' };

async function run() {
    const ws = new WebSocket('ws://127.0.0.1:9222/devtools/page/27241A0104A801FB016D64F12459FB3E');
    await new Promise(r => ws.onopen = r);

    let nextId = 1;
    const pending = new Map();
    ws.onmessage = (e) => {
        const msg = JSON.parse(e.data);
        if (msg.id && pending.has(msg.id)) {
            pending.get(msg.id)(msg.result);
            pending.delete(msg.id);
        }
    };
    function send(method, params = {}) {
        const id = nextId++;
        return new Promise(r => {
            pending.set(id, r);
            ws.send(JSON.stringify({ id, method, params }));
        });
    }

    // 1. Set localStorage first
    await send('Runtime.evaluate', {
        expression: `
            localStorage.setItem('token', '${adminToken}');
            localStorage.setItem('user', JSON.stringify(${JSON.stringify(adminUser)}));
            localStorage.removeItem('branding');
            window.location.href = '/system/home';
        `
    });

    // Wait 2.5s for React router to render /system/home
    await new Promise(r => setTimeout(r, 2500));

    // Capture
    const res = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('manual_capturas/test_system_home.png', Buffer.from(res.data, 'base64'));
    console.log('Saved test_system_home.png, size:', res.data.length);
    ws.close();
    process.exit(0);
}
run();

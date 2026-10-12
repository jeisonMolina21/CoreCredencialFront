const fs = require('fs');

async function test() {
    const ws = new WebSocket('ws://127.0.0.1:9222/devtools/page/27241A0104A801FB016D64F12459FB3E');
    
    await new Promise((resolve, reject) => {
        ws.onopen = resolve;
        ws.onerror = reject;
    });
    console.log('WS Open');

    let nextId = 1;
    function send(method, params = {}) {
        const id = nextId++;
        return new Promise((resolve) => {
            const handler = (event) => {
                const msg = JSON.parse(event.data);
                if (msg.id === id) {
                    ws.removeEventListener('message', handler);
                    resolve(msg.result);
                }
            };
            ws.addEventListener('message', handler);
            ws.send(JSON.stringify({ id, method, params }));
        });
    }

    const res = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('manual_capturas/test_fast.png', Buffer.from(res.data, 'base64'));
    console.log('Saved test_fast.png successfully! Length:', res.data.length);
    ws.close();
    process.exit(0);
}

test().catch(err => {
    console.error(err);
    process.exit(1);
});

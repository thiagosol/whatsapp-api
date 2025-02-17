const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { saveMessage } = require('./db');

const client = new Client({
    authStrategy: new LocalAuth({ dataPath: './.wwebjs_auth' }),
    puppeteer: {
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--disable-gpu'
        ]
    }
});

function initializeWhatsApp() {
    client.on('qr', qr => {
        console.log('Escaneie o QR Code abaixo para conectar ao WhatsApp:');
        qrcode.generate(qr, { small: true });
    });

    client.on('ready', () => {
        console.log('WhatsApp conectado!');
    });

    client.initialize();
}

async function sendMessage(recipient, recipientType, message) {
    try {
        const formattedRecipient = recipientType === 'group' ? recipient : `${recipient}@c.us`;
        await client.sendMessage(formattedRecipient, message);
        await saveMessage(recipient, recipientType, message);
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        throw error;
    }
}

module.exports = { initializeWhatsApp, sendMessage };

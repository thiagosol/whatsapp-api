const express = require('express');
const bodyParser = require('body-parser');
const { validateToken } = require('./db');
const { initializeWhatsApp, sendMessage } = require('./whatsapp');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use(async (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }
    const isValid = await validateToken(token);
    if (!isValid) {
        return res.status(403).json({ error: 'Token inválido ou expirado' });
    }
    next();
});

app.post('/send', async (req, res) => {
    const { recipient, recipientType, message } = req.body;
    if (!recipient || !recipientType || !message) {
        return res.status(400).json({ error: 'Número, tipo de destinatário e mensagem são obrigatórios' });
    }
    
    if (!['individual', 'group'].includes(recipientType)) {
        return res.status(400).json({ error: 'recipientType deve ser individual ou group' });
    }

    try {
        await sendMessage(recipient, recipientType, message);
        res.json({ success: true, message: 'Mensagem enviada com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao enviar mensagem', details: error.message });
    }
});

initializeWhatsApp();

app.listen(port, () => {
    console.log(`API rodando na porta ${port}`);
});

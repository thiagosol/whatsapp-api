const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.WPP_DB_USER,
    host: process.env.WPP_DB_HOST,
    database: "whatsapp-api",
    password: process.env.WPP_DB_PASS,
    port: 5432,
});

async function validateToken(token) {
    try {
        const result = await pool.query('SELECT 1 FROM tokens WHERE token = $1 AND expires_at > NOW()', [token]);
        return result.rowCount > 0;
    } catch (error) {
        console.error('Erro ao validar token:', error);
        return false;
    }
}

async function saveMessage(recipient, recipientType, message) {
    try {
        await pool.query(
            'INSERT INTO messages (recipient, recipient_type, message) VALUES ($1, $2, $3)',
            [recipient, recipientType, message]
        );
    } catch (error) {
        console.error('Erro ao salvar mensagem no banco:', error);
    }
}

module.exports = { validateToken, saveMessage };

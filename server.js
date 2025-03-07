require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// Connexion PostgreSQL
const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: 5432,
});

const connectWithRetry = () => {
    pool.connect()
        .then(() => console.log('✅ Connecté à PostgreSQL'))
        .catch(err => {
            console.error('⏳ PostgreSQL indisponible, nouvelle tentative dans 5 secondes...', err);
            setTimeout(connectWithRetry, 5000);
        });
};

connectWithRetry();

app.get('/', (req, res) => {
    res.send('Bienvenue sur mon API de gestion de tâches 🚀');
});

// Routes API
app.get('/tasks', async (req, res) => {
    const result = await pool.query('SELECT * FROM tasks');
    res.json(result.rows);
});

app.post('/createtasks', async (req, res) => {
    const { task } = req.body;
    const result = await pool.query('INSERT INTO tasks (name) VALUES ($1) RETURNING *', [task]);
    res.json(result.rows[0]);
});

app.delete('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
    res.sendStatus(204);
});

app.listen(port, () => {
    console.log(`🚀 Serveur en écoute sur http://localhost:${port}`);
});

import express from 'express';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import apiRouter from './src/index.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

// ==========================================
// SWAGGER DOCUMENTATION
// ==========================================
if (fs.existsSync('./swagger-output.json')) {
    const swaggerDocument = JSON.parse(fs.readFileSync('./swagger-output.json', 'utf-8'));
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} else {
    console.warn('⚠️ Fichier swagger-output.json introuvable. Lancez `npm run swagger`.');
}


// ==========================================
// MONTAGE DU ROUTEUR PRINCIPAL (/api)
// ==========================================
app.use('/api', apiRouter);

// ==========================================
// ROUTE DE BASE (Healthcheck)
// ==========================================
app.get('/', (req, res) => {
    res.json({ message: 'Serveur TGR fonctionnel avec ES Modules !' });
});

// ==========================================
// DÉMARRAGE DU SERVEUR
// ==========================================
app.listen(PORT, () => {
    console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
    console.log(`📚 Documentation Swagger : http://localhost:${PORT}/api-docs`);
});

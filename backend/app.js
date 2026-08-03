// Patch global pour sérialiser correctement les BigInt avec JSON.stringify (retournés par Prisma)
BigInt.prototype.toJSON = function () {
  return this.toString();
};

import dotenv from 'dotenv';
if (process.env.NODE_ENV === 'test') {
    dotenv.config({ path: '.env.test' });
} else {
    dotenv.config();
}
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import apiRouter from './src/index.js';
import { globalErrorHandler } from './src/middleware/errorHandler.middleware.js';

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // URL par défaut de Vite
  credentials: true // Très important pour autoriser les cookies (Refresh Token)
}));
app.use(express.json());
app.use(cookieParser());

// ==========================================
// SWAGGER DOCUMENTATION
// ==========================================
if (fs.existsSync('./swagger-output.json')) {
    const swaggerDocument = JSON.parse(fs.readFileSync('./swagger-output.json', 'utf-8'));
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} else {
    // Ne pas afficher d'avertissement en environnement de test
    if (process.env.NODE_ENV !== 'test') {
        console.warn('⚠️ Fichier swagger-output.json introuvable. Lancez `npm run swagger`.');
    }
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

// Middleware de gestion globale des erreurs
app.use(globalErrorHandler);

export default app;

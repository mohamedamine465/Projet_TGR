import { execSync } from 'child_process';
import dotenv from 'dotenv';

export default async () => {
    console.log('\n⏳ Préparation de la base de données de test (tgr_test_db)...');
    
    // On s'assure d'utiliser l'environnement de test
    process.env.NODE_ENV = 'test';
    
    // Charger explicitement .env.test pour avoir DATABASE_URL sans le hardcoder
    dotenv.config({ path: '.env.test' });
    
    try {
        // Appliquer le schéma Prisma sur la base de test
        execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
        console.log('✅ Base de test prête.');
    } catch (error) {
        console.error('❌ Erreur lors de la préparation de la DB de test:', error);
        process.exit(1);
    }
};

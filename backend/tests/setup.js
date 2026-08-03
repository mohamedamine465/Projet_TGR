import { jest } from '@jest/globals';
import { prisma } from '../src/config/db.js';
import jwt from 'jsonwebtoken';

beforeEach(async () => {
    // Vider toutes les tables avant chaque test pour repartir sur une DB propre
    const tablenames = await prisma.$queryRaw`SELECT tablename FROM pg_tables WHERE schemaname='public'`;
    for (const { tablename } of tablenames) {
        if (tablename !== '_prisma_migrations') {
            try {
                await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${tablename}" CASCADE;`);
            } catch (error) {
                console.log({ error });
            }
        }
    }

    // Réinsérer les données minimales (Types, Profils)
    const typeAdmin = await prisma.typeUtilisateur.create({ data: { libelleType: 'Administrateur' } });
    const profilAdmin = await prisma.profil.create({ data: { libelleProfil: 'Dette du Tresor' } });

    // Créer un admin factice pour les tests avec un mot de passe non temporaire (dateDernierAcces n'est pas null)
    const user = await prisma.utilisateur.create({
        data: {
            nom: 'Admin',
            prenom: 'Test',
            email: 'admin.test@tgr.gov.ma',
            password: 'hash',
            dateDernierAcces: new Date(),
            typeUtilisateurId: typeAdmin.idType,
            profils: { connect: [{ idProfil: profilAdmin.idProfil }] }
        }
    });

    // Générer un token pour cet admin
    const token = jwt.sign({ userId: user.idUtilisateur }, process.env.JWT_SECRET || 'TEST_SECRET', { expiresIn: '1h' });
    global.testToken = token;
    global.testUserId = user.idUtilisateur;
});

afterAll(async () => {
    await prisma.$disconnect();
});

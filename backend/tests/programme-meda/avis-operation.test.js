import request from 'supertest';
import { prisma } from '#config/db.js';
import { default as app } from '../../app.js';

describe('Avis Operation - Integration Tests', () => {
  let projetId;

  beforeEach(async () => {
    const projet = await prisma.projet.create({
      data: {
        gestion: 2024,
        datePEC: new Date(),
        don: { create: { numDon: 11, objet: 'Test' } }
      }
    });
    projetId = projet.idProjet;

    await prisma.depense.create({
      data: {
        datePEC: new Date(),
        dateEcheance: new Date(),
        projetId: projetId,
        createdById: global.testUserId,
        avisOperation: {
          create: {
            numFacture: 12345,
            montantDispo: 20000,
            partFinancee: 5000
          }
        }
      }
    });
  });

  describe('GET /api/programme-meda/avis-operations', () => {
    it('doit lister les avis d\'opérations', async () => {
      const response = await request(app)
        .get('/api/programme-meda/avis-operations')
        .set('Authorization', `Bearer ${global.testToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].avisOperation.numFacture).toBe(12345);
    });
  });

  describe('POST /api/programme-meda/avis-operations', () => {
    it('doit créer un avis d\'opération', async () => {
      const response = await request(app)
        .post('/api/programme-meda/avis-operations')
        .set('Authorization', `Bearer ${global.testToken}`)
        .send({
          projetId: projetId,
          datePEC: '2025-01-01',
          dateEcheance: '2025-02-01',
          numFacture: 98765,
          montantDispo: 50000,
          partFinancee: 10000
        });
      
      expect(response.status).toBe(201);
      expect(response.body.data.avisOperation.numFacture).toBe(98765);
      expect(response.body.data.avisOperation.partFinancee).toBe(10000);
    });
  });
});

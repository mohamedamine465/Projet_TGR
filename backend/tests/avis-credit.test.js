import request from 'supertest';
import { prisma } from '#config/db.js';
import { default as app } from '../app.js';

describe('Avis de Crédit - Integration Tests (Vraie BDD)', () => {
  let pretId = 101n;
  let preteurId = 101;

  beforeEach(async () => {
    await prisma.preteur.create({
      data: {
        codeCategorie: preteurId,
        maturite: 'C',
        designation: 'Preteur 101'
      }
    });

    await prisma.pret.create({
      data: {
        numPret: pretId,
        dateCreation: new Date(),
        objet: 'Test Credit',
        soldeCourant: 1000n,
        numEmprunt: 'EMP-101',
        preteurId: preteurId,
        updatedById: global.testUserId
      }
    });
  });

  describe('POST /api/dette-tresor/avis-credits', () => {
    it('doit créer un avis de crédit', async () => {
      const response = await request(app)
        .post('/api/dette-tresor/avis-credits')
        .set('Authorization', `Bearer ${global.testToken}`)
        .send({
          pretId: Number(pretId),
          montant: 500,
          taux: 5,
          datePEC: '2024-01-02T00:00:00Z',
          dateEcheance: '2024-01-02T00:00:00Z'
        });
      expect(response.status).toBe(201);
    });
  });

  describe('GET /api/dette-tresor/avis-credits', () => {
    it('doit lister les avis de crédit', async () => {
      await prisma.recette.create({
        data: {
          pretId: pretId,
          datePEC: new Date(),
          dateEcheance: new Date(),
          createdById: global.testUserId,
          avisCredit: {
            create: { montant: 100, taux: 5 }
          }
        }
      });
      const response = await request(app).get('/api/dette-tresor/avis-credits').set('Authorization', `Bearer ${global.testToken}`);
      expect(response.status).toBe(200);
      expect(response.body.data.length).toBeGreaterThan(0);
    });
  });
});

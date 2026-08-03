import request from 'supertest';
import { prisma } from '#config/db.js';
import { default as app } from '../app.js';

describe('Ordres de Paiement - Integration Tests (Vraie BDD)', () => {
  let pretId = 102n;
  let preteurId = 102;
  let avisDebitId;

  beforeEach(async () => {
    await prisma.preteur.create({
      data: {
        codeCategorie: preteurId,
        maturite: 'L',
        designation: 'Preteur OP'
      }
    });

    await prisma.pret.create({
      data: {
        numPret: pretId,
        dateCreation: new Date(),
        objet: 'Test OP',
        soldeCourant: 1000n,
        numEmprunt: 'EMP-102',
        preteurId: preteurId,
        updatedById: global.testUserId
      }
    });

    const depense = await prisma.depense.create({
      data: {
        pretId: pretId,
        datePEC: new Date(),
        dateEcheance: new Date(),
        createdById: global.testUserId,
        avisDebit: {
          create: { type: 'Frais', montantCapital: 100, montantInteret: 0, montantCommission: 0, taux: 0, dateDepense: new Date() }
        }
      }
    });
    avisDebitId = depense.codeDepense;
  });

  describe('POST /api/dette-tresor/ordres-paiement', () => {
    it('doit créer un OP', async () => {
      const response = await request(app)
        .post('/api/dette-tresor/ordres-paiement')
        .set('Authorization', `Bearer ${global.testToken}`)
        .send({
          depensesIds: [avisDebitId],
          pretId: Number(pretId),
          datePEC: '2024-01-01T00:00:00Z',
          dateEcheance: '2024-02-01T00:00:00Z',
          montantCapital: 100,
          montantInteret: 10,
          montantCommission: 5,
          numlettre: 999
        });
      expect(response.status).toBe(201);
    });
  });

  describe('GET /api/dette-tresor/ordres-paiement', () => {
    it('doit lister les OP', async () => {
      await prisma.ordrePaiement.create({
        data: {
          datePEC: new Date(),
          dateEcheance: new Date(),
          montantCapital: 100,
          montantInteret: 0,
          montantCommission: 0,
          numlettre: 12345,
          createdById: global.testUserId,
          pretId: pretId
        }
      });
      const response = await request(app).get('/api/dette-tresor/ordres-paiement').set('Authorization', `Bearer ${global.testToken}`);
      expect(response.status).toBe(200);
      expect(response.body.data.length).toBeGreaterThan(0);
    });
  });
});

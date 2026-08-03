import request from 'supertest';
import { prisma } from '#config/db.js';
import { default as app } from '../../app.js';

describe('Avis de Débit - Integration Tests avec Vraie BDD', () => {
  let pretId = 12345n;
  let preteurId = 123;

  beforeEach(async () => {
    await prisma.preteur.create({
      data: {
        codeCategorie: preteurId,
        maturite: 'C',
        designation: 'Preteur Test'
      }
    });

    await prisma.pret.create({
      data: {
        numPret: pretId,
        dateCreation: new Date(),
        objet: 'Projet Test',
        soldeCourant: 1000n,
        numEmprunt: 'EMP-123',
        preteurId: preteurId,
        updatedById: global.testUserId
      }
    });
  });

  describe('POST /api/dette-tresor/avis-debits', () => {
    it('doit créer un avis de débit (201 Created)', async () => {
      const payload = {
        pretId: Number(pretId),
        type: 'Amortissement',
        montantCapital: 1000,
        montantInteret: 50,
        montantCommission: 10,
        taux: 5,
        dateDepense: '2024-05-15T00:00:00.000Z',
        datePEC: '2024-05-16T00:00:00.000Z',
        dateEcheance: '2024-06-16T00:00:00.000Z'
      };

      const response = await request(app)
        .post('/api/dette-tresor/avis-debits')
        .set('Authorization', `Bearer ${global.testToken}`)
        .send(payload);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.codeDepense).toBeDefined();
    });
  });

  describe('GET /api/dette-tresor/avis-debits', () => {
    it('doit retourner la liste des avis de débits (200 OK)', async () => {
      await prisma.depense.create({
        data: {
          pretId: pretId,
          datePEC: new Date(),
          dateEcheance: new Date(),
          createdById: global.testUserId,
          avisDebit: {
            create: {
              type: 'Frais bancaires',
              montantCapital: 500,
              montantInteret: 0,
              montantCommission: 0,
              taux: 0,
              dateDepense: new Date()
            }
          }
        }
      });

      const response = await request(app)
        .get('/api/dette-tresor/avis-debits')
        .set('Authorization', `Bearer ${global.testToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data[0].avisDebit.type).toBe('Frais bancaires');
    });
  });

  describe('GET /api/dette-tresor/avis-debits/:id', () => {
    it('doit retourner un avis de débit par ID', async () => {
      const depense = await prisma.depense.create({
        data: {
          pretId: pretId,
          datePEC: new Date(),
          dateEcheance: new Date(),
          createdById: global.testUserId,
          avisDebit: {
            create: { type: 'UniqueType', montantCapital: 500, montantInteret: 0, montantCommission: 0, taux: 0, dateDepense: new Date() }
          }
        }
      });

      const response = await request(app)
        .get(`/api/dette-tresor/avis-debits/${depense.codeDepense}`)
        .set('Authorization', `Bearer ${global.testToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.codeDepense).toBe(depense.codeDepense);
    });
  });

  describe('PUT /api/dette-tresor/avis-debits/:id', () => {
    it('doit mettre à jour un avis de débit', async () => {
      const depense = await prisma.depense.create({
        data: {
          pretId: pretId,
          datePEC: new Date(),
          dateEcheance: new Date(),
          createdById: global.testUserId,
          avisDebit: {
            create: { type: 'AncienType', montantCapital: 500, montantInteret: 0, montantCommission: 0, taux: 0, dateDepense: new Date() }
          }
        }
      });

      const payload = { type: 'NouveauTypeUpdate', montantCapital: 800 };

      const response = await request(app)
        .put(`/api/dette-tresor/avis-debits/${depense.codeDepense}`)
        .set('Authorization', `Bearer ${global.testToken}`)
        .send(payload);

      expect(response.status).toBe(200);

      const updated = await prisma.avisDebit.findUnique({ where: { depenseId: depense.codeDepense } });
      expect(updated.type).toBe('NouveauTypeUpdate');
    });
  });

  describe('DELETE /api/dette-tresor/avis-debits/:id', () => {
    it('doit supprimer un avis de débit', async () => {
      const depense = await prisma.depense.create({
        data: {
          pretId: pretId,
          datePEC: new Date(),
          dateEcheance: new Date(),
          createdById: global.testUserId,
          avisDebit: {
            create: { type: 'To Delete', montantCapital: 500, montantInteret: 0, montantCommission: 0, taux: 0, dateDepense: new Date() }
          }
        }
      });

      const response = await request(app)
        .delete(`/api/dette-tresor/avis-debits/${depense.codeDepense}`)
        .set('Authorization', `Bearer ${global.testToken}`);

      expect(response.status).toBe(200);

      const found = await prisma.depense.findUnique({ where: { codeDepense: depense.codeDepense } });
      expect(found).toBeNull();
    });
  });
});

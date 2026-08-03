import request from 'supertest';
import { prisma } from '#config/db.js';
import { default as app } from '../../app.js';

describe('Approvisionnement - Integration Tests', () => {
  let projetId;
  let recetteId;

  beforeEach(async () => {
    const projet = await prisma.projet.create({
      data: {
        gestion: 2024,
        datePEC: new Date(),
        don: { create: { numDon: 10, objet: 'Test' } }
      }
    });
    projetId = projet.idProjet;

    const recette = await prisma.recette.create({
      data: {
        datePEC: new Date(),
        dateEcheance: new Date(),
        projetId: projetId,
        createdById: global.testUserId,
        approvisionnement: {
          create: {
            cumulApprovis: 1,
            montantApprovis: 5000,
            reference: 'REF-123',
            numAvance: 1
          }
        }
      }
    });
    recetteId = recette.codeRecette;
  });

  describe('GET /api/programme-meda/approvisionnements', () => {
    it('doit lister les approvisionnements', async () => {
      const response = await request(app)
        .get('/api/programme-meda/approvisionnements')
        .set('Authorization', `Bearer ${global.testToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].approvisionnement.reference).toBe('REF-123');
    });
  });

  describe('POST /api/programme-meda/approvisionnements', () => {
    it('doit créer un approvisionnement', async () => {
      const response = await request(app)
        .post('/api/programme-meda/approvisionnements')
        .set('Authorization', `Bearer ${global.testToken}`)
        .send({
          projetId: projetId,
          datePEC: '2025-01-01',
          dateEcheance: '2025-02-01',
          montantApprovis: 10000,
          cumulApprovis: 2,
          numAvance: 2,
          reference: 'REF-999'
        });
      
      expect(response.status).toBe(201);
      expect(response.body.data.approvisionnement.reference).toBe('REF-999');
      expect(response.body.data.approvisionnement.montantApprovis).toBe(10000);
    });
  });
});

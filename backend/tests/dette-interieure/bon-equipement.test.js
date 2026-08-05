import request from 'supertest';
import { prisma } from '#config/db.js';
import { default as app } from '../../app.js';

describe('Bon d\'Equipement - Integration Tests', () => {
  let bonId = 2000;

  beforeEach(async () => {
    await prisma.bonEquipement.create({
      data: {
        numBon: bonId,
        dateSouscription: new Date(),
        montant: 50000.00,
        datePEC: new Date()
      }
    });
  });

  describe('GET /api/dette-interieure/bons-equipement', () => {
    it('doit lister les bons d\'équipement', async () => {
      const response = await request(app).get('/api/dette-interieure/bons-equipement').set('Authorization', `Bearer ${global.testToken}`);
      expect(response.status).toBe(200);
      expect(response.body.data.length).toBeGreaterThan(0);
    });
  });

  describe('POST /api/dette-interieure/bons-equipement', () => {
    it('doit créer un bon d\'équipement', async () => {
      const response = await request(app)
        .post('/api/dette-interieure/bons-equipement')
        .set('Authorization', `Bearer ${global.testToken}`)
        .send({
          numBon: 2001,
          dateSouscription: '2024-01-01T00:00:00Z',
          montant: 10000,
          datePEC: '2024-01-05T00:00:00Z'
        });
      expect(response.status).toBe(201);
      expect(response.body.data).toHaveProperty('numBon');
    });
  });

  describe('DELETE /api/dette-interieure/bons-equipement/:id', () => {
    it('doit supprimer un bon d\'équipement', async () => {
      const response = await request(app).delete(`/api/dette-interieure/bons-equipement/${bonId}`).set('Authorization', `Bearer ${global.testToken}`);
      expect(response.status).toBe(200);
      const check = await prisma.bonEquipement.findUnique({ where: { numBon: bonId } });
      expect(check).toBeNull();
    });
  });
});

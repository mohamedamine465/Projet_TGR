import request from 'supertest';
import { prisma } from '#config/db.js';
import { default as app } from '../../app.js';

describe('Adjudication - Integration Tests', () => {
  let adjId = 1000;

  beforeEach(async () => {
    await prisma.adjudication.create({
      data: {
        idAdjudication: adjId,
        dateJouissance: new Date(),
        maturite: '10 ans',
        taux: 3.5,
        montant: 1000000.50
      }
    });
  });

  describe('GET /api/dette-interieure/adjudications', () => {
    it('doit lister les adjudications', async () => {
      const response = await request(app).get('/api/dette-interieure/adjudications').set('Authorization', `Bearer ${global.testToken}`);
      expect(response.status).toBe(200);
      expect(response.body.data.length).toBeGreaterThan(0);
    });
  });

  describe('POST /api/dette-interieure/adjudications', () => {
    it('doit créer une adjudication', async () => {
      const response = await request(app)
        .post('/api/dette-interieure/adjudications')
        .set('Authorization', `Bearer ${global.testToken}`)
        .send({
          idAdjudication: 1001,
          dateJouissance: '2024-01-01T00:00:00Z',
          maturite: '10 ans',
          taux: 4.5,
          montant: 500000
        });
      expect(response.status).toBe(201);
      expect(response.body.data).toHaveProperty('idAdjudication');
    });
  });

  describe('DELETE /api/dette-interieure/adjudications/:id', () => {
    it('doit supprimer une adjudication', async () => {
      const response = await request(app).delete(`/api/dette-interieure/adjudications/${adjId}`).set('Authorization', `Bearer ${global.testToken}`);
      expect(response.status).toBe(200);
      const check = await prisma.adjudication.findUnique({ where: { idAdjudication: adjId } });
      expect(check).toBeNull();
    });
  });
});

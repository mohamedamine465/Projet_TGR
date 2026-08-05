import request from 'supertest';
import { prisma } from '#config/db.js';
import { default as app } from '../../app.js';

describe('Commission - Integration Tests', () => {
  describe('GET /api/dette-interieure/commissions/bordereaux', () => {
    it('doit lister les bordereaux', async () => {
      const response = await request(app).get('/api/dette-interieure/commissions/bordereaux').set('Authorization', `Bearer ${global.testToken}`);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('POST /api/dette-interieure/commissions/bordereaux', () => {
    it('doit créer un bordereau', async () => {
      const response = await request(app)
        .post('/api/dette-interieure/commissions/bordereaux')
        .set('Authorization', `Bearer ${global.testToken}`)
        .send({ numDecompte: 1, montantBordereau: 5000 });
      expect(response.status).toBe(201);
      expect(response.body.data).toHaveProperty('numBord');
    });
  });
});

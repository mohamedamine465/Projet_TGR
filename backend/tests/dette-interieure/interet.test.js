import request from 'supertest';
import { prisma } from '#config/db.js';
import { default as app } from '../../app.js';

describe('Interet - Integration Tests', () => {
  describe('GET /api/dette-interieure/interets', () => {
    it('doit lister les intérêts', async () => {
      const response = await request(app).get('/api/dette-interieure/interets').set('Authorization', `Bearer ${global.testToken}`);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('POST /api/dette-interieure/interets', () => {
    it('doit calculer et créer un intérêt (et sa dépense parent)', async () => {
      const response = await request(app)
        .post('/api/dette-interieure/interets')
        .set('Authorization', `Bearer ${global.testToken}`)
        .send({
          annee: 2026,
          trimestre: 1,
          tauxInteret: 2.5,
          nbreJour: 90
        });
      expect(response.status).toBe(201);
      expect(response.body.data).toHaveProperty('idInteret');
      expect(response.body.data).toHaveProperty('depenseId');
    });
  });
});

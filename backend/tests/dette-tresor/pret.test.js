import request from 'supertest';
import { prisma } from '#config/db.js';
import { default as app } from '../../app.js';

describe('Prêt - Integration Tests (Vraie BDD)', () => {
  let pretId = 100n;
  let preteurId = 999;

  beforeEach(async () => {
    await prisma.preteur.create({
      data: {
        codeCategorie: preteurId,
        maturite: 'C',
        designation: 'Preteur Init'
      }
    });

    await prisma.pret.create({
      data: {
        numPret: pretId,
        dateCreation: new Date(),
        objet: 'Test Init',
        soldeCourant: 5000n,
        numEmprunt: 'EMP-999',
        preteurId: preteurId,
        updatedById: global.testUserId
      }
    });
  });

  describe('GET /api/dette-tresor/prets', () => {
    it('doit lister les prêts', async () => {
      const response = await request(app).get('/api/dette-tresor/prets').set('Authorization', `Bearer ${global.testToken}`);
      expect(response.status).toBe(200);
      expect(response.body.data.length).toBeGreaterThan(0);
    });
  });

  describe('POST /api/dette-tresor/prets', () => {
    it('doit créer un prêt', async () => {
      await prisma.preteur.create({
        data: {
          codeCategorie: 888,
          maturite: 'M',
          designation: 'Preteur Nouveau'
        }
      });
      const response = await request(app)
        .post('/api/dette-tresor/prets')
        .set('Authorization', `Bearer ${global.testToken}`)
        .send({
          numPret: 200,
          dateCreation: '2024-01-01T00:00:00Z',
          objet: 'Nouveau Pret',
          soldeCourant: 100,
          numEmprunt: 'EMP-200',
          preteurId: 888
        });
      expect(response.status).toBe(201);
      expect(response.body.data.numPret).toBe("200");
    });
  });

  describe('GET /api/dette-tresor/prets/:id', () => {
    it('doit récupérer un prêt', async () => {
      const response = await request(app).get(`/api/dette-tresor/prets/${Number(pretId)}`).set('Authorization', `Bearer ${global.testToken}`);
      expect(response.status).toBe(200);
      expect(response.body.data.numPret).toBe(String(pretId));
    });
  });

  describe('PUT /api/dette-tresor/prets/:id', () => {
    it('doit mettre à jour un prêt', async () => {
      const response = await request(app).put(`/api/dette-tresor/prets/${Number(pretId)}`).set('Authorization', `Bearer ${global.testToken}`).send({ objet: 'Modifié' });
      expect(response.status).toBe(200);
      expect(response.body.data.objet).toBe('Modifié');
    });
  });

  describe('DELETE /api/dette-tresor/prets/:id', () => {
    it('doit supprimer un prêt', async () => {
      const response = await request(app).delete(`/api/dette-tresor/prets/${Number(pretId)}`).set('Authorization', `Bearer ${global.testToken}`);
      expect(response.status).toBe(200);
      const check = await prisma.pret.findUnique({ where: { numPret: pretId } });
      expect(check).toBeNull();
    });
  });
});

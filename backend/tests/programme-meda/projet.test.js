import request from 'supertest';
import { prisma } from '#config/db.js';
import { default as app } from '../../app.js';

describe('Projet - Integration Tests', () => {
  let projetId;

  beforeEach(async () => {
    const projet = await prisma.projet.create({
      data: {
        gestion: 2024,
        datePEC: new Date(),
        superviseurId: global.testUserId,
        don: {
          create: {
            numDon: 101,
            objet: 'Don Init'
          }
        }
      }
    });
    projetId = projet.idProjet;
  });

  describe('GET /api/programme-meda/projets', () => {
    it('doit lister les projets', async () => {
      const response = await request(app)
        .get('/api/programme-meda/projets')
        .set('Authorization', `Bearer ${global.testToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].don).toBeDefined();
    });
  });

  describe('POST /api/programme-meda/projets (DON)', () => {
    it('doit créer un projet de type Don', async () => {
      const response = await request(app)
        .post('/api/programme-meda/projets')
        .set('Authorization', `Bearer ${global.testToken}`)
        .send({
          type: 'DON',
          gestion: 2025,
          datePEC: '2025-01-01',
          numDon: 202,
          objetDon: 'Don pour santé'
        });
      
      expect(response.status).toBe(201);
      expect(response.body.data.gestion).toBe(2025);
      expect(response.body.data.don.numDon).toBe(202);
    });
  });

  describe('POST /api/programme-meda/projets (FOND_ROULEMENT)', () => {
    it('doit créer un projet de type Fond de roulement', async () => {
      await prisma.preteurProjet.create({
        data: {
          codePreteur: 'BAM',
          intitule: 'Bank Al Maghrib'
        }
      });

      const response = await request(app)
        .post('/api/programme-meda/projets')
        .set('Authorization', `Bearer ${global.testToken}`)
        .send({
          type: 'FOND_ROULEMENT',
          gestion: 2025,
          datePEC: '2025-02-01',
          numContrat: 303,
          preteurId: 'BAM'
        });
      
      expect(response.status).toBe(201);
      expect(response.body.data.fondRoulement).toBeDefined();
      expect(response.body.data.fondRoulement.preteurId).toBe('BAM');
    });
  });
});

import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'API TGR - Gestion de la Dette Publique',
    description: 'Documentation de l\'API backend avec Express et Prisma',
    version: '1.0.0',
  },
  host: 'localhost:3000',
  basePath: '/',
  schemes: ['http'],
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'Authorization',
      description: 'Format attendu : Bearer <token>'
    }
  },
  security: [
    { bearerAuth: [] }
  ],
  definitions: {
    Pret: {
      numEmprunt: "EMP-2026",
      objet: "Projet Autoroute",
      soldeCourant: 1500000,
      preteurId: 1
    },
    AvisCredit: {
      pretId: 100,
      taux: 4.5,
      montant: 50000,
      dateEcheance: "2026-12-31",
      datePEC: "2026-07-27"
    }
  }
};

const outputFile = './swagger-output.json';
// Le point d'entrée pour swagger-autogen afin de scanner les routes
const endpointsFiles = ['./server.js'];

// Génère le fichier swagger-output.json
swaggerAutogen()(outputFile, endpointsFiles, doc).then(() => {
  console.log('✅ Documentation Swagger générée avec succès');
});

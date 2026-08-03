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
    },
    OrdrePaiement: {
      datePEC: "2024-05-10T00:00:00Z",
      dateEcheance: "2024-06-10T00:00:00Z",
      montantCapital: 3000,
      montantInteret: 400,
      montantCommission: 60,
      numlettre: 405,
      pretId: 100200,
      echeanceId: 1
    },
    AvisDebit: {
      datePEC: "2024-05-15T00:00:00Z",
      dateEcheance: "2024-06-15T00:00:00Z",
      pretId: 100200,
      dateDepense: "2024-05-16T00:00:00Z",
      taux: 2.5,
      montantCapital: 5000,
      montantInteret: 250,
      montantCommission: 50,
      type: "Frais bancaires"
    },
    Projet: {
      type: "DON",
      gestion: 2025,
      datePEC: "2025-01-01",
      numDon: 202,
      objetDon: "Don pour santé",
      numContrat: 303,
      preteurId: "BAM"
    },
    Approvisionnement: {
      projetId: 1,
      datePEC: "2025-01-01",
      dateEcheance: "2025-02-01",
      montantApprovis: 10000,
      cumulApprovis: 2,
      numAvance: 2,
      reference: "REF-999"
    },
    AvisOperation: {
      projetId: 1,
      datePEC: "2025-01-01",
      dateEcheance: "2025-02-01",
      numFacture: 98765,
      montantDispo: 50000,
      partFinancee: 10000
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

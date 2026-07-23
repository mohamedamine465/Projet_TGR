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
  }
};

const outputFile = './swagger-output.json';
// Le point d'entrée pour swagger-autogen afin de scanner les routes
const endpointsFiles = ['./server.js'];

// Génère le fichier swagger-output.json
swaggerAutogen()(outputFile, endpointsFiles, doc).then(() => {
  console.log('✅ Documentation Swagger générée avec succès');
});

import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    screenshotOnRunFailure: false, // Désactiver les screenshots
    supportFile: 'cypress/support/e2e.js', // Activer le fichier de support
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});

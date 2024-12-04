import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    projectId: "g4s3g2", // ID-ul proiectului tău Cypress
    baseUrl: "http://localhost:5173", 
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}", // Căutăm fișiere de test în directorul cypress/e2e
    setupNodeEvents(on, config) {
      // Aici poți implementa event listeners dacă ai nevoie
    },
  },
});
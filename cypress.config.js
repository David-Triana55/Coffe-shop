import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    setupNodeEvents (on, config) {

    },
    baseUrl: 'http://localhost:3000', // Cambia esto según el puerto de tu aplicación
    specPattern: 'cypress/e2e/**/*.cy.js', // Especifica dónde están tus archivos de prueba
    supportFile: 'cypress/support/commands.js',
    video: false, // Deshabilitar grabación de videos
    screenshotOnRunFailure: false // Deshabilitar capturas de pantalla en caso de fallos
  }
})

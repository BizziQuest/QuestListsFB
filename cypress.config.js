const { defineConfig } = require('cypress')
module.exports = defineConfig({
  projectId: 'e7dr8v',
  fixturesFolder: 'tests/e2e/fixtures',
  screenshotsFolder: 'tests/e2e/screenshots',
  videosFolder: 'tests/e2e/videos',
  experimentalMemoryManagement: true,
  experimentalStudio: true,
  experimentalInteractiveRunEvents: true,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      // return require("./tests/e2e/plugins/index.js")(on, config);
    },
    specPattern: 'tests/e2e/specs/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'tests/e2e/support/index.js',
    experimentalStudio: true,
    experimentalInteractiveRunEvents: true,
    },

  component: {
    devServer: {
      framework: 'vue',
      bundler: 'vite',
    },
    experimentalMemoryManagement: true,
    // experimentalStudio: true,
    experimentalInteractiveRunEvents: true,
  },
});

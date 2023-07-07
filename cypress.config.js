

module.exports = {

  defaultCommandTimeout: 10000,
  projectId: "d75n5r",
  defaultCommandTimeout: 10000,
  reporter: "junit",

  reporterOptions: {
    mochaFile: "cypress/results/junit-results-[hash].xml",
    toConsole: true,
  },

  e2e: {
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config)
    },
  },
};

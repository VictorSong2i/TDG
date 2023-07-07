// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
require('cypress-downloadfile/lib/downloadFileCommand');

let startTime;

Cypress.Commands.add('startTimer', () => {
  startTime = new Date().getTime();
});

Cypress.Commands.add('logExecutionTime', () => {
  const endTime = new Date().getTime();
  const executionTime = endTime - startTime;
  cy.log(`Execution time: ${executionTime}ms`);
});


Cypress.Commands.add('moveCsvToFixtures', (csvFileName) => {
  const downloadsFolder = Cypress.config('downloadsFolder');
  const fixturesFolder = 'cypress/fixtures';

  // Define the source and destination paths
  const sourcePath = `${downloadsFolder}/${csvFileName}`;
  const destinationPath = `${fixturesFolder}/${csvFileName}`;

  // Read the CSV file contents
  cy.readFile(sourcePath, 'utf8')
    .then((fileContents) => {
      // Write the contents to the destination file in fixtures
      cy.writeFile(destinationPath, fileContents, 'utf8');
    })
    .then(() => {
      cy.log(`Moved ${csvFileName} to fixtures folder`);
    })
});



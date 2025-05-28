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

Cypress.Commands.add('login', (email, password) => {
    cy.visit('/'); // sua URL de login
    cy.get('form').within(() => {
      cy.get('input[name="email"]').type(email);
      cy.get('input[name="password"]').type(password);
      cy.get('button[type="submit"]').click();
    });
  });
  
  Cypress.Commands.add('createUser', (username, email, password) => {
    cy.visit('/cadastro');
    cy.get('form').within(() => {
      cy.get('input[name="nome"]').type(username);    // campo "nome"
      cy.get('input[name="email"]').type(email);      // campo "email"
      cy.get('input[name="senha"]').type(password);   // campo "senha"
      cy.get('button[type="submit"]').click();        // botão de cadastro
    });
  });

  Cypress.Commands.add('deleteAllUsers', () => {
    cy.exec('python delect.py', { failOnNonZeroExit: false });
  });
  
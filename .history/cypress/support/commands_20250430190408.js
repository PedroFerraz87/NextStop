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
Cypress.Commands.add('login', () => {
    cy.fixture('users.json').then((user) => {
      cy.request({
        method: 'POST',
        url: '/api/login', // Substitua pelo endpoint real de login
        body: {
          username: user.username,
          password: user.password,
        },
      }).then((response) => {
        // Salvar o token ou dados de sessão para usar nos testes
        window.localStorage.setItem('auth_token', response.body.token);
      });
    });
  });
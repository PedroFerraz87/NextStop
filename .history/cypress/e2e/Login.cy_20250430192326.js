Cypress.Commands.add('deleteAllUsers', () => {
    cy.exec('python delect.py', { failOnNonZeroExit: false });
});

Cypress.Commands.add('login', (username, password) => {
    cy.visit('');
    cy.get('.container').within(() => {
    cy.visit('');
    cy.get('[type="text"]').type(username);
    cy.get('[type="password"]').type(password);
    cy.wait(3000);
    cy.get('[type="submit"]').click();
    });
});

Cypress.Commands.add('createUser', (username, email, password) => {
    cy.visit('cadastro');
    cy.switchToRegister();
    cy.get('.container').within(() => {
    cy.visit('cadastro');
    cy.get('[type="text"]').type(username);
    cy.get('[type="email"]').type(email);
    cy.get('[name="senha"]').type(password);
    cy.get('[name="confirmarSenha"]').type(password);
    cy.wait(3000);
    cy.get('[type="submit"]').click();
    });
});

Cypress.Commands.add('switchToRegister', () => {
    cy.get('p > a').click();
});

describe('Login', () => {
    it('O usuário faz o cadastro e o login inicial', () => {

        cy.visit('cadastro')

        cy.switchToRegister();

        cy.createUser('testuser', 'testuser@example.com', 'password123');

        cy.login('testuser', 'password123');

    });
    it('O usuário faz o cadastro e falha o login.', () =>{
        cy.deleteAllUsers();

        cy.visit('cadastro')

        cy.switchToRegister();

        cy.createUser('testuser', 'testuser@example.com', 'password123');

        cy.login('Nome não Correspondente', 'password123');

    });
});
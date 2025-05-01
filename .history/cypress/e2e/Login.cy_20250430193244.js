Cypress.Commands.add('deleteAllUsers', () => {
    cy.exec('python delect.py', { failOnNonZeroExit: false });
});

Cypress.Commands.add('login', (username, password) => {
    cy.visit('/');
    cy.get('.container').within(() => {
        cy.get('[type="text"]').type(username);
        cy.get('[type="password"]').type(password);
        cy.wait(1000); // Reduzido para testes mais rápidos
        cy.get('[type="submit"]').click();
    });
});

Cypress.Commands.add('createUser', (username, email, password) => {
    cy.visit('/cadastro');
    cy.switchToRegister();
    cy.get('.container').within(() => {
        cy.get('[type="text"]').type(username);
        cy.get('[type="email"]').type(email);
        cy.get('[name="senha"]').type(password);
        cy.get('[name="confirmarSenha"]').type(password);
        cy.wait(1000); // Opcional
        cy.get('[type="submit"]').click();
    });
});

Cypress.Commands.add('switchToRegister', () => {
    // Aguarde o link aparecer ou ajuste o seletor conforme seu HTML
    cy.get('p > a').should('exist').click();
});

describe('Login', () => {
    it('O usuário faz o cadastro e o login inicial', () => {
        cy.createUser('testuser', 'testuser@example.com', 'password123');
        cy.login('testuser', 'password123');
    });

    it('O usuário faz o cadastro e falha o login.', () => {
        cy.createUser('testuser2', 'testuser2@example.com', 'password123');
        cy.login('Nome não Correspondente', 'password123');
    });
});

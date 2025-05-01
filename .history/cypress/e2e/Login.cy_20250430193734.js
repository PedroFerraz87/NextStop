Cypress.Commands.add('deleteAllUsers', () => {
    cy.exec('python delect.py', { failOnNonZeroExit: false });
  });
  
  Cypress.Commands.add('login', (email, password) => {
    cy.visit('/login');
    cy.get('form').within(() => {
      cy.get('input[name="email"]').type(email);
      cy.get('input[name="password"]').type(password);
      cy.get('button[type="submit"]').click();
    });
  });
  
  Cypress.Commands.add('createUser', (username, email, password) => {
    cy.visit('/cadastro');
    cy.get('form').within(() => {
      cy.get('input[name="nome"]').type(username);
      cy.get('input[name="email"]').type(email);
      cy.get('input[name="senha"]').type(password);
      cy.get('input[name="confirmarSenha"]').type(password);
      cy.get('button[type="submit"]').click();
    });
  });
  
  describe('Login', () => {
    it('O usuário faz o cadastro e o login inicial', () => {
      cy.createUser('testuser', 'testuser@example.com', 'password123');
      cy.visit('/login');
      cy.login('testuser@example.com', 'password123');
    });
  
    it('O usuário faz o cadastro e falha o login', () => {
      cy.createUser('testuser2', 'testuser2@example.com', 'password123');
      cy.visit('/login');
      cy.login('emailerrado@example.com', 'password123');
    });
  });
  
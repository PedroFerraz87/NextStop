describe('Página de Viagens Cadastradas', () => {
  beforeEach(() => {
    cy.deleteAllUsers();
    cy.createUser('usuario', 'usuario@example.com', 'senha123');
    cy.login('usuario@example.com', 'senha123');
    cy.visit('/gerenciar'); 
    cy.get('[href="/gerenciar/"]').click();
    cy.get('.text-blue-400').click();
    cy.get('#destino').type('Chile');
    cy.get('.bg-blue-600').click();
  {}
  });
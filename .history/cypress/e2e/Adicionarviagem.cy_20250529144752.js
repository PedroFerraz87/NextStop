describe('Página de Criar Roteiro', () => {
  beforeEach(() => {
    cy.deleteAllUsers();
    cy.createUser('robotestes', 'user@example.com', 'senha1234');
    cy.login('user@example.com', 'senha1234');
    cy.visit('/roteiro');  
  });

  it('Cenário favorável 1: Adiciona o roteiro de viagem com ao menos uma programação', () => { 
    cy.contains('Destino');
    cy.contains('Data de Ida');
    cy.contains('Data de Volta');

    cy.get('input[name="destino"]').type('Paris');
    cy.get('input[name="dataIda"]').type('2025-06-15');
    cy.get('input[name="dataVolta"]').type('2025-06-22');

    cy.get('input[name="dias[]"]').first().type('2025-06-16');
    cy.get('input[name="horarios[]"]').first().type('09:00');
    cy.get('input[name="locais[]"]').first().type('Eiffel Tower');

    cy.intercept('POST', '/roteiro/').as('postRoteiro');
    cy.get('form').within(() => {
      cy.get('button[type="submit"]').click();
    });

  });

  it('Cenário desfavorável 1: Exibe mensagem de erro se campos obrigatórios não forem preenchidos', () => {
    cy.get('form').within(() => {
      cy.get('button[type="submit"]').click();
    });
    cy.url().should('include', '/roteiro');
  });
});

  it('Cenário desfavorável 2: Exibe mensagem de erro se o usuário tentar salvar um roteiro co', () => {


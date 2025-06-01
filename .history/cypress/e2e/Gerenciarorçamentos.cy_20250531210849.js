describe('História 5: Gerenciar Orçamentos', () => {
  
  beforeEach(() => {
    cy.deleteAllUsers();
    cy.createUser('robotestes', 'robo@example.com', 'senha1234');
    cy.login('robo@example.com', 'senha1234');
    
    });

  it('Cenário favorável 1: Deve editar um orçamento salvo corretamente', () => {
    cy.visit('/ver-orcamentos');

    cy.contains('Paris').should('exist');
    cy.contains('Editar').click();

    cy.get('input[name="hospedagem"]').clear().type('1500');
    cy.get('input[name="passagem"]').clear().type('2500');
    cy.get('input[name="alimentacao"]').clear().type('1000');
    cy.get('input[name="passeios"]').clear().type('700');
    cy.get('input[name="extras"]').clear().type('300');

    cy.contains('Salvar alterações').click();

    cy.url().should('include', '/ver-orcamentos');
    cy.contains('Paris').should('exist');
    cy.contains('R$ 6000.00').should('exist');
  });

  it('Cenário favorável 2: Deve excluir um orçamento salvo corretamente', () => {
    cy.visit('/ver-orcamentos');

    cy.contains('Paris').should('exist');
    cy.get('form').contains('Deletar').click();

    cy.contains('Paris').should('not.exist');
    cy.contains('Nenhum orçamento cadastrado ainda.').should('exist');
  });

  it('Cenário desfavorável 1: Deve exibir mensagem quando não há orçamentos cadastrados', () => {
    cy.visit('/ver-orcamentos');
    cy.get('form').contains('Deletar').click();
    cy.contains('Nenhum orçamento cadastrado ainda.').should('exist');
  });

});

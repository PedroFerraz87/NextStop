describe('História 5: Gerenciar Orçamentos', () => {
  
  beforeEach(() => {
    cy.deleteAllUsers();
    cy.createUser('robotestes', 'robo@example.com', 'senha1234');
    cy.login('robo@example.com', 'senha1234');

    cy.createRoteiro({
      destino: 'Paris',
      hospedagem: 1000,
      passagem: 2000,
      alimentacao: 800,
      passeios: 500,
      extras: 200,
      custo_total: 4500
    });
  });

  it('Deve editar um orçamento salvo corretamente', () => {
    cy.visit('/ver-orcamentos');

    cy.contains('Paris').should('exist');
    cy.contains('Editar').click();

    cy.get('input[name="hospedagem"]').clear().type('1500');
    cy.get('input[name="passagem"]').clear().type('2500');
    cy.get('input[name="alimentacao"]').clear().type('1000');
    cy.get('input[name="passeios"]').clear().type('700');
    cy.get('input[name="extras"]').clear().type('300');

    cy.contains('Salvar').click();

    cy.url().should('include', '/ver-orcamentos');
    cy.contains('Paris').should('exist');
    cy.contains('R$ 6000.00').should('exist');
  });

  it('Deve excluir um orçamento salvo corretamente', () => {
    cy.visit('/ver-orcamentos');

    cy.contains('Paris').should('exist');
    cy.get('form').contains('Deletar').click();

    cy.contains('Paris').should('not.exist');
    cy.contains('Nenhum orçamento cadastrado ainda.').should('exist');
  });

  it('Deve exibir mensagem quando não há orçamentos cadastrados', () => {
    cy.visit('/ver-orcamentos');
    cy.get('form').contains('Deletar').click();

    cy.contains('Nenhum orçamento cadastrado ainda.').should('exist');
  });

});

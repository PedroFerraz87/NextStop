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

  // 🟢 Cenário Favorável 1 - Edição de orçamento
  it('Deve editar um orçamento salvo corretamente', () => {
    cy.visit('/ver-orcamentos');

    cy.contains('Paris').should('exist');
    cy.contains('Editar').click();

    // Altera os valores do orçamento
    cy.get('input[name="hospedagem"]').clear().type('1500');
    cy.get('input[name="passagem"]').clear().type('2500');
    cy.get('input[name="alimentacao"]').clear().type('1000');
    cy.get('input[name="passeios"]').clear().type('700');
    cy.get('input[name="extras"]').clear().type('300');

    cy.contains('Salvar').click();

    // Verifica se voltou para a tela de orçamentos e se os dados estão atualizados
    cy.url().should('include', '/ver-orcamentos');
    cy.contains('Paris').should('exist');
    cy.contains('R$ 6000.00').should('exist');
  });

  // 🟢 Cenário Favorável 2 - Exclusão de orçamento
  it('Deve excluir um orçamento salvo corretamente', () => {
    cy.visit('/ver-orcamentos');

    cy.contains('Paris').should('exist');
    cy.get('form').contains('Deletar').click();

    // Após excluir, o orçamento não deve mais aparecer
    cy.contains('Paris').should('not.exist');
    cy.contains('Nenhum orçamento cadastrado ainda.').should('exist');
  });

  // 🔴 Cenário Desfavorável 1 - Nenhum orçamento salvo
  it('Deve exibir mensagem quando não há orçamentos cadastrados', () => {
    // Deleta o orçamento previamente criado
    cy.visit('/ver-orcamentos');
    cy.get('form').contains('Deletar').click();

    // Verifica mensagem de ausência
    cy.contains('Nenhum orçamento cadastrado ainda.').should('exist');
  });

});

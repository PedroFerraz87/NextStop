describe('História 8: Gerenciar Checklist - Editar e Deletar', () => {

  beforeEach(() => {
    cy.deleteAllUsers();
    cy.createUser('robotestes', 'robo@example.com', 'senha1234');
    cy.login('robo@example.com', 'senha1234');

    cy.visit('/checklist');
    cy.get('input[name="item"]').type('Mochila');
    cy.get('button').contains('Adicionar Item').click();
  });

  it('Cenário favorável 1 - Editar um item do checklist', () => {
    cy.contains('Editar').click();
    cy.get('input[name="item"]').clear().type('Mochila de mão');
    cy.get('button').contains('Salvar').click();

    cy.contains('Mochila de mão').should('exist');
  });

  it('Cenário desfavorável 1 - Tentar editar deixando o campo vazio', () => {
    cy.contains('Editar').click();
    cy.get('input[name="item"]').clear();
    cy.get('button').contains('Salvar Alterações').click();

    cy.get('div').contains('Preencha este campo vazio').should('be.visible')

  });

  it('Cenário favorável 2 - Deletar um item do checklist', () => {
    cy.contains('Deletar').click();

    cy.contains('Mochila de mão').should('not.exist');
  });


});

describe('História 4: Orçamento de Viagem', () => {
  beforeEach(() => {
    cy.deleteAllUsers();
    cy.createUser('usuario', 'usuario@example.com', 'senha123');
    cy.login('usuario@example.com', 'senha123');
    cy.visit('/orcamento');
  });

  it('Cenário favorável 1: Calcula e exibe o orçamento total corretamente', () => {
    cy.get('input[name="passagem"]').type('1200');
    cy.get('input[name="hospedagem"]').type('800');
    cy.get('input[name="alimentacao"]').type('500');
    cy.get('input[name="passeios"]').type('300');
    cy.get('input[name="extras"]').type('200');

    cy.get('button').contains('Calcular').click();

    cy.get('#valorTotal')
      .should('exist')
      .and('contain', '3000'); 
  });

  it('Cenário desfavorável 1: Não permite números negativos', () => {
    cy.get('input[name="passagem"]').type('-500');
    cy.get('button').contains('Salvar orçamento').click();

    cy.get('#mensagemErro')
      .should('exist')
      .and('contain', 'O número deve ser maior ou igual a zero');
  });

  it('Cenário favorável 2: Permite alterar centavos com os botões laterais', () => {
    cy.get('input[name="alimentacao"]').clear().type('100.00');

    cy.get('[name="alimentacao"]').parent().find('.increment').click();
    cy.get('[name="alimentacao"]').should('have.value', '100.01');

    // Simula clique no botão lateral de decremento (suponha que exista com a classe .decrement)
    cy.get('[name="alimentacao"]').parent().find('.decrement').click();
    cy.get('[name="alimentacao"]').should('have.value', '100.00');
  });
});

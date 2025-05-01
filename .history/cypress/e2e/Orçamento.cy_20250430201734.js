describe('Funcionalidade: Orçamento de Viagem', () => {

  it('Cenário favorável 1: Deve calcular o valor total estimado da viagem', () => {
    cy.get('select[name="roteiro"]', { timeout: 10000 }).should('be.visible').select('Recife');
cy.get('input[name="hospedagem"]', { timeout: 10000 }).should('be.visible').type('1000');

    cy.get('input[name="passagem"]').type('1500');
    cy.get('input[name="alimentacao"]').type('800');
    cy.get('input[name="passeios"]').type('500');
    cy.get('input[name="extras"]').type('500');
    cy.get('button[type="submit"]').click(); // Alterado para selecionar o botão de submit
    cy.contains('Custo Total: R$ 4300,00').should('be.visible');
  });

  it('Cenário desfavorável 1: O valor deve ser 0 ou maior que 0', () => {
    cy.get('input[name="hospedagem"]').type('-1');
    cy.get('button[type="submit"]').click(); // Alterado para selecionar o botão de submit
    cy.contains('O valor deve ser maior igual a 0.').should('be.visible');
  });

  it('Cenário favorável 2: Deve permitir ajustar centavos com botão lateral', () => {
    cy.get('input[name="alimentacao"]').type('300');
    cy.get('button#incrementar-centavos').click().click();
    cy.get('button[type="submit"]').click(); // Alterado para selecionar o botão de submit
    cy.contains('Total estimado: R$ 300,02').should('be.visible');
  });

});

describe('Funcionalidade: Orçamento de Viagem', () => {

  it('Cenário favorável 1: Deve calcular o valor total estimado da viagem', () => {
    cy.get('input[name="Escolha a viagem"]').click();
    cy.get('input[name="Gasto com Hospedagem (R$)"]').type('1000');
    cy.get('input[name="Gasto com Passagem (R$)"]').type('1500');
    cy.get('input[name="Gasto com Alimentação (R$)"]').type('800');
    cy.get('input[name="Gasto com Passeios (R$)"]').type('500');
    cy.get('input[name="Gastos Extras (R$)"]').type('500');
    cy.get('#salvar-orcamento').click();
    cy.contains('Custo Total: R$ 4300,00').should('be.visible');
  });

  it('Cenário desfavorável 1: O valor deve ser 0 ou maior que 0', () => {
    cy.get('input[name="Gasto com Hospedagem (R$)"]').type('-1');
    cy.get('#salvar-orcamento').click();
    cy.contains('O valor deve ser maior igual a 0.').should('be.visible');
  });

  it('Cenário favorável 2: Deve permitir ajustar centavos com botão lateral', () => {
    cy.get('input[name="Gasto com Alimentação (R$)"]').type('300');
    cy.get('button#incrementar-centavos').click().click();
    cy.get('#salvar-orcamento').click();
    cy.contains('Total estimado: R$ 300,02').should('be.visible');
  });

});

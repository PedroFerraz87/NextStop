describe('História 4: Orçamento de Viagem', () => {
  beforeEach(() => {
    cy.deleteAllUsers();
    cy.createUser('robotestes', 'robo@example.com', 'senha1234');
    cy.login('robo@example.com', 'senha1234');
  });

  it('Cenário favorável 1: Calcula e salva orçamento corretamente', () => {
    cy.visit('/roteiro')
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
    cy.get('select[name="roteiro"]').select('Roma');

    cy.get('select[name="roteiro"]').then(select => {
      const firstOption = select.find('option').first().text();
      cy.get('select[name="roteiro"]').select(firstOption);
    });

    cy.get('input[name="passagem"]').type('1200');
    cy.get('input[name="hospedagem"]').type('800');
    cy.get('input[name="alimentacao"]').type('500');
    cy.get('input[name="passeios"]').type('300');
    cy.get('input[name="extras"]').type('200');

    cy.get('button[type="submit"]').click();

  });

  it('Cenário desfavorável 1: Não permite números negativos', () => {
      cy.get('select[name="roteiro"] option').should('have.length.greaterThan', 0);

      cy.get('input[name="passagem"]').type('-500');
      cy.get('button[type="submit"]').click();

  });

  it('Cenário favorável 2: Permite alterar centavos manualmente', () => {
    cy.get('input[name="alimentacao"]').clear().type('100.00');

    cy.get('input[name="alimentacao"]').invoke('val').then(valor => {
      const novoValor = (parseFloat(valor) + 0.01).toFixed(2);
      cy.get('input[name="alimentacao"]').clear().type(novoValor);
    });

    cy.get('input[name="alimentacao"]').should('have.value', '100.01');

    cy.get('input[name="alimentacao"]').invoke('val').then(valor => {
      const novoValor = (parseFloat(valor) - 0.01).toFixed(2);
      cy.get('input[name="alimentacao"]').clear().type(novoValor);
    });

    cy.get('input[name="alimentacao"]').should('have.value', '100.00');
  });
});

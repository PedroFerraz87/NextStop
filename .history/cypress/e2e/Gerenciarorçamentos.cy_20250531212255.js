describe('História 5: Gerenciar Orçamentos', () => {
  
  beforeEach(() => {
    cy.deleteAllUsers();
    cy.createUser('robotestes', 'robo@example.com', 'senha1234');
    cy.login('robo@example.com', 'senha1234');
    
    });

  it('Cenário favorável 1: Deve editar um orçamento salvo corretamente', () => {
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
    });

    cy.visit('/orcamento');
    cy.get('select[name="roteiro"]').should('exist').select('Paris');

    cy.get('input[name="passagem"]').type('1200');
    cy.get('input[name="hospedagem"]').type('800');
    cy.get('input[name="alimentacao"]').type('500');
    cy.get('input[name="passeios"]').type('300');
    cy.get('input[name="extras"]').type('200');

    cy.get('button[type="submit"]').click();

    cy.visit('/ver_orcamentos');

    cy.contains('Paris').should('exist');
    cy.contains('Editar').click();

    cy.get('input[name="hospedagem"]').clear().type('1500');
    cy.get('input[name="passagem"]').clear().type('2500');
    cy.get('input[name="alimentacao"]').clear().type('1000');
    cy.get('input[name="passeios"]').clear().type('700');
    cy.get('input[name="extras"]').clear().type('300');

    cy.contains('Salvar alterações').click();

    cy.url().should('include', '/ver_orcamentos');
    cy.contains('Paris').should('exist');
    cy.contains('R$ 6000.00').should('exist');
  });

  it('Cenário favorável 2: Deve excluir um orçamento salvo corretamente', () => {
    cy.visit('/ver_orcamentos');

    cy.contains('Paris').should('exist');
    cy.get('form').contains('Deletar').click();

    cy.contains('Paris').should('not.exist');
    cy.contains('Nenhum orçamento cadastrado ainda.').should('exist');
  });

  it('Cenário desfavorável 1: Deve exibir mensagem quando não há orçamentos cadastrados', () => {
    cy.visit('/ver_orcamentos');
    cy.get('form').contains('Deletar').click();
    cy.contains('Nenhum orçamento cadastrado ainda.').should('exist');
  });

});

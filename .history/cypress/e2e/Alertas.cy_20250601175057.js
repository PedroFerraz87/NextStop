describe('História 6: Alertas e lembretes', () => {

  beforeEach(() => {
    cy.deleteAllUsers();
    cy.createUser('robotestes', 'robo@example.com', 'senha1234');
    cy.login('robo@example.com', 'senha1234');
  });

  it('Cenário favorável 1 - Notificação correta para evento próximo', () => {
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
 
    cy.visit('/lembretes')

    cy.get('#mensagem')
      .should('not.have.class', 'opacity-0')
      .and('contain.text', '⚠️ Faltam 10 minutos para: Evento');
  });

  it('Cenário desfavorável 1 - Notificação atrasada por fuso horário incorreto', () => {
    cy.intercept('GET', '/api/lembretes/', {
      statusCode: 200,
      body: [
        {
          titulo: 'Evento Fuso Incorreto',
          evento_iso: new Date(Date.now() - 3 * 3600000 + 10 * 60000).toISOString(),
          min10: 1
        }
      ]
    }).as('getLembretes');

    cy.visit('/lembretes');

    cy.contains('Evento Fuso Incorreto').should('be.visible');

    cy.wait(2000);
    cy.get('#mensagem').should('have.class', 'opacity-0');
  });

  it('Cenário desfavorável 2 - Usuário sem roteiros salvos vê mensagem sem programações', () => {
    cy.intercept('GET', '/api/lembretes/', {
      statusCode: 200,
      body: []
    }).as('getLembretes');

    cy.visit('/lembretes');

    cy.contains('Nenhuma programação próxima.').should('be.visible');
    cy.get('#mensagem').should('have.class', 'opacity-0');
  });

});

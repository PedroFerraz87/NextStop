describe('História 6: Alertas e lembretes', () => {

  beforeEach(() => {
    cy.deleteAllUsers();
    cy.createUser('robotestes', 'robo@example.com', 'senha1234');
    cy.login('robo@example.com', 'senha1234');
    cy.visit('/lembretes');  
  });

  it('Cenário favorável 1 - Notificação correta para evento próximo', () => {
    cy.intercept('GET', '/api/lembretes/', {
      statusCode: 200,
      body: [
        {
          titulo: 'Evento Próximo',
          evento_iso: new Date(Date.now() + 30 * 60000).toISOString(),
          min10: 1
        }
      ]
    }).as('getLembretes');

    cy.visit('/alertas-lembretes');
    cy.wait('@getLembretes');

    cy.contains('Evento Próximo').should('be.visible');

    cy.wait(1000);
    cy.get('#mensagem')
      .should('not.have.class', 'opacity-0')
      .and('contain.text', '⚠️ Faltam 30 minutos para: Evento Próximo');
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

    cy.visit('/alertas-lembretes');
    cy.wait('@getLembretes');

    cy.contains('Evento Fuso Incorreto').should('be.visible');

    // Espera para ver se a mensagem não aparece (deveria estar opaca)
    cy.wait(2000);
    cy.get('#mensagem').should('have.class', 'opacity-0');
  });

  it('Cenário desfavorável 2 - Usuário sem roteiros salvos vê mensagem sem programações', () => {
    cy.intercept('GET', '/api/lembretes/', {
      statusCode: 200,
      body: []
    }).as('getLembretes');

    cy.visit('/alertas-lembretes');
    cy.wait('@getLembretes');

    cy.contains('Nenhuma programação próxima.').should('be.visible');
    cy.get('#mensagem').should('have.class', 'opacity-0');
  });

});

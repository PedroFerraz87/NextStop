describe('História 6: Alertas e lembretes', () => {
  const login = () => {
    cy.visit('/login');
    cy.get('input[name="username"]').type('usuario_teste');
    cy.get('input[name="password"]').type('senha_teste');
    cy.get('button[type="submit"]').click();
    cy.url().should('not.include', '/login');
  };

  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('Cenário favorável 1 - Notificação correta para evento próximo', () => {
    login();

    cy.intercept('GET', '/url-da-api-ou-endpoint-lembretes', {
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

    // Verifica se o evento aparece na lista
    cy.contains('Evento Próximo').should('be.visible');

    // Verifica se a mensagem de alerta aparece (depois da checagem inicial)
    cy.wait(1000); // espera o JS executar

    cy.get('#mensagem')
      .should('not.have.class', 'opacity-0')
      .and('contain.text', '⚠️ Faltam 30 minutos para: Evento Próximo');
  });

  it('Cenário desfavorável 1 - Notificação atrasada por fuso horário incorreto', () => {
    login();

    // Mock com horário no fuso incorreto (exemplo: 3 horas atrás)
    cy.intercept('GET', '/url-da-api-ou-endpoint-lembretes', {
      statusCode: 200,
      body: [
        {
          titulo: 'Evento Fuso Incorreto',
          evento_iso: new Date(Date.now() - 3 * 3600000 + 10 * 60000).toISOString(), // evento "10min" no passado ajustado por fuso errado
          min10: 1
        }
      ]
    }).as('getLembretes');

    cy.visit('/alertas-lembretes');

    cy.wait('@getLembretes');

    // O evento aparece, mas como está com fuso errado, a notificação pode vir atrasada ou não aparecer
    cy.contains('Evento Fuso Incorreto').should('be.visible');

    // Espera para ver se o alerta aparece (não deve, por ser atrasado)
    cy.wait(2000);

    cy.get('#mensagem').should('have.class', 'opacity-0'); // sem mensagem porque passou o horário
  });

  it('Cenário desfavorável 2 - Usuário sem roteiros salvos vê mensagem sem programações', () => {
    login();

    // Mock para usuário sem programações
    cy.intercept('GET', '/url-da-api-ou-endpoint-lembretes', {
      statusCode: 200,
      body: []
    }).as('getLembretes');

    cy.visit('/alertas-lembretes');

    cy.wait('@getLembretes');

    // Verifica mensagem padrão para nenhum evento
    cy.contains('Nenhuma programação próxima.').should('be.visible');

    // Verifica que não aparece mensagem de alerta
    cy.get('#mensagem').should('have.class', 'opacity-0');
  });
});

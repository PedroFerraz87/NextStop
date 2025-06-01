describe('História 6: Alertas e lembretes', () => {

  beforeEach(() => {
    cy.deleteAllUsers();
    cy.createUser('robotestes', 'robo@example.com', 'senha1234');
    cy.login('robo@example.com', 'senha1234');
  });

  it('Cenário favorável 1 - Notificação correta para evento próximo', () => {
    const hoje = new Date();
    const dataHoje = hoje.toISOString().split('T')[0];
    const hora = hoje.getHours() + 1;
    const horaFormatada = `${hora.toString().padStart(2, '0')}:00`;

    cy.visit('/roteiro');
    cy.get('input[name="destino"]').type('Paris');
    cy.get('input[name="dataIda"]').type(dataHoje);
    cy.get('input[name="dataVolta"]').type(dataHoje);

    cy.get('input[name="dias[]"]').first().type(dataHoje);
    cy.get('input[name="horarios[]"]').first().type(horaFormatada);
    cy.get('input[name="locais[]"]').first().type('Eiffel Tower');

    cy.intercept('POST', '/roteiro/').as('postRoteiro');
    cy.get('form').within(() => {
      cy.get('button[type="submit"]').click();
    });

    cy.visit('/lembretes');

    cy.get('#mensagem')
      .should('not.have.class', 'opacity-0');
  });

  it('Cenário desfavorável 1 - Notificação atrasada por fuso horário incorreto', () => {
    const eventoAtrasado = new Date(Date.now() - 3 * 3600000 + 10 * 60000);
    cy.intercept('GET', '/api/lembretes/', {
      statusCode: 200,
      body: [
        {
          titulo: 'Evento Fuso Incorreto',
          evento_iso: eventoAtrasado.toISOString(),
          min10: 1
        }
      ]
    }).as('getLembretes');

    cy.visit('/lembretes');
    cy.contains('Evento Fuso Incorreto').should('be.visible');
    cy.get('#mensagem').should('have.class', 'opacity-0');
  });

  it('Cenário desfavorável 2 - Usuário sem roteiros salvos vê mensagem sem programações', () => {
    // 🔥 Deleta os roteiros antes desse cenário
    cy.visit('/gerenciar');
    cy.get('button').contains('Deletar').each(($btn) => {
      cy.wrap($btn).click();
      cy.on('window:confirm', () => true);
    });

    cy.visit('/lembretes');
    cy.contains('Nenhuma programação próxima.').should('be.visible');
    cy.get('#mensagem').should('have.class', 'opacity-0');
  });

});

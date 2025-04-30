ALERTAS  DE VIAGEM
describe('Funcionalidade: Alertas e Lembretes', () => {

    beforeEach(() => {
      cy.login();
      cy.visit('/alertas');
    });
  
    it('Cenário favorável 1: Deve enviar notificação quando evento estiver próximo', () => {
      cy.intercept('GET', '/api/eventos', {
        body: [
          { titulo: 'Voo para Louvre', data: '2025-05-01T10:00:00Z' }
        ]
      }).as('eventos');
      cy.reload();
      cy.wait('@eventos');
      cy.contains('Falta 1 hora para sua programação em Louvre').should('be.visible');
    });
  
    it('Cenário desfavorável 1: Deve enviar notificação atrasada por fuso horário diferente', () => {
      cy.intercept('GET', '/api/eventos', {
        body: [
          { titulo: 'Coliseu', data: '2025-05-01T10:00:00-03:00', fusoDiferente: true }
        ]
      }).as('eventoFuso');
      cy.reload();
      cy.wait('@eventoFuso');
      cy.contains('Faltam 1o minutos para sua programação em Coliseu').should('be.visible');
    });
  
    it('Cenário desfavorável 2: Deve informar ausência de alertas se não houver viagens', () => {
      cy.intercept('GET', '/api/eventos', { body: [] }).as('semEventos');
      cy.reload();
      cy.wait('@semEventos');
      cy.contains('Nenhuma programação próxima.').should('be.visible');
    });
  
  });
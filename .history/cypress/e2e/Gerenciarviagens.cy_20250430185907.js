GERENCIAR VIAGEM
describe('Funcionalidade: Gerenciar Viagens', () => {

    beforeEach(() => {
      cy.login();
      cy.visit('/gerenciar-viagem');
    });
  
    it('Cenário favorável 1: Deve permitir editar um roteiro salvo', () => {
      cy.get('.viagem').first().within(() => {
        cy.contains('Editar').click();
      });
      cy.get('input#destino').clear().type('Nova York');
      cy.get('button#salvar-alterações').click();
     
    });
  
    it('Cenário desfavorável 1: Não deve mostrar nada se o usuário não tiver roteiros salvos', () => {
      cy.intercept('GET', '/api/viagens', { body: [] }).as('semViagens');
      cy.reload();
      cy.wait('@semViagens');
      cy.contains('Nenhuma viagem cadastrada ainda').should('be.visible');
    });
  
    it('Cenário favorável 2: Deve permitir deletar uma viagem salva', () => {
      cy.get('.viagem').first().within(() => {
        cy.contains('Deletar').click();
      });
      
    });
  
  });
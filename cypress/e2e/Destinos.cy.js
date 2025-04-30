describe('Funcionalidade: Sugestão de destinos (favoritar e desfavoritar)', () => {
  
    beforeEach(() => {
      cy.login(); 
      cy.visit('/destinos-recomendados');
    });
  
    it('Cenário favorável 1: Deve exibir destinos com nome, descrição e imagem, permitindo favoritar e desfavoritar', () => {
      cy.get('.destino').should('have.length.greaterThan', 0);
      cy.get('.destino').first().within(() => {
        cy.get('.nome').should('be.visible');
        cy.get('.descricao').should('be.visible');
        cy.get('img').should('be.visible');
        cy.get('.botao-favoritar').click();
        cy.get('.botao-🗑').click();
      });
    });
  
    it('Cenário desfavorável 1: Não deve exibir nada se não houver destinos favoritados', () => {
      cy.intercept('GET', '/api/destinos-recomendados', { body: [] }).as('semDestinos');
      cy.reload();
      cy.wait('@semDestinos');
      cy.get('.destino favoritos').should('not.exist');
      
    });
  
    it('Cenário desfavorável 2: Não deve permitir favoritar o mesmo destino duas vezes', () => {
      cy.get('.destino').first().within(() => {
        cy.get('.botao-favoritar').click();
        cy.get('.botao-favoritar').click().should('not.exist');
      });
    
    });
  
  });
describe('Funcionalidade: Checklist de Viagem', () => {

    beforeEach(() => {
      cy.login();
      cy.visit('/checklist');
    });
  
    it('Cenário favorável 1: Deve permitir adicionar itens e marcar como concluído', () => {
      cy.get('input#item').type('Passaporte');
      cy.get('button#adicionar-item').click();
      cy.get('Meu-checklist').contains('Passaporte').parent().find('input[type="checkbox"]').check();
      
    });
    
    it('Cenário desfavorável 1: Marca o item como concluído, mas não risca nem move para o fim da lista', () => {
        cy.login();
        cy.visit('/checklist');
      
        cy.get('input#item').type('Passagem');
        cy.get('button#adicionar-item').click();
      
        cy.get('Meu checklist').contains('passagem').parent().find('input[type="checkbox"]').check();
     
      });
  
    it('Cenário desfavorável 2: Deve impedir salvar checklist sem título', () => {
      cy.get('input#item').type(' ');
      cy.get('button#Adicionar item').click();
      
    });
  
  });
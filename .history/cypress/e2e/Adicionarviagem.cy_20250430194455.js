describe('Funcionalidade: Adicionar Viagem (Criar roteiro personalizado)', () => {

    beforeEach(() => {
      cy.login();
      cy.visit('/adicionar-viagem'); 
    });
  
    it('Cenário favorável 1: Deve permitir criar uma viagem com destino, datas, locais e horários', () => {
      cy.get('input#destino').type('Paris');
      cy.get('input#data-de-ida').type('01-06-2025');
      cy.get('input#data-volta').type('10-06-2025');
      cy.get('input#local').type('Museu do Louvre');
      cy.get('input#horario').type('10:00');
      cy.get('button#salvar').click();
  
      cy.contains('Roteiro criado com sucesso').should('be.visible');
    });
  
    it('Cenário desfavorável 1: Não deve permitir criar roteiro sem preencher campos obrigatórios', () => {
      cy.get('input#local').type('Torre Eiffel');
      cy.get('input#horario').type('14:00');
      cy.get('button#salvar').click();
  
      cy.contains('Preencha este campo').should('be.visible');
    });
  
    it('Cenário desfavorável 2: Não deve permitir salvar sem programação', () => {
      cy.get('input#destino').type('Londres');
      cy.get('input#data-de-ida').type('05-07-2025');
      cy.get('input#data-de-volta').type('10-07-2025');
      cy.get('button#salvar').click()

      cy.contains('Todos os campos de programçaõ devem ser preenchidos').should('be.visible');
    });
  
  });
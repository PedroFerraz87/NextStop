describe('Editar Roteiro', () => {
    beforeEach(() => {
      cy.deleteAllUsers();
      cy.createUser('usuario', 'usuario@example.com', 'senha123');
      cy.login('usuario@example.com', 'senha123');
      cy.visit('/editar'); // ajuste o ID conforme necessário
    });
  
    it('Edita destino e datas do roteiro', () => {
      cy.get('input[name="destino"]')
        .clear()
        .type('Lisboa');
  
      cy.get('input[name="dataIda"]')
        .clear()
        .type('2025-06-01');
  
      cy.get('input[name="dataVolta"]')
        .clear()
        .type('2025-06-10');
  
      cy.get('button[type="submit"]').contains('Salvar Alterações').click();
  
      // Verifica se continua na tela ou redirecionou corretamente
      cy.url().should('include', '/roteiros');
    });
  
    it('Adiciona uma nova programação ao roteiro', () => {
      cy.contains('Adicionar programação').click();
  
      const data = '2025-06-05';
      const hora = '15:30';
      const local = 'Castelo de São Jorge';
  
      cy.get('#roteirosContainer')
        .find('input[type="date"]')
        .last()
        .type(data);
  
      cy.get('#roteirosContainer')
        .find('input[type="time"]')
        .last()
        .type(hora);
  
      cy.get('#roteirosContainer')
        .find('input[type="text"]')
        .last()
        .type(local);
  
      cy.get('button[type="submit"]').contains('Salvar Alterações').click();
  
      // Verifica se salvou com sucesso ou redirecionou
      cy.url().should('include', '/roteiros');
    });
  
    it('Impede salvar se faltar campos obrigatórios', () => {
      cy.get('input[name="destino"]').clear();
      cy.get('button[type="submit"]').contains('Salvar Alterações').click();
  
      cy.get('#mensagemErro')
        .should('contain', 'Preencha todos os campos obrigatórios!');
    });
  });
  
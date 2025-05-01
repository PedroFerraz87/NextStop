describe('Página de Criar Roteiro', () => {
  beforeEach(() => {
    cy.deleteAllUsers();
    cy.createUser('usuario', 'usuario@example.com', 'senha123');
    cy.login('usuario@example.com', 'senha123');
    cy.visit('/roteiro');  
  });

  it('Exibe os campos de formulário e adiciona programações', () => {
    cy.contains('Destino');
    cy.contains('Data de Ida');
    cy.contains('Data de Volta');

    cy.get('input[name="destino"]').type('Paris');
    cy.get('input[name="dataIda"]').type('2025-06-15');
    cy.get('input[name="dataVolta"]').type('2025-06-22');

    cy.get('input[name="dias[]"]').first().type('2025-06-16');
    cy.get('input[name="horarios[]"]').first().type('09:00');
    cy.get('input[name="locais[]"]').first().type('Eiffel Tower');

    cy.get('button').contains('+ Adicionar Programação').click();
    cy.get('input[name="dias[]"]').should('have.length', 2);  
    cy.get('input[name="horarios[]"]').should('have.length', 2);
    cy.get('input[name="locais[]"]').should('have.length', 2);

    cy.get('form').submit();

    cy.url().should('include', '/gerenciar_viagens'); 
    cy.get('#mensagemSucesso').should('contain', 'Roteiro criado com sucesso');
  });

  it('Exibe mensagem de erro se campos obrigatórios não forem preenchidos', () => {
    cy.get('form').submit();  

    cy.get('#mensagemErro').should('contain', 'Preencha todos os campos obrigatórios!');
  });
});

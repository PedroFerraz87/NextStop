describe('História 3: Gerenciar viagens', () => {
  beforeEach(() => {
    cy.deleteAllUsers();
    cy.createUser('usuario', 'user@example.com', 'senha12343');
    cy.login('usuario@example.com', 'senha123');
  });

   it('Cenário favorável 1: Permite editar informações do roteiro salvo', () => {
    cy.visit('/roteiro'); 

    cy.get('input[name="destino"]').type('Paris');
    cy.get('input[name="dataIda"]').type('2025-06-15');
    cy.get('input[name="dataVolta"]').type('2025-06-22');
    cy.get('input[name="dias[]"]').first().type('2025-06-16');
    cy.get('input[name="horarios[]"]').first().type('09:00');
    cy.get('input[name="locais[]"]').first().type('Eiffel Tower');

     cy.get('form').within(() => {
      cy.get('button[type="submit"]').click();
    });

    cy.visit('/gerenciar'); 

    cy.get('.text-blue-400').contains('Editar').click();

    cy.contains('Destino')
    cy.get('input[name="destino"]').clear().type('Londres');
    cy.get('button').contains('Salvar Alterações').click();
    cy.contains('Londres').should('exist');
    cy.contains('Paris').should('not.exist');
  });

  it('Cenário favorável 2: Permite excluir um roteiro salvo', () => {
    cy.visit('/gerenciar'); 
    cy.get('button').contains('Deletar').click();
    cy.on('window:confirm', () => true); 
        cy.contains('Nenhuma viagem cadastrada ainda').should('exist');

  });

  it('Cenário desfavorável 1: Exibe mensagem quando não há roteiros salvos', () => {
    cy.visit('/gerenciar'); 
    cy.contains('Nenhuma viagem cadastrada ainda').should('exist');
  });
});

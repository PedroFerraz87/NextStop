describe('História 3: Gerenciar viagens', () => {
  beforeEach(() => {
    cy.deleteAllUsers();
    cy.createUser('usuario', 'usuario@example.com', 'senha123');
    cy.login('usuario@example.com', 'senha123');
  });

   it('Cenário favorável 1: Permite editar informações do roteiro salvo', () =>

    cy.visit('/gerenciar'); 

    cy.get('button').contains('Editar').click();

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
    cy.contains('Paris').should('not.exist');
    cy.contains('Nenhuma viagem cadastrada ainda').should('exist');
  });

  it('Cenário desfavorável 1: Exibe mensagem quando não há roteiros salvos', () => {
    cy.visit('/gerenciar'); 
    cy.contains('Nenhuma viagem cadastrada ainda').should('exist');
  });
});

describe('Página de Roteiros Cadastrados', () => {
  beforeEach(() => {
    cy.deleteAllUsers();
    cy.createUser('usuario', 'usuario@example.com', 'senha123');
    cy.login('usuario@example.com', 'senha123');
    cy.visit('/gerenciar'); 
    cy.get('[href="/gerenciar/"]').click();
    cy.get('.text-blue-400').click();
    cy.get('#destino').type('Chile');
    cy.get('.bg-blue-600').click();
  });
});


     it('Exibe viagens cadastradas corretamente', () => {
          cy.contains('Viagens Cadastradas');
          cy.contains('Paris');
          cy.contains('Data de Ida:').should('contain', '2025-05-10');
          cy.contains('Data de Volta:').should('contain', '2025-05-20');
          cy.contains('Torre Eiffel');
          cy.contains('Museu do Louvre');
        });

        it('Permite acessar a página de edição de um roteiro', () => {
          cy.contains('Editar').click();
          cy.url().should('include', '/editar');
          cy.get('input[name="destino"]').should('have.value', 'Paris');
        });

        it('Permite deletar um roteiro', () => {
          cy.contains('Deletar').click();
          cy.on('window:confirm', () => true); // caso tenha confirmação no backend

          cy.contains('Nenhuma viagem cadastrada ainda').should('exist');
        });
      });

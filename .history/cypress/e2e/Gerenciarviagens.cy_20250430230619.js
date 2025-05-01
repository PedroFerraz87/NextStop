describe('Página de Roteiros Cadastrados', () => {
  beforeEach(() => {
    cy.deleteAllUsers();
    cy.createUser('usuario', 'usuario@example.com', 'senha123');
    cy.login('usuario@example.com', 'senha123');
    cy.visit('/gerenciar'); 
  });
});

      it('Exibe viagens cadastradas corretamente', () => {
        cy.ger('[href="/home"')
        cy.get('[href="/gerenciar/"]').click();
        cy.get('.text-blue-400').click();
        cy.get('#destino').type('Chile');
        cy.get('.bg-blue-600').click();
        cy.contains('Viagens Cadastradas');
        cy.contains('Paris');
              
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

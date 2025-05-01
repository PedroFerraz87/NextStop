describe('Página de Viagens Cadastradas', () => {
  beforeEach(() => {
    cy.deleteAllUsers();
    cy.createUser('usuario', 'usuario@example.com', 'senha123');
    cy.login('usuario@example.com', 'senha123');

    cy.request('POST', '/api/roteiros/', {
      destino: 'Paris',
      data_ida: '2025-05-10',
      data_volta: '2025-05-20',
      programacoes: [
        { dia: '2025-05-12', horario: '10:00', local: 'Torre Eiffel' },
        { dia: '2025-05-13', horario: '14:00', local: 'Museu do Louvre' }
      ]
    });

    cy.visit('/roteiros');
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

    // Verifica que a viagem foi removida
    cy.contains('Nenhuma viagem cadastrada ainda').should('exist');
  });
});

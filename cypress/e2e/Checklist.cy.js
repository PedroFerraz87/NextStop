describe('Checklist de Viagem', () => {
  beforeEach(() => {
    cy.deleteAllUsers();
    cy.createUser('usuario', 'usuario@example.com', 'senha123');
    cy.login('usuario@example.com', 'senha123');
    cy.visit('/checklist');
  });

  it('Adiciona um item ao checklist e marca como concluído', () => {
    const novoItem = 'Passaporte';

    // Adiciona novo item
    cy.get('input[name="item"]').type(novoItem);
    cy.get('button[type="submit"]').contains('Adicionar Item').click();

    // Verifica se o item foi adicionado
    cy.contains(novoItem).should('exist');

    // Marca como concluído
    cy.contains(novoItem).parent().within(() => {
      cy.get('input[type="checkbox"]').check({ force: true });
    });

    // Recarrega e verifica se o item está riscado (concluído)
    cy.visit('/checklist');
    cy.contains(novoItem)
      .should('have.class', 'line-through')
      .and('have.class', 'text-gray-400');
  });
});

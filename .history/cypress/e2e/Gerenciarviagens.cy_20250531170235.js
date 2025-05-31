describe('História 3: Gerenciar viagens', () => {
  beforeEach(() => {
    cy.deleteAllUsers();
    cy.createUser('usuario', 'usuario@example.com', 'senha123');
    cy.login('usuario@example.com', 'senha123');
  });

   it('Cenário favorável 1: Permite editar informações do roteiro salvo', () => {
    cy.visit('/roteiro'); 

    cy.contains('Destino');
    cy.contains('Data de Ida');
    cy.contains('Data de Volta');

    cy.get('input[name="destino"]').type('Paris');
    cy.get('input[name="dataIda"]').type('2025-06-15');
    cy.get('input[name="dataVolta"]').type('2025-06-22');

    cy.get('input[name="dias[]"]').first().type('2025-06-16');
    cy.get('input[name="horarios[]"]').first().type('09:00');
    cy.get('input[name="locais[]"]').first().type('Eiffel Tower');

    cy.intercept('POST', '/roteiro/').as('postRoteiro');
    cy.get('form').within(() => {
    cy.get('button[type="submit"]').click();
    });

    cy.visit('http://localhost:8000/gerenciar/');
    cy.get('button').contains('Editar').click();

    cy.contains('Destino')
    cy.contains('Data de volta')
    cy.get('input[name="destino"]').clear().type('Londres');
    cy.get('button').contains('Salvar Alterações').click();
  });

  it('Cenário desfavorável 1: Exibe mensagem quando não há roteiros salvos', () => {
    cy.clearRoteiros();
    cy.visit('http://localhost:8000/gerenciar/');
    cy.contains('Nenhuma viagem cadastrada ainda').should('exist');
  });

  it('Cenário favorável 2: Permite excluir um roteiro salvo', () => {
    cy.contains('Destino');
    cy.contains('Data de Ida');
    cy.contains('Data de Volta');

    cy.get('input[name="destino"]').type('Paris');
    cy.get('input[name="dataIda"]').type('2025-06-15');
    cy.get('input[name="dataVolta"]').type('2025-06-22');

    cy.get('input[name="dias[]"]').first().type('2025-06-16');
    cy.get('input[name="horarios[]"]').first().type('09:00');
    cy.get('input[name="locais[]"]').first().type('Eiffel Tower');

    cy.intercept('POST', '/roteiro/').as('postRoteiro');
    cy.get('form').within(() => {
    cy.get('button[type="submit"]').click();
    });

    cy.visit('http://localhost:8000/gerenciar/');
    cy.contains(roteiroExemplo).parent().find('button').contains('Deletar').click();
    cy.on('window:confirm', () => true); 
  });
});

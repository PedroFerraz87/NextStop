describe('Página de Criar Roteiro', () => {
  beforeEach(() => {
    cy.deleteAllUsers();
    cy.createUser('usuario', 'user@example.com', 'senha1234');
    cy.login('user@example.com', 'senha1234');
    cy.visit('/roteiro');  
  });

  it('Cenário favorável: Cria roteiro com sucesso', () => { 
    // Verifica que os campos principais estão na página
    cy.contains('Destino');
    cy.contains('Data de Ida');
    cy.contains('Data de Volta');
    cy.contains('Programações');

    // Preenche dados principais
    cy.get('input[name="destino"]').type('Paris');
    cy.get('input[name="dataIda"]').type('2025-06-15');
    cy.get('input[name="dataVolta"]').type('2025-06-22');

    // Preenche uma programação
    cy.get('input[name="dias[]"]').first().type('2025-06-16');
    cy.get('input[name="horarios[]"]').first().type('09:00');
    cy.get('input[name="locais[]"]').first().type('Torre Eiffel');

    // Adiciona mais uma programação
    cy.contains('+ Adicionar Programação').click();
    cy.get('input[name="dias[]"]').last().type('2025-06-17');
    cy.get('input[name="horarios[]"]').last().type('14:00');
    cy.get('input[name="locais[]"]').last().type('Museu do Louvre');

    // Intercepta o POST para verificar o envio
    cy.intercept('POST', '/roteiro/').as('postRoteiro');

    // Submete o formulário
    cy.get('form').within(() => {
      cy.get('button[type="submit"]').click();
    });

    // Aguarda a requisição ser feita e verifica se foi para a rota correta
    cy.wait('@postRoteiro').its('response.statusCode').should('eq', 302);

    // Valida o feedback visual de sucesso
    cy.contains('Roteiro salvo com sucesso').should('exist');
  });

  it('Cenário desfavorável 1: Campos principais não preenchidos', () => {
    // Clica em salvar sem preencher nada
    cy.get('form').within(() => {
      cy.get('button[type="submit"]').click();
    });

    // Permanece na página de roteiro
    cy.url().should('include', '/roteiro');

    // Verifica mensagem de erro
    cy.contains('Preencha todos os campos obrigatórios!').should('exist');
  });

  it('Cenário desfavorável 2: Não adiciona nenhuma programação', () => {
    // Preenche dados principais
    cy.get('input[name="destino"]').type('Roma');
    cy.get('input[name="dataIda"]').type('2025-07-01');
    cy.get('input[name="dataVolta"]').type('2025-07-10');

    // Remove a programação existente (se tivesse botão, mas no seu HTML não tem)
    // Alternativamente, pode tentar submeter sem preencher programação
    cy.get('input[name="dias[]"]').clear();
    cy.get('input[name="horarios[]"]').clear();
    cy.get('input[name="locais[]"]').clear();

    cy.get('form').within(() => {
      cy.get('button[type="submit"]').click();
    });

    // Permanece na página e exibe erro
    cy.url().should('include', '/roteiro');
    cy.contains('Todos os campos de programação devem ser preenchidos!').should('exist');
  });
});

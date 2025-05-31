describe('História 3: Gerenciar viagens', () => {
  beforeEach(() => {
    cy.deleteAllUsers();
    cy.createUser('usuario', 'usuario@example.com', 'senha123');
    cy.login('usuario@example.com', 'senha123');
    cy.visit('/gerenciar'); 
  });

   it('Cenário favorável 1: Permite editar informações do roteiro salvo', () => {
    cy.contains(roteiroExemplo).should('exist');
    cy.contains(roteiroExemplo).parent().find('button').contains('Editar').click();
    cy.get('input[name="titulo"]').clear().type('Roteiro para Paris Atualizado');
    cy.get('textarea[name="descricao"]').clear().type('Descrição atualizada da viagem para Paris.');
    cy.get('button').contains('Salvar').click();

    // Verifica se as alterações foram salvas
    cy.contains('Roteiro para Paris Atualizado').should('exist');
    cy.contains('Descrição atualizada da viagem para Paris.').should('exist');
  });

  it('Cenário desfavorável 1: Exibe mensagem quando não há roteiros salvos', () => {
    // Simula um usuário sem roteiros (isso depende de como sua app lida com dados. Você pode limpar via API ou banco antes)
    cy.clearRoteiros(); // Comando hipotético que você pode criar para limpar os roteiros

    // Acessa a página de gerenciamento
    cy.visit('http://localhost:8000/gerenciar-viagem');

    // Verifica se a mensagem de nenhum roteiro aparece
    cy.contains('Nenhuma viagem cadastrada ainda').should('exist');
  });

  it('Cenário favorável 2: Permite excluir um roteiro salvo', () => {
    // Verifica se o roteiro existe
    cy.contains(roteiroExemplo).should('exist');

    // Clica no botão de deletar
    cy.contains(roteiroExemplo).parent().find('button').contains('Deletar').click();

    // Confirma a exclusão se tiver confirmação
    cy.on('window:confirm', () => true); // Simula clicar em "OK" no confirm

    // Verifica se o roteiro foi removido
    cy.contains(roteiroExemplo).should('not.exist');
  });
});

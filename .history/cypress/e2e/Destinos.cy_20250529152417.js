describe('Página de Destinos Recomendados', () => {
  beforeEach(() => {
    cy.deleteAllUsers();
    cy.createUser('usuario', 'usuario@example.com', 'senha123');
    cy.login('usuario@example.com', 'senha123');
    cy.visit('/sugestao');
  });

  it('Cenário favorável 1: Adiciona destino aos favoritos com sucesso', () => {
    const destinoFavorito = 'Paris, França';

    // Verifica se o destino está listado
    cy.contains(destinoFavorito).should('exist');

    // Clica em favoritar
    cy.contains(destinoFavorito).parent().find('button').click();

    // Verifica a mensagem de sucesso
    cy.get('#mensagem').should('contain', `${destinoFavorito} foi adicionado aos seus favoritos!`);

    // Verifica se aparece na lista de favoritos
    cy.get('#favoritosList').contains(destinoFavorito);
  });

  it('Cenário favorável 2: Remove destino dos favoritos com sucesso', () => {
    const destinoFavorito = 'Paris, França';

    // Adiciona primeiro
    cy.contains(destinoFavorito).parent().find('button').click();
    cy.get('#mensagem').should('contain', `${destinoFavorito} foi adicionado aos seus favoritos!`);
    cy.get('#favoritosList').contains(destinoFavorito);

    // Agora remove
    cy.get('#favoritosList').contains(destinoFavorito).parent().find('button').click();

    // Verifica mensagem de remoção
    cy.get('#mensagem').should('contain', `${destinoFavorito} foi removido dos seus favoritos!`);

    // Verifica se não está mais na lista
    cy.get('#favoritosList').should('not.contain', destinoFavorito);
  });

  it('Cenário desfavorável 1: Não permite favoritar destino já favoritado', () => {
    const destinoFavorito = 'Paris, França';

    // Adiciona o destino aos favoritos
    cy.contains(destinoFavorito).parent().find('button').click();
    cy.get('#mensagem').should('contain', `${destinoFavorito} foi adicionado aos seus favoritos!`);
    cy.get('#favoritosList').contains(destinoFavorito);

    // Tenta adicionar novamente
    cy.contains(destinoFavorito).parent().find('button').click();

    // Verifica mensagem de erro
    cy.get('#mensagem').should('contain', `${destinoFavorito} já foi adicionado aos seus favoritos!`);
  });
});
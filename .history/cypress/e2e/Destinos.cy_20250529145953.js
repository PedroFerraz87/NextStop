describe('Página de Destinos Recomendados', () => {
  beforeEach(() => {
    cy.deleteAllUsers();
    cy.createUser('usuario', 'usuario@example.com', 'senha123');
    cy.login('usuario@example.com', 'senha123');
    cy.visit('.sugestão');  
  });

  it('Exibe todos os destinos recomendados', () => {
    // Verifica se todos os destinos são exibidos corretamente
    cy.contains('Paris, França');
    cy.contains('Madrid, Espanha');
    cy.contains('Roma, Itália');
    cy.contains('Tóquio, Japão');
    cy.contains('Cusco, Peru');
    cy.contains('Auckland, Nova Zelândia');
    cy.contains('Cidade do Cabo, África do Sul');
    cy.contains('Vancouver, Canadá');
    cy.contains('Dubai, Emirados Árabes Unidos');
  });

  it('Adiciona e remove destinos dos favoritos', () => {
    const destinoFavorito = 'Paris, França';

    // Tenta adicionar o destino aos favoritos
    cy.contains(destinoFavorito).parent().find('button').click();
    cy.get('#mensagem').should('contain', `${destinoFavorito} foi adicionado aos seus favoritos!`);
    
    // Verifica se o destino foi adicionado à lista de favoritos
    cy.get('#favoritosList').contains(destinoFavorito);

    // Tenta remover o destino dos favoritos
    cy.get('#favoritosList').contains(destinoFavorito).parent().find('button').click();
    cy.get('#mensagem').should('contain', `${destinoFavorito} foi removido dos seus favoritos!`);

    // Verifica se o destino foi removido da lista de favoritos
    cy.get('#favoritosList').should('not.contain', destinoFavorito);
  });

  it('Não permite adicionar um destino já favoritado novamente', () => {
    const destinoFavorito = 'Paris, França';

    // Adiciona o destino aos favoritos
    cy.contains(destinoFavorito).parent().find('button').click();
    cy.get('#mensagem').should('contain', `${destinoFavorito} foi adicionado aos seus favoritos!`);

    // Tenta adicionar novamente o mesmo destino
    cy.contains(destinoFavorito).parent().find('button').click();
    cy.get('#mensagem').should('contain', `${destinoFavorito} já foi adicionado aos seus favoritos!`);
  });
});

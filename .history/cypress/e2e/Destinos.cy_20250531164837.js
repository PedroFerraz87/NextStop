describe('História 1: ', () => {
   const destinoFavorito = 'Paris, França';
  beforeEach(() => {
    cy.deleteAllUsers();
    cy.createUser('usuario', 'usuario@example.com', 'senha123');
    cy.login('usuario@example.com', 'senha123');
    cy.visit('/sugestao');  
  });

  it('Cenário favorável 1: Exibe todos os destinos recomendados e permite favoritar', () => {
    cy.contains('Paris, França');
    cy.contains('Madrid, Espanha');
    cy.contains('Roma, Itália');
    cy.contains('Tóquio, Japão');
    cy.contains('Cusco, Peru');
    cy.contains('Auckland, Nova Zelândia');
    cy.contains('Cidade do Cabo, África do Sul');
    cy.contains('Vancouver, Canadá');
    cy.contains('Dubai, Emirados Árabes Unidos');

    cy.contains(destinoFavorito).parent().find('button').click();
    cy.get('#mensagem').should('contain', `${destinoFavorito} foi adicionado aos seus favoritos!`);

  });

  it('Cenário favorável 2: remove destinos dos favoritos', () => {
    
    cy.get('#favoritosList').contains(destinoFavorito);
    cy.get('#favoritosList').contains(destinoFavorito).parent().find('button').click();
    cy.get('#mensagem').should('contain', `${destinoFavorito} foi removido dos seus favoritos!`);

    cy.get('#favoritosList').should('not.contain', destinoFavorito);
  });

  it('Cenário desfavorável 1: Não permite adicionar um destino já favoritado novamente', () => {
    cy.contains(destinoFavorito).parent().find('button').click();
    cy.contains(destinoFavorito).parent().find('button').click();
    cy.get('#mensagem').should('contain', `${destinoFavorito} já foi adicionado aos seus favoritos!`);
  });
});

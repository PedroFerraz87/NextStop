
beforeEach(() => {
  cy.deleteAllUsers();
  cy.createUser('usuario', 'usuario@example.com', 'senha123');
  cy.login('usuario@example.com', 'senha123');
  cy.visit('/sugestao');
});

describe('Página de Destinos Recomendados', () => {
  const destinoFavorito = 'Paris, França';
  it('Cenário favorável 1: Exibe destinos e permite favoritar', () => {
    cy.contains(destinoFavorito).should('exist');
    cy.get('img').should('exist'); // Verifica que existem imagens na página

    // Clica em favoritar
    cy.contains(destinoFavorito).parent().find('button').click();

    // Verifica mensagem de sucesso
    cy.get('#mensagem').should('contain', `${destinoFavorito} foi adicionado aos seus favoritos!`);

    // Verifica se aparece na lista de favoritos
    cy.get('#favoritosList').contains(destinoFavorito);
  });

  it('Cenário favorável 2: Permite desfavoritar um destino da lista', () => {
    // Primeiro adiciona aos favoritos
    cy.contains(destinoFavorito).parent().find('button').click();
    cy.get('#mensagem').should('contain', `${destinoFavorito} foi adicionado aos seus favoritos!`);
    cy.get('#favoritosList').contains(destinoFavorito);

    // Agora remove dos favoritos
    cy.get('#favoritosList').contains(destinoFavorito).parent().find('button').click();

    // Verifica a mensagem de remoção
    cy.get('#mensagem').should('contain', `${destinoFavorito} foi removido dos seus favoritos!`);

    // Verifica que não está mais na lista de favoritos
    cy.get('#favoritosList').should('not.contain', destinoFavorito);
  });

  it('Cenário desfavorável 1: Não permite favoritar o mesmo destino duas vezes', () => {
    // Adiciona o destino aos favoritos
    cy.contains(destinoFavorito).parent().find('button').click();
    cy.get('#mensagem').should('contain', `${destinoFavorito} foi adicionado aos seus favoritos!`);
    cy.get('#favoritosList').contains(destinoFavorito);

    // Tenta adicionar novamente o mesmo destino
    cy.contains(destinoFavorito).parent().find('button').click();

    // Verifica a mensagem de erro
    cy.get('#mensagem').should('contain', `${destinoFavorito} já foi adicionado aos seus favoritos!`);
  });
});

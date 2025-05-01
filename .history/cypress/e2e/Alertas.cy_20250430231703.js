describe('Página de Alertas e Lembretes', () => {
  beforeEach(() => {
    cy.deleteAllUsers();
    cy.createUser('usuario', 'usuario@example.com', 'senha123');
    cy.login('usuario@example.com', 'senha123');

    // Suponha que lembretes sejam criados por um endpoint de programação
    const agora = new Date();
    agora.setMinutes(agora.getMinutes() + 10); // evento daqui 10 minutos

    cy.visit('/lembretes');
  });

  it('Exibe lembretes para programações próximas', () => {
    cy.contains('Alertas e Lembretes');
    cy.contains('Próximas Programações');
    cy.contains('Coliseu');
    cy.contains('Data e Hora:');
  });

  it('Renderiza o relógio no topo', () => {
    cy.get('#relogio').should('exist').and('not.be.empty');
  });

  it('Exibe mensagem de aviso próximo ao evento (simulado)', () => {
    cy.window().then(win => {
      win.mostrarMensagem('⚠️ Faltam 10 minutos para: Coliseu');
    });
    cy.get('#mensagem').should('contain.text', 'Faltam 10 minutos para: Coliseu');
  });
});

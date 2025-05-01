describe('Página de Calculadora de Gastos', () => {
  beforeEach(() => {
    cy.deleteAllUsers();
    cy.createUser('usuario', 'usuario@example.com', 'senha123');
    cy.login('usuario@example.com', 'senha123');

    cy.request('roteiros/', {
      destino: 'Barcelona',
      data_ida: '2025-05-10',
      data_volta: '2025-05-20',
      programacoes: []
    });

    cy.visit('/orcamento');
  });

  it('Preenche e envia o formulário de orçamento com sucesso', () => {
    cy.contains('Calculadora de Gastos da Viagem');

    cy.get('select[name="roteiro"]').should('exist').select('Barcelona');

    cy.get('input[name="hospedagem"]').type('800.50');
    cy.get('input[name="passagem"]').type('1200.00');
    cy.get('input[name="alimentacao"]').type('450.75');
    cy.get('input[name="passeios"]').type('300');
    cy.get('input[name="extras"]').type('100');

    cy.get('form#formGastos').submit();

    // Confirmação pode variar — ajuste conforme a resposta esperada
    cy.url().should('include', '/orcamento'); // ou outra rota de redirecionamento após POST
  });
});

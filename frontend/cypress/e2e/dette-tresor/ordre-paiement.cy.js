describe('Module Ordres de Paiement', () => {
  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.setItem('access_token', 'fake-jwt-token');
    });
    
    cy.intercept('GET', '**/api/auth/me', {
      statusCode: 200,
      body: { data: { user: { nom: 'Admin', prenom: 'Test', profils: [{ libelleProfil: 'Dette du Tresor' }] } } }
    }).as('getMe');

    cy.visit('/dette-tresor/ordres-paiement');
    cy.wait('@getMe');
  });

  it('doit afficher les onglets et charger le formulaire de création', () => {
    cy.get('.tab-btn').contains('Ajouter un ordre de paiement').should('be.visible').and('have.class', 'active');
    cy.get('.tab-btn').contains('Consulter les ordres de paiement').should('be.visible');
    cy.get('.tab-btn').contains('Générer Lettre de règlement').should('be.visible');
  });

  it('doit permettre de créer un ordre de paiement', () => {
    cy.intercept('POST', '**/api/dette-tresor/ordres-paiement', {
      statusCode: 201,
      body: { success: true }
    }).as('createOP');

    // Le composant écoute @created pour rediriger vers "Consulter"
    cy.intercept('GET', '**/api/dette-tresor/ordres-paiement*', {
      statusCode: 200,
      body: { data: [{ numOrdre: 'OP-500', numlettre: 777, montantCapital: 10000 }] }
    }).as('getOP');

    cy.get('#pretId').type('1024');
    cy.get('#numlettre').type('777');
    cy.get('#montantCapital').clear().type('10000');
    cy.get('#montantInteret').clear().type('500');
    cy.get('#montantCommission').clear().type('100');
    cy.get('#dateEcheance').type('2023-11-15');
    cy.get('#datePEC').type('2023-11-10');

    cy.get('button[type="submit"]').click();
    cy.wait('@createOP');

    // Redirection automatique via l'événement @created
    cy.wait('@getOP');
    cy.get('.tab-btn').contains('Consulter les ordres de paiement').should('have.class', 'active');
  });

  it('doit permettre de consulter la liste des ordres de paiement', () => {
    cy.intercept('GET', '**/api/dette-tresor/ordres-paiement*', {
      statusCode: 200,
      body: { data: [
        { numOrdre: 'OP-500', numlettre: 777, montantCapital: 10000, dateEcheance: '2023-11-15' }
      ]}
    }).as('getOP');

    cy.get('.tab-btn').contains('Consulter les ordres de paiement').click();
    cy.wait('@getOP');
    
    cy.contains('OP-500').should('be.visible');
    cy.contains('777').should('be.visible');
  });
});

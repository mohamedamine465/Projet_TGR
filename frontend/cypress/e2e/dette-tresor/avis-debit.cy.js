describe('Module Avis de Débit', () => {
  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.setItem('access_token', 'fake-jwt-token');
    });
    
    cy.intercept('GET', '**/api/auth/me', {
      statusCode: 200,
      body: { data: { user: { nom: 'Admin', prenom: 'Test', profils: [{ libelleProfil: 'Dette du Tresor' }] } } }
    }).as('getMe');

    cy.visit('/dette-tresor/avis-debits');
    cy.wait('@getMe');
  });

  it('doit afficher les onglets et charger le formulaire de création', () => {
    cy.get('.tab-btn').contains('Ajouter un avis').should('be.visible').and('have.class', 'active');
    cy.get('.tab-btn').contains('Consulter les avis').should('be.visible');
  });

  it('doit permettre de créer un avis de débit', () => {
    cy.intercept('POST', '**/api/dette-tresor/avis-debits', {
      statusCode: 201,
      body: { success: true, data: { codeDepense: 'AD-101' } }
    }).as('createAvisDebit');

    // Le composant écoute @created pour rediriger vers "Consulter"
    cy.intercept('GET', '**/api/dette-tresor/avis-debits*', {
      statusCode: 200,
      body: { data: [{ codeDepense: 'AD-101', avisDebit: { type: 'Frais bancaires', montantCapital: 1000 } }] }
    }).as('getAvisDebits');

    cy.get('#pretId').type('1024');
    cy.get('#type').select('Frais bancaires');
    cy.get('#montantCapital').clear().type('1000');
    cy.get('#montantInteret').clear().type('200');
    cy.get('#montantCommission').clear().type('50');
    cy.get('#taux').clear().type('2.5');
    cy.get('#dateDepense').type('2023-11-01');
    cy.get('#datePEC').type('2023-11-02');
    cy.get('#dateEcheance').type('2023-11-15');

    cy.get('button[type="submit"]').click();
    cy.wait('@createAvisDebit');

    // Le composant redirige automatiquement vers l'onglet 'consulter' après création
    cy.wait('@getAvisDebits');
    cy.get('.tab-btn').contains('Consulter les avis').should('have.class', 'active');
  });

  it('doit permettre de consulter la liste des avis de débit', () => {
    cy.intercept('GET', '**/api/dette-tresor/avis-debits*', {
      statusCode: 200,
      body: { data: [
        { codeDepense: 'AD-200', pretId: 1024, dateEcheance: '2023-12-01', avisDebit: { type: 'Commission de gestion', montantCapital: 5000 } }
      ]}
    }).as('getAvisDebits');

    cy.get('.tab-btn').contains('Consulter les avis').click();
    cy.wait('@getAvisDebits');
    
    cy.get('td').contains('AD-200').should('be.visible');
    cy.get('td').contains('Commission de gestion').should('be.visible');
  });
});

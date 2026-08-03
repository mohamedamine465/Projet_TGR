describe('Module Avis de Crédit', () => {
  beforeEach(() => {
    // Injecter un faux token
    cy.window().then((win) => {
      win.localStorage.setItem('access_token', 'fake-jwt-token');
    });
    
    // Intercepter auth/me
    cy.intercept('GET', '**/api/auth/me', {
      statusCode: 200,
      body: { data: { user: { nom: 'Admin', prenom: 'Test', profils: [{ libelleProfil: 'Dette du Tresor' }] } } }
    }).as('getMe');

    // Intercepter le chargement des prêts pour le select
    cy.intercept('GET', '**/api/dette-tresor/prets', {
      statusCode: 200,
      body: { data: [{ numPret: '1024', objet: 'Prêt Test' }] }
    }).as('getPrets');

    cy.visit('/dette-tresor/avis-credits');
    cy.wait('@getMe');
  });

  it('doit afficher les onglets et charger le formulaire de création par défaut', () => {
    cy.get('.tab-btn').contains('Ajouter un avis de crédit').should('be.visible').and('have.class', 'active');
    cy.get('.tab-btn').contains('Consulter les avis de crédit').should('be.visible');
    
    // Attendre que la liste des prêts soit chargée pour le select
    cy.wait('@getPrets');
    cy.get('select').first().should('exist'); // prets select
  });

  it('doit permettre de créer un avis de crédit', () => {
    cy.intercept('POST', '**/api/dette-tresor/avis-credits', {
      statusCode: 201,
      body: { success: true, message: 'Avis de crédit ajouté avec succès !' }
    }).as('createAvisCredit');

    // Remplir le formulaire
    cy.get('select').first().select('1024');
    cy.get('input[type="date"]').eq(0).type('2023-12-01'); // dateEcheance
    cy.get('input[type="date"]').eq(1).type('2023-12-05'); // datePEC
    cy.get('input[type="number"]').eq(0).type('5.5'); // taux
    cy.get('input[type="number"]').eq(1).type('150000'); // montant

    cy.get('button[type="submit"]').click();
    cy.wait('@createAvisCredit');

    // Vérifier le succès
    cy.contains('Avis de crédit ajouté avec succès !').should('be.visible');
  });

  it('doit permettre de consulter la liste des avis de crédit', () => {
    cy.intercept('GET', '**/api/dette-tresor/avis-credits*', {
      statusCode: 200,
      body: { data: [
        { codeRecette: 'AC-999', pretId: 1024, dateEcheance: '2023-12-01', avisCredit: { montant: 150000, taux: 5.5 } }
      ]}
    }).as('getAvisCredits');

    cy.get('.tab-btn').contains('Consulter les avis de crédit').click();
    cy.wait('@getAvisCredits');
    
    cy.contains('AC-999').should('be.visible');
    cy.contains('1024').should('be.visible');
  });
});

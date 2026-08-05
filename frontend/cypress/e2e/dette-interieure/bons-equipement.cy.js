describe('Module Bons d\'Équipement (Dette Intérieure)', () => {
  beforeEach(() => {
    // Injecter un faux token pour simuler une session active
    cy.window().then((win) => {
      win.localStorage.setItem('access_token', 'fake-jwt-token');
    });
    
    // Intercepter auth/me
    cy.intercept('GET', '**/api/auth/me', {
      statusCode: 200,
      body: { 
        data: { 
          user: { 
            nom: 'Admin', 
            prenom: 'Test', 
            profils: [{ libelleProfil: 'Dette Interieure' }] 
          } 
        } 
      }
    }).as('getMe');

    cy.visit('/dette-interieure/bons-equipement');
    cy.wait('@getMe');
  });

  it('doit afficher les onglets du module et charger le formulaire de création par défaut', () => {
    cy.get('.tab-btn').contains('Créer Bon').should('be.visible').and('have.class', 'active');
    
    // Vérifier le formulaire
    cy.get('#dateSouscription').should('exist');
    cy.get('#datePEC').should('exist');
    cy.get('#montant').should('exist');
  });

  it('doit permettre de soumettre le formulaire de création avec succès', () => {
    cy.intercept('POST', '**/api/dette-interieure/bons-equipement', {
      statusCode: 201,
      body: { success: true, data: { numBon: 1 } }
    }).as('createBon');

    cy.get('#dateSouscription').type('2026-08-01');
    cy.get('#datePEC').type('2026-08-05');
    cy.get('#montant').type('250000');

    cy.get('button[type="submit"]').contains('Enregistrer').click();

    cy.wait('@createBon');

    // Vérifier le message de succès
    cy.contains('Le bon d\'équipement a été enregistré avec succès.').should('be.visible');
    
    // Le formulaire devrait s'être vidé (attendre 3 secondes)
    cy.wait(3100);
    cy.get('#montant').should('have.value', '');
  });

  it("doit permettre de consulter les bons", () => {
    cy.intercept('GET', '**/api/dette-interieure/bons-equipement', {
      statusCode: 200,
      body: {
        success: true,
        data: [{ numBon: 888, dateSouscription: '2026-01-01', datePEC: '2026-01-02', montant: 250000 }]
      }
    }).as('getBons');

    cy.get('.tab-btn').contains('Consulter les Bons').click();
    cy.wait('@getBons');

    // Vérifier que la donnée est affichée
    cy.contains('#888').should('be.visible');
  });
});

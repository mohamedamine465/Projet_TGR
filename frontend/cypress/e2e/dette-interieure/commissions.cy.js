describe('Module Commissions (Dette Intérieure)', () => {
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

    cy.visit('/dette-interieure/commissions');
    cy.wait('@getMe');
  });

  it('doit afficher les onglets du module et charger le formulaire de création par défaut', () => {
    cy.get('.tab-btn').contains('Créer Commission').should('be.visible').and('have.class', 'active');
    
    // Vérifier le formulaire
    cy.get('#numDecompte').should('exist');
    cy.get('#montantBordereau').should('exist');
  });

  it('doit permettre de soumettre le formulaire de création avec succès', () => {
    cy.intercept('POST', '**/api/dette-interieure/commissions/bordereaux', {
      statusCode: 201,
      body: { success: true, data: { numBord: 1 } }
    }).as('createBordereau');

    cy.get('#numDecompte').type('101');
    cy.get('#montantBordereau').type('15000');

    cy.get('button[type="submit"]').contains('Enregistrer').click();

    cy.wait('@createBordereau');

    // Vérifier le message de succès
    cy.contains('Le bordereau a été enregistré avec succès.').should('be.visible');
    
    // Le formulaire devrait s'être vidé (attendre 3 secondes)
    cy.wait(3100);
    cy.get('#montantBordereau').should('have.value', '');
  });

  it("doit permettre de consulter les commissions", () => {
    cy.intercept('GET', '**/api/dette-interieure/commissions/bordereaux', {
      statusCode: 200,
      body: {
        success: true,
        data: [{ numBord: 777, numDecompte: 101, montantBordereau: 5000 }]
      }
    }).as('getCommissions');

    cy.get('.tab-btn').contains('Consulter Commissions').click();
    cy.wait('@getCommissions');

    // Vérifier que la donnée est affichée
    cy.contains('#777').should('be.visible');
    cy.contains('D-101').should('be.visible');
  });
});

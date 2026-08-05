describe('Module Intérêts (Dette Intérieure)', () => {
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

    cy.visit('/dette-interieure/interets');
    cy.wait('@getMe');
  });

  it('doit afficher les onglets du module et charger le formulaire de création par défaut', () => {
    cy.get('.tab-btn').contains('Créer Intérêt').should('be.visible').and('have.class', 'active');
    
    // Vérifier le formulaire
    cy.get('#annee').should('exist');
    cy.get('#trimestre').should('exist');
    cy.get('#tauxInteret').should('exist');
    cy.get('#nbreJour').should('exist');
  });

  it('doit permettre de soumettre le formulaire de création avec succès', () => {
    cy.intercept('POST', '**/api/dette-interieure/interets', {
      statusCode: 201,
      body: { success: true, data: { idInteret: 1 } }
    }).as('createInteret');

    cy.get('#annee').clear().type('2026');
    cy.get('#trimestre').select('3');
    cy.get('#tauxInteret').type('4.5');
    cy.get('#nbreJour').type('90');

    cy.get('button[type="submit"]').contains('Enregistrer').click();

    cy.wait('@createInteret');

    // Vérifier le message de succès
    cy.contains('L\'intérêt a été enregistré avec succès.').should('be.visible');
    
    // Le formulaire devrait s'être vidé (attendre 3 secondes)
    cy.wait(3100);
    cy.get('#tauxInteret').should('have.value', '');
  });

  it("doit permettre de consulter les intérêts", () => {
    cy.intercept('GET', '**/api/dette-interieure/interets', {
      statusCode: 200,
      body: {
        success: true,
        data: [{ idInteret: 666, annee: 2026, trimestre: 1, tauxInteret: 4.5, nbreJour: 90 }]
      }
    }).as('getInterets');

    cy.get('.tab-btn').contains('Consulter Intérêts').click();
    cy.wait('@getInterets');

    // Vérifier que la donnée est affichée
    cy.contains('#666').should('be.visible');
    cy.contains('2026 - T1').should('be.visible');
  });
});

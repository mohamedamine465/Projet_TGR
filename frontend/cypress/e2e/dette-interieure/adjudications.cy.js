describe('Module Adjudications (Dette Intérieure)', () => {
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

    cy.visit('/dette-interieure/adjudications');
    cy.wait('@getMe');
  });

  it('doit afficher les onglets du module et charger le formulaire de création par défaut', () => {
    cy.get('.tab-btn').contains('Créer Adjudication').should('be.visible').and('have.class', 'active');
    
    // Vérifier le formulaire
    cy.get('#dateJouissance').should('exist');
    cy.get('#maturite').should('exist');
    cy.get('#taux').should('exist');
    cy.get('#montant').should('exist');
  });

  it('doit permettre de soumettre le formulaire de création avec succès', () => {
    cy.intercept('POST', '**/api/dette-interieure/adjudications', {
      statusCode: 201,
      body: { success: true, data: { idAdjudication: 1 } }
    }).as('createAdjudication');

    cy.get('#dateJouissance').type('2026-08-01');
    cy.get('#maturite').select('10 ans');
    cy.get('#taux').type('3.50');
    cy.get('#montant').type('500000');

    cy.get('button[type="submit"]').contains('Enregistrer').click();

    cy.wait('@createAdjudication');

    // Vérifier le message de succès
    cy.contains('L\'adjudication a été enregistrée avec succès.').should('be.visible');
    
    // Le formulaire devrait s'être vidé (attendre 3 secondes)
    cy.wait(3100);
    cy.get('#taux').should('have.value', '');
  });

  it("doit permettre de consulter les adjudications", () => {
    cy.intercept('GET', '**/api/dette-interieure/adjudications', {
      statusCode: 200,
      body: {
        success: true,
        data: [{ idAdjudication: 999, dateJouissance: '2026-01-01', maturite: '13 semaines', taux: 3.5, montant: 150000 }]
      }
    }).as('getAdjudications');

    cy.get('.tab-btn').contains('Consulter les Adjudications').click();
    cy.wait('@getAdjudications');

    // Vérifier que la donnée est affichée
    cy.contains('#999').should('be.visible');
    cy.contains('13 semaines').should('be.visible');
  });
});

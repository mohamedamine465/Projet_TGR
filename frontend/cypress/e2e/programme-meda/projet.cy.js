describe('Module Projets (Programme MEDA & FR)', () => {
  beforeEach(() => {
    // Injecter un faux token pour simuler une session active
    cy.window().then((win) => {
      win.localStorage.setItem('access_token', 'fake-jwt-token');
    });
    
    // Intercepter auth/me pour que le routeur ne nous renvoie pas sur /login
    cy.intercept('GET', '**/api/auth/me', {
      statusCode: 200,
      body: { 
        data: { 
          user: { 
            nom: 'Admin', 
            prenom: 'Test', 
            profils: [{ libelleProfil: 'Programme MEDA' }] 
          } 
        } 
      }
    }).as('getMe');

    // Intercepter le chargement de la liste des projets
    cy.intercept('GET', '**/api/programme-meda/projets*', {
      statusCode: 200,
      body: { 
        data: [
          { 
            idProjet: 1, 
            gestion: 2024, 
            datePEC: '2024-01-01T00:00:00.000Z', 
            don: { numDon: 101, objet: 'Projet Santé' }
          }
        ]
      }
    }).as('getProjets');

    cy.visit('/programme-meda/projets');
    cy.wait('@getMe');
  });

  it('doit afficher les onglets du module et charger le formulaire de création par défaut', () => {
    cy.get('.tab-btn').contains('Ajouter un projet').should('be.visible').and('have.class', 'active');
    cy.get('.tab-btn').contains('Consulter les projets').should('be.visible');
    
    // Vérifier le formulaire
    cy.get('select').should('exist'); // Type de projet
  });

  it('doit permettre de soumettre le formulaire de création (Type Don)', () => {
    cy.intercept('POST', '**/api/programme-meda/projets', {
      statusCode: 201,
      body: { success: true, message: 'Projet créé avec succès' }
    }).as('createProjet');

    // Remplir le formulaire
    cy.get('select').select('DON');
    cy.get('input[type="number"]').eq(0).type('2025'); // gestion
    cy.get('input[type="date"]').type('2025-05-15'); // datePEC
    cy.get('input[type="number"]').eq(1).type('102'); // numDon
    cy.get('input[type="text"]').type('Projet Education'); // objetDon

    cy.get('button[type="submit"]').contains('Créer').click();

    cy.wait('@createProjet');

    // Vérifier le message de succès
    cy.contains('Projet créé avec succès').should('be.visible');
  });

  it('doit permettre de consulter la liste des projets', () => {
    // Cliquer sur l'onglet "Consulter"
    cy.contains('Consulter les projets').click();
    
    cy.wait('@getProjets');
    
    // Vérifier que le tableau s'affiche
    cy.get('table').should('be.visible');
    cy.contains('2024').should('be.visible');
    cy.contains('Don').should('be.visible');
    cy.contains('Projet Santé').should('be.visible');
  });
});

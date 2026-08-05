describe('Module Justificatifs (Avis Operation)', () => {
  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.setItem('access_token', 'fake-jwt-token');
    });
    
    cy.intercept('GET', '**/api/auth/me', {
      statusCode: 200,
      body: { 
        data: { 
          user: { 
            nom: 'Admin', 
            prenom: 'Test', 
            profils: [{ libelleProfil: 'Projets' }] 
          } 
        } 
      }
    }).as('getMe');

    cy.intercept('GET', '**/api/programme-meda/avis-operations*', {
      statusCode: 200,
      body: { 
        data: [
          { 
            codeDepense: 80,
            projetId: 1, 
            datePEC: '2024-02-01T00:00:00.000Z',
            avisOperation: {
              numFacture: 9999,
              montantDispo: 5000,
              partFinancee: 1000
            }
          }
        ]
      }
    }).as('getAvis');

    cy.visit('/programme-meda/avis-operations');
    cy.wait('@getMe');
  });

  it('doit afficher le formulaire de saisie par défaut', () => {
    cy.get('.tab-btn').contains('Justifier une dépense').should('be.visible').and('have.class', 'active');
  });

  it('doit soumettre une pièce justificative avec succès', () => {
    cy.intercept('POST', '**/api/programme-meda/avis-operations', {
      statusCode: 201,
      body: { success: true, message: 'Pièce justificative enregistrée' }
    }).as('createAvis');

    cy.get('input[type="number"]').eq(0).type('1'); // projetId
    cy.get('input[type="date"]').eq(0).type('2025-05-15'); // datePEC
    cy.get('input[type="date"]').eq(1).type('2025-12-31'); // dateEcheance
    cy.get('input[type="number"]').eq(1).type('5555'); // numFacture
    cy.get('input[type="number"]').eq(2).type('8000'); // montantDispo
    cy.get('input[type="number"]').eq(3).type('2000'); // partFinancee

    cy.get('button[type="submit"]').contains('Enregistrer').click();

    cy.wait('@createAvis');
    cy.contains('enregistrée avec succès').should('be.visible');
  });

  it('doit afficher la liste des justificatifs', () => {
    cy.contains('Consulter les pièces').click();
    cy.wait('@getAvis');
    cy.get('table').should('be.visible');
    cy.contains('Projet #1').should('be.visible');
    cy.contains('9999').should('be.visible');
  });
});

describe('Module Encaissements (Avances / Approvisionnements)', () => {
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

    cy.intercept('GET', '**/api/programme-meda/approvisionnements*', {
      statusCode: 200,
      body: { 
        data: [
          { 
            codeRecette: 50,
            projetId: 1, 
            datePEC: '2024-01-01T00:00:00.000Z',
            approvisionnement: {
              reference: 'REF-111',
              numAvance: 5,
              montantApprovis: 15000,
              cumulApprovis: 1
            }
          }
        ]
      }
    }).as('getAppros');

    cy.visit('/programme-meda/approvisionnements');
    cy.wait('@getMe');
  });

  it('doit afficher les onglets et le formulaire', () => {
    cy.get('.tab-btn').contains('Ajouter une avance').should('be.visible').and('have.class', 'active');
  });

  it('doit soumettre le formulaire avec succès', () => {
    cy.intercept('POST', '**/api/programme-meda/approvisionnements', {
      statusCode: 201,
      body: { success: true, message: 'Avance créée avec succès' }
    }).as('createAppro');

    cy.get('input[type="number"]').eq(0).type('1'); // projetId
    cy.get('input[type="date"]').eq(0).type('2025-05-15'); // datePEC
    cy.get('input[type="date"]').eq(1).type('2025-12-31'); // dateEcheance
    cy.get('input[type="number"]').eq(1).type('25000'); // montantApprovis
    cy.get('input[type="number"]').eq(2).type('2'); // cumulApprovis
    cy.get('input[type="number"]').eq(3).type('6'); // numAvance
    cy.get('input[type="text"]').type('REF-NEW'); // reference

    cy.get('button[type="submit"]').contains('Enregistrer').click();

    cy.wait('@createAppro');
    cy.contains('Avance / Approvisionnement créé avec succès').should('be.visible');
  });

  it('doit afficher la liste des avances', () => {
    cy.contains('Consulter les avances').click();
    cy.wait('@getAppros');
    cy.get('table').should('be.visible');
    cy.contains('Projet #1').should('be.visible');
    cy.contains('REF-111').should('be.visible');
  });
});

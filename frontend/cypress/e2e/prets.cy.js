describe('Module Prêts (Dette du Trésor)', () => {
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
            profils: [{ libelleProfil: 'Dette du Tresor' }] 
          } 
        } 
      }
    }).as('getMe');

    // Intercepter le chargement des prêteurs pour le formulaire
    cy.intercept('GET', '**/api/dette-tresor/prets/preteurs', {
      statusCode: 200,
      body: { 
        data: [
          { codeCategorie: 1, designation: 'FMI', maturite: 'L' },
          { codeCategorie: 2, designation: 'Banque Mondiale', maturite: 'L' }
        ]
      }
    }).as('getPreteurs');

    // Intercepter le chargement de la liste des prêts
    cy.intercept('GET', '**/api/dette-tresor/prets*', {
      statusCode: 200,
      body: { 
        data: [
          { 
            numPret: '1001', 
            numEmprunt: 'EMP-001', 
            dateCreation: '2023-01-01T00:00:00.000Z', 
            soldeCourant: 1500000, 
            objet: 'Autoroute du Nord',
            preteur: { designation: 'Banque Mondiale', codeCategorie: 2, maturite: 'L' }
          }
        ]
      }
    }).as('getPrets');

    cy.visit('/dette-tresor/prets');
    // S'assurer que l'authentification est passée avant de continuer
    cy.wait('@getMe');
  });

  it('doit afficher les onglets du module et charger le formulaire de création par défaut', () => {
    // Vérifier les onglets (en ciblant spécifiquement les boutons d'onglets pour éviter les liens de la sidebar)
    cy.get('.tab-btn').contains('Créer prêt').should('be.visible').and('have.class', 'active');
    cy.get('.tab-btn').contains('Consulter les prêts').should('be.visible');
    
    // Vérifier le formulaire
    cy.get('#numPret').should('exist');
    cy.wait('@getPreteurs');
    cy.get('#preteurId').should('contain', 'FMI');
  });

  it('doit permettre de soumettre le formulaire de création de prêt avec succès', () => {
    cy.intercept('POST', '**/api/dette-tresor/prets', {
      statusCode: 201,
      body: { success: true, message: 'Prêt créé avec succès' }
    }).as('createPret');

    // Remplir le formulaire
    cy.get('#numPret').type('2002');
    cy.get('#numEmprunt').type('EMP-002');
    cy.get('#preteurId').select('1');
    cy.get('#dateCreation').type('2023-05-15');
    cy.get('#soldeCourant').type('2000000');
    cy.get('#objet').type('Construction Hôpital');

    cy.get('button[type="submit"]').contains('Créer').click();

    cy.wait('@createPret');

    // Vérifier le message de succès
    cy.contains('Le prêt a été créé avec succès').should('be.visible');
    
    // Le formulaire devrait s'être vidé
    cy.get('#numPret').should('have.value', '');
  });

  it('doit permettre de consulter la liste des prêts', () => {
    // Cliquer sur l'onglet "Consulter"
    cy.contains('Consulter les prêts').click();
    
    cy.wait('@getPrets');
    
    // Vérifier que le tableau s'affiche avec la ligne mockée
    cy.get('.data-table').should('be.visible');
    cy.contains('#1001').should('be.visible');
    cy.contains('EMP-001').should('be.visible');
    cy.contains('Banque Mondiale').should('be.visible');
    cy.contains('Autoroute du Nord').should('be.visible');
  });
  
  it('doit filtrer la liste des prêts à la soumission du formulaire de recherche', () => {
    // Cliquer sur l'onglet "Consulter"
    cy.contains('Consulter les prêts').click();
    cy.wait('@getPrets');
    
    // S'attendre à un nouvel appel API lors de la recherche
    cy.intercept('GET', '**/api/dette-tresor/prets*numPret=1001*', {
      statusCode: 200,
      body: { data: [{ numPret: '1001', numEmprunt: 'EMP-001', objet: 'Recherche OK' }] }
    }).as('getPretsSearch');
    
    // Remplir le filtre
    cy.get('.search-form input[type="number"]').first().type('1001');
    cy.get('.search-form button[type="submit"]').click();
    
    cy.wait('@getPretsSearch');
    cy.contains('Recherche OK').should('be.visible');
  });
});

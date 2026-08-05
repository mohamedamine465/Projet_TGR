describe('Login Page (Authentification)', () => {
  beforeEach(() => {
    // Intercepter la requête de configuration s'il y en a une, sinon juste visiter la page
    cy.visit('/login');
  });

  it('doit afficher les erreurs si on soumet le formulaire vide', () => {
    cy.get('button[type="submit"]').click();

    // Vérifier que le navigateur ou notre validation bloque
    cy.get('input[type="email"]').invoke('prop', 'validationMessage').should('not.be.empty');
  });

  it('doit afficher une erreur pour des identifiants invalides', () => {
    // Intercepter la requête d\'API pour simuler une erreur 401
    cy.intercept('POST', '**/api/auth/login', {
      statusCode: 401,
      body: { success: false, message: 'Identifiants invalides.' }
    }).as('loginInvalid');

    cy.get('input[type="email"]').type('wrong@tgr.gov.ma');
    cy.get('input[type="password"]').type('wrongpass');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginInvalid');

    // Vérifier qu'un message d'erreur est affiché
    cy.contains('Identifiants invalides.').should('be.visible');
  });

  it('doit gérer le scénario de "Première Connexion" (Changement de mot de passe requis)', () => {
    cy.intercept('POST', '**/api/auth/login', {
      statusCode: 403,
      body: { 
        success: false, 
        message: 'Accès bloqué. Vous devez obligatoirement modifier votre mot de passe temporaire.',
        errors: {
          first_login: true,
          email: 'admin@tgr.gov.ma'
        }
      }
    }).as('loginFirst');

    cy.get('input[type="email"]').type('admin@tgr.gov.ma');
    cy.get('input[type="password"]').type('admin');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginFirst');

    // Vérifier que le formulaire de changement de mot de passe s'affiche sans redirection
    cy.contains('Première Connexion').should('be.visible');
    cy.contains('Veuillez changer votre mot de passe obligatoire.').should('be.visible');
    cy.get('input[placeholder="Nouveau mot de passe"]').should('exist');
  });

  it('doit réussir la connexion et rediriger vers le tableau de bord', () => {
    cy.intercept('POST', '**/api/auth/login', {
      statusCode: 200,
      body: { 
        success: true, 
        data: {
          token: 'fake-jwt-token',
          user: {
            nom: 'Admin',
            prenom: 'Système',
            email: 'admin@tgr.gov.ma',
            profils: [{ libelleProfil: 'Dette du Tresor' }]
          }
        }
      }
    }).as('loginSuccess');

    cy.get('input[type="email"]').type('admin@tgr.gov.ma');
    cy.get('input[type="password"]').type('securepassword');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginSuccess');

    // Vérifier que le token N'EST PLUS stocké dans le localStorage (Sécurité XSS)
    cy.window().then((window) => {
      expect(window.localStorage.getItem('access_token')).to.be.null;
    });

    // Vérifier la redirection
    cy.url().should('not.include', '/login');
  });
});

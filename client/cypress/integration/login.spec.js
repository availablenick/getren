describe('Login page', () => {
  beforeEach(() => {
    cy.request('GET', 'http://localhost:5000/erase_db');
    cy.intercept('POST', 'http://localhost:5000/login').as('login');
  });

  it('renders error message when e-mail and password are empty', () => {
    cy.visit('http://localhost:3000/login');
    cy.get('button[type="submit"]').click();
    cy.wait('@login');
    cy.get('form').should('contain', 'O email/senha está incorreto(a)');
  });

  it('renders error message when only e-mail is empty', () => {
    cy.visit('http://localhost:3000/login');
    cy.get('input[name="password"]').type('password');
    cy.get('button[type="submit"]').click();
    cy.wait('@login');
    cy.get('form').should('contain', 'O email/senha está incorreto(a)');
  });

  it('renders error message when only password is empty', () => {
    cy.visit('http://localhost:3000/login');
    cy.get('input[name="email"]').type('e-mail');
    cy.get('button[type="submit"]').click();
    cy.wait('@login');
    cy.get('form').should('contain', 'O email/senha está incorreto(a)');
  });

  it('checks if user signs in correctly', () => {
    cy.visit('http://localhost:3000/login');
    cy.request('POST', 'http://localhost:5000/register',
      {
        email: 'test@example.com',
        password: 'password',
        password_confirm: 'password'
      }
    ).then(() => {
      cy.get('input[name="email"]').type('test@example.com');
      cy.get('input[name="password"]').type('password');
      cy.get('button[type="submit"]').click();
      cy.wait('@login');
      cy.get('body').should('contain', 'SAIR');
    });
  });

  it('renders error message when password is incorrect', () => {
    cy.visit('http://localhost:3000/login');
    cy.request('POST', 'http://localhost:5000/register',
      {
        email: 'test@example.com',
        password: 'password',
        password_confirm: 'password'
      }
    ).then(() => {
      cy.get('input[name="email"]').type('test@example.com');
      cy.get('input[name="password"]').type('password1');
      cy.get('button[type="submit"]').click();
      cy.wait('@login');
      cy.get('form').should('contain', 'O email/senha está incorreto(a)');
    });
  });
});

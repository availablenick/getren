describe('Signup page', () => {
  beforeEach(() => {
    cy.request('GET', 'http://localhost:5000/erase_db');
    cy.request('GET', 'http://localhost:5000/logout');
    cy.intercept('POST', 'http://localhost:5000/register').as('signup');
    cy.intercept('POST', 'http://localhost:5000/confirmation').as('confirmation');
  });

  it('renders error message when e-mail and password are empty', () => {
    cy.visit('http://localhost:3000/cadastro');
    cy.get('button[type=submit]').click();
    cy.get('form').should('contain', 'Sem email');
    cy.get('form').should('contain', 'Sem senha');
  });

  it('renders error message when password is too short', () => {
    cy.visit('http://localhost:3000/cadastro');
    cy.get('input[name=password]').type('1234567');
    cy.get('button[type=submit]').click();
    cy.wait('@signup');
    cy.get('form').should('contain', 'Senha curta');
  });

  it('renders error message when e-mail is not valid', () => {
    cy.visit('http://localhost:3000/cadastro');
    let invalidEmails = ['a@example.com', 'aexample.com', 'a@example'];
    for (let email of invalidEmails) {
      cy.get('input[name=email]').type(email);
      cy.get('button[type=submit]').click();
      cy.wait('@signup');
      cy.get('form').should('contain', 'Email inválido');
      cy.get('input[name=email]').clear();
    }
  });

  it('renders error message when e-mail already exists', () => {
    cy.visit('http://localhost:3000/cadastro');
    cy.get('input[name=email]').type('test@example.com');
    cy.get('input[name=password]').type('password');
    cy.get('input[name=password_confirm]').type('password');
    cy.get('button[type=submit]').click();
    cy.wait('@confirmation');
    cy.wait(5000);

    // Log out and try to register another user
    cy.request('GET', 'http://localhost:5000/logout')
      .then(() => {
        cy.visit('http://localhost:3000/cadastro');
        cy.get('input[name=email]').type('test@example.com');
        cy.get('input[name=password]').type('password');
        cy.get('input[name=password_confirm]').type('password');
        cy.get('button[type=submit]').click();
        cy.wait('@signup');
        cy.get('form').should('contain', 'Email cadastrado');
      });
  });

  it('renders error message when password confirmation is incorrect', () => {
    cy.visit('http://localhost:3000/cadastro');
    cy.get('input[name=password]').type('password');
    cy.get('input[name=password_confirm]').type('password1');
    cy.get('button[type=submit]').click();
    cy.wait('@signup');
    cy.get('form').should('contain', 'Confirmação errada');
  });

  it('checks if user signs up and signs in correctly', () => {
    cy.visit('http://localhost:3000/cadastro');
    cy.get('input[name=email]').type('test@example.com');
    cy.get('input[name=password]').type('password');
    cy.get('input[name=password_confirm]').type('password');
    cy.get('button[type=submit]').click();
    cy.wait('@signup');
    cy.get('body').should('contain', 'Usuário cadastrado');
    cy.wait('@confirmation')
    cy.wait(5000);
    cy.get('body').should('contain', 'SAIR');
  });
});

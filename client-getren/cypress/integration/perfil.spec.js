describe('Perfil page', () => {
  beforeEach(() => {
    cy.request('GET', 'http://localhost:5000/erase_db')
      .then(() => {
        return cy.request('GET', 'http://localhost:5000/logout');
      })
      .then(() => {
        return cy.request('POST', 'http://localhost:5000/register',
          {
            email: 'test@example.com',
            password: 'password',
            password_confirm: 'password',
          }
        );
      });
    cy.visit('http://localhost:3000/perfil');
  });

  it('loads user\'s information correctly', () => {
    cy.get('input[name=email]').should('have.value', 'test@example.com');
  });

  it('loads user\'s information correctly after update', () => {
    cy.get('input[name=name]').type('test name');
    cy.get('input[name=job]').type('test job');
    cy.get('input[name=birthdate]').type('2000-01-01');
    cy.get('select[name=federal_state]').select('AC');
    cy.wait(1000);
    cy.get('select[name=city]').select('Acrelândia');
    cy.get('button[type=submit]').click();
    cy.wait(1000);

    cy.visit('http://localhost:3000/perfil');
    cy.get('input[name=name]').should('have.value', 'test name');
    cy.get('input[name=job]').should('have.value', 'test job');
    cy.get('input[name=birthdate]').should('have.value', '2000-01-01');
    cy.get('select[name=federal_state]').should('have.value', 'AC');
    cy.get('select[name=city]').should('have.value', 'Acrelândia');
  });

  it('loads user\'s purchases', () => {
    // for (let i = 0; i < 50; i++) {
    //   let json_args = JSON.stringify({
    //     name: 'Curso ' + i,
    //     price: 100,
    //     expires_at: new Date().toISOString().slice(0, 10),
    //     is_watchable: false,
    //     is_available: false,
    //   });

    //   let course = new FormData();
    //   course.append('json_args', json_args);
    //   cy.form_request('http://localhost:3000/perfil', formData);
    // }

    cy.get('button[name=minhas-compras]').click();
  });
});

describe('Login testing', () => {

  beforeEach(() => {
    cy.visit('/');
  })

  it('Should redirect to the login page (without auth)', () => {
    cy.location('href').should('include', '/auth/login');
  })

  it('Allows user to see email but not password', () => {
    cy.fixture('users').then(users => {
      cy.get('input').eq(0).type(users[0].email);
      cy.get('input[type="password"]').type(users[0].password);

      cy.get('input').eq(0).should('have.value', users[0].email);
      cy.get('input[type=password]').should('have.value', users[0].password);
    });
  });

  it('Shows error with incorrect details', () => {
    cy.get('input').eq(0).type('not');
    cy.get('input[type="password"]').type('correct');

    cy.get('button').click();
    cy.contains('Email or password are incorrect').should('be.visible');
  });

  it('Allows user to login', () => {
    cy.fixture('users').then(users => {
      cy.get('input').eq(0).type(users[0].email);
      cy.get('input[type="password"]').type(users[0].password);

      cy.get('button').click();
      cy.location('pathname').should('equal', '/');
    });
  });
})

describe('Home page testing', () => {

  beforeEach(() => {
    cy.fixture('users').then(users => {
      cy.login(users[0].email, users[0].password);
    });
  });

  it('Can see assets on the frontpage', () => {
    cy.get('[data-testid="asset-page"]').children('div').should('have.length.gt', 0);
  });

  it('Can see the side bar options', () => {
    cy.get('[data-testid="sidebar"]').children('a').should('have.length', 3);
  });

});

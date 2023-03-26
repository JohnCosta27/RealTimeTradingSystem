describe('Allows user to see their assets', () => {
  beforeEach(() => {
    cy.fixture('users').then((users) => {
      cy.login(users[0].email, users[0].password);
      cy.get('[aria-roledescription="goto-my-assets"]')
        .click()
        .location('pathname')
        .should('match', /assets/);
    });
  });

  it('should see assets', () => {
    cy.get('[aria-roledescription="asset-card"]').should('have.length.gt', 0);
  });
});

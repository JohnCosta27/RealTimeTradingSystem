describe('Home page testing', () => {
  beforeEach(() => {
    cy.fixture('users').then((users) => {
      cy.login(users[0].email, users[0].password);
    });
  });

  it('Can see assets on the frontpage', () => {
    cy.get('[data-testid="asset-page"]')
      .children('div')
      .should('have.length.gt', 0);
  });

  it('Can see the side bar options', () => {
    cy.get('[data-testid="sidebar"]').children('a').should('have.length', 3);
  });

  it('Allows users to see the price of an asset', () => {
    cy.get('[aria-roledescription="asset-card"] [aria-roledescription="view-graph-button"]')
      .eq(0)
      .click()

    cy.location('pathname')
      .location('pathname')
      .should('match',/\/assets\/\b.{36}$/)
  });
});

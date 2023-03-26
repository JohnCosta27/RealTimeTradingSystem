describe('Create trades testing', () => {

  beforeEach(() => {
    cy.fixture('users').then((users) => {
      cy.login(users[0].email, users[0].password);
      cy.get('[aria-roledescription="goto-trades"]')
        .click()
        .location('pathname')
        .should('match', /trades/);
    });
  });

  it('Allows user to create a trade', () => {
    // Allows for more robust testing by having random prices.
    const amount = Math.floor(Math.random() * 50);
    const price = Math.floor(Math.random() * 50);

    const expected = Math.floor((price / amount) * 100) / 100;

    cy.get('[aria-roledescription="trade-amount"]').click().type(amount.toString());
    cy.get('[aria-roledescription="trade-price"]').click().type(price.toString());

    cy.contains(/select/i).click()
    cy.contains(/silver/i).click();

    cy.get('[aria-roledescription="create-trade"]').click();

    cy.contains(expected).should('have.length', 1);
  });
  
});

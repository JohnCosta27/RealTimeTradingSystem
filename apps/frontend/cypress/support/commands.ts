/// <reference types="cypress" />
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/auth/login');
  cy.get('input').eq(0).type(email);
  cy.get('input[type="password"]').type(password);
  cy.get('button').click();

  cy.location('pathname').should('eq', '/');
});

Cypress.on('uncaught:exception', () => {
  // returning false here prevents Cypress from
  // failing the test
  return false
})

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
    }
  }
}

export {};

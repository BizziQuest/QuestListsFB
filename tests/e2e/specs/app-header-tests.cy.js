// https://docs.cypress.io/api/introduction/api.html

describe('App shows the welcome text', () => {
  it('Visits the app root url', () => {
    cy.visit('/');
    cy.contains('.v-alert', 'Welcome to Quest Lists! You don\'t have any Quests yet, but have no fear, simply click on the  icon on the left to get started!');
  });
});

describe('App shows app name', () => {
  it('Visits the app root url', () => {
    cy.visit('/');
    // cy.contains('header button', 'LOG IN / SIGN UP');
  });
});

describe('Message when no lists are available', () => {
  it('Visits the app root url', () => {
    cy.server();
    cy.route('http://localhost:8888/*').as('firebaseRequest');
    cy.visit('/');
    cy.wait('@firebaseRequest', { timeout: 30000 });
    cy.contains('.v-alert', 'There are no lists yet. Please add a list.');
  });
});

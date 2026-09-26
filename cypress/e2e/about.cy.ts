describe('About page', () => {
  beforeEach(() => {
    cy.visit('/about')
  })

  it('renders the page header', () => {
    cy.contains('Banking that works').should('be.visible')
    cy.contains('for everyone').should('be.visible')
  })

  it('renders exactly 4 stat cards', () => {
    cy.contains('Founded').should('be.visible')
    cy.contains('Clients served').should('be.visible')
    cy.contains('Branches nationwide').should('be.visible')
    cy.contains('Credit rating').should('be.visible')
  })

  it('renders the mission section', () => {
    cy.contains('Our Mission').should('be.visible')
    cy.contains('Simplifying banking for millions').should('be.visible')
  })

  it('renders all Our Promise items', () => {
    cy.contains('No hidden fees').should('be.visible')
    cy.contains('Plain-language terms').should('be.visible')
    cy.contains('Instant decisions').should('be.visible')
    cy.contains('Human support, always').should('be.visible')
  })

  it('renders exactly 4 value cards', () => {
    cy.contains('Trusted & Secure').should('be.visible')
    cy.contains('Client-First').should('be.visible')
    cy.contains('Financial Empowerment').should('be.visible')
    cy.contains('Proven Track Record').should('be.visible')
  })

  it('CTA button links to loan simulator', () => {
    cy.contains('Try our Loan Simulator')
      .should('have.attr', 'href')
      .and('include', 'loan-simulator')
  })
})

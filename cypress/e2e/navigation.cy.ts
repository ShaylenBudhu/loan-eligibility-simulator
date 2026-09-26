describe('Navigation', () => {
  beforeEach(() => {
    cy.viewport(1280, 800)
    cy.visit('/')
  })

  it('loads the home page by default', () => {
    cy.url().should('eq', `${Cypress.config('baseUrl')}/`)
    cy.contains('Your financial').should('be.visible')
  })

  it('navigates to Loan Simulator', () => {
    cy.contains('Loan Eligibility Simulator').first().click()
    cy.url().should('include', '/loan-simulator')
  })

  it('navigates to About Us', () => {
    cy.contains('About Us').click()
    cy.url().should('include', '/about')
    cy.contains('Banking that works').should('be.visible')
  })

  it('navigates to Contact Us', () => {
    cy.contains('Contact Us').click()
    cy.url().should('include', '/contact')
    cy.contains("We'd love to").should('be.visible')
  })

  it('logo click returns to home from another page', () => {
    cy.visit('/about')
    cy.get('img[alt="Capitec Bank"]').click()
    cy.url().should('eq', `${Cypress.config('baseUrl')}/`)
  })

  it('active link is highlighted on About page', () => {
    cy.visit('/about')
    cy.contains('About Us').should('have.attr', 'data-active', '')
  })

  it('active link is highlighted on Contact page', () => {
    cy.visit('/contact')
    cy.contains('Contact Us').should('have.attr', 'data-active', '')
  })
})

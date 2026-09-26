describe('Contact page', () => {
  beforeEach(() => {
    cy.visit('/contact')
  })

  it('renders the page header', () => {
    cy.contains("We'd love to").should('be.visible')
    cy.contains('hear from you').should('be.visible')
  })

  it('renders all contact detail cards', () => {
    cy.contains('Call us').should('be.visible')
    cy.contains('Email us').should('be.visible')
    cy.contains('Head office').should('be.visible')
    cy.contains('Branch hours').should('be.visible')
  })

  it('shows native validation when submitting empty form', () => {
    cy.get('button[type="submit"]').click()
    // HTML5 required fields block submission — success state never appears
    cy.contains('Message sent!').should('not.exist')
  })

  it('successfully submits a filled form', () => {
    cy.get('#name').type('Test User')
    cy.get('#email').type('test@example.com')
    cy.get('#message').type('This is a test message from Cypress.')
    cy.get('button[type="submit"]').click()
    cy.contains('Message sent!').should('be.visible')
  })

  it('shows 24-hour reply note on success', () => {
    cy.get('#name').type('User')
    cy.get('#email').type('user@test.com')
    cy.get('#message').type('Hello')
    cy.get('button[type="submit"]').click()
    cy.contains('24 hours').should('be.visible')
  })

  it('resets form when "Send another message" is clicked', () => {
    cy.get('#name').type('Reset User')
    cy.get('#email').type('reset@test.com')
    cy.get('#message').type('Testing reset flow')
    cy.get('button[type="submit"]').click()
    cy.contains('Send another message').click()
    cy.get('#name').should('have.value', '')
    cy.get('#email').should('have.value', '')
    cy.get('#message').should('have.value', '')
  })

  it('CTA link points to loan simulator', () => {
    cy.contains('Try the Loan Simulator').should('have.attr', 'href', '/loan-simulator')
  })
})

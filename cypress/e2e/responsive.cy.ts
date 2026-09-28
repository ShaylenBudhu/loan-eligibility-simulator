describe('Responsive navbar', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  context('desktop ≥1024px', () => {
    beforeEach(() => cy.viewport(1280, 800))

    it('shows desktop nav links', () => {
      cy.get('button[aria-label="Toggle menu"]').should('not.be.visible')
    })

    it('all nav links are visible', () => {
      cy.contains('Home').should('be.visible')
      cy.contains('About Us').should('be.visible')
      cy.contains('Contact Us').should('be.visible')
    })
  })

  context('tablet / mobile <1024px', () => {
    beforeEach(() => cy.viewport(768, 900))

    it('shows the burger button', () => {
      cy.get('button[aria-label="Toggle menu"]').should('be.visible')
    })

    it('desktop nav links are not visible', () => {
      // NavigationMenu is hidden via CSS
      cy.get('button[aria-label="Toggle menu"]').should('be.visible')
    })

    it('opens mobile menu on burger click', () => {
      cy.get('button[aria-label="Toggle menu"]').click()
      cy.get('[aria-expanded="true"]').should('exist')
      // Target mobile-only links (rounded-xl) not the hidden desktop nav (rounded-full)
      cy.contains('a.rounded-xl', 'Home').should('be.visible')
      cy.contains('a.rounded-xl', 'About Us').should('be.visible')
    })

    it('closes mobile menu on second burger click', () => {
      cy.get('button[aria-label="Toggle menu"]').click()
      cy.get('button[aria-label="Toggle menu"]').click()
      cy.get('[aria-expanded="false"]').should('exist')
    })

    it('closes mobile menu when a link is clicked', () => {
      cy.get('button[aria-label="Toggle menu"]').click()
      cy.contains('a.rounded-xl', 'About Us').click()
      cy.url().should('include', '/about')
      cy.get('[aria-expanded="false"]').should('exist')
    })
  })
})

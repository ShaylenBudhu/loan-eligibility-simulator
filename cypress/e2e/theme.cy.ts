describe('Theme toggle', () => {
  beforeEach(() => {
    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.clear()
        win.localStorage.setItem('theme', 'light')
      },
    })
  })

  it('starts in light mode by default', () => {
    cy.get('html').should('not.have.class', 'dark')
  })

  it('clicking toggle applies dark class to <html>', () => {
    cy.get('button[aria-label="Toggle theme"]').click()
    cy.get('html').should('have.class', 'dark')
  })

  it('clicking toggle again removes dark class', () => {
    cy.get('button[aria-label="Toggle theme"]').click()
    cy.get('button[aria-label="Toggle theme"]').click()
    cy.get('html').should('not.have.class', 'dark')
  })

  it('persists dark mode preference after reload', () => {
    cy.get('button[aria-label="Toggle theme"]').click()
    cy.reload()
    cy.get('html').should('have.class', 'dark')
  })

  it('persists light mode preference after reload', () => {
    // set to dark first, then back to light
    cy.get('button[aria-label="Toggle theme"]').click()
    cy.get('button[aria-label="Toggle theme"]').click()
    cy.reload()
    cy.get('html').should('not.have.class', 'dark')
  })

  it('saves preference to localStorage', () => {
    cy.get('button[aria-label="Toggle theme"]').click()
    cy.window().then((win) => {
      expect(win.localStorage.getItem('theme')).to.eq('dark')
    })
  })
})

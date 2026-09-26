import { ThemeToggle } from '@/components/molecules'
import { ThemeProvider } from '@/contexts'

const mountToggle = (dark = false) => {
  // ThemeProvider reads from localStorage on init — set it before mounting
  localStorage.setItem('theme', dark ? 'dark' : 'light')
  cy.mount(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>
  )
}

describe('ThemeToggle', () => {
  afterEach(() => localStorage.removeItem('theme'))

  it('renders the toggle button with aria-label', () => {
    mountToggle()
    cy.get('button[aria-label="Toggle theme"]').should('exist')
  })

  it('has cursor-pointer class', () => {
    mountToggle()
    cy.get('button[aria-label="Toggle theme"]').should('have.class', 'cursor-pointer')
  })

  it('clicking in light mode applies dark class to <html>', () => {
    mountToggle(false)
    cy.get('button[aria-label="Toggle theme"]').click()
    cy.get('html').should('have.class', 'dark')
  })

  it('clicking in dark mode removes dark class from <html>', () => {
    mountToggle(true)
    cy.get('button[aria-label="Toggle theme"]').click()
    cy.get('html').should('not.have.class', 'dark')
  })

  it('saves updated preference to localStorage after click', () => {
    mountToggle(false)
    cy.get('button[aria-label="Toggle theme"]').click()
    cy.window().then((win) => {
      expect(win.localStorage.getItem('theme')).to.eq('dark')
    })
  })
})

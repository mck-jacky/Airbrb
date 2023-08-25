/* eslint-disable no-undef */
describe('happy path on search and review listing', () => {
  it('should register and make a booking', () => {
    cy.visit('localhost:3000/')
    cy.url().should('include', 'localhost:3000/')

    // visit register page
    cy.get('button[name="register"]')
      .click();
    cy.url().should('include', 'localhost:3000/register')

    // create account tom successfully
    cy.get('input[name="name"]')
      .focus()
      .type('Aimen')

    cy.get('input[name="email"]')
      .focus()
      .type('Aimen@gmail.com')

    cy.get('input[name="password"]')
      .focus()
      .type('passw0rd')

    cy.get('input[name="confirm-password"]')
      .focus()
      .type('passw0rd')

    cy.get('button[name="submit"]')
      .click()

    cy.url().should('include', 'localhost:3000/')
    cy.get('button[name="logout"]')
      .should('be.visible')

    // able to visit listing
    cy.get('button[name="listing-host"]')
      .click()
    cy.get('button[name="new-listing"]')
      .should('be.visible')

    // visit new listing page
    cy.get('button[name="new-listing"]')
      .click()
    cy.url().should('include', 'localhost:3000/listings/new')

    // able to create a new listing
    cy.get('input[name="title"]')
      .focus()
      .type('Eco Rainforest Retreat (Entire 3bdr House)')
    cy.get('input[name="propertyType"]').parent().click()
    cy.findByRole('option', {
      name: 'House'
    }).click()
    cy.get('input[name="street-address"]')
      .focus()
      .type('Montville')
    cy.get('input[name="city"]')
      .focus()
      .type('Montville')
    cy.get('input[name="state-province"]')
      .focus()
      .type('QLD')
    cy.get('input[name="zip"]')
      .focus()
      .type('2320')
    cy.get('input[name="price"]')
      .focus()
      .type('3450')
    cy.get('input[name="bathrooms"]')
      .focus()
      .type('2')
    cy.get('button[name="double-0-0"]')
      .click()
    cy.get('input[name="essentials"]')
      .check()
    cy.get('input[name="private-bathroom"]')
      .check()
    cy.get('input[name="image-thumbnail"]').attachFile('../../res/image.png')
    cy.wait(1000)
    cy.get('button[name="submit"]')
      .click()
    cy.url().should('include', 'localhost:3000/listings/host')
    cy.wait(2000)
    cy.get('p[name="listing-title"]')
      .contains('Eco Rainforest Retreat (Entire 3bdr House)')
    cy.get('div[name="unpublish-label"]')
      .should('be.visible')

    // publish listing
    cy.get('button[name="more"]').click()
    cy.get('li[name="Publish"]').click()
    cy.get('.ant-picker-input').eq(0).get('input').eq(0).focus()
    cy.get('.ant-picker-input').eq(0).get('input').eq(0).type('2023-01-15')
    cy.get('.ant-picker-input').eq(0).get('input').eq(1).focus()
    cy.get('.ant-picker-input').eq(0).get('input').eq(1).type('2023-01-20')
    cy.get('.ant-picker-input').eq(0).get('input').eq(1).type('{enter}')
    cy.get('.ant-modal-footer button').eq(1).click({ force: true })
    cy.get('div[name="publish-label"]')
      .should('be.visible')

    // visit new listing page
    cy.get('button[name="new-listing"]')
      .click()
    cy.url().should('include', 'localhost:3000/listings/new')

    // able to create a new listing
    cy.get('input[name="title"]')
      .focus()
      .type('Rodwell Retreat Glamping Tent')
    cy.get('input[name="propertyType"]').parent().click()
    cy.findByRole('option', {
      name: 'House'
    }).click()
    cy.get('input[name="street-address"]')
      .focus()
      .type('Woodchester')
    cy.get('input[name="city"]')
      .focus()
      .type('Woodchester')
    cy.get('input[name="state-province"]')
      .focus()
      .type('SA')
    cy.get('input[name="zip"]')
      .focus()
      .type('2220')
    cy.get('input[name="price"]')
      .focus()
      .type('680')
    cy.get('input[name="bathrooms"]')
      .focus()
      .type('1')
    cy.get('button[name="double-0-0"]')
      .click()
    cy.get('input[name="essentials"]')
      .check()
    cy.get('input[name="private-bathroom"]')
      .check()
    cy.get('input[name="image-thumbnail"]').attachFile('../../res/image.png')
    cy.wait(1000)
    cy.get('button[name="submit"]')
      .click()
    cy.url().should('include', 'localhost:3000/listings/host')
    cy.wait(2000)
    cy.get('p[name="listing-title"]')
      .contains('Rodwell Retreat Glamping Tent')
    cy.get('div[name="unpublish-label"]')
      .should('be.visible')

    // publish listing
    cy.wait(6000)
    cy.get('button[name="more"]').eq(1).click()
    cy.get('li[name="Publish"]').click()
    cy.get('.ant-picker-input').eq(0).get('input').eq(0).focus()
    cy.get('.ant-picker-input').eq(0).get('input').eq(0).type('2023-01-15')
    cy.get('.ant-picker-input').eq(0).get('input').eq(1).focus()
    cy.get('.ant-picker-input').eq(0).get('input').eq(1).type('2023-01-17')
    cy.get('.ant-picker-input').eq(0).get('input').eq(1).type('{enter}')
    cy.get('.ant-modal-footer button').eq(1).click({ force: true })
    cy.get('div[name="publish-label"]')
      .should('be.visible')

    // logout successfully
    cy.get('button[name="logout"]')
      .click()
    cy.get('button[name="register"]')
      .should('be.visible')

    // create account Hayden successfully
    cy.visit('localhost:3000/')
    cy.url().should('include', 'localhost:3000/')

    // // visit register page
    cy.get('button[name="register"]')
      .click();
    cy.url().should('include', 'localhost:3000/register')

    cy.get('input[name="name"]')
      .focus()
      .type('Hayden')

    cy.get('input[name="email"]')
      .focus()
      .type('Hayden@gmail.com')

    cy.get('input[name="password"]')
      .focus()
      .type('passw0rd')

    cy.get('input[name="confirm-password"]')
      .focus()
      .type('passw0rd')

    cy.get('button[name="submit"]')
      .click()

    cy.url().should('include', 'localhost:3000/')
    cy.get('button[name="logout"]')
      .should('be.visible')

    // able to see two listing
    cy.get('p[name="listing-title"]').contains('Eco Rainforest Retreat (Entire 3bdr House)')
    cy.get('p[name="listing-title"]').contains('Rodwell Retreat Glamping Tent')

    // search by city
    cy.get('input[name="search-bar"]')
      .focus()
      .type('Eco')

    cy.get('button[name="clear-button"]')
      .should('be.visible')

    cy.get('button[name="search-button"]')
      .click()

    // able to show Eco Rainforest Retreat (Entire 3bdr House)
    cy.get('p[name="listing-title"]').contains('Eco Rainforest Retreat (Entire 3bdr House)')
    cy.get('p[name="listing-title"]').contains('Rodwell Retreat Glamping Tent').should('not.exist');

    // clear search bar
    cy.get('button[name="clear-button"]')
      .click()

    // able to see two listing
    cy.get('p[name="listing-title"]').contains('Eco Rainforest Retreat (Entire 3bdr House)')
    cy.get('p[name="listing-title"]').contains('Rodwell Retreat Glamping Tent')

    // search by fiter
    cy.get('button[name="filter-button"]')
      .click()

    // filter by date
    cy.get('input[placeholder="Start date"]')
      .focus()
      .type('2023/01/18')
    cy.get('input[placeholder="End date"]')
      .focus()
      .type('2023/01/20')
    cy.get('input[placeholder="End date"]').type('{enter}')
    cy.get('button[name="modal-search-button"]')
      .click({ force: true })

    // able to show Eco Rainforest Retreat (Entire 3bdr House)
    cy.wait(3000)
    cy.get('p[name="listing-title"]').eq(0).contains('Eco Rainforest Retreat (Entire 3bdr House)')
    cy.get('p[name="listing-title"]').eq(0).contains('Rodwsell Retreat Glamping Tent').should('not.exist');

    // create booking
    cy.get('button[name="card-action"]').click()
    cy.wait(2000)

    cy.get('button[name="book-submit"]').click()
    cy.wait(3000)

    // logout successfully
    cy.get('button[name="logout"]')
      .click()
    cy.get('button[name="register"]')
      .should('be.visible')
    cy.url().should('include', 'localhost:3000/listings')

    // login again
    cy.get('button[name="login"]')
      .click()
    cy.url().should('include', 'localhost:3000/login')

    // able to login Aimen
    cy.get('input[name="email"]')
      .focus()
      .type('Aimen@gmail.com')

    cy.get('input[name="password"]')
      .focus()
      .type('passw0rd')

    cy.get('button[name="submit"]')
      .click()

    // able to visit listing
    cy.get('button[name="listing-host"]')
      .click()
    cy.get('button[name="new-listing"]')
      .should('be.visible')

    // accpet booking
    cy.wait(6000)
    cy.get('button[name="more"]').eq(0).click()
    cy.get('li[name="Booking"]').click()
    cy.get('span[name="accept-button"]').click()

    // logout successfully
    cy.get('button[name="logout"]')
      .click()
    cy.get('button[name="register"]')
      .should('be.visible')
    cy.url().should('include', 'localhost:3000')

    // login again
    cy.get('button[name="login"]')
      .click()
    cy.url().should('include', 'localhost:3000/login')

    // able to login Hayden
    cy.get('input[name="email"]')
      .focus()
      .type('Hayden@gmail.com')

    cy.get('input[name="password"]')
      .focus()
      .type('passw0rd')

    cy.get('button[name="submit"]')
      .click()

    // booking is accepted
    cy.wait(3000)
    cy.url().should('include', 'localhost:3000/')
    cy.get('div[name="status"]').contains('accepted')
  })
})

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
      .type('Tom')

    cy.get('input[name="email"]')
      .focus()
      .type('tom@gmail.com')

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

    // logout successfully
    cy.get('button[name="logout"]')
      .click()
    cy.get('button[name="register"]')
      .should('be.visible')

    // visit register page
    cy.get('button[name="register"]')
      .click();
    cy.url().should('include', 'localhost:3000/')

    // create account jerry successfully
    cy.get('input[name="name"]')
      .focus()
      .type('Jerry')

    cy.get('input[name="email"]')
      .focus()
      .type('jerry@gmail.com')

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

    // logout successfully
    cy.get('button[name="logout"]')
      .click()
    cy.get('button[name="login"]')
      .should('be.visible')

    // visit login page
    cy.get('button[name="login"]')
      .click()
    cy.url().should('include', 'localhost:3000/login')

    // able to login tom
    cy.get('input[name="email"]')
      .focus()
      .type('tom@gmail.com')

    cy.get('input[name="password"]')
      .focus()
      .type('passw0rd')

    cy.get('button[name="submit"]')
      .click()

    cy.url().should('include', 'localhost:3000/')
    cy.get('button[name="listing-host"]')
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
      .type('Wonderful garden')
    cy.get('input[name="propertyType"]').parent().click()
    cy.findByRole('option', {
      name: 'Hotel'
    }).click()
    cy.get('input[name="street-address"]')
      .focus()
      .type('High Street')
    cy.get('input[name="city"]')
      .focus()
      .type('Sydney')
    cy.get('input[name="state-province"]')
      .focus()
      .type('NSW')
    cy.get('input[name="zip"]')
      .focus()
      .type('2020')
    cy.get('input[name="price"]')
      .focus()
      .type('180')
    cy.get('input[name="bathrooms"]')
      .focus()
      .type('2')
    cy.get('button[name="double-0-0"]')
      .click()
    cy.get('input[name="essentials"]')
      .check()
    cy.get('input[name="washer"]')
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
      .contains('Wonderful garden')
    cy.get('div[name="unpublish-label"]')
      .should('be.visible')

    // publish listing
    cy.get('button[name="more"]').click()
    cy.get('li[name="Publish"]').click()
    cy.get('.ant-picker-input').eq(0).get('input').eq(0).focus()
    cy.get('.ant-picker-input').eq(0).get('input').eq(0).type('2023-01-23')
    cy.get('.ant-picker-input').eq(0).get('input').eq(1).focus()
    cy.get('.ant-picker-input').eq(0).get('input').eq(1).type('2023-01-25')
    cy.get('.ant-picker-input').eq(0).get('input').eq(1).type('{enter}')
    cy.get('.ant-modal-footer button').eq(1).click({ force: true })
    cy.get('div[name="publish-label"]')
      .should('be.visible')

    // publish listing
    cy.get('button[name="more"]').click()
    cy.get('li[name="Unpublish"]').click()
    cy.get('div[name="unpublish-label"]')
      .should('be.visible')

    // publish listing again
    cy.get('button[name="more"]').click()
    cy.get('li[name="Publish"]').click()
    cy.get('.ant-picker-input').eq(0).get('input').eq(0).focus()
    cy.get('.ant-picker-input').eq(0).get('input').eq(0).type('2023-01-26')
    cy.get('.ant-picker-input').eq(0).get('input').eq(1).focus()
    cy.get('.ant-picker-input').eq(0).get('input').eq(1).type('2023-01-28')
    cy.get('.ant-picker-input').eq(0).get('input').eq(1).type('{enter}')
    cy.get('.ant-modal-footer button').eq(1).click({ force: true })
    cy.get('div[name="publish-label"]')
      .should('be.visible')

    // logout successfully
    cy.get('button[name="logout"]')
      .click()
    cy.get('button[name="login"]')
      .should('be.visible')
    cy.get('p[name="date-range"]').contains('26 Jan - 28 Jan')

    // visit login page
    cy.get('button[name="login"]')
      .click()
    cy.url().should('include', 'localhost:3000/login')

    // able to login jerry
    cy.get('input[name="email"]')
      .focus()
      .type('jerry@gmail.com')

    cy.get('input[name="password"]')
      .focus()
      .type('passw0rd')

    cy.get('button[name="submit"]')
      .click()

    cy.url().should('include', 'localhost:3000/')
    cy.get('button[name="listing-host"]')
      .should('be.visible')
    cy.get('p[name="date-range"]').contains('26 Jan - 28 Jan')

    // click listing
    cy.get('button[name="card-action"]').click()
    cy.wait(2000)
    // check listing elements
    cy.get('h6[name="listing-title"]').contains('Wonderful garden')
    cy.get('span[name="listing-address"]').contains('High Street, Sydney, NSW')
    cy.get('span[name="listing-type"]').contains('Hotel')
    cy.get('div[name="listing-price"]').contains('$180')
    cy.get('div[name="listing-price"]').contains('Per night')
    cy.get('span[name="listing-beds"]').contains('1')
    cy.get('span[name="listing-bathrooms"]').contains('2')
    cy.get('span[name="listing-rooms"]').contains('1')
    cy.get('[data-testid="RestaurantOutlinedIcon"]')
      .should('be.visible')
    cy.get('[data-testid="LocalLaundryServiceOutlinedIcon"]')
      .should('be.visible')
    cy.get('[data-testid="BathtubOutlinedIcon"]')
      .should('be.visible')
    cy.get('.ant-picker-input').eq(0).get('input').eq(0).focus()
    cy.get('.ant-picker-input').eq(0).get('input').eq(0).type('2023-01-27')
    cy.get('.ant-picker-input').eq(0).get('input').eq(1).focus()
    cy.get('.ant-picker-input').eq(0).get('input').eq(1).type('2023-01-28')
    cy.get('.ant-picker-input').eq(0).get('input').eq(1).type('{enter}')
    cy.get('h6[name="listing-booking-duration"]').contains('27 Jan - 28 Jan')
    cy.get('h6[name="listing-booking-total-night"]').contains('Total Night: 1')
    cy.get('h6[name="listing-booking-cost"]').contains('$180')
    cy.get('button[name="book-submit"]').click()

    // check booking is exist
    cy.get('[data-field="startDate"]').contains('2023/01/27')
    cy.get('[data-field="endDate"]').contains('2023/01/28')
    cy.get('[data-field="status"]').contains('pending')

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

    // able to login jerry
    cy.get('input[name="email"]')
      .focus()
      .type('jerry@gmail.com')

    cy.get('input[name="password"]')
      .focus()
      .type('passw0rd')

    cy.get('button[name="submit"]')
      .click()

    cy.url().should('include', 'localhost:3000/listings')
    cy.get('h6[name="listing-title"]').contains('Wonderful garden')
  })
})

import type { AddressPayload } from '../models/checkout'

interface OrderSummaryAuth {
  token: string
  basketId: number
  addressId: number
  deliveryMethodId: number
  cardId: number
}

export class OrderSummaryPage {
  visit (auth: OrderSummaryAuth): this {
    cy.visit('/#/order-summary', {
      onBeforeLoad (win) {
        win.localStorage.setItem('token', auth.token)
        win.sessionStorage.setItem('bid', String(auth.basketId))
        win.sessionStorage.setItem('addressId', String(auth.addressId))
        win.sessionStorage.setItem('deliveryMethodId', String(auth.deliveryMethodId))
        win.sessionStorage.setItem('paymentId', String(auth.cardId))
      }
    })
    return this
  }

  get deliveryAddressCard () {
    return cy.get('[data-testid="delivery-address-card"]')
  }

  get basketProductRows () {
    return cy.get('[data-testid="basket-item"]')
  }

  containsAddress (address: AddressPayload): Cypress.Chainable {
    return this.deliveryAddressCard
      .should('contain.text', address.fullName)
      .and('contain.text', address.streetAddress)
      .and('contain.text', address.city)
      .and('contain.text', address.zipCode)
      .and('contain.text', address.country)
  }
}

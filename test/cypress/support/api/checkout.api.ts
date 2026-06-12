import type { Address, AddressPayload, Card, CardPayload, CheckoutPayload, DeliveryMethod, OrderConfirmation } from '../models/checkout'

function authHeaders (token: string) {
  return { Authorization: `Bearer ${token}` }
}

export function createAddress (token: string, address: AddressPayload): Cypress.Chainable<Address> {
  return cy.request({
    method: 'POST',
    url: '/api/Addresss',
    headers: authHeaders(token),
    body: address
  }).then(res => {
    expect(res.status).to.eq(201)
    return res.body.data as Address
  })
}

export function createCard (token: string, card: CardPayload): Cypress.Chainable<Card> {
  return cy.request({
    method: 'POST',
    url: '/api/Cards',
    headers: authHeaders(token),
    body: card
  }).then(res => {
    expect(res.status).to.eq(201)
    return res.body.data as Card
  })
}

export function getDeliveryMethods (token: string): Cypress.Chainable<DeliveryMethod[]> {
  return cy.request({
    method: 'GET',
    url: '/api/Deliverys',
    headers: authHeaders(token)
  }).then(res => {
    expect(res.status).to.eq(200)
    return res.body.data as DeliveryMethod[]
  })
}

export function deleteAddress (token: string, addressId: number): void {
  cy.request({
    method: 'DELETE',
    url: `/api/Addresss/${addressId}`, // triple 's' matches the Juice Shop route (server.ts:450)
    headers: authHeaders(token)
  }).its('status').should('eq', 200)
}

export function deleteCard (token: string, cardId: number): void {
  cy.request({
    method: 'DELETE',
    url: `/api/Cards/${cardId}`,
    headers: authHeaders(token)
  }).its('status').should('eq', 200)
}

export function checkout (token: string, basketId: number, payload: CheckoutPayload): Cypress.Chainable<OrderConfirmation> {
  return cy.request({
    method: 'POST',
    url: `/rest/basket/${basketId}/checkout`,
    headers: authHeaders(token),
    body: payload
  }).then(res => {
    expect(res.status).to.eq(200)
    return res.body as OrderConfirmation
  })
}
